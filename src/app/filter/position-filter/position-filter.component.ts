import {ChangeDetectionStrategy, Component, forwardRef, Input, OnDestroy, Signal} from '@angular/core';
import { Machine, Position } from '../../models/models';
import { PositionService } from '../../services/position/position.service';
import { filter, scan, switchMap } from 'rxjs/operators';
import { ReplaySubject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ControlValueAccessor, FormBuilder, FormControl, FormGroup, FormGroupDirective, NG_VALUE_ACCESSOR, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MACHINE } from '../../constants/constants';
import {defined} from "../../layout/utils";
import {toSignal} from "@angular/core/rxjs-interop";

export class CustomErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        return !!(control && control.invalid);
    }
}

function validateParams(value: any): value is { date: string; referentialId: number } {
    return typeof value === 'object' && defined(value) && 'referentialId' in value && 'date' in value;
}

@Component({
    selector: 'lt-position-filter',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './position-filter.component.html',
    styleUrls: ['./position-filter.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => PositionFilterComponent),
            multi: true
        }
    ]
})
export class PositionFilterComponent implements ControlValueAccessor, OnDestroy {
    readonly MACHINE = MACHINE;
    selectedFilter: 'numeric' | 'device' = 'numeric';
    readonly positions: Signal<Position[]>;
    matcher = new CustomErrorStateMatcher();

    @Input() set selectedDate(date: string) {
        if (defined(date)) {
            this.paramsSubject.next({ date });
        }
    }

    @Input() set selectedMachine(machine: Machine | undefined) {
        this.selectedFilter = 'numeric';
        this._selectedMachine = machine;
        if (defined(machine?.machineLength)) {
            this.dcumForm.get('end')?.setValidators([Validators.min(MACHINE.defaultStart), Validators.max(Math.ceil(machine!.machineLength))]);
        }
        if (defined(machine) && typeof machine !== 'number') {
            this.paramsSubject.next({ referentialId: machine.referentialId });
        }
    }
    get selectedMachine() {
        return this._selectedMachine;
    }
    private _selectedMachine?: Machine;

    private paramsSubject = new ReplaySubject<{ date: string } | { referentialId: number }>(2);

    readonly dcumForm: FormGroup;

    constructor(private positionService: PositionService, public readonly dialog: MatDialog, private fb: FormBuilder) {
        const positions$ = this.paramsSubject.pipe(
            scan((params, param) => ({ ...params, ...param })),
            filter(validateParams),
            switchMap(params => this.positionService.getAllPositions(params.referentialId, params.date)),
        );

      this.positions = toSignal(positions$, { initialValue: [] });

        this.dcumForm = this.fb.group(
            {
                start: [0, [Validators.required, Validators.min(MACHINE.defaultStart)]],
                end: [0, [Validators.required, Validators.min(MACHINE.defaultStart)]]
            },
            { validators: this.customValidatorGroup(), updateOn: 'change' }
        );
    }

    ngOnDestroy() {
        this.paramsSubject.complete();
    }

    get startControl(): FormControl {
        return this.dcumForm.get('start') as FormControl;
    }

    get endControl(): FormControl {
        return this.dcumForm.get('end') as FormControl;
    }

    customValidatorGroup() {
        return () => {
            const min: number = this.dcumForm?.get('start')?.value;
            const max: number = this.dcumForm?.get('end')?.value;
            return max < min ? { error: 'comparison' } : null;
        };
    }

    resetPosition() {
        this.selectedFilter = 'numeric';
        const end = this.selectedMachine!.machineLength > MACHINE.defaultLength ? MACHINE.defaultLength : Math.ceil(this.selectedMachine!.machineLength);
        const value = { start: MACHINE.defaultStart, end };
        this.dcumForm.setValue(value);
        this.writeValue([value.start, value.end]);
        this.onChange([value.start, value.end]);
    }

    updatePosition() {
        this.onChange([this.startControl.value, this.endControl.value]);
    }

    getMaxMachineLength() {
        return this.selectedMachine?.machineLength ? Math.ceil(this.selectedMachine?.machineLength) : '0';
    }

    private onChange: (value: [number, number]) => void = () => {};
    private onTouched: () => void = () => {};

    writeValue(value: [number, number] | null): void {
        value ??= [0, 0];
        this.dcumForm.setValue({ start: value[0], end: value[1] });
    }

    registerOnChange(fn: (value: [number, number]) => void): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }
}

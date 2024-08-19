import { ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Position } from '../../../models/models';
import { PositionDialogComponent } from '../position-dialog/position-dialog.component';
import { filter, tap } from 'rxjs/operators';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {noop} from "rxjs";
import {defined} from "../../../layout/utils";

@Component({
    selector: 'lt-position-select',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './position-select.component.html',
    styleUrls: ['./position-select.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => PositionSelectComponent),
            multi: true
        }
    ]
})
export class PositionSelectComponent implements ControlValueAccessor {
    @Input() positions: Position[] | null | undefined;
    @Input() label!: string;

    selectedPosition: Position | null | undefined;

    private onChange: (x: number) => void = noop;
    private onTouched: () => void = noop;

    constructor(public readonly dialog: MatDialog, private readonly cdr: ChangeDetectorRef) {}

    openDialog() {
        this.dialog
            .open(PositionDialogComponent, {
                data: { positions: this.positions, selectedPosition: this.selectedPosition, start: this.label === 'start' }
            })
            .afterClosed()
            .pipe(
                filter(defined),
                tap((selectedPosition: Position) => {
                    this.selectedPosition = selectedPosition;
                    this.cdr.markForCheck();

                    this.onTouched();
                    if (this.label === 'start') {
                        this.onChange(selectedPosition.upstreamX);
                    } else {
                        this.onChange(selectedPosition.downstreamX);
                    }
                })
            )
            .subscribe();
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    writeValue(obj: number | Position | null): void {
        if (typeof obj === 'number') {
            if (this.label === 'start') {
                const filteredPositions = this.positions?.sort((a, b) => a.upstreamX - b.upstreamX);
                this.selectedPosition = filteredPositions?.find(position => position.upstreamX >= obj)!;
            } else {
                const filteredPositions = this.positions?.sort((a, b) => b.downstreamX - a.downstreamX);
                this.selectedPosition = filteredPositions?.find(position => position.downstreamX <= obj)!;
            }
            return;
        }
        this.selectedPosition = obj;
    }
}

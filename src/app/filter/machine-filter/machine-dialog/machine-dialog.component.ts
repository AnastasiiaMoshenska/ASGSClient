import {ChangeDetectionStrategy, Component, Inject, Signal} from '@angular/core';
import { Machine } from '../../../models/models';
import { FormControl } from '@angular/forms';
import { debounceTime, map, startWith } from 'rxjs/operators';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import {sanitizeTerm} from "../../../layout/utils";
import {toSignal} from "@angular/core/rxjs-interop";

@Component({
    selector: 'lt-machine-dialog',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './machine-dialog.component.html',
    styleUrls: ['./machine-dialog.component.scss']
})
export class MachineDialogComponent {
    public filteredMachines: Signal<Machine[]>
    public searchControl: FormControl<any> = new FormControl();

    readonly endlessDate = new Date('4000-01-01T00:00:00Z');

    constructor(
        public dialog: MatDialog,
        public dialogRef: MatDialogRef<MachineDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { machines: Machine[]; selectedMachine: Machine }
    ) {
        const filter$ = this.searchControl.valueChanges.pipe(debounceTime(200), startWith(''));
        const filteredMachines$ = filter$.pipe(
            map(searchTerm => {
                const filteredMachines = data.machines.filter(machine => sanitizeTerm(machine.machineCode).includes(sanitizeTerm(searchTerm)));
                return filteredMachines.sort((a, b) => sanitizeTerm(a.machineCode).localeCompare(sanitizeTerm(b.machineCode)));
            })
        );
        this.filteredMachines = toSignal(filteredMachines$)
    }
    selectMachine(selectedMachine: Machine) {
        this.dialogRef.close(selectedMachine);
    }

    closeDialog() {
        this.dialogRef.close();
    }
}

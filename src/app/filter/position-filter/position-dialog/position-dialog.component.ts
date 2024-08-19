import {ChangeDetectionStrategy, Component, Inject, Signal} from '@angular/core';
import { combineLatest } from 'rxjs';
import { Position } from '../../../models/models';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import {debounceTime, map, startWith } from 'rxjs/operators';
import {sanitizeTerm} from "../../../layout/utils";
import {toSignal} from "@angular/core/rxjs-interop";

@Component({
    selector: 'lt-dialog',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './position-dialog.component.html',
    styleUrls: ['./position-dialog.component.scss']
})
export class PositionDialogComponent {
    public filteredPositions: Signal<Position[]>
    public searchControl: FormControl<any> = new FormControl();

    constructor(
        public dialog: MatDialog,
        public dialogRef: MatDialogRef<PositionDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { positions: Position[]; selectedPosition: Position; start: boolean }
    ) {
        const filter$ = this.searchControl.valueChanges.pipe(debounceTime(200), startWith(''));

        const filteredPositions$ = combineLatest([data.positions, filter$]).pipe(
            map(([machines, searchTerm]) => {
                const filteredPositions = data.positions.filter(position => sanitizeTerm(position.elementName).includes(sanitizeTerm(searchTerm)));
                return filteredPositions.sort((a, b) => {
                    if (this.data.start) {
                        return a.upstreamX - b.upstreamX;
                    } else {
                        return a.downstreamX - b.downstreamX;
                    }
                });
            })
        );
        this.filteredPositions = toSignal(filteredPositions$);
    }
    selectPosition(selectedPosition: Position) {
        this.dialogRef.close(selectedPosition);
    }

    closeDialog() {
        this.dialogRef.close();
    }
}

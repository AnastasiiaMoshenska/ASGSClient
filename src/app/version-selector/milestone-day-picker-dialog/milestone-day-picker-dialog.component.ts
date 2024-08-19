import {ChangeDetectorRef, Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MilestoneDay} from "../../layout/stuff";

@Component({
  selector: 'lt-milestone-day-picker-dialog',
  template: `
    <div cdkDrag cdkDragRootElement=".cdk-overlay-pane">
      <h1 mat-dialog-title cdkDragHandle title="Add/Edit Anchor">Pick a date</h1>
      <div class="content" mat-dialog-content>
        @for (milestoneDay of milestoneDays; track milestoneDay) {
          <lt-milestone-day-tile
            [milestoneDay]="milestoneDay"
            (click)="select(milestoneDay)"
            class="day-tile"
          />
        }
      </div>
      <div class="footer" mat-dialog-actions>
        <button mat-stroked-button mat-button mat-dialog-close title="Close without saving">
          <mat-icon inline>close</mat-icon>
          Close
        </button>
      </div>
    </div>
  `,
  styleUrls: ['./milestone-day-picker-dialog.component.scss']
})
export class MilestoneDayPickerDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public readonly milestoneDays: MilestoneDay[],
    public dialogRef: MatDialogRef<any>,
    readonly cdr: ChangeDetectorRef
  ) {
    setTimeout(() => cdr.detectChanges(), 0);
  }

  select(milestoneDay: MilestoneDay) {
    this.dialogRef.close(milestoneDay);
  }
}

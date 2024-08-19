import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MilestoneDay } from "./stuff";
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'lt-milestone-day-range',
  template: `
    <span>
            <span style="text-align: right; margin-right: 10px">{{ fromDayValue }}</span>
            <svg height="10" width="70" viewBox="0 0 100 100">
                <rect x="-220" y="35" width="480" height="30" style="fill: rgb(0, 0, 255); stroke-width: 0; stroke: rgb(0, 0, 0)"></rect>
                <circle cx="-250" cy="50" r="40" stroke="black" stroke-width="1" fill="blue"></circle>
                <circle cx="350" cy="50" r="40" stroke="black" stroke-width="6" fill="white"></circle>
            </svg>
            <span style="text-align: left; margin-left: 10px">{{ toDayValue }}</span>
        </span>
  `
})
export class MilestoneDayRangeComponent {
  @Input()
  set fromDay(fromDay: MilestoneDay | string) {
    this.fromDayValue = (fromDay as MilestoneDay)?.label || (fromDay as string);
  }

  @Input()
  set toDay(toDay: MilestoneDay | string) {
    this.toDayValue = (toDay as MilestoneDay)?.label || (toDay as string);
  }

  fromDayValue: string;
  toDayValue: string;
}

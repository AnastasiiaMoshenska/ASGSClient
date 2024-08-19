import {ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DateFormat, MilestoneDay, MilestoneImportance, MilestoneImportanceColors } from '../../layout/stuff';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'lt-milestone-day-tile',
    template: `
        <div class="tile-inner-container">
            <section class="main">
                <div class="badge" [style.background-color]="getImportanceColor(milestoneDay().importance)"></div>
                <div class="content">
                    <div>
                        <section class="info-container">
                            <div class="info">
                                <div class="name">{{ milestoneDay().label }}</div>
                                <section class="badge-container" (click)="$event.stopPropagation()">
                                    <a class="other-badge id" target="_blank"> ID {{ milestoneDay()?.id }} </a>
                                </section>
                            </div>
                            <div class="description">
                                <strong>{{ milestoneDay().date | date : MILESTONE_DAY_TILE_TIME_FORMAT }}</strong>
                            </div>
                        </section>
                    </div>
                </div>
            </section>
        </div>
    `,
    styleUrls: ['milestone-day-tile.component.scss']
})
export class MilestoneDayTileComponent {
    milestoneDay = input.required<MilestoneDay>();

    readonly MILESTONE_DAY_TILE_TIME_FORMAT = DateFormat.MILESTONE_DAY_TILE_TIME;

    getImportanceColor(importance: keyof typeof MilestoneImportance) {
        return MilestoneImportanceColors[importance] || MilestoneImportanceColors.DEFAULT;
    }
}

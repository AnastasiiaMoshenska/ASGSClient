import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  input,
  Input,
  model,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  viewChild,
  ViewEncapsulation
} from '@angular/core';
import {axisBottom, scaleLinear, ScaleLinear, select} from 'd3';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {MilestoneDayPickerDialogComponent} from './milestone-day-picker-dialog/milestone-day-picker-dialog.component';
import {asyncScheduler, lastValueFrom, Subscription} from 'rxjs';
import {switchMap, throttleTime} from 'rxjs/operators';
import {DatePipe} from '@angular/common';
import {
  createResizeObservable,
  DateFormat,
  isBetween,
  MilestoneDay,
  MilestoneDayRange,
  MilestoneImportanceColors
} from '../layout/stuff';
import {MilestoneDayService} from "../services/layout/milestone-day.service";

function getIntermediateDays(x: MilestoneDay, y: MilestoneDay): MilestoneDayRange {
  return {id: `${x.id}/${y.id}`, from: x, to: y};
}

function isRange(v: MilestoneDay | MilestoneDayRange | number, versions: MilestoneDay[] = []): v is MilestoneDayRange {
  if (typeof v === 'number') {
    return versions.length > 0 && 'from' in versions[v];
  }
  return 'from' in v;
}

function checkRanges(version: MilestoneDay, ranges: HighlightedRange[]) {
  if (!ranges?.length) {
    return true;
  }
  for (const range of ranges) {
    if (isBetween(version.date, range.from.date, range.to.date)) {
      return true;
    }
  }
  return false;
}

@Component({
  selector: 'lt-version-selector',
  template: `
    <svg #svg class="svg-root"></svg>`,
  styleUrls: ['./version-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class VersionSelectorComponent implements OnInit, OnChanges, OnDestroy {

  readonly version = model.required<MilestoneDay>();

  readonly restrictToRange = input(false, {transform: booleanAttribute});
  readonly ranges = input<HighlightedRange[]>([])

  @Input()
  set versions(versions: MilestoneDay[]) {
    this._versionRanges = (versions || []).reduce((acc, version) => (acc.length ? [...acc, getIntermediateDays(acc[acc.length - 1], version), version] : [version]), []);
  }

  private _versionRanges: (MilestoneDay | MilestoneDayRange)[];
  readonly svgElement = viewChild.required<ElementRef>('svg')
  private width: number;
  private resizeSubscription: Subscription;

  constructor(private element: ElementRef, private readonly dialog: MatDialog, private readonly datePipe: DatePipe, private readonly milestoneDayService: MilestoneDayService) {
  }

  ngOnInit() {
    const resizeObservable = createResizeObservable(this.element);

    this.resizeSubscription = resizeObservable.pipe(throttleTime(100, asyncScheduler, {trailing: true})).subscribe(() => this.render());
  }

  ngOnDestroy() {
    this.resizeSubscription.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['ranges'] || changes['version']) {
      const initialized = this._versionRanges && this.ranges();
      if (initialized) {
        this.render();
        return;
      }
    }

    if (changes['versions']?.currentValue) {
      this.render();
    }
  }

  private render() {
    const svg = select(this.svgElement().nativeElement);
    this.width = parseInt(svg.style('width'), 10);

    const versionsData = this._versionRanges;
    const rangesData = this.ranges() || [];

    svg.select('g').remove();

    const bounds = this.getTimelineBounds();
    const axisBounds = this.getAxisBounds();

    const xScale = scaleLinear()
      .domain([0, versionsData.length - 1])
      .range([bounds.x, bounds.maxX()]);

    const versionToX = (v: MilestoneDay): number => {
      const matchingVersions = versionsData.filter(version => version.id === v.id);
      if (matchingVersions.length !== 1) {
        return -1;
      }
      return xScale(versionsData.indexOf(matchingVersions[0]));
    };

    const tickValues = versionsData.map((v, i) => ((v as MilestoneDay).importance !== 'NONE' ? i : null)).filter(v => !!v) as number[];

    const xAxis = axisBottom(xScale)
      .tickValues(tickValues)
      .tickSize(0)
      .tickFormat((d: number) => (versionsData[d] ? (versionsData[d] as any).label : ''));

    const renderTarget = svg.append('g').attr('transform', `translate(${SIZE.margin.left}, ${SIZE.margin.top})`);

    // Add a backdrop for the slide on hover
    renderTarget
      .append('rect')
      .attr('x', -20)
      .attr('y', 0)
      .attr('width', bounds.w + 40)
      .attr('height', bounds.h + 50)
      .style('opacity', 0);

    renderTarget
      .on('mouseover', () => {
        renderTarget
          .transition('easePoly')
          .duration(100)
          .attr('transform', `translate(${SIZE.margin.left}, ${SIZE.margin.top - (SIZE.plot.range.height + SIZE.plot.dot.marginTop)})`);
      })
      .on('mouseout', () => {
        renderTarget.transition('easePoly').duration(100).attr('transform', `translate(${SIZE.margin.left}, ${SIZE.margin.top})`);
      });

    // Render the axis and fix the tick label positioning
    renderTarget.append('g').attr('class', 'axis').attr('transform', `translate(0, ${axisBounds.y})`).call(xAxis);

    renderTarget.selectAll('g.tick text').attr('y', 12);

    // Render hover rectangles with bullets and date labels
    const versionGroups = renderTarget.selectAll('rect.version-group').data(versionsData).enter().append('g').attr('class', 'version-group');

    versionGroups
      .append('circle')
      .attr('class', d => (this.matches(d) ? 'dot active' : 'dot'))
      .attr('cx', (d, i) => xScale(i))
      .attr('cy', bounds.maxY() + 1)
      .attr('r', d => (this.matches(d) ? SIZE.plot.dot.activeRadius : SIZE.plot.dot.radius))
      .style('fill', d => this.getVersionColor(d));
    versionGroups
      .append('text')
      .attr('class', 'version-data')
      .text((d: any) => (!!d.date ? this.datePipe.transform(d.date, DateFormat.DATE) : this.matches(d) ? this.version().label : ''))
      .attr('text-anchor', 'middle')
      .attr('x', (d, i) => xScale(i))
      .attr('y', bounds.maxY() + 36);
    versionGroups
      .append('rect')
      .attr('class', 'version-hover-rect')
      .attr('x', (d, i) => xScale(i) + SIZE.plot.hoverRect.offset.x)
      .attr('y', bounds.maxY() + SIZE.plot.hoverRect.offset.y)
      .attr('width', SIZE.plot.hoverRect.width)
      .attr('height', SIZE.plot.hoverRect.height)
      .style('opacity', 0);

    versionGroups
      .on('mouseover', (event, d) => {
        select(event.currentTarget)
          .select('circle')
          .transition('easePoly')
          .duration(100)
          .attr('r', SIZE.plot.dot.activeRadius)
          .style('fill', this.getVersionColor(d, true));
      })
      .on('mouseout', (event, d) => {
        select(event.currentTarget)
          .select('circle')
          .transition('easePoly')
          .duration(150)
          .attr('r', this.matches(d) ? SIZE.plot.dot.activeRadius : SIZE.plot.dot.radius)
          .style('fill', this.getVersionColor(d, false));
      })
      .on('click', (event, d) => this.setVersion(d));

    // Render the active ranges on the timeline
    renderTarget
      .selectAll('rect.range')
      .data(rangesData)
      .enter()
      .append('rect')
      .attr('class', 'range')
      .attr('x', d => d.getScaledRange(versionsData, xScale)[0] - SIZE.plot.dot.radius)
      .attr('width', d => {
        const [start, end] = d.getScaledRange(versionsData, xScale);
        return end - start + 2 * SIZE.plot.dot.radius;
      })
      .attr('y', bounds.maxY() - (SIZE.plot.dot.radius + SIZE.plot.dot.marginTop + SIZE.plot.range.height))
      .attr('height', SIZE.plot.range.height)
      .attr('rx', SIZE.plot.dot.radius)
      .attr('ry', SIZE.plot.dot.radius)
      .style('fill', d => d.color);

    // Render the label for the ranges
    renderTarget
      .selectAll('text.range-label')
      .data(rangesData)
      .enter()
      .append('text')
      .attr('class', 'range-label')
      .text(d => d.title)
      .attr('x', d => versionToX(d.from) + SIZE.plot.dot.radius)
      .attr('y', bounds.maxY() - (SIZE.plot.dot.radius + SIZE.plot.dot.marginTop + 2));
  }

  private getTimelineBounds(): Rect {
    return new Rect(0, 0, this.width - (SIZE.margin.left + SIZE.margin.right), SIZE.frame.height - (SIZE.margin.top + SIZE.margin.bottom));
  }

  private getAxisBounds(): Rect {
    return new Rect(0, this.getTimelineBounds().maxY(), this.getTimelineBounds().w, SIZE.margin.bottom);
  }

  private matches(version: MilestoneDay | MilestoneDayRange | number) {
    if (!this.version) {
      return false;
    }

    const selectedVersion = this.version();
    if (selectedVersion.date) {
      selectedVersion.date = new Date(selectedVersion.date);
    }

    const validVersion = typeof version === 'number' ? this._versionRanges[version] : (version as MilestoneDayRange | MilestoneDay);

    return (
      (isRange(validVersion, this._versionRanges as MilestoneDay[]) &&
        selectedVersion.date?.getTime() > validVersion?.from.date.getTime() &&
        selectedVersion.date?.getTime() < validVersion?.to.date.getTime()) ||
      selectedVersion.id === validVersion.id
    );
  }

  private getVersionColor(version: any, forceColor: boolean = false): string {
    if (!version) {
      return 'white';
    }

    if (!forceColor && !this.matches(version)) {
      return MilestoneImportanceColors.NONE;
    }

    return MilestoneImportanceColors[version.importance as keyof typeof MilestoneImportanceColors] || MilestoneImportanceColors.DEFAULT;
  }

  private async setVersion(version: MilestoneDay | MilestoneDayRange | number) {
    const versions = this._versionRanges as any[];
    let milestoneDay = typeof version === 'number' ? versions[version] : (version as MilestoneDay);

    if (isRange(version, versions)) {
      const dialogConfig = new MatDialogConfig<MilestoneDayRange>();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = false;
      dialogConfig.width = '500px';

      const milestoneRange = typeof version === 'number' ? (versions[version] as MilestoneDayRange) : (version as MilestoneDayRange);
      const dialogRef = this.milestoneDayService
        .findMoreDatesByDateBetween(milestoneRange.from, milestoneRange.to)
        .pipe(switchMap(milestoneDays => this.dialog.open(MilestoneDayPickerDialogComponent, {
          ...dialogConfig,
          data: milestoneDays
        }).afterClosed()));
      milestoneDay = await lastValueFrom(dialogRef);
    }
    if (!milestoneDay || (this.restrictToRange && !checkRanges(milestoneDay, this.ranges()))) {
      return;
    }

    this.version.set(milestoneDay);
    this.render();
  }
}

class Rect {
  constructor(public x: number, public y: number, public w: number, public h: number) {
  }

  public maxX(): number {
    return this.x + this.w;
  }

  public maxY(): number {
    return this.y + this.h;
  }
}

const SIZE = {
  margin: {
    left: 28,
    right: 28,
    top: 0,
    bottom: 6
  },
  frame: {
    height: 32
  },
  plot: {
    dot: {
      radius: 4,
      activeRadius: 8,
      marginTop: 6
    },
    hoverRect: {
      width: 60,
      height: 100,
      offset: {
        x: -30,
        y: -10
      }
    },
    range: {
      height: 12
    }
  }
};

export class HighlightedRange {
  public constructor(public title: string, public color: string, public from: MilestoneDay, public to: MilestoneDay) {
  }

  public getScaledRange(sortedVersions: (MilestoneDay | MilestoneDayRange)[] = [], xScale: ScaleLinear<number, number>): number[] {
    if (!sortedVersions.length) {
      return [-1, -1];
    }
    const validVersions = sortedVersions.filter(v =>
      isRange(v) ? this.from.date < v.to?.date && v.from?.date < this.to.date : this.from.date <= v.date && v.date <= this.to.date
    );

    const first = validVersions[0];
    const last = validVersions[validVersions.length - 1];
    return [first, last].map(v => xScale(sortedVersions.indexOf(v)));
  }
}

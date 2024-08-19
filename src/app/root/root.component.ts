import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component, effect,
  OnDestroy,
  OnInit,
  Pipe,
  PipeTransform,
  Signal,
  signal, ViewChild,
} from '@angular/core';
import {Observable, ReplaySubject} from "rxjs";
import {defined, MilestoneDay} from "../layout/stuff";
import {ProgressBarMode} from "@angular/material/progress-bar";
import {Filter} from "../filter/root-filter/root-filter.component";
import {shareReplay} from "rxjs/operators";
import {MilestoneDayService} from "../services/layout/milestone-day.service";
import {MatDialog} from "@angular/material/dialog";
import {ActivatedRoute} from "@angular/router";
import 'svg-pan-zoom-container';
import {toSignal} from "@angular/core/rxjs-interop";
import {SvgComponent} from "../svg/root-svg/svg.component";

@Pipe({standalone: true, name: 'ceiling'})
export class CeilingPipe implements PipeTransform {
  transform(value: number): number {
    return Math.ceil(value);
  }
}

@Component({
  selector: 'lt-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './root.component.html',
  styleUrl: './root.component.scss'
})
export class RootComponent implements OnInit, OnDestroy {
  isDraggable = true;
  isCollapsed = false;
  isLoading = false;
  datePicker: Date = new Date();

  progressBarMode: ProgressBarMode;

  //readonly svgComponent = viewChild.required<SvgComponent>('svg');
  @ViewChild('svg') svgComponent: SvgComponent;

  readonly versionChange = new ReplaySubject<MilestoneDay>(1);

  readonly filter = signal<Filter | undefined>(undefined);

  date = new Date();

  constructor(milestoneDayService: MilestoneDayService, public readonly dialog: MatDialog, private readonly cdr: ChangeDetectorRef, private readonly route: ActivatedRoute) {
    const dateString = this.route.snapshot.queryParamMap.get('date');
    const date = defined(dateString) ? dateString : null;

  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.versionChange.complete();
  }

  zoomIn() {
    this.svgComponent.zoomIn();
  }

  toggleView() {
    this.isCollapsed = !this.isCollapsed;
  }

  toggleDragging() {
    this.isDraggable = !this.isDraggable;
  }

  isEndless(inputDate: Date): boolean {
    const date = new Date(inputDate);
    const endlessDate = new Date('4000-01-01T00:00:00Z');
    return date >= endlessDate;
  }

  setLoadingState(loading: boolean) {
    this.isLoading = loading;
    this.progressBarMode = loading ? 'indeterminate' : 'determinate';
    this.cdr.detectChanges();
  }

  onDateChange(event: Date): void {
    this.datePicker = event;
  }
}

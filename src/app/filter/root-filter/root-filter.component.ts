import {ChangeDetectionStrategy, Component, Input, OnDestroy, Output} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {Element, Machine} from '../../models/models';
import {MatDialog} from '@angular/material/dialog';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {combineLatest, Observable, of, ReplaySubject, switchMap, timer} from 'rxjs';
import {ElementService} from '../../services/element/element.service';
import {catchError, distinctUntilChanged, filter, map, mapTo, shareReplay, startWith, tap} from 'rxjs/operators';
import {MACHINE} from '../../constants/constants';
import {mergeLoadingStates} from "../../layout/utils";


function defined<T>(x: T | null | undefined | void): x is T {
  return x !== null && x !== undefined;
}

function compareElements(a: Element, b: Element): number {
  let res = a.depthLevel - b.depthLevel;

  if (res) {
    return res;
  }

  res = a.upstreamX - b.upstreamX;

  if (res) {
    return res;
  }

  res = a.elementName.localeCompare(b.elementName);

  if (res) {
    return res;
  }

  return b.width - a.width;
}

function formatSelectedDate(date: any) {
  if (typeof date !== 'string') {
    return date.toISOString().slice(0, -5) + 'Z';
  } else {
    return date;
  }
}

function selectUniqueDepthLevels(elements: Element[]): number[] {
  const uniqueDepthLevelsSet = new Set<number>();
  elements.forEach(item => {
    uniqueDepthLevelsSet.add(item.depthLevel);
  });

  return Array.from(uniqueDepthLevelsSet).sort((a, b) => a - b);
}

function selectUniqueClasses(elements: Element[]): string[] {
  const uniqueClassesSet = new Set<string>();
  elements.forEach(item => {
    if (item.mainClass != null) {
      uniqueClassesSet.add(item.mainClass);
    }
  });
  return Array.from(uniqueClassesSet).sort();
}

export interface Filter {
  selectedMachine: Machine;
  isLabelShown: boolean;
  isExpertShown: boolean;
  isDefaultHeightAdded: boolean;
  depthLevels: number[];
  namesLevels: number[];
  activeClasses: string[];
  positionRange: [number, number];

  elements: Element[];
  isCollapsed: boolean;
}


@Component({
  selector: 'lt-root-filter',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './root-filter.component.html',
  styleUrls: ['./root-filter.component.scss'],
})
export class RootFilterComponent implements OnDestroy {
  isElementsEmpty: boolean | undefined;

  classes!: string[];
  depthLevels: number[] | undefined;
  namesLevels!: number[];

  isElementsWithoutHeightPresent = false;

  @Input() set date(date: Date) {
    this.dateSelected.next(date);
  }

  @Input() set isCollapsed(value: boolean) {
    this.isCollapsedControl.setValue(value);
    this._collapse();
  }

  readonly dateSelected = new ReplaySubject<Date>(1);

  readonly dateAsString = this.dateSelected.pipe(filter(defined), map(formatSelectedDate));

  @Output() readonly formValuesChanged: Observable<Filter>;
  @Output() readonly loadingStateChanged: Observable<boolean>;

  readonly form: FormGroup;

  readonly elements$: Observable<Element[]>;

  readonly machineChanged: Observable<Machine>;

  constructor(
    private elementService: ElementService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    public readonly dialog: MatDialog,
    private readonly fb: FormBuilder
  ) {
    const params = this.route.snapshot.queryParamMap;
    const machineIdString = params.get('machine');
    const selectedMachine = defined(machineIdString) ? +machineIdString : null;
    const start = +params.get('dcumStart')!;
    const end = +params.get('dcumEnd')!;

    this.form = this.fb.group({
      selectedMachine,
      isLabelShown: [{value: true, disabled: true}],
      isExpertShown: [{value: false, disabled: true}],
      isDefaultHeightAdded: [{value: false, disabled: true}],
      depthLevels: this.fb.array([]),
      namesLevels: this.fb.array([]),
      activeClasses: [[]],
      positionRange: [[start, end]],
      isCollapsed: false
    });

    let firstUpdate = params.has('dcumStart') && !Number.isNaN(start) && params.has('dcumEnd') && !Number.isNaN(end);

    this.machineChanged = this.form.controls['selectedMachine'].valueChanges.pipe(
      tap(machine => {
        if (firstUpdate) {
          firstUpdate = false;
          return;
        }
        this._updatePositionRange(machine);
      })
    );

    this.form.controls['depthLevels'].valueChanges.subscribe(() => {
      if (this.isCollapsedControl.value === false) {
        this._saveDepthLevelToLocalStorage();
      }
    });

    const trigger$: Observable<[Machine, [number, number], string]> = combineLatest([
      this.machineChanged,
      this.form.controls['positionRange'].valueChanges.pipe(startWith(this.positionRangeControl.value)) as Observable<[number, number]>,
      this.dateAsString
    ]).pipe(shareReplay({bufferSize: 1, refCount: true}));

    this.elements$ = trigger$.pipe(
      switchMap(([machine, position, date]) => {
        this._updateUrlParams(machine, position, date);
        if (
          position[0] >= MACHINE.defaultStart &&
          position[0] <= Math.ceil(machine.machineLength) &&
          position[1] >= MACHINE.defaultStart &&
          position[1] <= Math.ceil(machine.machineLength)
        ) {
          this._disableFormControls(false);
          return this.elementService.getElementsByMachineElementId(machine.machineElementId, machine.referentialId, date, position[0], position[1]);
        } else {
          return timer(0).pipe(mapTo([]));
        }
      }),
      map(elements => elements.sort(compareElements)),
      tap(elements => {
        this._setElementsData(elements);
        this.isElementsEmpty = !elements.length;
      }),
      shareReplay({bufferSize: 1, refCount: true})
    );

    this.loadingStateChanged = mergeLoadingStates(trigger$, this.elements$).pipe(distinctUntilChanged());

    this.formValuesChanged = combineLatest(this.form.valueChanges, this.elements$).pipe(
      map(([value, elements]) => ({
        selectedMachine: value.selectedMachine,
        isLabelShown: value.isLabelShown,
        isExpertShown: value.isExpertShown,
        isDefaultHeightAdded: value.isDefaultHeightAdded,
        depthLevels: (value.depthLevels as boolean[]).map((x, i) => (x ? this.depthLevels[i] : null)).filter(x => x !== null),
        namesLevels: (value.namesLevels as boolean[]).map((x, i) => (x ? this.namesLevels[i] : null)).filter(x => x !== null),
        activeClasses: value.activeClasses,
        positionRange: value.positionRange,
        elements,
        isCollapsed: value.isCollapsed
      }))
    );
  }

  ngOnDestroy() {
    this.dateSelected.complete();
  }

  get depthLevelControls(): FormControl[] {
    return (this.form.get('depthLevels') as FormArray).controls as FormControl[];
  }

  get namesLevelControls(): FormControl[] {
    return (this.form.get('namesLevels') as FormArray).controls as FormControl[];
  }

  get selectedMachineControl(): FormControl {
    return this.form.get('selectedMachine') as FormControl;
  }

  get isCollapsedControl(): FormControl {
    return this.form.get('isCollapsed') as FormControl;
  }

  get positionRangeControl(): FormControl {
    return this.form.get('positionRange') as FormControl;
  }

  _updatePositionRange({machineLength}: Machine) {
    const dcumEnd = machineLength !== null ? (machineLength < MACHINE.defaultLength ? Math.ceil(machineLength) : MACHINE.defaultLength) : MACHINE.defaultStart;
    this.positionRangeControl.setValue([MACHINE.defaultStart, dcumEnd]);
  }

  _updateUrlParams(machine: Machine, position: [number, number], date: string) {
    const queryParams: Params = {
      machine: machine.machineElementId,
      referential: machine.referentialId,
      date,
      dcumStart: position[0],
      dcumEnd: position[1]
    };

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge'
    });
  }

  _setElementsData(elements: Element[]) {
    this.classes = selectUniqueClasses(elements);
    this.form.patchValue({activeClasses: structuredClone(this.classes)});
    this.depthLevels = this.namesLevels = selectUniqueDepthLevels(elements);

    this._updateLevels(this.form.get('namesLevels') as FormArray, this.namesLevels, true);
    this._updateLevels(this.form.get('depthLevels') as FormArray, this.depthLevels, !!this.isCollapsedControl.value);
    this._saveDepthLevelToLocalStorage();

    this._checkPresenceOfElementsWithoutHeight(elements);
  }

  _updateLevels(formArray: FormArray, reference: number[], isOnlyFirstActive: boolean) {
    formArray.clear();
    if (!reference.length) {
      return;
    }
    if (isOnlyFirstActive) {
      reference.forEach(() => {
        formArray.push(this.fb.control(false));
      });
      formArray.setValue([true, ...Array(formArray.length - 1).fill(false)]);
    } else {
      reference.forEach(() => {
        formArray.push(this.fb.control(true));
      });
    }
  }

  _checkPresenceOfElementsWithoutHeight(elements: Element[]){
    elements.forEach(element => {
      if (element.height === 0 && element.width !== 0) {
        this.isElementsWithoutHeightPresent = true;
      }
    })
  }

  _collapse() {
    if (this.isCollapsedControl.value) {
      this._updateLevels(this.form.get('depthLevels') as FormArray, this.depthLevels, true);
    } else {
      this._getDepthLevelFromLocalStorage();
    }
  }

  _saveDepthLevelToLocalStorage() {
    const depthLevelsArray = (this.form.get('depthLevels') as FormArray).getRawValue();
    localStorage['depthLevels'] = JSON.stringify(depthLevelsArray);
  }

  _getDepthLevelFromLocalStorage() {
    if (window.localStorage.getItem('depthLevels')) {
      const depthLevels = JSON.parse(localStorage['depthLevels']);
      this.form.patchValue({depthLevels});
    }
  }

  _disableFormControls(disable: boolean) {
    const method = disable ? 'disable' : 'enable';
    this.form.get('isLabelShown')[method]();
    this.form.get('isExpertShown')[method]();
    this.form.get('isDefaultHeightAdded')[method]();
  }
}

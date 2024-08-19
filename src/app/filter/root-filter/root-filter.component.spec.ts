import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RootFilterComponent} from './root-filter.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {provideRouter} from "@angular/router";
import {MachineFilterComponent} from "../machine-filter/machine-filter.component";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {ClassFilterComponent} from "../class-filter/class-filter.component";
import {PositionFilterComponent} from "../position-filter/position-filter.component";
import {MatFormField, MatFormFieldModule, MatLabel} from "@angular/material/form-field";
import {MatChipsModule} from "@angular/material/chips";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatRadioModule} from "@angular/material/radio";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatInput, MatInputModule} from "@angular/material/input";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MACHINE} from "../../constants/constants";
import {Element} from "../../models/models";
import {MatIcon} from "@angular/material/icon";

describe('RootFilterComponent', () => {
  let component: RootFilterComponent;
  let fixture: ComponentFixture<RootFilterComponent>;

  const mockMachines = {
    basic: {
      description: 'machine',
      machineCode: 'code',
      machineElementId: 1,
      referentialId: 2,
      validFromDay: new Date(Date.now()),
      expiryDay: new Date(Date.now()),
      title: 'title',
      machineLength: 10.3
    },
    overLength: {
      description: 'machine',
      machineCode: 'code',
      machineElementId: 1,
      referentialId: 2,
      validFromDay: new Date(Date.now()),
      expiryDay: new Date(Date.now()),
      title: 'title',
      machineLength: 60
    },
    nullLength: {
      description: 'machine',
      machineCode: 'code',
      machineElementId: 1,
      referentialId: 2,
      validFromDay: new Date(Date.now()),
      expiryDay: new Date(Date.now()),
      title: 'title',
      machineLength: null
    }
  }

  const mockEmptyElements: Element[] = [];

  const mockElements: Element[] = [
    {
      elementId: 1,
      elementLabel: 'label',
      elementName: 'name',
      expertName: 'expert',
      mainClass: 'class',
      depthLevel: 1,
      validFromDayId: 0,
      expiryDayId: 1,
      validFromDay: new Date(Date.now()),
      expiryDay: new Date(Date.now()),
      elemTypeId: 0,
      typeName: 'type',
      txtColor: 'red',
      bgColor: 'black',
      depth: 1.1,
      height: 2.0,
      width: 1,
      upstreamY: 0,
      upstreamZ: 1.2,
      midstreamX: 2,
      midstreamY: 2.1,
      midstreamZ: 3,
      downstreamX: 3,
      downstreamY: 0,
      downstreamZ: 0,
      upstreamX: 0
    },
    {
      elementId: 11,
      elementLabel: 'label1',
      elementName: 'name1',
      expertName: 'expert1',
      mainClass: 'class1',
      depthLevel: 11,
      validFromDayId: 1,
      expiryDayId: 11,
      validFromDay: new Date(Date.now()),
      expiryDay: new Date(Date.now()),
      elemTypeId: 1,
      typeName: 'type1',
      txtColor: 'red1',
      bgColor: 'black1',
      depth: 1.11,
      height: 2.01,
      width: 11,
      upstreamY: 1,
      upstreamZ: 1.21,
      midstreamX: 21,
      midstreamY: 2.11,
      midstreamZ: 31,
      downstreamX: 31,
      downstreamY: 1,
      downstreamZ: 1,
      upstreamX: 1
    },
    {
      elementId: 11,
      elementLabel: 'label1',
      elementName: 'name1',
      expertName: 'expert1',
      mainClass: 'class1',
      depthLevel: 11,
      validFromDayId: 1,
      expiryDayId: 11,
      validFromDay: new Date(Date.now()),
      expiryDay: new Date(Date.now()),
      elemTypeId: 1,
      typeName: 'type1',
      txtColor: 'red1',
      bgColor: 'black1',
      depth: 1.11,
      height: 0,
      width: 11,
      upstreamY: 1,
      upstreamZ: 1.21,
      midstreamX: 21,
      midstreamY: 2.11,
      midstreamZ: 31,
      downstreamX: 31,
      downstreamY: 1,
      downstreamZ: 1,
      upstreamX: 1
    }
  ];

  const mockElementsNoElementsWithoutHeight: Element[] = [
    {
      elementId: 1,
      elementLabel: 'label',
      elementName: 'name',
      expertName: 'expert',
      mainClass: 'class',
      depthLevel: 1,
      validFromDayId: 0,
      expiryDayId: 1,
      validFromDay: new Date(Date.now()),
      expiryDay: new Date(Date.now()),
      elemTypeId: 0,
      typeName: 'type',
      txtColor: 'red',
      bgColor: 'black',
      depth: 1.1,
      height: 2.0,
      width: 1,
      upstreamY: 0,
      upstreamZ: 1.2,
      midstreamX: 2,
      midstreamY: 2.1,
      midstreamZ: 3,
      downstreamX: 3,
      downstreamY: 0,
      downstreamZ: 0,
      upstreamX: 0
    },
  ]

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MatSlideToggleModule,
        MatFormField,
        MatLabel,
        MatIcon,
        MatChipsModule,
        MatCheckboxModule,
        MatAutocompleteModule,
        MatRadioModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        MatInputModule,
        MatInput,
        MatFormFieldModule
      ],
      providers: [
        provideRouter([]),
      ],
      declarations: [
        RootFilterComponent,
        MachineFilterComponent,
        ClassFilterComponent,
        PositionFilterComponent
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RootFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit date when date input changes', () => {
    const date = new Date(Date.now()); // Example date
    const dateSpy = spyOn(component.dateSelected, 'next');
    component.date = date;
    expect(dateSpy).toHaveBeenCalledWith(date);
  });

  it('should set isCollapsedControl value when isCollapsed input changes', () => {
    const isCollapsed = true;
    const isCollapsedSpy = spyOn(component.isCollapsedControl, 'setValue');
    component.isCollapsed = isCollapsed;
    expect(isCollapsedSpy).toHaveBeenCalledWith(isCollapsed);
  })

  it('should unsubscribe on ngOnDestroy', () => {
    const spy = spyOn(component.dateSelected, "complete").and.callThrough();
    component.ngOnDestroy();
    expect(spy).toHaveBeenCalled();
  });

  it('should update and round position range end value when machine length is not null and less than default machine length (50meters)', () => {
    component._updatePositionRange(mockMachines.basic);
    expect(component.positionRangeControl.value).toEqual([MACHINE.defaultStart, Math.ceil(mockMachines.basic.machineLength)]);
  })

  it('should update position range end value to default machine length when machine length is null', () => {
    component._updatePositionRange(mockMachines.nullLength);
    expect(component.positionRangeControl.value).toEqual([MACHINE.defaultStart, MACHINE.defaultStart]);
  })

  it('should update and round position range end value to default machine length when machine length is not null and more than default (50meters)', () => {
    component._updatePositionRange(mockMachines.overLength);
    expect(component.positionRangeControl.value).toEqual([MACHINE.defaultStart, MACHINE.defaultLength]);
  })

  it('should update unique classes FromArray based on elements', () => {
    component._setElementsData(mockElements);
    expect(component.form.get('activeClasses').value).toEqual(['class', 'class1'])
  })

  it('should return unique depth levels array based on elements', () => {
    component._setElementsData(mockElements);
    expect(component.depthLevels).toEqual([1, 11]);
  })

  it('should set all values in unique depth level FromArray to true after loading elements and if view is not collapsed', () => {
    component._setElementsData(mockElements);
    expect(component.form.get('depthLevels').value).toEqual([true, true]);
  })

  it('should set only first value in unique names level FromArray to true after loading elements and if view is not collapsed', () => {
    component._setElementsData(mockElements);
    expect(component.form.get('namesLevels').value).toEqual([true, false]);
  })

  it('should not set or update depth and names levels FromArray if there is no elements', () => {
    component._setElementsData(mockEmptyElements);
    expect(component.form.get('namesLevels').value).toEqual([]);
    expect(component.form.get('depthLevels').value).toEqual([]);
  })

  it('should save depth levels FromArray values to local storage after after loading elements', () => {
    component._setElementsData(mockElements);
    expect(localStorage['depthLevels']).toBe(JSON.stringify([true, true]))
  })

  it('should return true if element with width but no height data is present in an array of elements after loading elements', () => {
    component._setElementsData(mockElements);
    expect(component.isElementsWithoutHeightPresent).toBe(true)
  })

  it('should return false if no elements with width but no height data are present in an array of elements after loading elements', () => {
    component._setElementsData(mockElementsNoElementsWithoutHeight);
    expect(component.isElementsWithoutHeightPresent).toBe(false)
  })

  it('should set only the first value to true in depth levels FormArray if the view was collapse before loading the elements', () => {
    component.isCollapsedControl.setValue(true);
    component.depthLevels = [1, 2];
    component._collapse();
    expect(component.form.get('depthLevels').value).toEqual([true, false]);
  })

  it('should update depth levels FormArray based on values saved in local storage if the view was not collapse before loading the elements', () => {
    component.isCollapsedControl.setValue(false);
    component._setElementsData(mockElements);
    component._collapse();
    expect(component.form.get('depthLevels').value).toEqual([true, true]);
  })
});

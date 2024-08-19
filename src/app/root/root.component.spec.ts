import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RootComponent } from './root.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {provideRouter} from "@angular/router";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatAccordion, MatExpansionModule} from "@angular/material/expansion";
import {RootFilterComponent} from "../filter/root-filter/root-filter.component";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatIcon} from "@angular/material/icon";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MachineFilterComponent} from "../filter/machine-filter/machine-filter.component";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {ClassFilterComponent} from "../filter/class-filter/class-filter.component";
import {MatFormField, MatFormFieldModule, MatLabel} from "@angular/material/form-field";
import {PositionFilterComponent} from "../filter/position-filter/position-filter.component";
import {MatChipsModule} from "@angular/material/chips";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatRadioModule} from "@angular/material/radio";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatInput, MatInputModule} from "@angular/material/input";
import {SvgComponent} from "../svg/root-svg/svg.component";

describe('RootComponent', () => {
  let component: RootComponent;
  let fixture: ComponentFixture<RootComponent>;
  let mockSvgComponent: jasmine.SpyObj<SvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MatProgressBarModule,
        MatAccordion,
        MatExpansionModule,
        MatCheckboxModule,
        MatIcon,
        BrowserAnimationsModule,
        MatSlideToggleModule,
        MatLabel,
        MatFormField,
        MatChipsModule,
        MatAutocompleteModule,
        MatRadioModule,
        FormsModule,
        MatInput,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule
      ],
      providers: [provideRouter([])],
      declarations: [
        RootComponent,
        RootFilterComponent,
        MachineFilterComponent,
        ClassFilterComponent,
        PositionFilterComponent
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RootComponent);
    component = fixture.componentInstance;
    mockSvgComponent = jasmine.createSpyObj('SvgComponent', ['zoomIn']);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should unsubscribe on ngOnDestroy', () => {
    const spy = spyOn(component.versionChange, 'complete').and.callThrough();
    component.ngOnDestroy();
    expect(spy).toHaveBeenCalled();
  });

  it('should call zoomIn on svgComponent when zoomIn is called and SVG exists', () => {
    component.svgComponent = mockSvgComponent;
    component.zoomIn();
    expect(mockSvgComponent.zoomIn).toHaveBeenCalled();
  })

  it('should toggle view isCollapsed state', () => {
    expect(component.isCollapsed).toBeFalse();
    component.toggleView();
    expect(component.isCollapsed).toBeTrue();
    component.toggleView();
    expect(component.isCollapsed).toBeFalse();
  });

  it('should toggle dragging isDraggable state', () => {
    expect(component.isDraggable).toBeTrue();
    component.toggleDragging();
    expect(component.isDraggable).toBeFalse();
    component.toggleDragging();
    expect(component.isDraggable).toBeTrue();
  })

  it('should return true if the date is on or after 4000-01-01T00:00:00Z', () => {
    const dateOnEndless = new Date('4000-01-01T00:00:00Z');
    const dateMareThanEndless = new Date('4001-01-01T00:00:00Z');
    expect(component.isEndless(dateOnEndless)).toBeTrue();
    expect(component.isEndless(dateMareThanEndless)).toBeTrue();
  })

  it('should return false if the date is before 4000-01-01T00:00:00Z', () => {
    const dateBeforeEndless = new Date('2020-01-01T00:00:00Z');
    expect(component.isEndless(dateBeforeEndless)).toBeFalse();
  })

  it('should set loading state to true and progressBarMode to indeterminate when loading', () => {
    component.setLoadingState(true);
    expect(component.isLoading).toBeTrue();
    expect(component.progressBarMode).toBe('indeterminate');
  })

  it('should set loading state to false and progressBarMode to determinate when not loading', () => {
    component.setLoadingState(false);
    expect(component.isLoading).toBeFalse();
    expect(component.progressBarMode).toBe('determinate');
  })
});

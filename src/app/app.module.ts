import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {RootFilterComponent} from "./filter/root-filter/root-filter.component";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatIconModule} from "@angular/material/icon";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MachineFilterComponent} from "./filter/machine-filter/machine-filter.component";
import {ClassFilterComponent} from "./filter/class-filter/class-filter.component";
import {PositionFilterComponent} from "./filter/position-filter/position-filter.component";
import {MatRadioGroup, MatRadioModule} from "@angular/material/radio";
import {MatInputModule} from "@angular/material/input";
import {PositionSelectComponent} from "./filter/position-filter/position-select/position-select.component";
import {MatChipsModule} from "@angular/material/chips";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {SvgComponent} from "./svg/root-svg/svg.component";
import {DatePipe, NgOptimizedImage} from "@angular/common";
import {ElementComponent} from "./svg/element/element.component";
import {TooltipComponent} from "./svg/tooltip/tooltip.component";
import {PositionDialogComponent} from "./filter/position-filter/position-dialog/position-dialog.component";
import {MilestoneDayRangeComponent} from "./layout/milestone-day-range.component";
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatNativeDateModule, MatOptionModule} from "@angular/material/core";
import {MachineDialogComponent} from "./filter/machine-filter/machine-dialog/machine-dialog.component";
import {MatDialogModule, MatDialogRef, MatDialog } from "@angular/material/dialog";
import {HttpClientModule} from "@angular/common/http";
import {VersionSelectorComponent} from "./version-selector/version-selector.component";
import {
  MilestoneDayPickerDialogComponent
} from "./version-selector/milestone-day-picker-dialog/milestone-day-picker-dialog.component";
import {MilestoneDayTileComponent} from "./version-selector/milestone-day-tile/milestone-day-tile.component";
import {CdkDrag, CdkDragHandle} from "@angular/cdk/drag-drop";
import {CeilingPipe, RootComponent} from "./root/root.component";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from "@angular/material/datepicker";

@NgModule({
  declarations: [
    AppComponent,
    RootFilterComponent,
    MachineFilterComponent,
    ClassFilterComponent,
    PositionFilterComponent,
    PositionSelectComponent,
    ElementComponent,
    SvgComponent,
    TooltipComponent,
    PositionDialogComponent,
    MilestoneDayRangeComponent,
    MachineDialogComponent,
    VersionSelectorComponent,
    MilestoneDayPickerDialogComponent,
    MilestoneDayTileComponent,
    RootComponent
  ],
  imports: [
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    NgOptimizedImage,
    MatFormFieldModule,
    MatChipsModule,
    MatIconModule,
    MatCheckboxModule,
    MatOptionModule,
    MatAutocompleteModule,
    MatRadioModule,
    MatButtonModule,
    MatProgressBarModule,
    MatExpansionModule,
    MatInputModule,
    MatDialogModule,
    HttpClientModule,
    CdkDrag,
    CdkDragHandle,
    CeilingPipe,
    MatSlideToggle,
    MatRadioGroup,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatDatepicker,
    MatNativeDateModule
  ],
  exports: [
    MatFormFieldModule
  ],
  providers: [{
    provide: MatDialogRef,
    useValue: {},

  },
    MatDialog,
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}

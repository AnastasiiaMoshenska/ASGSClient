import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PositionDialogComponent} from './position-dialog.component';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatRadioModule} from "@angular/material/radio";
import {MatIconModule} from "@angular/material/icon";
import {ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

describe('PositionDialogComponent', () => {
  let component: PositionDialogComponent;
  let fixture: ComponentFixture<PositionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatDialogModule,
        MatInputModule,
        MatFormFieldModule,
        MatRadioModule,
        MatIconModule,
        ReactiveFormsModule,
        BrowserAnimationsModule
      ],
      declarations: [PositionDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: { close: () => {} } },
        { provide: MAT_DIALOG_DATA, useValue: { positions: [], selectedPosition: null, start: true } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PositionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

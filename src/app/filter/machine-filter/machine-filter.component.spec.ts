import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MachineFilterComponent} from './machine-filter.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {of} from "rxjs";
import {MachineService} from "../../services/machine/machine.service";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatRadioModule} from "@angular/material/radio";
import {MatIconModule} from "@angular/material/icon";
import {ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

describe('MachineFilterComponent', () => {
  let component: MachineFilterComponent;
  let fixture: ComponentFixture<MachineFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule,
        MatDialogModule,
        MatInputModule,
        MatFormFieldModule,
        MatRadioModule,
        MatIconModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
      ],
      declarations: [MachineFilterComponent],
      providers: [
        { provide: MatDialogRef, useValue: { close: () => {} } },
        { provide: MAT_DIALOG_DATA, useValue: of({someData: []}) },
        MachineService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MachineFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MachineDialogComponent } from './machine-dialog.component';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {ReactiveFormsModule} from "@angular/forms";
import {MilestoneDayRangeComponent} from "../../../layout/milestone-day-range.component";
import {MatInputModule} from "@angular/material/input";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

describe('MachineDialogComponent', () => {
    let component: MachineDialogComponent;
    let fixture: ComponentFixture<MachineDialogComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
          imports: [
            MatFormFieldModule,
            MatInputModule,
            MatIcon,
            MatDialogModule,
            ReactiveFormsModule,
            BrowserAnimationsModule
          ],
            declarations: [
              MachineDialogComponent,
              MilestoneDayRangeComponent
            ],
          providers: [
            { provide: MatDialogRef, useValue: { close: () => {} } },
            {
              provide: MAT_DIALOG_DATA,
              useValue: {
                machines: [
                  { machineId: 1, machineCode: 'ABC123', machineName: 'Lathe' },
                  { machineId: 2, machineCode: 'DEF456', machineName: 'Milling Machine' },
                  { machineId: 3, machineCode: 'GHI789', machineName: 'Grinder' }
                ],
                selectedMachine: { machineId: 2, machineCode: 'DEF456', machineName: 'Milling Machine' }
              }
            }
          ]
        }).compileComponents();

        fixture = TestBed.createComponent(MachineDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

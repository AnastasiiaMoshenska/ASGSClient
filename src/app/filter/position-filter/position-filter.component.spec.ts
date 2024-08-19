import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PositionFilterComponent } from './position-filter.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {MatRadioModule} from "@angular/material/radio";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

describe('PositionFilterComponent', () => {
    let component: PositionFilterComponent;
    let fixture: ComponentFixture<PositionFilterComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
          imports: [
            HttpClientTestingModule,
            MatRadioModule,
            FormsModule,
            MatFormFieldModule,
            ReactiveFormsModule,
            MatInputModule,
            BrowserAnimationsModule
          ],
          declarations: [PositionFilterComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(PositionFilterComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

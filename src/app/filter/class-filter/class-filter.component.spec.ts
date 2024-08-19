import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassFilterComponent } from './class-filter.component';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatChipsModule} from "@angular/material/chips";
import { MatCheckboxModule} from "@angular/material/checkbox";
import {MatAutocomplete, MatAutocompleteModule} from "@angular/material/autocomplete";
import {ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatIcon} from "@angular/material/icon";

describe('ClassFilterComponent', () => {
    let component: ClassFilterComponent;
    let fixture: ComponentFixture<ClassFilterComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
          imports: [
            MatFormFieldModule,
            MatChipsModule,
            MatCheckboxModule,
            MatAutocomplete,
            ReactiveFormsModule,
            MatInputModule,
            MatAutocompleteModule,
            BrowserAnimationsModule,
            MatIcon
          ],
            declarations: [ClassFilterComponent ]
        }).compileComponents();

        fixture = TestBed.createComponent(ClassFilterComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef, Input, OnChanges } from '@angular/core';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
    selector: 'lt-class-filter',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './class-filter.component.html',
    styleUrls: ['./class-filter.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => ClassFilterComponent),
            multi: true
        }
    ]
})
export class ClassFilterComponent implements OnChanges, ControlValueAccessor {
    readonly separatorKeysCodes = [ENTER, COMMA];
    readonly classCtrl = new FormControl('');

    @Input() classes!: string[];

    classesFiltered: string[] = [];
    classesActive = new Set<string>();

    constructor(private cdr: ChangeDetectorRef) {}

    ngOnChanges() {
        this.classesFiltered = this.classes?.filter(className => !this.classesActive.has(className));
    }

    remove(name: string): void {
        this.classesActive.delete(name);
        this.classesFiltered = this.classes.filter(className => !this.classesActive.has(className));
        this.changeValue(this.classesActive);
    }

    showAll() {
        if (this.classesActive.size === this.classes.length) {
            this.changeValue(new Set());
            this.classesFiltered = this.classes;
        } else {
            this.changeValue(new Set(this.classes));
            this.classesFiltered = [];
        }
    }

    select(event: MatAutocompleteSelectedEvent): void {
        this.classesActive.add(event.option.viewValue);
        this.classesFiltered = this.classes.filter(className => !this.classesActive.has(className));
        this.classCtrl.reset();
        this.changeValue(this.classesActive);
    }

    private onChange: (value: string[]) => void = () => {};
    private onTouched: () => void = () => {};

    writeValue(value: string[]): void {
        this.changeValue(new Set(value));
    }

    changeValue(value: Set<string>) {
        this.classesActive = value;
        this.onTouched();
        this.onChange([...value]);
        this.cdr.detectChanges();
      localStorage['classes'] = JSON.stringify(Array.from(this.classesActive));
    }

    registerOnChange(fn: (value: string[]) => void): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }
}

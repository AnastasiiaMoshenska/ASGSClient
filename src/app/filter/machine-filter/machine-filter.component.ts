import {Component, forwardRef, signal, Signal} from '@angular/core';
import {Machine} from '../../models/models';
import {MatDialog} from '@angular/material/dialog';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {MachineDialogComponent} from './machine-dialog/machine-dialog.component';
import {MachineService} from '../../services/machine/machine.service';
import {toSignal} from "@angular/core/rxjs-interop";
import {shareReplay} from "rxjs/operators";
import {Observable} from "rxjs";

@Component({
  selector: 'lt-machine-filter',
  templateUrl: './machine-filter.component.html',
  styleUrls: ['./machine-filter.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MachineFilterComponent),
      multi: true
    }
  ]
})
export class MachineFilterComponent implements ControlValueAccessor {
  readonly machines: Signal<Machine[]>;
  readonly machines$: Observable<Machine[]>;
  readonly selectedMachine = signal<Machine | null | undefined>(null);
  private onChange: (value: Machine | null) => void = () => {
  };
  private onTouched: () => void = () => {
  };


  static ID = 0;
  readonly id = MachineFilterComponent.ID++;

  constructor(public readonly dialog: MatDialog, private readonly machineService: MachineService) {
    this.machines$ = this.machineService.getAllMachines().pipe(shareReplay(1));
    this.machines = toSignal(this.machines$, {initialValue: []})
  }

  openDialog() {
    this.dialog.open(MachineDialogComponent, {
      data: {
        machines: this.machines(),
        selectedMachine: this.selectedMachine()
      }
    }).afterClosed()
      .subscribe((selectedMachine: Machine) => {
        if (selectedMachine) {
          this.writeValue(selectedMachine);
        }
        this.onTouched();
      });
  }

  writeValue(value: number | Machine | null): void {
    if (typeof value === 'number') {
      this.machines$.subscribe(machines => {
        const found = machines.find(machine => machine.machineElementId === value) ?? null;
        if (found !== null) {
          this.selectedMachine.set(found);
          this.onChange(found);
        }
      });
      return;
    }
    this.selectedMachine.set(value);
    this.onChange(value);
  }

  registerOnChange(fn: (value: Machine | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
}

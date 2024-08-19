import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Machine } from '../../models/models';

@Injectable({
    providedIn: 'root'
})
export class MachineService {
    private machineUrl = 'http://localhost:8080/beamline-schematics/machines';
    // private machineUrl = 'https://ccda-dev.cern.ch:8906/api/layout/beamline-schematics/machines';

    constructor(private http: HttpClient) {}

    getAllMachines(): Observable<Array<Machine>> {
        return this.http
            .get<Machine[]>(this.machineUrl)
            .pipe(
                map(machines => {
                    const all = machines || [];
                    return all.map(machine => ({
                      ...machine,
                      validFromDay: new Date(machine.validFromDay),
                      expiryDay: new Date(machine.expiryDay)
                    }))
                })
            )
            .pipe(catchError(this.handleError<Machine[]>('get machines', [])));
    }

    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            console.log(`${operation} failed: ${error.message}`);
            return of(result as T);
        };
    }
}

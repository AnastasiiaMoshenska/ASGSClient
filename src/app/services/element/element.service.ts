import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Element } from '../../models/models';
import { MACHINE } from '../../constants/constants';

@Injectable({
    providedIn: 'root'
})
export class ElementService {
    private elementUrl = 'http://localhost:8080/beamline-schematics/elements';
    // private elementUrl = 'https://ccda-dev.cern.ch:8906/api/layout/beamline-schematics/elements';

    constructor(private http: HttpClient) {}

    getElementsByMachineElementId(
        machineElementId: number,
        referentialId: number,
        date: string | null,
        dcumStart: number = MACHINE.defaultStart,
        dcumEnd: number = MACHINE.defaultLength
    ): Observable<Array<Element>> {
        return this.http
            .get<Element[]>(`${this.elementUrl}/machine/${machineElementId}/referential/${referentialId}?date=${date}&dcumStart=${+dcumStart}&dcumEnd=${+dcumEnd}`)
            .pipe(
                map(elements => {
                    return elements || [];
                }),
                catchError(this.handleError<Element[]>('get elements', []))
            );
    }

    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            console.log(`${operation} failed: ${error.message}`);
            return of(result as T);
        };
    }
}

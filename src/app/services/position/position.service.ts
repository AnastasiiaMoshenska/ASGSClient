import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Position } from '../../models/models';

@Injectable({
    providedIn: 'root'
})
export class PositionService {
    private positionUrl = 'http://localhost:8080/beamline-schematics/positions';


    constructor(private http: HttpClient) {}

    getAllPositions(referential: number, elValidFromDay: string): Observable<Array<Position>> {
        return this.http
            .get<Position[]>(`${this.positionUrl}/referential/${referential}/elValidFromDay/${elValidFromDay}`)
            .pipe(
                map(positions => {
                    return positions || [];
                })
            )
            .pipe(catchError(this.handleError<Position[]>('get elements', [])));
    }

    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            console.log(`${operation} failed: ${error.message}`);
            return of(result as T);
        };
    }
}

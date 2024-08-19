import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {defined, MilestoneDay, MilestoneImportance} from "../../layout/stuff";
import {filter, map, shareReplay, switchMap} from "rxjs/operators";
import {Observable} from "rxjs";
import {QueryBuilder} from "../../layout/query-builder";

@Injectable({
  providedIn: 'root'
})
export class MilestoneDayService {
  protected readonly endpoint = 'https://layout.cern.ch/api/v1/milestone-days';

  readonly cache$: Observable<MilestoneDay[]>;

  public static parseFromDate(fromDay?: MilestoneDay) {
    return new Date(fromDay?.date || '1954-01-01T00:00:00.000Z');
  }

  public static parseToDate(toDay?: MilestoneDay) {
    return new Date(toDay?.date || '4000-01-01T00:00:00.000Z');
  }

  constructor(protected readonly http: HttpClient) {

    this.cache$ = this.getAll(undefined, 10_000).pipe(
      map(milestoneDays => milestoneDays.map(milestoneDay => ({...milestoneDay, date: new Date(milestoneDay.date)}))),
      map(milestoneDays => milestoneDays.sort((x: MilestoneDay, y: MilestoneDay) => +x.date - +y.date)),
      shareReplay(1)
    );
  }

  public findMoreDatesByDateBetween(fromDay?: MilestoneDay, toDay?: MilestoneDay) {
    const from = MilestoneDayService.parseFromDate(fromDay);
    const to = MilestoneDayService.parseToDate(toDay);

    return this.http
      .get<MilestoneDay[]>(`${this.endpoint}/by-date-between`, {
        params: {
          fromDate: from.toISOString(),
          toDate: to.toISOString()
        }
      })
      .pipe(map(milestoneDays => milestoneDays.map(milestoneDay => ({
        ...milestoneDay,
        date: new Date(milestoneDay.date)
      }))));
  }

  findLatestMilestoneDay(date: Date) {
    return this.http
      .get<MilestoneDay>(`${this.endpoint}/find-latest`, {
        params: {
          date: date.toISOString()
        }
      })
      .pipe(
        switchMap(latest => this.get(latest.id)),
      );
  }

  get(id: number): Observable<MilestoneDay> {
    return this.cache$.pipe(
      map(days => days.find(md => md.id === id)),
      filter(defined)
    );
  }

  public getByLabel(label: string): Observable<MilestoneDay> {
    return this.cache$.pipe(
      map(mds => mds.find(md => md.label === label)),
      filter(defined)
    );
  }

  getAll(queryObject?: any, max?: number): Observable<MilestoneDay[]> {
    if (!queryObject) {
      return this.http.get<MilestoneDay[]>(`${this.endpoint}`, {params: max ? {max: `${max}`} : {}});
    }
    const query = QueryBuilder.stringify(queryObject);
    return this.http.get<MilestoneDay[]>(`${this.endpoint}`, {params: max ? {query, max: `${max}`} : {query}});
  }

  findByOfficialIsTrueAndImportanceNotIn(excludedImportances: (keyof typeof MilestoneImportance)[] = ['NONE']): Observable<MilestoneDay[]> {
    const excludedImportanceSet = new Set(excludedImportances);
    return this.cache$.pipe(map(mds => mds.filter(md => md.official && !excludedImportanceSet.has(md.importance))));
  }
}

import {ElementRef} from "@angular/core";
import {Observable} from "rxjs";

export enum DateFormat {
  DATE = 'dd-MM-yyyy', // 21-05-2019
  INVERSE_DATE = 'yyyy-MM-dd',
  DATE_TIME = 'dd-MM-yyyy HH:mm:ss', // 21-05-2019 12:54:33
  EAM_DATE = 'dd-MMM-yyyy HH:mm', // 21-May-2019 12:54
  UTC_TIME = 'HH:mm:ss z', // 12:54:33 UTC
  MILESTONE_DAY_TILE_TIME = 'EEEE, MMMM d, y' // Monday, July 24, 2017
}

export interface MilestoneDay {
  id: number;
  date: Date;
  official: boolean;
  label: string;
  importance: keyof typeof MilestoneImportance;
}

export enum MilestoneImportance {
  MAJOR = 'MAJOR',
  MEDIUM = 'MEDIUM',
  MINOR = 'MINOR',
  NONE = 'NONE'
}

export enum MilestoneImportanceColors {
  MAJOR = '#d9534f',
  MEDIUM = '#f0ad4e',
  MINOR = '#5cb85c',
  NONE = '#d3d3d3',
  DEFAULT = 'lightblue'
}

export interface MilestoneDayRange {
  id: string;
  from: MilestoneDay;
  to: MilestoneDay;
}

export function createResizeObservable(element: ElementRef) {
  return new Observable(obs => {
    // TODO Remove @ts-ignore after upgrading to TypeScript 4.2.
    // @ts-ignore
    // this should be fine with all evergreen, we don't care about IE
    const resizeObserver = new ResizeObserver(() => obs.next());
    resizeObserver.observe(element.nativeElement);
    return () => resizeObserver.unobserve(element.nativeElement);
  });
}

export const isBetween = (date: Date, from: Date, to: Date): boolean => date >= from && date < to;

export function defined<T>(x: T | null | undefined | void): x is T {
  return x !== null && x !== undefined;
}

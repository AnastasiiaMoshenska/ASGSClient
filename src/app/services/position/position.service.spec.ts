import {TestBed} from '@angular/core/testing';

import {PositionService} from './position.service';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {Position} from "../../models/models";

describe('PositionService', () => {
  let service: PositionService;
  let httpTestingController: HttpTestingController;

  const referentialId = 1;
  const elValidFromDay = new Date(Date.now()).toISOString().replace(/\.\d{3}/, '');
  const url = '/api/v1/beamline-schematics/positions';
  const urlWithParams = `${url}/referential/${referentialId}/elValidFromDay/${elValidFromDay}`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ]
    });
    service = TestBed.inject(PositionService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return an array of Positions', () => {

    const mockPositions: Position[] = [
      {
        elementName: 'SPS position',
        referentialId: 1,
        upstreamX: 1.1,
        midstreamX: 1.2,
        downstreamX: 1.3,
        elValidFromDay: new Date(Date.now()),
        elExpiryDay: new Date(Date.now())
      },
      {
        elementName: 'PS position',
        referentialId: 1,
        upstreamX: -1,
        midstreamX: 10.2,
        downstreamX: 10.3,
        elValidFromDay: new Date(Date.now()),
        elExpiryDay: new Date(Date.now())
      }
    ];

    service.getAllPositions(referentialId, elValidFromDay).subscribe(positions => {
      expect(positions.length).toBe(2);
      expect(positions).toEqual(mockPositions);
    });

    const req = httpTestingController.expectOne(urlWithParams);
    expect(req.request.method).toEqual('GET');
    req.flush(mockPositions);
    httpTestingController.verify();
  });

  it('should return an empty array', () => {
    const mockPositions = null;

    service.getAllPositions(referentialId, elValidFromDay).subscribe(positions => {
      expect(positions.length).toBe(0);
      expect(positions).toEqual([]);
    });

    const req = httpTestingController.expectOne(urlWithParams);
    expect(req.request.method).toEqual('GET');
    req.flush(mockPositions);
    httpTestingController.verify();
  })
});

import { TestBed } from '@angular/core/testing';

import { ElementService } from './element.service';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {Element} from "../../models/models";

describe('ElementService', () => {
  let service: ElementService;
  let httpTestingController: HttpTestingController;

  const machine = 0;
  const referentialId = 1;
  const date = new Date(Date.now()).toISOString().replace(/\.\d{3}/, '');
  const dcumStart = -1;
  const dcumEnd = 10;
  const url = '/api/v1/beamline-schematics/elements';
  const urlWithParams = `${url}/machine/${machine}/referential/${referentialId}?date=${date}&dcumStart=${dcumStart-10}&dcumEnd=${dcumEnd+10}`;


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ]
    });
    service = TestBed.inject(ElementService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return an array of elements', () => {

    const mockElements: Element[] = [
      {
        elementId: 1,
        elementLabel: 'label',
        elementName: 'name',
        expertName: 'expert',
        mainClass: 'class',
        depthLevel: 1,
        validFromDayId: 0,
        expiryDayId: 1,
        validFromDay: new Date(Date.now()),
        expiryDay: new Date(Date.now()),
        elemTypeId: 0,
        typeName: 'type',
        txtColor: 'red',
        bgColor: 'black',
        depth: 1.1,
        height: 2.0,
        width: 1,
        upstreamY: 0,
        upstreamZ: 1.2,
        midstreamX: 2,
        midstreamY: 2.1,
        midstreamZ: 3,
        downstreamX: 3,
        downstreamY: 0,
        downstreamZ: 0,
        upstreamX: 0
      }
    ];

    service.getElementsByMachineElementId(machine, referentialId, date, dcumStart, dcumEnd).subscribe(elements => {
      expect(elements.length).toBe(1);
      expect(elements).toEqual(mockElements);
    });

    const req = httpTestingController.expectOne(urlWithParams);
    expect(req.request.method).toEqual('GET');
    req.flush(mockElements);
    httpTestingController.verify();
  })


  it('should return an empty array', () => {
    const mockElements = null;

    service.getElementsByMachineElementId(machine, referentialId, date, dcumStart, dcumEnd).subscribe(elements => {
      expect(elements.length).toBe(0);
      expect(elements).toEqual([]);
    });

    const req = httpTestingController.expectOne(urlWithParams);
    expect(req.request.method).toEqual('GET');
    req.flush(mockElements);
    httpTestingController.verify();
  })
});

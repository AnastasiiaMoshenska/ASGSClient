import {TestBed} from '@angular/core/testing';

import {MachineService} from './machine.service';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {Machine} from "../../models/models";

describe('MachineService', () => {
  let service: MachineService;
  let httpTestingController: HttpTestingController;

  const url = '/api/v1/beamline-schematics/machines';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ]
    });
    service = TestBed.inject(MachineService);
    httpTestingController = TestBed.inject(HttpTestingController)
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return an array of Machines', () => {
    const mockMachines: Machine[] = [
      {
        description: 'description SPS',
        machineCode: 'SPS',
        machineElementId: 1,
        referentialId: 2,
        validFromDay: new Date(Date.now()),
        expiryDay: new Date(Date.now()),
        title: 'SPS title',
        machineLength: 10
      },
      {
        description: 'description PS',
        machineCode: 'PS',
        machineElementId: 3,
        referentialId: 4,
        validFromDay: new Date(Date.now()),
        expiryDay: new Date(Date.now()),
        title: 'PS title',
        machineLength: 5
      }
    ];

    service.getAllMachines().subscribe(machines => {
      expect(machines.length).toBe(2);
      expect(machines).toEqual(mockMachines);
    });

    const req = httpTestingController.expectOne(url);
    expect(req.request.method).toEqual('GET');
    req.flush(mockMachines);
    httpTestingController.verify();
  })


  it('should return an empty array', () => {
    const mockMachines = null;

    service.getAllMachines().subscribe(machines => {
      expect(machines.length).toBe(0);
      expect(machines).toEqual([]);
    });

    const req = httpTestingController.expectOne(url);
    expect(req.request.method).toEqual('GET');
    req.flush(mockMachines);
    httpTestingController.verify();
  })
});

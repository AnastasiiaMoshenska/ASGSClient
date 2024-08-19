export interface Element{
  elementId: number;
  elementLabel: string;
  elementName: string;
  expertName: string;
  mainClass: string;
  depthLevel: number;
  validFromDayId: number;
  expiryDayId: number;
  validFromDay: Date;
  expiryDay: Date;
  elemTypeId: number;
  typeName: string;
  txtColor: string;
  bgColor: string;
  depth: number;
  height: number;
  width: number;
  downstreamX: number;
  downstreamY: number;
  downstreamZ: number;
  midstreamX: number;
  midstreamY: number;
  midstreamZ: number;
  upstreamX: number;
  upstreamY: number;
  upstreamZ: number;
}

export interface Machine {
  description: string;
  machineCode: string;
  machineElementId: number;
  referentialId: number;
  validFromDay: Date;
  expiryDay: Date;
  title: string;
  machineLength: number;
}

export interface Position {
  elementName: string;
  referentialId: number;
  upstreamX: number;
  midstreamX: number;
  downstreamX: number;
  elValidFromDay: Date;
  elExpiryDay: Date;
}

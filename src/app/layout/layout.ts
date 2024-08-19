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

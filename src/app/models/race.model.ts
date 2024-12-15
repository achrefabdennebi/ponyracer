import { PonyModel, PonyWithPositionModel } from './pony.model';

export interface RaceModel {
  id: number;
  name: string;
  ponies: PonyModel[];
  startInstant: string;
  betPonyId?: number;
  status?: string;
}

export interface LiveRaceModel {
  ponies: PonyWithPositionModel[];
  status: 'PENDING' | 'RUNNING' | 'FINISHED';
}

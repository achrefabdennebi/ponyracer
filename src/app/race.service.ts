import { inject, Injectable, Type } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, takeWhile } from 'rxjs';
import { environment } from '../environments/environment';
import { LiveRaceModel, RaceModel } from './models/race.model';
import { WsService } from './ws.service';

@Injectable({ providedIn: 'root' })
export class RaceService {
  private readonly http = inject(HttpClient);
  private readonly ws = inject(WsService);

  list(): Observable<Array<RaceModel>> {
    const params = { status: 'PENDING' };
    return this.http.get<Array<RaceModel>>(`${environment.baseUrl}/api/races`, { params });
  }

  get(raceId: number): Observable<RaceModel> {
    return this.http.get<RaceModel>(`${environment.baseUrl}/api/races/${raceId}`);
  }

  bet(raceId: number, ponyId: number): Observable<void> {
    return this.http.post<void>(`${environment.baseUrl}/api/races/${raceId}/bets`, { ponyId });
  }

  cancelBet(raceId: number): Observable<void> {
    return this.http.delete<void>(`${environment.baseUrl}/api/races/${raceId}/bets`);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  live(raceId: number): Observable<LiveRaceModel> {
    return this.ws
      .connect<LiveRaceModel>(`/race/${raceId}`)
      .pipe(takeWhile(liveRace => liveRace.status !== 'FINISHED', /* include last value */ true));
  }
}

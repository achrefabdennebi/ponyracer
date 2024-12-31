import { Component, computed, inject, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { catchError, map, of, startWith, switchMap } from 'rxjs';
import { RaceService } from '../race.service';
import { RaceModel } from '../models/race.model';
import { PonyWithPositionModel } from '../models/pony.model';
import { PonyComponent } from '../pony/pony.component';
import { FromNowPipe } from '../from-now.pipe';

interface RaceModelWithPositions extends RaceModel {
  poniesWithPosition: Array<PonyWithPositionModel>;
  liveError?: boolean;
}

@Component({
  imports: [PonyComponent, FromNowPipe],
  templateUrl: './live.component.html',
  styleUrl: './live.component.css'
})
export class LiveComponent {
  readonly raceModel: Signal<RaceModelWithPositions | undefined>;
  readonly winners = computed(() => this.raceModel()?.poniesWithPosition.filter(pony => pony.position >= 100));
  readonly betWon = computed(() => this.winners()?.some(pony => pony.id === this.raceModel()?.betPonyId));

  constructor() {
    const route = inject(ActivatedRoute);
    const raceId = parseInt(route.snapshot.paramMap.get('raceId')!);
    const raceService = inject(RaceService);
    this.raceModel = toSignal(
      raceService.get(raceId).pipe(
        switchMap(race => {
          if (race.status === 'FINISHED') {
            return of({ ...race, poniesWithPosition: [] });
          } else {
            return raceService.live(race.id).pipe(
              map(live => ({ ...race, poniesWithPosition: live.ponies, status: live.status })),
              startWith({ ...race, poniesWithPosition: [] }),
              catchError(() => of({ ...race, poniesWithPosition: [], liveError: true }))
            );
          }
        })
      )
    );
  }
}

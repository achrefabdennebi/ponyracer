import { Component, inject, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map, startWith, switchMap } from 'rxjs';
import { RaceService } from '../race.service';
import { RaceModel } from '../models/race.model';
import { PonyWithPositionModel } from '../models/pony.model';
import { PonyComponent } from '../pony/pony.component';

interface RaceModelWithPositions extends RaceModel {
  poniesWithPosition: Array<PonyWithPositionModel>;
}

@Component({
  imports: [PonyComponent],
  templateUrl: './live.component.html',
  styleUrl: './live.component.css'
})
export class LiveComponent {
  readonly raceModel: Signal<RaceModelWithPositions | undefined>;

  constructor() {
    const route = inject(ActivatedRoute);
    const raceId = parseInt(route.snapshot.paramMap.get('raceId')!);
    const raceService = inject(RaceService);
    this.raceModel = toSignal(
      raceService.get(raceId).pipe(
        switchMap(race =>
          raceService.live(race!.id).pipe(
            map(live => ({ ...race, poniesWithPosition: live.ponies, status: live.status })),
            startWith({ ...race, poniesWithPosition: [] })
          )
        )
      )
    );
  }
}

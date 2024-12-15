import { Component, inject, Signal, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { startWith, Subject, switchMap } from 'rxjs';
import { PonyComponent } from '../pony/pony.component';
import { RaceService } from '../race.service';
import { RaceModel } from '../models/race.model';
import { PonyModel } from '../models/pony.model';
import { FromNowPipe } from '../from-now.pipe';

@Component({
  imports: [RouterLink, PonyComponent, FromNowPipe],
  templateUrl: './bet.component.html',
  styleUrl: './bet.component.css'
})
export class BetComponent {
  private readonly raceService = inject(RaceService);
  readonly raceModel: Signal<RaceModel | undefined>;
  readonly betFailed = signal(false);
  private readonly refreshSubject = new Subject<void>();

  constructor() {
    const route = inject(ActivatedRoute);
    const raceId = parseInt(route.snapshot.paramMap.get('raceId')!);
    this.raceModel = toSignal(
      this.refreshSubject.pipe(
        startWith(undefined),
        switchMap(() => this.raceService.get(raceId))
      )
    );
  }

  betOnPony(pony: PonyModel): void {
    this.betFailed.set(false);
    const result$ = this.isPonySelected(pony)
      ? this.raceService.cancelBet(this.raceModel()!.id)
      : this.raceService.bet(this.raceModel()!.id, pony.id);
    result$.subscribe({
      next: () => this.refreshSubject.next(),
      error: () => this.betFailed.set(true)
    });
  }

  isPonySelected(pony: PonyModel): boolean {
    return pony.id === this.raceModel()!.betPonyId;
  }
}

import { Component } from '@angular/core';
import { RaceModel } from '../models/race.model';
import { ActivatedRoute } from '@angular/router';
import { RaceService } from '../race.service';
import { PonyComponent } from '../pony/pony.component';
import { PonyModel } from '../models/pony.model';
import { FromNowPipe } from '../from-now.pipe';

@Component({
  selector: 'pr-bet',
  imports: [PonyComponent, FromNowPipe],
  templateUrl: './bet.component.html',
  styleUrl: './bet.component.css'
})
export class BetComponent {
  raceModel: RaceModel | null = null;
  betFailed = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private raceService: RaceService
  ) {
    const id = +this.activatedRoute.snapshot.paramMap.get('raceId')!;
    this.raceService.get(id).subscribe(race => (this.raceModel = race));
  }

  betOnPony(pony: PonyModel) {
    if (!this.isPonySelected(pony)) {
      this.raceService.bet(this.raceModel!.id, pony.id).subscribe({
        next: (race: RaceModel) => (this.raceModel = race),
        error: () => (this.betFailed = true)
      });
    } else {
      this.raceService.cancelBet(this.raceModel!.id).subscribe({
        next: () => (this.raceModel!.betPonyId = undefined),
        error: () => (this.betFailed = true)
      });
    }
  }

  isPonySelected(pony: PonyModel): boolean {
    return pony.id === this.raceModel?.betPonyId;
  }
}

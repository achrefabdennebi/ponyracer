import { Component } from '@angular/core';
import { RaceModel } from '../models/race.model';
import { RaceComponent } from '../race/race.component';
import { RaceService } from '../race.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'pr-races',
  imports: [RaceComponent, RouterLink],
  templateUrl: './races.component.html',
  styleUrl: './races.component.css'
})
export class RacesComponent {
  races: RaceModel[] = [];
  constructor(private raceService: RaceService) {
    this.raceService.list().subscribe(races => (this.races = races));
  }
}

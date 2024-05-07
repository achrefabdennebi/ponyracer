import { Component } from '@angular/core';
import { MenuComponent } from './menu/menu.component';
import { RacesComponent } from './races/races.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'pr-root',
  standalone: true,
  imports: [MenuComponent, RacesComponent, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {}

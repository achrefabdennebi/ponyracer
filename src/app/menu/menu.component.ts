import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'pr-menu',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {
  navbarCollapsed = true;

  public toggleNavbar() {
    this.navbarCollapsed = !this.navbarCollapsed;
  }
}

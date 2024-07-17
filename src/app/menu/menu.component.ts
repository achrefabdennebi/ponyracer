import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserService } from '../user.service';
import { tap } from 'rxjs';
import { UserModel } from '../models/user.model';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'pr-menu',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {
  navbarCollapsed = true;
  user: UserModel | null = null;
  constructor(private readonly userService: UserService) {
    this.userService.userEvents.pipe(takeUntilDestroyed()).subscribe(user => (this.user = user));
  }
  public toggleNavbar() {
    this.navbarCollapsed = !this.navbarCollapsed;
  }
}

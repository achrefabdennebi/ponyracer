import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { UserModel } from '../models/user.model';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'pr-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup<{
    login: FormControl<string | null>;
    password: FormControl<string | null>;
  }>;

  authenticationFailed = false;

  constructor(
    protected fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.loginForm = fb.group({
      login: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    });
  }

  public authenticate() {
    const { login, password } = this.loginForm.value;
    this.userService.authenticate(login, password).subscribe({
      next: (user: UserModel) => this.router.navigateByUrl('/'),
      error: () => (this.authenticationFailed = true)
    });
  }
}

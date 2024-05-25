import { Component } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'pr-register',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  login = this.fb.control('', [Validators.required, Validators.min(3)]);
  password = this.fb.control('', [Validators.required]);
  confirmPassword = this.fb.control('', [Validators.required]);
  birthYear = this.fb.control<number | null>(null, [Validators.required]);
  passwordGroup = this.fb.group({
    password: this.password,
    confirmPassword: this.confirmPassword
  });
  userForm = this.fb.group({
    login: this.login,
    passwordForm: this.passwordGroup,
    birthYear: this.birthYear
  });

  constructor(
    private fb: NonNullableFormBuilder,
    private userService: UserService,
    private router: Router
  ) {}
}

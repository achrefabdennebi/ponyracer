import { Component } from '@angular/core';
import {
  AbstractControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
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
  login = this.fb.control('', [Validators.required, Validators.minLength(3)]);
  password = this.fb.control('', [Validators.required]);
  confirmPassword = this.fb.control('', [Validators.required]);
  birthYear = this.fb.control<number | null>(null,
    [
      Validators.required,
      Validators.min(1900),
      Validators.max(new Date().getFullYear())
    ]);
  passwordGroup = this.fb.group({
    password: this.password,
    confirmPassword: this.confirmPassword
  }, {
    validators: RegisterComponent.passwordMatch
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

  static passwordMatch(group: AbstractControl): ValidationErrors | null {
    const password = group.value.password;
    const confirmPassword = group.value.confirmPassword;

    return password === confirmPassword ? null : {
      matchingError: true
    }
  }

  register(): void {
    console.log('form submitted');
  }
}

import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage = '';
  formInvalidMessage = '';
  isSubmitting = false;
  formSubmitted = false;

  /**
   * Constructor injecting required services.
   * @param authService AuthService for login API calls
   * @param router Router for navigation after login
   */
  constructor(private authService: AuthService, private router: Router) {
    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });
  }

  /**
   * Initializes the component.
   * Redirects to dashboard if user is already logged in.
   */
  ngOnInit(): void {
    this.errorMessage = '';
    this.formInvalidMessage = '';

    if (sessionStorage.getItem('token')) {
      this.router.navigate(['/dashboard']);
    }
  }

  /**
   * Handles login form submission.
   * Performs validation and calls AuthService to log in.
   */
  login() {
    this.formSubmitted = true;

    this.errorMessage = '';
    this.formInvalidMessage = '';

    Object.values(this.loginForm.controls).forEach(control => {
      control.markAsTouched();
    });

    if (this.loginForm.invalid) {
      this.formInvalidMessage = 'Please enter both username and password.';
      return;
    }

    this.isSubmitting = true;

    this.authService.login(this.loginForm.value).subscribe({
      next: (response: any) => {
        sessionStorage.setItem('token', response.token);
        sessionStorage.setItem('username', response.username);
        this.router.navigate(['/dashboard']);
      },
      error: (error: any) => {
        this.isSubmitting = false;

        if (error?.status === 400) {
          this.errorMessage = 'Invalid username or password.';
        } else if (error?.status === 0) {
          this.errorMessage = 'Unable to connect to the server. Please check your internet connection.';
        } else {
          this.errorMessage = 'An unexpected error occurred. Please try again later.';
        }
        console.error('Login failed:', error);
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
  }

  get usernameControl() {
    return this.loginForm.controls['username'];
  }

  get passwordControl() {
    return this.loginForm.controls['password'];
  }

  /**
   * Determines whether to show validation error for a control.
   * @param controlName Name of the control
   * @returns true if control is invalid and touched or form has been submitted
   */
  shouldShowError(controlName: string): boolean {
    const control = this.loginForm.get(controlName);
    return this.formSubmitted || (control?.invalid && control?.touched) ? true : false;
  }
}
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, CommonModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  errorMessage = '';
  formInvalidMessage = '';
  isSubmitting = false;
  formSubmitted = false;
  registrationSuccess = false;
  
  /**
   * Constructor for injecting services.
   * @param authService Service to handle registration
   * @param router Router for redirection after success 
   */
  constructor(private authService: AuthService, private router: Router) {
    this.signupForm = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.minLength(3)]),
      password: new FormControl('', [
        Validators.required, 
        Validators.minLength(6),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/) // Requires at least one lowercase, one uppercase, and one number
      ]),
    });
  }

  /**
   * Initializes the component.
   * Redirects if token exits in sessionStorage.
   */
  ngOnInit(): void {
    this.errorMessage = '';
    this.formInvalidMessage = '';
    
    if (sessionStorage.getItem('token')) {
      this.router.navigate(['/dashboard']);
    }
  }

  /**
   * Handles signup form submission.
   * Validates and registers a new user via the AuthService. 
   */
  signup() {
    this.formSubmitted = true;
    
    this.errorMessage = '';
    this.formInvalidMessage = '';
    
    Object.values(this.signupForm.controls).forEach(control => {
      control.markAsTouched();
    });
    
    if (this.signupForm.invalid) {
      if (!this.usernameControl?.valid) {
        this.formInvalidMessage = 'Please enter a valid username (minimum 3 characters).';
      } else if (!this.passwordControl?.valid) {
        this.formInvalidMessage = 'Password must be at least 6 characters with at least one uppercase letter, one lowercase letter, and one number.';
      } else {
        this.formInvalidMessage = 'Please fill in all required fields correctly.';
      }
      return;
    }

    this.isSubmitting = true;

    const registrationData = {
      username: this.signupForm.value.username,
      password: this.signupForm.value.password
    };

    this.authService.register(registrationData).subscribe({
      next: (response: any) => {
        this.registrationSuccess = true;
        
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
      },
      error: (error: any) => {
        this.isSubmitting = false;
        
        if (error?.status === 409) {
          this.errorMessage = 'Username already exists. Please choose another.';
        } else if (error?.status === 0) {
          this.errorMessage = 'Unable to connect to the server. Please check your internet connection.';
        } else if (error?.error?.message) {
          this.errorMessage = error.error.message;
        } else if (error?.error) {
          this.errorMessage = typeof error.error === 'string' ? error.error : 'Registration failed. Please try again.';
        } else if (error?.message) {
          this.errorMessage = error.message;
        } else {
          this.errorMessage = 'An unexpected error occurred. Please try again later.';
        }
        console.error('Registration failed:', error);
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
  }

  get usernameControl() {
    return this.signupForm.controls['username'];
  }

  get passwordControl() {
    return this.signupForm.controls['password'];
  }
  
  get termsControl() {
    return this.signupForm.controls['termsAccepted'];
  }
  
  /**
   * 
   * Determines if an error message should be shown for a control.
   * @param controlName Name of the form control
   * @returns true if control is invalid and touched or form has been submitted
   */
  shouldShowError(controlName: string): boolean {
    const control = this.signupForm.get(controlName);
    return this.formSubmitted || (control?.invalid && control?.touched) ? true : false;
  }
}
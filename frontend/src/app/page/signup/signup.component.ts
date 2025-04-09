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

  constructor(private authService: AuthService, private router: Router) {
    this.signupForm = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.minLength(3)]),
      password: new FormControl('', [
        Validators.required, 
        Validators.minLength(6),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/) // Requires at least one lowercase, one uppercase, and one number
      ]),
      termsAccepted: new FormControl(false, [Validators.requiredTrue])
    });
  }

  ngOnInit(): void {
    // Clear any stored error messages on initialization
    this.errorMessage = '';
    this.formInvalidMessage = '';
    
    // Check if already logged in
    if (localStorage.getItem('token')) {
      this.router.navigate(['/dashboard']);
    }
  }

  signup() {
    // Set form as submitted
    this.formSubmitted = true;
    
    // Reset error messages
    this.errorMessage = '';
    this.formInvalidMessage = '';
    
    // Mark all controls as touched to ensure validation messages show
    Object.values(this.signupForm.controls).forEach(control => {
      control.markAsTouched();
    });
    
    // Check if form is valid
    if (this.signupForm.invalid) {
      if (!this.usernameControl?.valid) {
        this.formInvalidMessage = 'Please enter a valid username (minimum 3 characters).';
      } else if (!this.passwordControl?.valid) {
        this.formInvalidMessage = 'Password must be at least 6 characters with at least one uppercase letter, one lowercase letter, and one number.';
      } else if (!this.termsControl?.valid) {
        this.formInvalidMessage = 'You must accept the Terms of Service and Privacy Policy.';
      } else {
        this.formInvalidMessage = 'Please fill in all required fields correctly.';
      }
      return;
    }

    // Set loading state
    this.isSubmitting = true;

    // Extract registration data, omitting the terms acceptance flag
    const registrationData = {
      username: this.signupForm.value.username,
      password: this.signupForm.value.password
    };

    this.authService.register(registrationData).subscribe({
      next: (response: any) => {
        // Show success message and provide login link
        this.registrationSuccess = true;
        
        // Optionally, you could automatically log the user in after successful registration
        // by calling the login method with the same credentials
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000); // Redirect to login after 3 seconds
      },
      error: (error: any) => {
        // Handle different error scenarios
        this.isSubmitting = false;
        
        if (error?.status === 409) {
          this.errorMessage = 'Username already exists. Please choose another.';
        } else if (error?.status === 0) {
          this.errorMessage = 'Unable to connect to the server. Please check your internet connection.';
        } else if (error?.error?.message) {
          this.errorMessage = error.error.message;
        } else if (error?.error) {
          // Handle case where error.error might be a string
          this.errorMessage = typeof error.error === 'string' ? error.error : 'Registration failed. Please try again.';
        } else if (error?.message) {
          this.errorMessage = error.message;
        } else {
          this.errorMessage = 'An unexpected error occurred. Please try again later.';
        }
        console.error('Registration failed:', error);
      },
      complete: () => {
        // Reset loading state
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
  
  // Helper method to check if control should show errors
  shouldShowError(controlName: string): boolean {
    const control = this.signupForm.get(controlName);
    return this.formSubmitted || (control?.invalid && control?.touched) ? true : false;
  }
}
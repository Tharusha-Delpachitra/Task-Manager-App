import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

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

  constructor(private authService: AuthService, private router: Router) {
    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });
  }

  ngOnInit(): void {
    this.errorMessage = '';
    this.formInvalidMessage = '';
    
    if (localStorage.getItem('token')) {
      this.router.navigate(['/dashboard']);
    }
  }

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
        localStorage.setItem('token', response.token);
        localStorage.setItem('username', response.username);
        this.router.navigate(['/dashboard']);
      },
      error: (error: any) => {
        this.isSubmitting = false;
        
        if (error?.status === 401) {
          this.errorMessage = 'Invalid username or password.';
        } else if (error?.status === 0) {
          this.errorMessage = 'Unable to connect. Please try again later.';
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
  
  shouldShowError(controlName: string): boolean {
    const control = this.loginForm.get(controlName);
    return this.formSubmitted || (control?.invalid && control?.touched) ? true : false;
  }
}
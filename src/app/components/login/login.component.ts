import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone:false
})
export class LoginComponent {
  loginForm: FormGroup;
  showPassword = false;
  
  // Background images that will rotate
  backgroundImages = [
    'https://www.everysingleframe.com/images/Interstellar_title.png',
    'https://www.everysingleframe.com/images/everything_title.jpg',
    'https://www.everysingleframe.com/images/Matrix_title.png'
  ];
  
  currentBgIndex = 0;
  currentBg = this.backgroundImages[0];

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router,) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
    
    // Change background image every 5 seconds
    setInterval(() => {
      this.currentBgIndex = (this.currentBgIndex + 1) % this.backgroundImages.length;
      this.currentBg = this.backgroundImages[this.currentBgIndex];
    }, 5000);
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value.email, this.loginForm.value.password).subscribe(
        (token) => {
          console.log('User logged in:', token);
          this.router.navigate(['/']);
        }
      )
      
      console.log('Form submitted:', this.loginForm.value);
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}

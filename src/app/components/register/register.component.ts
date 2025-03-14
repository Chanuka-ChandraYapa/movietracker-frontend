import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone:false
})
export class RegisterComponent {
  registerForm: FormGroup;
  showPassword = false;
  showConfirmPassword = false;
  
  // Movie genres for interests selection
  genres = [
    { id: 'action', name: 'Action' },
    { id: 'adventure', name: 'Adventure' },
    { id: 'comedy', name: 'Comedy' },
    { id: 'drama', name: 'Drama' },
    { id: 'fantasy', name: 'Fantasy' },
    { id: 'horror', name: 'Horror' },
    { id: 'romance', name: 'Romance' },
    { id: 'sci-fi', name: 'Sci-Fi' },
    { id: 'thriller', name: 'Thriller' },
    { id: 'documentary', name: 'Documentary' }
  ];
  
  // Background images
  backgroundImages = [
    'https://www.everysingleframe.com/images/Blade_title.png',
    'https://www.everysingleframe.com/images/amelie_title.jpeg',
    'https://www.everysingleframe.com/images/LaLa_title.png'
  ];
  
  currentBgIndex = 0;
  currentBg = this.backgroundImages[0];

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(4)]],
      displayname: ['', [Validators.required, Validators.minLength(4)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
      interests: [[]],
      termsAgreed: [false, Validators.requiredTrue]
    }, {
      validators: this.passwordMatchValidator
    });
    
    // Change background every 5 seconds
    setInterval(() => {
      this.currentBgIndex = (this.currentBgIndex + 1) % this.backgroundImages.length;
      this.currentBg = this.backgroundImages[this.currentBgIndex];
    }, 5000);
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    return null;
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.authService.register(
        this.registerForm.value.username, this.registerForm.value.displayname,
        this.registerForm.value.email, this.registerForm.value.password
      ).subscribe(
        (user) => {
          console.log('User registered:', user);
          // Redirect to login page
          this.router.navigate(['/login']);
        }
      )
      console.log('Registration form submitted:', this.registerForm.value);
    } else {
      this.registerForm.markAllAsTouched();
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
  
  toggleGenre(genreId: string) {
    const interests = [...this.registerForm.get('interests')?.value || []];
    const index = interests.indexOf(genreId);
    
    if (index > -1) {
      interests.splice(index, 1);
    } else {
      interests.push(genreId);
    }
    
    this.registerForm.get('interests')?.setValue(interests);
  }
  
  isGenreSelected(genreId: string): boolean {
    const interests = this.registerForm.get('interests')?.value || [];
    return interests.includes(genreId);
  }
}
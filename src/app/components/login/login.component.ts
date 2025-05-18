import { Component } from '@angular/core';
import { GeneralService } from '../../services/general.service';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  visible: boolean = true;

  isLoggingIn: boolean = false;

  loginForm: FormGroup;
  constructor(
    private gs: GeneralService,
    private as: AuthService,
    private fb: FormBuilder
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.maxLength(30)]],
      password: ['', [Validators.required, Validators.maxLength(30)]],
    });
  }
  togglePassVisibility() {
    this.visible = !this.visible;
  }

  login() {
    if (this.isLoggingIn) {
      return;
    }

    this.isLoggingIn = true;

    this.as.login(this.loginForm.value).subscribe(
      (response) => {
        this.isLoggingIn = false;
        this.gs.makeToast('Login Successful!', 'success');
      },
      (error) => {
        console.error(error);
        if (error.status === 0) {
          this.gs.makeAlert(
            'Oops!',
            'Something went wrong. Please try again later.',
            'error'
          );
        } else if (error.status === 401) {
          this.gs.makeAlert(error.error.title, error.error.message, 'error');
        } else if (error.status === 403) {
          this.gs.makeAlert(error.error.title, error.error.message, 'error');
        }

        this.isLoggingIn = false;
      }
    );
  }
}

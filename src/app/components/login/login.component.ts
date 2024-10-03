import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  visible: boolean = true;

  isLoggingIn: boolean = false;
  
  // loginForm: FormGroup 
  // constructor(
  //   private gs: GeneralService,
  //   private as: AuthService,
  //   private fb: FormBuilder,
  // ) {
  //   this.loginForm =  this.fb.group({
  //     email: ['', [Validators.required, Validators.maxLength(30)]],
  //     password: ['', [Validators.required, Validators.maxLength(30)]]
  //   })


  // }
  togglePassVisibility() {
    this.visible = !this.visible;
  }

  // login() {
  //   if(this.isLoggingIn) {
  //     return
  //   }

  //   this.isLoggingIn = true

  //   this.as.login(this.loginForm.value).subscribe(
  //     response => {
  //       this.isLoggingIn = false
  //       this.gs.successToastAlert('Login Successful!')
  //     },
  //     error => {
  //       console.error(error)
  //       if(error.status === 0) {
  //         this.gs.errorAlert('Oops!', 'Something went wrong. Please try again later.')
  //       }
  //       else if(error.status === 401) {
  //         this.gs.errorAlert(error.error.title, error.error.message)
  //       }
  //       else if(error.status === 403) {
  //         this.gs.errorAlert(error.error.title, error.error.message)
  //       }

  //       this.isLoggingIn = false
  //     }
  //   )
  // }
}

import { Component } from '@angular/core';
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgIf} from '@angular/common';
import {UserService} from '../../../services/login/user.service';
import {Router, RouterLink} from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
    NgIf,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  form:any;
  formControl:any;
  unauthorized: boolean = false;
  tooMuchRequests: boolean = false;
  constructor(private readonly fb: FormBuilder,
              private readonly userService: UserService,
              protected readonly router: Router) {
    this.form = this.fb.group({
      email:[null,[Validators.email,Validators.required]],
      password:[null,Validators.required]
    })
    this.formControl = this.form.controls;
  }

  onSubmit(){
    if(this.form.invalid){
      this.form.markAllAsTouched();
      return;
    }
    this.loginUser()
    console.log("Login in");
  }

  loginUser(){
    if(this.form.valid){
      let email = this.form.value.email
      let password = this.form.value.password

      this.userService.loginUser(email,password).subscribe({
        next: (response:any) =>{
          this.userService.saveToken(response.encryptedToken)
          console.log('User logged in', response);
        },
        error: (err) => {
          if(err.status === 401){
            this.unauthorized = true;
          }
          if(err.status === 429){
            this.tooMuchRequests = true;
          }
          console.error('Error:', err)
        }
      })
    }
  }
}

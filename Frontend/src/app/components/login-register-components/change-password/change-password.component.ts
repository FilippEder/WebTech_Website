import { Component } from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {UserService} from '../../../services/login/user.service';
import {Router} from '@angular/router';
import {passwordValidator} from '../../../services/validators/password-validator.service';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-change-password',
  imports: [
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent {

  form:any;
  formControl:any;
  incorrectPassword:boolean = false;
  changeSuccessful:boolean = false;

  constructor(private readonly fb: FormBuilder,
              private readonly userService: UserService,
              protected readonly router: Router) {
    this.form = this.fb.group({
      currentPassword:[null,[Validators.required]],
      newPassword:[null,Validators.required, passwordValidator()]
    })
    this.formControl = this.form.controls;
  }

  get passwordField(){
    return this.form.get('newPassword')
  }

  onSubmit(){
    if(this.form.invalid){
      this.form.markAllAsTouched();
      return;
    }
    this.changePassword()
  }

  changePassword(){
    if(this.form.valid){
      let currentPassword = this.form.value.currentPassword
      let newPassword = this.form.value.newPassword

      this.userService.changePassword(newPassword,currentPassword).subscribe({
        next: (response:any) =>{
          this.changeSuccessful = true;
          this.incorrectPassword =false;
          console.log('Password change successful', response);
        },
        error: (err) => {
          if(err.status === 401){
            this.changeSuccessful = false;
            this.incorrectPassword = true;
          }
          console.error('Error:', err)
        }
      })
    }
  }

}

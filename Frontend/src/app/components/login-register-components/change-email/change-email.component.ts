import { Component } from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {UserService} from '../../../services/login/user.service';
import {Router} from '@angular/router';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-change-email',
  imports: [
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './change-email.component.html',
  styleUrl: './change-email.component.css'
})
export class ChangeEmailComponent {


  form:any;
  formControl:any;
  incorrectPassword:boolean = false;
  changeSuccessful:boolean = false;
  usedEmail:boolean = false

  constructor(private readonly fb: FormBuilder,
              private readonly userService: UserService,
              protected readonly router: Router) {
    this.form = this.fb.group({
      password:[null,[Validators.required]],
      email:[null,[Validators.email,Validators.required]]
    })
    this.formControl = this.form.controls;
  }

  onSubmit(){
    if(this.form.invalid){
      this.form.markAllAsTouched();
      return;
    }
    this.changeEmail()
  }

  changeEmail(){
    if(this.form.valid){
      let password = this.form.value.password
      let email = this.form.value.email

      this.userService.changeEmail(password,email).subscribe({
        next: (response:any) =>{
          this.changeSuccessful = true;
          this.incorrectPassword =false;
          this.usedEmail = false;
          console.log('Email change successful', response);
        },
        error: (err) => {
          if(err.status === 401){
            this.changeSuccessful = false;
            this.incorrectPassword = true;
          }
          if(err.status === 400){
            this.usedEmail = true;
            this.changeSuccessful = false;
          }
          console.error('Error:', err)
        }
      })
    }
  }

}

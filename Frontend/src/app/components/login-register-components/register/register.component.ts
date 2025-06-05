import { Component } from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgIf} from '@angular/common';
import {User} from '../../../models/login-models/User';
import {UserService} from '../../../services/login/user.service';
import {Router, RouterLink} from '@angular/router';
import {passwordValidator} from '../../../services/validators/password-validator.service';

@Component({
  selector: 'app-register',
  imports: [
    ReactiveFormsModule,
    NgIf,
    RouterLink
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  form:any;
  formControl:any;
  usedEmail:boolean = false;
  constructor(private readonly fb: FormBuilder,
              private readonly userService: UserService,
              protected readonly router: Router){
    this.form = this.fb.group({
      email:[null,[Validators.email,Validators.required]],
      password:[null,Validators.required, passwordValidator()],
      region:[null,Validators.required],
      city:[null,Validators.required],
      street:[null,Validators.required],
      postcode:[null,Validators.required]
    })
    this.formControl = this.form.controls;
  }

  get passwordField(){
    return this.form.get('password')
  }
  onSubmit(){
    if(this.form.invalid){
      this.form.markAllAsTouched();
      return;
    }
    console.log("submitting")
    this.registerUser()
  }

  registerUser(){
    if(this.form.valid){
      let values = this.form.value
      let address = this.addressToString();
      let newUser = new User(values.email,values.password,address)

      this.userService.registerUser(newUser).subscribe({
        next: (response) =>{
          this.usedEmail = false;
          if(this.userService.isAuthenticated()){
            this.userService.logoutUser()
          }
          this.router.navigate(['/login'])
          console.log('User registered', response);
        },
        error: (err) => {
          if(err.status === 400){
            this.usedEmail = true;
          }
          console.error('Error:', err)
        }
      })
    }
  }

  addressToString():string{
    let values = this.form.value
    let address:string;
    address = `${values.region}, ${values.city}, ${values.street}, ${values.postcode}`
    return address;
  }

}

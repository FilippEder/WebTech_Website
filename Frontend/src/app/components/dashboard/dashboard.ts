import { Component } from '@angular/core';
import {Router, RouterLink, RouterOutlet} from "@angular/router";
import {UserService} from '../../services/login/user.service';

@Component({
  selector: 'app-dashboard',
    imports: [
        RouterLink,
        RouterOutlet
    ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {

  constructor(private readonly router: Router,
              protected readonly authService: UserService) {
  }

  isloggedIn(){
    return this.authService.isAuthenticated()
  }

    logout(){
    this.authService.logoutUser();
    this.router.navigate(['/login'])
  }

}

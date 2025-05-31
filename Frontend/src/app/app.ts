import { Component } from '@angular/core';
import {Router, RouterLink, RouterOutlet} from '@angular/router';
import {UserService} from './services/login/user.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  title = 'FrontendFilipp';

  constructor(private readonly router: Router,
              protected readonly authService: UserService) {
  }

  logout(){
    this.authService.logoutUser();
    this.router.navigate(['/login'])
  }

}

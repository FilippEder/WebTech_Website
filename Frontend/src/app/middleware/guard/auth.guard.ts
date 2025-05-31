import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {UserService} from '../../services/login/user.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(UserService)
  const router = inject(Router)

  if(authService.isAuthenticated()){
    return true;
  } else {
    router.navigate(['/login'])
    return false
  }
};

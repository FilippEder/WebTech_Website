import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {UserService} from '../../services/login/user.service';

export const loginGuard: CanActivateFn = (route, state) => {
  const authService = inject(UserService)
  const router = inject(Router)

  if(authService.isAuthenticated()){
    router.navigate(['/vehicle-seller'])
    return false;
  } else {
    return true;
  }
};

import {HttpErrorResponse, HttpInterceptorFn} from '@angular/common/http';
import {inject} from '@angular/core';
import {UserService} from '../../services/login/user.service';
import {tap} from 'rxjs';

export const authenticationInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(UserService)

  const token = authService.getToken();

  if(token){
    const cloned = req.clone({
      setHeaders:{
        authorization: token
      }
    })
    return next(cloned).pipe(
      tap({
        error:(error: HttpErrorResponse) =>{
          if(error.status === 401 || error.status === 403){
            authService.logoutUser();
          }
        }
      })
    )
  }

  return next(req);
};

import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { UserService } from './user.service';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const loggedUser = inject(UserService).currentUser();
  if (loggedUser) {
    const clone = req.clone({
      setHeaders: {
        Authorization: `Bearer ${loggedUser.token}`
      }
    });

    return next(clone);
  }
  return next(req);
};

import { Injectable, Injector } from '@angular/core';
import { HttpRequest, HttpHandler, HttpInterceptor } from '@angular/common/http';
import { Observable, Subject, throwError  } from 'rxjs';
import { catchError } from "rxjs/operators";
import { Router } from '@angular/router';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  refreshTokenInProgress = false;

  tokenRefreshedSource = new Subject();
  tokenRefreshed$ = this.tokenRefreshedSource.asObservable();

  constructor(private injector: Injector, private router: Router) {

  }

  addAuthHeader(request:any) {

    if (!request.url.includes("token/refresh")) {
      // if(this.cache.user?.token){
  	  //   request = request.clone({
  	  //     setHeaders: {
      //       Authorization: 'Bearer '+`${this.cache.user.token}`
  	  //     }
  	  //   });
      // }
    }
    return request;
}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
    // this.userService = this.injector.get(UserService);
    // this.cache = this.injector.get(Cache);
    // Handle request
    console.log('intercept');

    request = this.addAuthHeader(request);

    return next.handle(request).pipe(
      catchError( error => {

        if (error.status === 401) {

          if (request.url.includes("token/refresh")) {
              this.refreshTokenInProgress = false;
              // this.userService.logout();
              return throwError(error);
          }

          // return this.refreshToken().pipe(
          //   mergeMap(() => {
          //       request = this.addAuthHeader(request);
          //       return next.handle(request);
          //   }),
          //   catchError( error => {
          //     return throwError(error);
          //   })
          // );
        } else if (error.status === 501 || error.status === 502 || error.status === 503) {
          // this.userService.logout();
          // if(this.userService.journey === 'sales'){
          //   this.router.navigate(['/onboard']);
          // } else {
          //   this.router.navigate(['/login']);
          // }
        }
        return throwError(error);
      })
    );
  }
  // refreshToken() {
  //   console.log('refreshToken..');
  //   if (this.refreshTokenInProgress) {
  //       return new Observable(observer => {
  //           this.tokenRefreshed$.subscribe(() => {
  //               observer.next();
  //               observer.complete();
  //           });
  //       });
  //   } else {
  //     this.refreshTokenInProgress = true;
  //     return from(this.userService.refreshToken())
  //     .pipe(
  //       switchMap(() => {
  //           this.refreshTokenInProgress = false;
  //           this.tokenRefreshedSource.next(null);
  //           return new Observable(observer => {
  //                 observer.next();
  //                 observer.complete();
  //             });
  //         }),
  //         catchError( error => {
  //           return throwError(error);
  //         })
  //     );
  //   }
  // }
}

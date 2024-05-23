import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
    constructor(private dataService: DataService,
        private router: Router) {
    }
    canActivate(): boolean {
      if (!this.dataService.isAuthenticated()) {
          this.router.navigateByUrl('/');
          return false;
      }
      return true;
    }
}

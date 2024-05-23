import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LandingComponent } from './landing/landing.component';
import { AuthGuardService } from '../services/auth-guard-service';
import { NgModule } from '@angular/core';
import { ChatComponent } from './chat/chat.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'landing', component: LandingComponent, canActivate: [AuthGuardService]},
  { path: 'chats', component: ChatComponent, canActivate: [AuthGuardService] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: false, scrollOffset: [0, 0], scrollPositionRestoration: 'top' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

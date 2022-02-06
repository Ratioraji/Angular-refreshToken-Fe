import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthComponent } from './pages/auth/auth.component';
import { MainComponent } from './pages/main/main.component';
import {AuthGuard} from '../app/core/Auth/Guard/auth.guard';
import { Erorr404Component } from '../app/pages/auth/erorr404/erorr404.component';
import { SharedModule } from './shared/shared.module';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    component: AuthComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('src/app/pages/auth/auth.module').then(m => m.AuthModule)
      }
    ]
  },
  {
    path: '',
    component: MainComponent,
    children: [{
        path: 'dashboard',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('src/app/pages/main/dashboard/dashboard.module').then(
            m => m.DashboardModule
          )
      }
    ]
  },
  {
    path: '**',
    component: AuthComponent,
    children: [
      {
        path: '',
        component: Erorr404Component,
        data: { title: 'Not Found' }
      }
    ]
  }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forRoot(routes, {
      useHash: false,
    })
  ],
  // providers: [AppPreloader],
  declarations: [MainComponent],
  exports: [RouterModule]
})
export class AppRoutingModule {}

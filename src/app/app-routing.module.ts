import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthHelper } from './_helpers/auth.helper';

const accountModule = () => import('./account/account.module').then(x => x.AccountModule);
const usersModule = () => import('./users/users.module').then(x => x.UsersModule);
const workspacesModule = () => import('./workspaces/workspaces.module').then(x => x.WorkspacesModule);
const aboutModule = () => import('./about/about.module').then(x => x.AboutModule);

const routes: Routes = [
  {
    path: '',
    redirectTo: 'workspaces',
    pathMatch: 'full',
    canActivate: [AuthHelper]
  },
  {
    path: 'account',
    loadChildren: accountModule
  },
  {
    path: 'users',
    loadChildren: usersModule,
    canActivate: [AuthHelper]
  },
  {
    path: 'workspaces',
    loadChildren: workspacesModule,
    canActivate: [AuthHelper]
  },
  {
    path: 'about',
    loadChildren: aboutModule
  },
  {
    path: '**',
    redirectTo: 'workspaces'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
  // Nothing to see here...
}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LayoutComponent } from './layout.component';
import { SigninComponent } from '../signin/signin.component';
import { SignupComponent } from '../signup/signup.component';
import { ResetPasswordComponent } from '../resetpassword/resetpassword.component';
import { EnterTokenComponent } from '../entertoken/entertoken.component';

const routes: Routes = [
    {
        path: '', component: LayoutComponent,
        children: [
            { path: 'signin', component: SigninComponent },
            { path: 'signup', component: SignupComponent },
            { path: 'resetpassword', component: ResetPasswordComponent },
            { path: 'entertoken', component: EnterTokenComponent }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AccountRoutingModule {
    // Nothing to see here...
}

import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AccountRoutingModule } from './account-routing.module';
import { LayoutComponent } from './layout.component';
import { SigninComponent } from '../signin/signin.component';
import { SignupComponent } from '../signup/signup.component';
import { ResetPasswordComponent } from '../resetpassword/resetpassword.component';
import { EnterTokenComponent } from '../entertoken/entertoken.component';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        AccountRoutingModule
    ],
    declarations: [
        LayoutComponent,
        SigninComponent,
        SignupComponent,
        ResetPasswordComponent,
        EnterTokenComponent
    ]
})
export class AccountModule {
    // Nothing to see here...
}

import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ApplicationPipesModule } from '../_pipes/app-pipes.module';

import { DueTodosRoutingModule } from './duetodos-routing.module';
import { LayoutComponent } from './layout.component';
import { ListComponent } from './list.component';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        DueTodosRoutingModule,
        NgbModule,
        FontAwesomeModule,
        ApplicationPipesModule
    ],
    declarations: [
        LayoutComponent,
        ListComponent
    ]
})
export class DueTodosModule {
    // Nothing to see here...
}

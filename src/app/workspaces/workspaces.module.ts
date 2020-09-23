import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ApplicationPipesModule } from '../_pipes/app-pipes.module';

import { WorkspaceRoutingModule } from './workspaces-routing.module';
import { LayoutComponent } from './layout.component';
import { ListComponent } from './list.component';
import { AddEditComponent } from './add-edit.component';
import { DetailsComponent } from './details.component';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        WorkspaceRoutingModule,
        NgbModule,
        FontAwesomeModule,
        ApplicationPipesModule
    ],
    declarations: [
        LayoutComponent,
        ListComponent,
        AddEditComponent,
        DetailsComponent
    ]
})
export class WorkspacesModule {
    // Nothing to see here...
}

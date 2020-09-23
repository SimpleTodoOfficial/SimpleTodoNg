import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { ApplicationPipesModule } from '../_pipes/app-pipes.module';
import { TodoRoutingModule } from './todos-routing.module';
import { LayoutComponent } from './layout.component';
import { ListComponent } from './list.component';
import { AddEditComponent } from './add-edit.component';
import { DetailsComponent } from './details.component';

@NgModule({
    imports: [
        CommonModule,
        DragDropModule,
        ReactiveFormsModule,
        TodoRoutingModule,
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
export class TodosModule {
    // Nothing to see here...
}

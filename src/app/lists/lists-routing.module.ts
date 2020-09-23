import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LayoutComponent } from './layout.component';
import { ListComponent } from './list.component';
import { AddEditComponent } from './add-edit.component';
import { DetailsComponent } from './details.component';

const todosModule = () => import('../todos/todos.module').then(x => x.TodosModule);

const routes: Routes = [
    {
        path: '', component: LayoutComponent,
        children: [
            {
                path: '', component: ListComponent
            },
            {
                path: 'add', component: AddEditComponent
            },
            {
                path: ':id/edit', component: AddEditComponent
            },
            {
                path: ':id', component: DetailsComponent
            },
            {
                path: ':id/todos',
                loadChildren: todosModule
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ListRoutingModule {
    // Nothing to see here...
}

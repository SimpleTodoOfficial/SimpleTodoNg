import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LayoutComponent } from './layout.component';
import { ListComponent } from './list.component';
import { AddEditComponent } from './add-edit.component';
import { DetailsComponent } from './details.component';

const listsModule = () => import('../lists/lists.module').then(x => x.ListsModule);

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
                path: ':id/lists',
                loadChildren: listsModule
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class WorkspaceRoutingModule {
    // Nothing to see here...
}

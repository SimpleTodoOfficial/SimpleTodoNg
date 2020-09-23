import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { AboutRoutingModule } from './about-routing.module';
import { LayoutComponent } from './layout.component';
import { DetailsComponent } from './details.component';

@NgModule({
    imports: [
        CommonModule,
        AboutRoutingModule,
        NgbModule,
        FontAwesomeModule
    ],
    declarations: [
        LayoutComponent,
        DetailsComponent
    ]
})
export class AboutModule {
    // Nothing to see here...
}

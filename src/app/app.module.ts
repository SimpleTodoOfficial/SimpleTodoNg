import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { AppComponent } from './app.component';
import { AlertComponent } from './alert';
import { AppRoutingModule } from './app-routing.module';
import { TokenInterceptor, ErrorInterceptor } from './_interceptors';
import { ModalConfirm } from './_modals/confirmation.modal';
import { ModalMoveList } from './_modals/move-list.modal';
import { ModalMoveTodo } from './_modals/move-todo.modal';

@NgModule({
  declarations: [
    AppComponent,
    AlertComponent,
    ModalConfirm,
    ModalMoveList,
    ModalMoveTodo
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    ReactiveFormsModule,
    NgbModule,
    FontAwesomeModule,
    AppRoutingModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    },
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {
  // Nothing to see here...
}

import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {ServiceWorkerModule} from '@angular/service-worker';
import {environment} from '../environments/environment';
import {HttpClientModule} from '@angular/common/http';
import {DeviceDetectorModule} from 'ngx-device-detector';
import {BaseComponent} from './base/base.component';
import {LoadingSpinnerModule} from './loading-spinner/loading-spinner.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule} from '@angular/forms';
import {ModalModule} from 'ngx-bootstrap';
import {NgbToastModule} from '@ng-bootstrap/ng-bootstrap';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {NoContentComponent} from './no-content/no-content.component';

@NgModule({
    declarations: [
        AppComponent,
        NoContentComponent,
        BaseComponent
    ],
    imports: [
        BrowserAnimationsModule,
        AppRoutingModule,
        FormsModule,
        HttpClientModule,
        FontAwesomeModule,
        LoadingSpinnerModule,
        ModalModule.forRoot(),
        DeviceDetectorModule.forRoot(),
        NgbToastModule,
        ServiceWorkerModule.register('ngsw-worker.js', {enabled: environment.production})
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}

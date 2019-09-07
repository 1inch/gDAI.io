import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GDaiRoutingModule} from './g-dai-routing.module';
import {GDaiComponent} from './g-dai.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {LoadingSpinnerModule} from '../loading-spinner/loading-spinner.module';
import {NgbAlertModule} from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    declarations: [GDaiComponent],
    imports: [
        CommonModule,
        FormsModule,
        FontAwesomeModule,
        GDaiRoutingModule,
        LoadingSpinnerModule,
        ReactiveFormsModule,
        NgbAlertModule
    ]
})
export class GDaiModule {
}

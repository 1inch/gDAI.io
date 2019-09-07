import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {GDaiComponent} from './g-dai.component';

const routes: Routes = [
    {
        path: '',
        component: GDaiComponent
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class GDaiRoutingModule {
}

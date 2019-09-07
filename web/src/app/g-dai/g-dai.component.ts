import {Component, OnInit} from '@angular/core';
import {GDAIService} from './g-dai.service';
import {TokenService} from '../token.service';

@Component({
    selector: 'app-g-dai',
    templateUrl: './g-dai.component.html',
    styleUrls: ['./g-dai.component.scss']
})
export class GDaiComponent implements OnInit {

    loading = true;
    walletBalance;

    constructor(
        protected gDaiService: GDAIService,
        protected tokenService: TokenService
    ) {
    }

    ngOnInit() {

        
    }

    async setWalletBalance() {

        this.walletBalance = this.tokenService.formatAsset('DAI', await this.gDaiService.getWalletBalance());
    }
}

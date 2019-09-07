import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {GDAIService} from './g-dai.service';
import {TokenService} from '../token.service';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {FormControl} from '@angular/forms';
import {ethers} from 'ethers';
import {debounceTime, distinctUntilChanged, filter} from 'rxjs/operators';
import {Web3Service} from '../web3.service';

@Component({
    selector: 'app-g-dai',
    templateUrl: './g-dai.component.html',
    styleUrls: ['./g-dai.component.scss']
})
export class GDaiComponent implements OnInit {

    loading = true;
    modalLoading = false;

    walletBalance = '0';
    earnedInterest = '0';

    depositTemplateModalRef: BsModalRef;

    fromTokenAmountControl = new FormControl('');
    fromTokenAmount;
    fromTokenBalance = '0';
    fromTokenBalanceBN = ethers.utils.bigNumberify(0);
    fromToken = 'DAI';

    @ViewChild('depositTemplate', {static: false})
    depositTemplate: TemplateRef<any>;

    constructor(
        protected gDaiService: GDAIService,
        protected tokenService: TokenService,
        protected web3Service: Web3Service,
        protected modalService: BsModalService
    ) {
    }

    async refreshInfos() {

        this.setWalletBalance();
        this.setEarnedInterest();
        this.loadTokenBalance();
    }

    ngOnInit() {

        this.refreshInfos();
        setInterval(
            () => {
                this.refreshInfos();
            },
            12000
        );

        this.initFromTokenAmount();
    }

    async setWalletBalance() {

        this.walletBalance = this.tokenService.formatAsset(
            this.fromToken,
            await this.gDaiService.getWalletBalance()
        );
    }

    async setEarnedInterest() {

        this.earnedInterest = this.tokenService.formatAsset(
            this.fromToken,
            await this.gDaiService.getEarnedInterest()
        );
    }

    isNumeric(str) {
        return /^\d*\.{0,1}\d*$/.test(str);
    }

    async initFromTokenAmount() {

        this.fromTokenAmountControl.valueChanges.pipe(
            debounceTime(200),
            filter((value, index) => this.isNumeric(value) && value !== 0 && !value.match(/^([0\.]+)$/)),
            distinctUntilChanged(),
        )
            .subscribe((value) => {

                this.fromTokenAmount = value;
                localStorage.setItem('fromTokenAmount', this.fromTokenAmount);
            });

        if (localStorage.getItem('fromTokenAmount')) {

            this.fromTokenAmountControl.setValue(localStorage.getItem('fromTokenAmount'));
        } else {

            this.fromTokenAmountControl.setValue('1.0');
        }
    }

    async openDepositModal() {

        this.loadTokenBalance();
        this.depositTemplateModalRef = this.modalService.show(this.depositTemplate);
    }

    async deposit() {

        this.modalLoading = true;

        try {

            await this.gDaiService.deposit(
                this.tokenService.parseAsset(this.fromToken, this.fromTokenAmount)
            );
        } catch (e) {

            alert(e);
            console.error(e);
        }

        this.modalLoading = false;
    }

    async setFromTokenAmount() {

        this.fromTokenAmountControl.setValue(this.fromTokenBalance);
    }

    async loadTokenBalance() {

        try {

            this.fromTokenBalanceBN = await this.tokenService.getTokenBalance(
                this.fromToken,
                this.web3Service.walletAddress
            );

            this.fromTokenBalance = this.tokenService.formatAsset(
                this.fromToken,
                // @ts-ignore
                this.fromTokenBalanceBN
            );

            this.fromTokenBalance = this.tokenService.toFixed(this.fromTokenBalance, 18);

            if (this.fromTokenBalance === '0') {

                this.fromTokenBalance = '0.0';
                this.fromTokenBalanceBN = ethers.utils.bigNumberify(0);
            }
        } catch (e) {

        }
    }
}

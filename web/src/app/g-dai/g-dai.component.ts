import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {GDAIService} from './g-dai.service';
import {TokenService} from '../token.service';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {FormControl} from '@angular/forms';
import {ethers} from 'ethers';
import {debounceTime, distinctUntilChanged, filter} from 'rxjs/operators';
import {Web3Service} from '../web3.service';
import {ConnectService} from '../connect.service';
import QrScanner from 'qr-scanner';

const QRCode = require('easyqrcodejs');

@Component({
    selector: 'app-g-dai',
    templateUrl: './g-dai.component.html',
    styleUrls: ['./g-dai.component.scss']
})
export class GDaiComponent implements OnInit {

    loading = true;
    modalLoading = false;

    modalTxHash = null;

    walletBalance = '0';
    earnedInterest = '0';
    mobileEarnedInterest = '0';

    receiver = '';

    depositTemplateModalRef: BsModalRef;
    withdrawTemplateModalRef: BsModalRef;
    receiveTemplateModalRef: BsModalRef;
    scanTemplateModalRef: BsModalRef;

    fromTokenAmountControl = new FormControl('');
    withdrawAmountControl = new FormControl('');
    sendAmountControl = new FormControl('');
    fromTokenAmount;
    withdrawAmount;
    sendAmount;
    fromTokenBalance = '0';
    fromTokenBalanceBN = ethers.utils.bigNumberify(0);
    fromToken = 'DAI';

    @ViewChild('depositTemplate', {static: false})
    depositTemplate: TemplateRef<any>;

    @ViewChild('withdrawTemplate', {static: false})
    withdrawTemplate: TemplateRef<any>;

    @ViewChild('receiveTemplate', {static: false})
    receiveTemplate: TemplateRef<any>;

    @ViewChild('scanTemplate', {static: false})
    scanTemplate: TemplateRef<any>;

    constructor(
        public gDaiService: GDAIService,
        public tokenService: TokenService,
        public web3Service: Web3Service,
        public modalService: BsModalService,
        public connectService: ConnectService
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
            4000
        );

        this.initFromTokenAmount();
        this.initWithdrawAmount();
        this.initSendAmount();

        this.loading = false;

        this.web3Service.connectEvent.subscribe(() => {

            this.refreshInfos();
        });

        this.web3Service.disconnectEvent.subscribe(() => {

            this.walletBalance = '0';
            this.earnedInterest = '0';
            this.mobileEarnedInterest = '0';
        });
    }

    async setWalletBalance() {

        this.walletBalance = this.tokenService.toFixed(
            this.tokenService.formatAsset(
                this.fromToken,
                await this.gDaiService.getWalletBalance()
            ),
            8
        );
    }

    async setEarnedInterest() {

        this.earnedInterest = this.tokenService.toFixed(
            this.tokenService.formatAsset(
                this.fromToken,
                await this.gDaiService.getEarnedInterest()
            ),
            14
        );

        this.mobileEarnedInterest = this.tokenService.toFixed(
            this.tokenService.formatAsset(
                this.fromToken,
                await this.gDaiService.getEarnedInterest()
            ),
            8
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

    async initWithdrawAmount() {

        this.withdrawAmountControl.valueChanges.pipe(
            debounceTime(200),
            filter((value, index) => this.isNumeric(value) && value !== 0 && !value.match(/^([0\.]+)$/)),
            distinctUntilChanged(),
        )
            .subscribe((value) => {

                this.withdrawAmount = value;
                localStorage.setItem('withdrawAmount', this.withdrawAmount);
            });

        if (localStorage.getItem('withdrawAmount')) {

            this.withdrawAmountControl.setValue(localStorage.getItem('withdrawAmount'));
        } else {

            this.withdrawAmountControl.setValue('1.0');
        }
    }

    async initSendAmount() {

        this.sendAmountControl.valueChanges.pipe(
            debounceTime(200),
            filter((value, index) => this.isNumeric(value) && value !== 0 && !value.match(/^([0\.]+)$/)),
            distinctUntilChanged(),
        )
            .subscribe((value) => {

                this.sendAmount = value;
                localStorage.setItem('sendAmount', this.sendAmount);
            });

        if (localStorage.getItem('sendAmount')) {

            this.sendAmountControl.setValue(localStorage.getItem('sendAmount'));
        } else {

            this.sendAmountControl.setValue('1.0');
        }
    }

    async connect() {

        this.connectService.startConnectEvent.next();
    }

    async openWithdrawModal() {

        this.loadTokenBalance();
        this.withdrawTemplateModalRef = this.modalService.show(this.withdrawTemplate);
    }

    async openScanModal() {

        this.scanTemplateModalRef = this.modalService.show(this.scanTemplate);

        let scanPreview;

        await new Promise((resolve, reject) => {

            const checkForElement = () => {

                scanPreview = document.getElementById('scanPreview');

                if (scanPreview) {

                    return resolve();
                }

                setTimeout(() => {
                    checkForElement();
                }, 100);
            };

            checkForElement();
        });

        QrScanner.WORKER_PATH = 'assets/qr-scanner-worker.min.js';

        QrScanner.hasCamera().then(hasCamera => scanPreview.textContent = hasCamera);

        // @ts-ignore
        const qrScanner = new QrScanner(document.getElementById('scanPreview'),
            result => {
                alert(result);
                console.log('decoded qr code:', result);
            }
        );

        qrScanner.start();

        console.log('qrScanner', qrScanner);
    }

    async openDepositModal() {

        this.loadTokenBalance();
        this.depositTemplateModalRef = this.modalService.show(this.depositTemplate);
    }

    async openReceiveModal() {

        this.receiveTemplateModalRef = this.modalService.show(this.receiveTemplate);

        await new Promise((resolve, reject) => {

            const checkForElement = () => {

                if (document.getElementById('receiveQRCode')) {

                    return resolve();
                }

                setTimeout(() => {
                    checkForElement();
                }, 100);
            };

            checkForElement();
        });

        new QRCode(
            document.getElementById('receiveQRCode'), {
                text: this.web3Service.walletAddress,
                logo: 'assets/logo@2x.png',
                width: 356,
                height: 356,
                logoWidth: 128,
                logoHeight: 128,
                colorDark: '#000000',
                colorLight: '#ffffff',
                logoBackgroundTransparent: false

            });
    }

    async deposit() {

        this.modalLoading = true;

        try {

            const hash = await this.gDaiService.deposit(
                this.fromToken,
                this.tokenService.parseAsset(this.fromToken, this.fromTokenAmount)
            );

            this.modalTxHash = hash;

            setTimeout(() => {
                this.modalTxHash = null;
            }, 10000);
        } catch (e) {

            alert(e);
            console.error(e);
        }

        this.modalLoading = false;
    }

    async withdraw() {

        this.modalLoading = true;

        try {

            const hash = await this.gDaiService.withdraw(
                this.fromToken,
                this.tokenService.parseAsset(this.fromToken, this.withdrawAmount)
            );

            this.modalTxHash = hash;

            setTimeout(() => {
                this.modalTxHash = null;
            }, 10000);
        } catch (e) {

            alert(e);
            console.error(e);
        }

        this.modalLoading = false;
    }

    async send() {

        this.loading = true;

        try {

            const hash = await this.gDaiService.send(
                this.receiver,
                this.tokenService.parseAsset(this.fromToken, this.sendAmount)
            );

            this.modalTxHash = hash;

            setTimeout(() => {
                this.modalTxHash = null;
            }, 10000);
        } catch (e) {

            alert(e);
            console.error(e);
        }

        this.loading = false;
    }

    async setFromTokenAmount() {

        this.fromTokenAmountControl.setValue(this.fromTokenBalance);
    }

    async setWithdrawAmount() {

        this.withdrawAmountControl.setValue(this.walletBalance);
    }

    async setSendAmount() {

        this.sendAmountControl.setValue(this.walletBalance);
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

import {Component, ElementRef, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NavigationService} from './navigation.service';
import {Location} from '@angular/common';
import {faArrowLeft, faCopy, faVideo} from '@fortawesome/free-solid-svg-icons';
import {Web3Service} from '../web3.service';
import {ConfigurationService} from '../configuration.service';
import {ThemeService} from '../theme.service';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {ConnectService} from '../connect.service';

declare let ethereum: any;
declare let web3: any;

@Component({
    selector: 'app-base',
    templateUrl: './base.component.html',
    styleUrls: ['./base.component.scss']
})
export class BaseComponent implements OnInit {

    backIcon = faArrowLeft;
    publishIcon = faVideo;
    loading = true;
    ensDomain;
    contractAddress;
    copyIcon = faCopy;
    isMetaMask = false;
    isTrustWallet = false;

    @ViewChild('walletIconEl', {static: false})
    walletIconEl: ElementRef;

    @ViewChild('walletIconEl2', {static: false})
    walletIconEl2: ElementRef;

    @ViewChild('connectTemplate', {static: false})
    connectTemplate: TemplateRef<any>;

    connectInProgress = false;

    modalRef: BsModalRef;

    constructor(
        private location: Location,
        public navigationService: NavigationService,
        private route: ActivatedRoute,
        private router: Router,
        private configurationService: ConfigurationService,
        public themeService: ThemeService,
        public web3Service: Web3Service,
        private modalService: BsModalService,
        protected connectService: ConnectService
    ) {
    }

    async ngOnInit() {

        try {

            this.loading = false;
            this.ensDomain = this.configurationService.AGGREGATED_TOKEN_SWAP_ENS;
            this.contractAddress = this.configurationService.CONTRACT_ADDRESS;

        } catch (e) {

            console.error(e);
        }

        this.web3Service.connectEvent.subscribe(() => {

            this.setWalletIcon();
        });

        this.connectService.startConnectEvent.subscribe(() => {

            this.openConnectModal();
        });

        if (typeof ethereum !== 'undefined') {

            this.isMetaMask = ethereum.isMetaMask;
        }

        if (
            typeof web3 !== 'undefined' &&
            typeof web3.currentProvider !== 'undefined' &&
            typeof web3.currentProvider.isTrust !== 'undefined'
        ) {

            this.isTrustWallet = web3.currentProvider.isTrust;
        }

        this.setWalletIcon();
    }

    async awaitForWalletIconEl() {

        return new Promise((resolve, reject) => {

            const check = () => {

                if (typeof this.walletIconEl !== 'undefined') {

                    resolve();
                } else {

                    setTimeout(check, 100);
                }
            };

            check();
        });
    }

    async setWalletIcon() {

        if (
            this.web3Service.walletIcon
        ) {

            await this.awaitForWalletIconEl();

            if (this.walletIconEl.nativeElement.hasChildNodes()) {

                for (let i = 0; i < this.walletIconEl.nativeElement.childNodes.length; i++) {

                    this.walletIconEl.nativeElement.removeChild(
                        this.walletIconEl.nativeElement.childNodes[i]
                    );
                }

                for (let i = 0; i < this.walletIconEl2.nativeElement.childNodes.length; i++) {

                    this.walletIconEl2.nativeElement.removeChild(
                        this.walletIconEl2.nativeElement.childNodes[i]
                    );
                }
            }

            this.walletIconEl.nativeElement.appendChild(this.web3Service.walletIconSmall);
            this.walletIconEl2.nativeElement.appendChild(this.web3Service.walletIcon);
        }
    }

    goBack() {
        this.navigationService.showBackButton = false;
        this.router.navigate(['../']);
    }

    copyToClipboard(value) {

        document.addEventListener('copy', (e: ClipboardEvent) => {
            e.clipboardData.setData('text/plain', value);
            e.preventDefault();
            document.removeEventListener('copy', null);
        });

        document.execCommand('copy');

        alert('Copied!');
    }

    openConnectModal() {

        this.modalRef = this.modalService.show(this.connectTemplate);
    }

    async connect(wallet) {

        this.connectInProgress = true;

        try {

            await this.web3Service.connect(wallet);

            this.modalRef.hide();
        } catch (e) {

            alert('An error has occured! Please try again.');
            console.error(e);
        }

        this.connectInProgress = false;
        this.setWalletIcon();
    }

    async disconnect() {

        this.web3Service.disconnect();
    }
}

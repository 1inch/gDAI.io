import {ConfigurationService} from './configuration.service';

import {Injectable} from '@angular/core';
import Squarelink from 'squarelink';
import Fortmatic from 'fortmatic';
import Portis from '@portis/web3';
import Jazzicon from 'jazzicon';
import WalletConnectProvider from '@walletconnect/web3-provider';
import ProviderEngine from 'web3-provider-engine';
import FetchSubprovider from 'web3-provider-engine/subproviders/fetch';
import TransportU2F from '@ledgerhq/hw-transport-u2f';
import createLedgerSubprovider from '@ledgerhq/web3-subprovider';
import Web3 from 'web3';
import {Subject} from 'rxjs';
import {Bitski} from 'bitski';
import {ethers} from 'ethers';

const {GSNProvider} = require('@openzeppelin/gsn-provider');

declare let require: any;
declare let web3: any;
declare let ethereum: any;
declare let window: any;

@Injectable({
    providedIn: 'root'
})
export class Web3Service {

    public rpcUrl = 'https://parity.1inch.exchange/rpc';

    public provider;
    public ethersProvider;
    public gsnProvider;

    public txProvider = null;
    public txProviderName;

    public thirdPartyProvider = null;

    public walletAddress = '';
    public walletEns = '';
    public walletIcon = null;
    public walletIconSmall = null;

    connectEvent = new Subject<any>();
    disconnectEvent = new Subject<void>();

    constructor(
        private configurationService: ConfigurationService
    ) {

        this.txProviderName = localStorage.getItem('txProviderName');
        this.initWeb3();
    }

    async initWeb3() {

        const oneInch = new ethers.providers.JsonRpcProvider(this.rpcUrl);
        const infura = new ethers.providers.InfuraProvider('homestead', this.configurationService.INFURA_KEY);

        this.ethersProvider = new ethers.providers.FallbackProvider([
            oneInch,
            infura,
        ]);

        const webSocketProvider = new Web3.providers.WebsocketProvider(
            'wss://ws.parity.1inch.exchange'
        );

        webSocketProvider.on('error', () => {

            this.provider = new Web3(
                new Web3.providers.WebsocketProvider(
                    'wss://mainnet.infura.io/ws/v3/' + this.configurationService.INFURA_KEY
                )
            );
        });

        this.provider = new Web3(
            webSocketProvider
        );

        if (this.txProviderName) {

            try {

                await this.connect(this.txProviderName);
            } catch (e) {
                console.error(e);
            }
        }
    }

    async disconnect() {

        if (this.thirdPartyProvider) {

            switch (this.txProviderName) {
                case 'portis':

                    break;
                case 'fortmatic':
                    this.thirdPartyProvider.user.logout();
                    break;
                case 'ledger':
                    this.thirdPartyProvider.stop();
                    break;
                case 'squarelink':

                    break;
                case 'torus':
                    window.location.reload();
                    break;
                case 'wallet-connect':
                    try {

                        const walletConnector = await this.thirdPartyProvider.getWalletConnector();
                        await walletConnector.killSession();
                        await this.thirdPartyProvider.stop();
                    } catch (e) {
                    }
                    break;
                case 'metamask':
                default:

                    break;
            }
        }

        this.txProvider = null;
        this.txProviderName = '';
        this.walletAddress = '';
        this.walletIcon = null;
        this.walletEns = '';

        localStorage.setItem('txProviderName', '');

        this.disconnectEvent.next();
    }

    async connect(wallet) {

        await this.disconnect();

        switch (wallet) {
            case 'portis':
                await this.enablePortisTxProvider();
                break;
            case 'fortmatic':
                await this.enableFortmaticTxProvider();
                break;
            case 'squarelink':
                await this.enableSquarelinkTxProvider();
                break;
            case 'wallet-connect':
                await this.enableWalletConnectTxProvider();
                break;
            case 'torus':
                await this.enableTorusTxProvider();
                break;
            case 'bitski':
                await this.enableBitskiTxProvider();
                break;
            case 'ledger':
                await this.enableLedgerTxProvider();
                break;
            case 'metamask':
            default:
                await this.enableWeb3TxProvider();
                break;
        }

        localStorage.setItem('txProviderName', wallet);

        this.walletAddress = (await this.txProvider.eth.getAccounts())[0];
        this.walletIconSmall = Jazzicon(16, parseInt(this.walletAddress.slice(2, 10), 16));
        this.walletIcon = Jazzicon(32, parseInt(this.walletAddress.slice(2, 10), 32));

        this.setWalletEns();

        const gsnProvider = new GSNProvider(this.txProvider.currentProvider, {
            verbose: true
        });
        this.gsnProvider = new Web3(gsnProvider);

        this.connectEvent.next({
            walletAddress: this.walletAddress,
            walletIcon: this.walletIcon
        });
    }

    async setWalletEns() {

        try {

            await this.waitForWalletAddress();

            if (this.txProviderName === 'torus') {

                console.log('userinfo', (await this.thirdPartyProvider.getUserInfo()));
                this.walletEns = (await this.thirdPartyProvider.getUserInfo()).email;
            } else {

                this.walletEns = await this.ethersProvider.lookupAddress(this.walletAddress);
            }
        } catch (e) {

            console.error(e);
        }
    }

    async enableWeb3TxProvider() {

        try {

            if (typeof ethereum !== 'undefined') {

                this.txProvider = new Web3(ethereum);

                try {

                    // Request account access if needed
                    await ethereum.enable();
                } catch (error) {

                    // User denied account access...
                    // alert('Please connect your Web3 Wallet to the dApp!');
                    throw new Error('No web3 provider!');
                }

                if (typeof ethereum.on !== 'undefined') {

                    ethereum.on('accountsChanged', (accounts) => {

                        window.location.reload();
                    });

                    ethereum.on('networkChanged', (netId) => {

                        window.location.reload();
                    });
                }

            } else if (typeof window.web3 !== 'undefined') {

                this.txProvider = new Web3(window.web3.currentProvider);

            } else if (typeof web3 !== 'undefined') {

                this.txProvider = new Web3(web3.currentProvider);
            } else {

                // alert('No Web3 provider found! Please install Metamask or use TrustWallet on mobile device.');
                throw new Error('No web3 provider!');
            }

            this.txProviderName = 'metamask';
        } catch (e) {

            alert(e);
            console.error(e);
            throw new Error(e);
        }
    }

    async enableSquarelinkTxProvider() {

        try {

            const sqlk = new Squarelink('70afd2513e1cf55d3435');

            this.txProvider = new Web3(
                await sqlk.getProvider()
            );

            await this.txProvider.eth.getAccounts();

            this.txProviderName = 'squarelink';
            this.thirdPartyProvider = sqlk;
        } catch (e) {

            console.error(e);
            throw new Error(e);
        }
    }

    async enableFortmaticTxProvider() {

        try {
            const fm = new Fortmatic('pk_live_7BCE996AE3CFEEC5');

            this.txProvider = new Web3(
                fm.getProvider()
            );

            await fm.user.login();

            this.txProviderName = 'fortmatic';
            this.thirdPartyProvider = fm;
        } catch (e) {

            console.error(e);
            throw new Error(e);
        }
    }

    async enablePortisTxProvider() {

        try {

            const portis = new Portis('89075d3e-a065-4752-ba0f-1e3e839efebf', 'mainnet');

            this.txProvider = new Web3(
                portis.provider
            );

            this.txProviderName = 'portis';
            this.thirdPartyProvider = portis;
        } catch (e) {

            console.error(e);
            throw new Error(e);
        }
    }

    async enableWalletConnectTxProvider() {

        try {

            const walletConnectProvider = new WalletConnectProvider({
                bridge: 'https://bridge.walletconnect.org',
                infuraId: this.configurationService.INFURA_KEY
            });

            this.txProvider = new Web3(
                walletConnectProvider
            );

            await walletConnectProvider.enable();

            this.txProviderName = 'wallet-connect';
            this.thirdPartyProvider = walletConnectProvider;
        } catch (e) {

            console.error(e);
            throw new Error(e);
        }
    }

    async enableTorusTxProvider() {

        try {

            const defaultTorus = require('@toruslabs/torus-embed');
            const Torus = defaultTorus.default;
            const torus = new Torus();
            await torus.init();

            // @ts-ignore
            await torus.ethereum.enable();

            this.txProvider = new Web3(
                torus.ethereum
            );

            this.txProviderName = 'torus';
            this.thirdPartyProvider = torus;
        } catch (e) {

            console.error(e);
            throw new Error(e);
        }
    }

    async enableBitskiTxProvider() {

        try {

            const bitski = new Bitski('95c821ef-1f25-45e2-9435-64c8e6e5a2b6', 'https://gdai.io/bitski-callback.html');
            const provider = bitski.getProvider();

            // @ts-ignore
            this.txProvider = new Web3(provider);

            await bitski.signIn();
            await this.txProvider.eth.getAccounts();

            this.txProviderName = 'bitski';
            this.thirdPartyProvider = provider;
        } catch (e) {

            console.error(e);
            throw new Error(e);
        }
    }

    async enableLedgerTxProvider() {

        try {

            const networkId = 1;
            const engine = new ProviderEngine();
            const getTransport = () => TransportU2F.create();
            const ledger = createLedgerSubprovider(getTransport, {
                networkId,
                accountsLength: 5
            });

            const rpcUrl = this.rpcUrl;

            engine.addProvider(ledger);
            engine.addProvider(new FetchSubprovider({rpcUrl}));
            engine.start();

            // @ts-ignore
            this.txProvider = new Web3(engine);

            await this.txProvider.eth.getAccounts();

            this.txProviderName = 'ledger';
            this.thirdPartyProvider = engine;
        } catch (e) {

            console.error(e);
            throw new Error(e);
        }
    }

    async waitForWalletAddress() {

        return new Promise((resolve, reject) => {

            const checkForWalletAddress = () => {

                if (this.walletAddress) {

                    resolve();
                } else {

                    setTimeout(checkForWalletAddress, 100);
                }
            };

            checkForWalletAddress();
            setTimeout(reject, 12000);
        });
    }
}

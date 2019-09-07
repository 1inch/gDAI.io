import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ethers} from 'ethers';

@Injectable({
    providedIn: 'root'
})
export class ConfigurationService {

    public AGGREGATED_TOKEN_SWAP_ENS = 'gaslessdai.eth';
    public INFURA_KEY = 'f01cd0a0e5ee443fae2bfec831c2e1ce';

    public GAS_PRICE_URL = 'https://gasprice.poa.network';
    public CONTRACT_ADDRESS = '0xdfdd3FE533D73259E7771F4793AbEe976b8f03aA';

    public fastGasPrice;
    public standardGasPrice;
    public instantGasPrice;

    constructor(
        private http: HttpClient
    ) {

        this.getGasPrices();
    }

    async getGasPrices() {

        const result = await this.http.get(this.GAS_PRICE_URL).toPromise();

        this.fastGasPrice = ethers.utils.bigNumberify(Math.trunc(result['fast'] * 100)).mul(1e7);
        this.standardGasPrice = ethers.utils.bigNumberify(Math.trunc(result['standard'] * 100)).mul(1e7);
        this.instantGasPrice = ethers.utils.bigNumberify(Math.trunc(result['instant'] * 100)).mul(1e7);
    }
}

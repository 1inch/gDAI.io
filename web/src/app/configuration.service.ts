import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ethers} from 'ethers';

@Injectable({
    providedIn: 'root'
})
export class ConfigurationService {

    public AGGREGATED_TOKEN_SWAP_ENS = 'gaslessdai.eth';
    public INFURA_KEY = '1318f78fade443ecb3054ccc301c5d7c';

    public GAS_PRICE_URL = 'https://gasprice.poa.network';
    public CONTRACT_ADDRESS = '0x70be979bf4193faf77eaada12cbb068ff0479a5a';
    public FULCRUM_IDAI_ADDRESS = '0x14094949152EDDBFcd073717200DA82fEd8dC960';

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

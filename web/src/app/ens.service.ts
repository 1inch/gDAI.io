import {Injectable} from '@angular/core';
import {ConfigurationService} from './configuration.service';
import {Web3Service} from './web3.service';

@Injectable({
    providedIn: 'root'
})
export class EnsService {

    constructor(
        private configurationService: ConfigurationService,
        private web3Service: Web3Service
    ) {

    }

    lookupAddress(address: string) {

        return this.web3Service.ethersProvider.lookupAddress(address);
    }

    resolveName(name: string) {

        return this.web3Service.ethersProvider.resolveName(name);
    }
}

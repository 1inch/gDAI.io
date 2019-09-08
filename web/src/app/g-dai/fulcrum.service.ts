import {Injectable} from '@angular/core';
import {Web3Service} from '../web3.service';
import {ConfigurationService} from '../configuration.service';
import {ethers} from 'ethers';

declare let require: any;
const ITOKEN_ABI = require('../abi/iToken.json');

@Injectable({
    providedIn: 'root'
})
export class FulcrumService {

    contract;

    constructor(
        protected web3Service: Web3Service,
        protected configurationService: ConfigurationService
    ) {

        this.contract = new this.web3Service.provider.eth.Contract(
            ITOKEN_ABI,
            this.configurationService.FULCRUM_IDAI_ADDRESS
        );
    }

    async supplyInterestRate() {

        return ethers.utils.bigNumberify(
            await this.contract.methods.supplyInterestRate().call()
        );
    }
}

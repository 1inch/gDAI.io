import {Injectable} from '@angular/core';
import {ConfigurationService} from '../configuration.service';
import {Web3Service} from '../web3.service';
import {ethers} from 'ethers';
import {BigNumber} from 'ethers/utils';
import {TokenService} from '../token.service';

const GDAI_ABI = [
    {
        'constant': true,
        'inputs': [],
        'name': 'name',
        'outputs': [
            {
                'internalType': 'string',
                'name': '',
                'type': 'string'
            }
        ],
        'payable': false,
        'stateMutability': 'view',
        'type': 'function'
    },
    {
        'constant': true,
        'inputs': [],
        'name': 'totalSupply',
        'outputs': [
            {
                'internalType': 'uint256',
                'name': '',
                'type': 'uint256'
            }
        ],
        'payable': false,
        'stateMutability': 'view',
        'type': 'function'
    },
    {
        'constant': true,
        'inputs': [],
        'name': 'decimals',
        'outputs': [
            {
                'internalType': 'uint8',
                'name': '',
                'type': 'uint8'
            }
        ],
        'payable': false,
        'stateMutability': 'view',
        'type': 'function'
    },
    {
        'constant': false,
        'inputs': [
            {
                'internalType': 'address',
                'name': 'spender',
                'type': 'address'
            },
            {
                'internalType': 'uint256',
                'name': 'addedValue',
                'type': 'uint256'
            }
        ],
        'name': 'increaseAllowance',
        'outputs': [
            {
                'internalType': 'bool',
                'name': '',
                'type': 'bool'
            }
        ],
        'payable': false,
        'stateMutability': 'nonpayable',
        'type': 'function'
    },
    {
        'constant': true,
        'inputs': [],
        'name': 'fulcrum',
        'outputs': [
            {
                'internalType': 'contract IFulcrum',
                'name': '',
                'type': 'address'
            }
        ],
        'payable': false,
        'stateMutability': 'view',
        'type': 'function'
    },
    {
        'constant': true,
        'inputs': [
            {
                'internalType': 'address',
                'name': 'user',
                'type': 'address'
            }
        ],
        'name': 'earnedInterest',
        'outputs': [
            {
                'internalType': 'uint256',
                'name': '',
                'type': 'uint256'
            }
        ],
        'payable': false,
        'stateMutability': 'view',
        'type': 'function'
    },
    {
        'constant': true,
        'inputs': [
            {
                'internalType': 'address',
                'name': 'account',
                'type': 'address'
            }
        ],
        'name': 'balanceOf',
        'outputs': [
            {
                'internalType': 'uint256',
                'name': '',
                'type': 'uint256'
            }
        ],
        'payable': false,
        'stateMutability': 'view',
        'type': 'function'
    },
    {
        'constant': false,
        'inputs': [],
        'name': 'renounceOwnership',
        'outputs': [],
        'payable': false,
        'stateMutability': 'nonpayable',
        'type': 'function'
    },
    {
        'constant': true,
        'inputs': [],
        'name': 'getHubAddr',
        'outputs': [
            {
                'internalType': 'address',
                'name': '',
                'type': 'address'
            }
        ],
        'payable': false,
        'stateMutability': 'view',
        'type': 'function'
    },
    {
        'constant': true,
        'inputs': [],
        'name': 'eth',
        'outputs': [
            {
                'internalType': 'contract IERC20',
                'name': '',
                'type': 'address'
            }
        ],
        'payable': false,
        'stateMutability': 'view',
        'type': 'function'
    },
    {
        'constant': true,
        'inputs': [],
        'name': 'owner',
        'outputs': [
            {
                'internalType': 'address',
                'name': '',
                'type': 'address'
            }
        ],
        'payable': false,
        'stateMutability': 'view',
        'type': 'function'
    },
    {
        'constant': true,
        'inputs': [],
        'name': 'isOwner',
        'outputs': [
            {
                'internalType': 'bool',
                'name': '',
                'type': 'bool'
            }
        ],
        'payable': false,
        'stateMutability': 'view',
        'type': 'function'
    },
    {
        'constant': true,
        'inputs': [],
        'name': 'symbol',
        'outputs': [
            {
                'internalType': 'string',
                'name': '',
                'type': 'string'
            }
        ],
        'payable': false,
        'stateMutability': 'view',
        'type': 'function'
    },
    {
        'constant': true,
        'inputs': [],
        'name': 'kyber',
        'outputs': [
            {
                'internalType': 'contract IKyber',
                'name': '',
                'type': 'address'
            }
        ],
        'payable': false,
        'stateMutability': 'view',
        'type': 'function'
    },
    {
        'constant': false,
        'inputs': [
            {
                'internalType': 'address',
                'name': 'spender',
                'type': 'address'
            },
            {
                'internalType': 'uint256',
                'name': 'subtractedValue',
                'type': 'uint256'
            }
        ],
        'name': 'decreaseAllowance',
        'outputs': [
            {
                'internalType': 'bool',
                'name': '',
                'type': 'bool'
            }
        ],
        'payable': false,
        'stateMutability': 'nonpayable',
        'type': 'function'
    },
    {
        'constant': true,
        'inputs': [],
        'name': 'relayHubVersion',
        'outputs': [
            {
                'internalType': 'string',
                'name': '',
                'type': 'string'
            }
        ],
        'payable': false,
        'stateMutability': 'view',
        'type': 'function'
    },
    {
        'constant': true,
        'inputs': [],
        'name': 'gasToken',
        'outputs': [
            {
                'internalType': 'contract IGasToken',
                'name': '',
                'type': 'address'
            }
        ],
        'payable': false,
        'stateMutability': 'view',
        'type': 'function'
    },
    {
        'constant': true,
        'inputs': [
            {
                'internalType': 'address',
                'name': 'owner',
                'type': 'address'
            },
            {
                'internalType': 'address',
                'name': 'spender',
                'type': 'address'
            }
        ],
        'name': 'allowance',
        'outputs': [
            {
                'internalType': 'uint256',
                'name': '',
                'type': 'uint256'
            }
        ],
        'payable': false,
        'stateMutability': 'view',
        'type': 'function'
    },
    {
        'constant': false,
        'inputs': [
            {
                'internalType': 'address',
                'name': 'newOwner',
                'type': 'address'
            }
        ],
        'name': 'transferOwnership',
        'outputs': [],
        'payable': false,
        'stateMutability': 'nonpayable',
        'type': 'function'
    },
    {
        'constant': true,
        'inputs': [],
        'name': 'dai',
        'outputs': [
            {
                'internalType': 'contract IERC20',
                'name': '',
                'type': 'address'
            }
        ],
        'payable': false,
        'stateMutability': 'view',
        'type': 'function'
    },
    {
        'inputs': [
            {
                'internalType': 'address',
                'name': '_feeReceiver',
                'type': 'address'
            }
        ],
        'payable': false,
        'stateMutability': 'nonpayable',
        'type': 'constructor'
    },
    {
        'payable': true,
        'stateMutability': 'payable',
        'type': 'fallback'
    },
    {
        'anonymous': false,
        'inputs': [
            {
                'indexed': true,
                'internalType': 'address',
                'name': 'oldRelayHub',
                'type': 'address'
            },
            {
                'indexed': true,
                'internalType': 'address',
                'name': 'newRelayHub',
                'type': 'address'
            }
        ],
        'name': 'RelayHubChanged',
        'type': 'event'
    },
    {
        'anonymous': false,
        'inputs': [
            {
                'indexed': true,
                'internalType': 'address',
                'name': 'from',
                'type': 'address'
            },
            {
                'indexed': true,
                'internalType': 'address',
                'name': 'to',
                'type': 'address'
            },
            {
                'indexed': false,
                'internalType': 'uint256',
                'name': 'value',
                'type': 'uint256'
            }
        ],
        'name': 'Transfer',
        'type': 'event'
    },
    {
        'anonymous': false,
        'inputs': [
            {
                'indexed': true,
                'internalType': 'address',
                'name': 'owner',
                'type': 'address'
            },
            {
                'indexed': true,
                'internalType': 'address',
                'name': 'spender',
                'type': 'address'
            },
            {
                'indexed': false,
                'internalType': 'uint256',
                'name': 'value',
                'type': 'uint256'
            }
        ],
        'name': 'Approval',
        'type': 'event'
    },
    {
        'anonymous': false,
        'inputs': [
            {
                'indexed': true,
                'internalType': 'address',
                'name': 'previousOwner',
                'type': 'address'
            },
            {
                'indexed': true,
                'internalType': 'address',
                'name': 'newOwner',
                'type': 'address'
            }
        ],
        'name': 'OwnershipTransferred',
        'type': 'event'
    },
    {
        'constant': false,
        'inputs': [
            {
                'internalType': 'address',
                'name': '_feeReceiver',
                'type': 'address'
            }
        ],
        'name': 'setFeeReceiver',
        'outputs': [],
        'payable': false,
        'stateMutability': 'nonpayable',
        'type': 'function'
    },
    {
        'constant': false,
        'inputs': [
            {
                'internalType': 'bytes',
                'name': '',
                'type': 'bytes'
            }
        ],
        'name': 'preRelayedCall',
        'outputs': [
            {
                'internalType': 'bytes32',
                'name': '',
                'type': 'bytes32'
            }
        ],
        'payable': false,
        'stateMutability': 'nonpayable',
        'type': 'function'
    },
    {
        'constant': false,
        'inputs': [
            {
                'internalType': 'bytes',
                'name': '',
                'type': 'bytes'
            },
            {
                'internalType': 'bool',
                'name': '',
                'type': 'bool'
            },
            {
                'internalType': 'uint256',
                'name': 'actualCharge',
                'type': 'uint256'
            },
            {
                'internalType': 'bytes32',
                'name': '',
                'type': 'bytes32'
            }
        ],
        'name': 'postRelayedCall',
        'outputs': [],
        'payable': false,
        'stateMutability': 'nonpayable',
        'type': 'function'
    },
    {
        'constant': false,
        'inputs': [
            {
                'internalType': 'uint256',
                'name': 'amount',
                'type': 'uint256'
            }
        ],
        'name': 'deposit',
        'outputs': [],
        'payable': false,
        'stateMutability': 'nonpayable',
        'type': 'function'
    },
    {
        'constant': false,
        'inputs': [
            {
                'internalType': 'uint256',
                'name': 'amount',
                'type': 'uint256'
            }
        ],
        'name': 'withdraw',
        'outputs': [],
        'payable': false,
        'stateMutability': 'nonpayable',
        'type': 'function'
    },
    {
        'constant': false,
        'inputs': [
            {
                'internalType': 'address',
                'name': 'to',
                'type': 'address'
            },
            {
                'internalType': 'uint256',
                'name': 'amount',
                'type': 'uint256'
            }
        ],
        'name': 'transfer',
        'outputs': [
            {
                'internalType': 'bool',
                'name': '',
                'type': 'bool'
            }
        ],
        'payable': false,
        'stateMutability': 'nonpayable',
        'type': 'function'
    },
    {
        'constant': false,
        'inputs': [
            {
                'internalType': 'address',
                'name': 'from',
                'type': 'address'
            },
            {
                'internalType': 'address',
                'name': 'to',
                'type': 'address'
            },
            {
                'internalType': 'uint256',
                'name': 'amount',
                'type': 'uint256'
            }
        ],
        'name': 'transferFrom',
        'outputs': [
            {
                'internalType': 'bool',
                'name': '',
                'type': 'bool'
            }
        ],
        'payable': false,
        'stateMutability': 'nonpayable',
        'type': 'function'
    },
    {
        'constant': false,
        'inputs': [
            {
                'internalType': 'address',
                'name': 'to',
                'type': 'address'
            },
            {
                'internalType': 'uint256',
                'name': 'amount',
                'type': 'uint256'
            }
        ],
        'name': 'approve',
        'outputs': [
            {
                'internalType': 'bool',
                'name': '',
                'type': 'bool'
            }
        ],
        'payable': false,
        'stateMutability': 'nonpayable',
        'type': 'function'
    },
    {
        'constant': true,
        'inputs': [
            {
                'internalType': 'address',
                'name': '',
                'type': 'address'
            },
            {
                'internalType': 'address',
                'name': 'from',
                'type': 'address'
            },
            {
                'internalType': 'bytes',
                'name': 'encodedFunction',
                'type': 'bytes'
            },
            {
                'internalType': 'uint256',
                'name': '',
                'type': 'uint256'
            },
            {
                'internalType': 'uint256',
                'name': '',
                'type': 'uint256'
            },
            {
                'internalType': 'uint256',
                'name': '',
                'type': 'uint256'
            },
            {
                'internalType': 'uint256',
                'name': '',
                'type': 'uint256'
            },
            {
                'internalType': 'bytes',
                'name': '',
                'type': 'bytes'
            },
            {
                'internalType': 'uint256',
                'name': 'maxPossibleCharge',
                'type': 'uint256'
            }
        ],
        'name': 'acceptRelayedCall',
        'outputs': [
            {
                'internalType': 'uint256',
                'name': '',
                'type': 'uint256'
            },
            {
                'internalType': 'bytes',
                'name': '',
                'type': 'bytes'
            }
        ],
        'payable': false,
        'stateMutability': 'view',
        'type': 'function'
    },
    {
        'constant': false,
        'inputs': [
            {
                'internalType': 'uint256',
                'name': 'amount',
                'type': 'uint256'
            }
        ],
        'name': 'withdrawFromRelayHub',
        'outputs': [],
        'payable': false,
        'stateMutability': 'nonpayable',
        'type': 'function'
    },
    {
        'constant': false,
        'inputs': [
            {
                'internalType': 'uint256',
                'name': 'amount',
                'type': 'uint256'
            }
        ],
        'name': 'withdrawGasToken',
        'outputs': [],
        'payable': false,
        'stateMutability': 'nonpayable',
        'type': 'function'
    }
];

@Injectable({
    providedIn: 'root'
})
export class GDAIService {

    contract;

    constructor(
        protected configurationService: ConfigurationService,
        protected web3Service: Web3Service,
        protected tokenService: TokenService
    ) {

        this.contract = new this.web3Service.provider.eth.Contract(
            GDAI_ABI,
            this.configurationService.CONTRACT_ADDRESS
        );
    }

    async getWalletBalance() {

        try {

            await this.web3Service.waitForWalletAddress();

            return ethers.utils.bigNumberify(await this.contract.methods.balanceOf(
                this.web3Service.walletAddress
            ).call());
        } catch (e) {

            // console.error(e);
        }

        return ethers.utils.bigNumberify(0);
    }

    async getEarnedInterest() {

        try {

            await this.web3Service.waitForWalletAddress();

            return ethers.utils.bigNumberify(await this.contract.methods.earnedInterest(
                this.web3Service.walletAddress
            ).call());
        } catch (e) {

            // console.error(e);
        }

        return ethers.utils.bigNumberify(0);
    }

    async deposit(tokenSymbol: string, amount: BigNumber) {

        await this.web3Service.waitForWalletAddress();

        let gasLimit = 0;

        if (!(await this.tokenService.isApproved(
            tokenSymbol,
            this.configurationService.CONTRACT_ADDRESS
        ))) {

            await this.tokenService.approve(tokenSymbol);
            gasLimit = 400000;
        }

        const callData = this.web3Service.txProvider.eth.abi.encodeFunctionCall({
                'inputs': [
                    {
                        'internalType': 'uint256',
                        'name': 'amount',
                        'type': 'uint256'
                    }
                ],
                'name': 'deposit',
                'type': 'function'
            },
            [
                amount
            ]
        );

        const tx = this.web3Service.txProvider.eth.sendTransaction({
            from: this.web3Service.walletAddress,
            to: this.configurationService.CONTRACT_ADDRESS,
            gasPrice: this.configurationService.fastGasPrice,
            gas: gasLimit ? gasLimit : null,
            data: callData
        });

        return new Promise((resolve, reject) => {

            tx
                .on('transactionHash', async (hash) => {

                    resolve(hash);
                })
                .on('error', (err) => {

                    reject(err);
                });
        });
    }

    async withdraw(tokenSymbol: string, amount: BigNumber) {

        await this.web3Service.waitForWalletAddress();

        const callData = this.web3Service.txProvider.eth.abi.encodeFunctionCall({
                'inputs': [
                    {
                        'internalType': 'uint256',
                        'name': 'amount',
                        'type': 'uint256'
                    }
                ],
                'name': 'withdraw',
                'type': 'function'
            },
            [
                amount
            ]
        );

        const tx = this.web3Service.txProvider.eth.sendTransaction({
            from: this.web3Service.walletAddress,
            to: this.configurationService.CONTRACT_ADDRESS,
            gasPrice: this.configurationService.fastGasPrice,
            data: callData
        });

        return new Promise((resolve, reject) => {

            tx
                .on('transactionHash', async (hash) => {

                    resolve(hash);
                })
                .on('error', (err) => {

                    reject(err);
                });
        });
    }

    async send(receiver: string, amount: BigNumber) {

        await this.web3Service.waitForWalletAddress();

        const callData = this.web3Service.txProvider.eth.abi.encodeFunctionCall({
                'inputs': [
                    {
                        'internalType': 'address',
                        'name': 'to',
                        'type': 'address'
                    },
                    {
                        'internalType': 'uint256',
                        'name': 'amount',
                        'type': 'uint256'
                    }
                ],
                'name': 'transfer',
                'type': 'function'
            },
            [
                receiver,
                amount
            ]
        );

        const tx = this.web3Service.gsnProvider.eth.sendTransaction({
            from: this.web3Service.walletAddress,
            to: this.configurationService.CONTRACT_ADDRESS,
            gasPrice: this.configurationService.fastGasPrice,
            gas: 250000,
            data: callData
        });

        return new Promise((resolve, reject) => {

            tx
                .on('transactionHash', async (hash) => {

                    resolve(hash);
                })
                .on('error', (err) => {

                    reject(err);
                });
        });
    }
}

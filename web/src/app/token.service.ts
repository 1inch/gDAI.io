import {Injectable} from '@angular/core';
import {Web3Service} from './web3.service';
import {ethers} from 'ethers';
import {BigNumber} from 'ethers/utils';

declare let require: any;
const ERC20ABI = require('./abi/ERC20.json');

@Injectable({
    providedIn: 'root'
})
export class TokenService {

    public tokens = {
        ABX: {
            symbol: 'ABX',
            name: 'Arbidex',
            icon: '0da858b0-21f9-11e8-baf6-5fcc218084fc.png',
            decimals: 18,
            address: '0x9a794dc1939f1d78fa48613b89b8f9d0a20da00e'
        },
        AGRI: {
            symbol: 'AGRI',
            name: 'AgriChain',
            icon: '9c77fd00-c16f-11e8-9e96-092a24f940bf.jpeg',
            decimals: 18,
            address: '0xa704fce7b309ec09df16e2f5ab8caf6fe8a4baa9'
        },
        AID: {
            symbol: 'AID',
            name: 'AidCoin',
            icon: 'f8485690-0cbe-11e8-9d6e-fb9202c9fa3b.png',
            decimals: 18,
            address: '0x37e8789bb9996cac9156cd5f5fd32599e6b91289'
        },
        AIX: {
            symbol: 'AIX',
            name: 'Aigang',
            icon: '3e7e7220-e35c-11e7-91c4-63061ece2a28.png',
            decimals: 18,
            address: '0x1063ce524265d5a3a624f4914acd573dd89ce988'
        },
        AMN: {
            symbol: 'AMN',
            name: 'Amon',
            icon: '0d917fd0-38b7-11e8-8208-adb8418cbb95.png',
            decimals: 18,
            address: '0x737F98AC8cA59f2C68aD658E3C3d8C8963E40a4c'
        },
        ANT: {
            symbol: 'ANT',
            name: 'Aragon',
            icon: 'Aragon.png',
            decimals: 18,
            address: '0x960b236a07cf122663c4303350609a66a7b288c0'
        },
        ATS: {
            symbol: 'ATS',
            name: 'Authorship',
            icon: '1162d3c0-1634-11e8-bf39-bd2b2e4b10cf.png',
            decimals: 4,
            address: '0x2daee1aa61d60a252dc80564499a69802853583a'
        },
        AUC: {
            symbol: 'AUC',
            name: 'Auctus',
            icon: 'ff0d5f00-4604-11e8-963a-05fa26187558.png',
            decimals: 18,
            address: '0xc12d099be31567add4e4e4d0d45691c3f58f5663'
        },
        BAT: {
            symbol: 'BAT',
            name: 'Basic Attention Token',
            icon: '47424c50-1495-11e8-a36b-c1b17c6baaea.png',
            decimals: 18,
            address: '0x0d8775f648430679a709e98d2b0cb6250d2887ef'
        },
        BAX: {
            symbol: 'BAX',
            name: 'BABB',
            icon: '03112a30-21f9-11e8-baf6-5fcc218084fc.png',
            decimals: 18,
            address: '0x9a0242b7a33dacbe40edb927834f96eb39f8fbcb'
        },
        BCS: {
            symbol: 'BCS',
            name: 'BC Shop',
            icon: '4d4f62b0-c7d1-11e7-a7f0-3f204353e561.png',
            decimals: 18,
            address: '0x98bde3a768401260e7025faf9947ef1b81295519'
        },
        BETR: {
            symbol: 'BETR',
            name: 'BetterBetting',
            icon: '34a456d0-6eed-11e8-9b33-47ec6716605d.png',
            decimals: 18,
            address: '0x763186eb8d4856d536ed4478302971214febc6a9'
        },
        BMC: {
            symbol: 'BMC',
            name: 'Blackmoon',
            icon: '55067260-d83d-11e7-91c4-63061ece2a28.png',
            decimals: 8,
            address: '0xdf6ef343350780bf8c3410bf062e0c015b1dd671'
        },
        BNT: {
            symbol: 'BNT',
            name: 'Bancor',
            icon: 'f80f2a40-eaf5-11e7-9b5e-179c6e04aa7c.png',
            decimals: 18,
            address: '0x1f573d6fb3f13d689ff844b4ce37794d79a7ff1c'
        },
        BOXX: {
            symbol: 'BOXX',
            name: 'Blockparty',
            icon: '42e8d320-64ab-11e8-b0ae-6d2fb3484860.png',
            decimals: 15,
            address: '0x780116d91e5592e58a3b3c76a351571b39abcec6'
        },
        CAN: {
            symbol: 'CAN',
            name: 'CanYa',
            icon: 'c2e649f0-051e-11e8-9454-0922d1574472.png',
            decimals: 6,
            address: '0x1d462414fe14cf489c7a21cac78509f4bf8cd7c0'
        },
        CAT: {
            symbol: 'CAT',
            name: 'BitClave',
            icon: 'a9b9b770-f46e-11e7-aabd-a344aed92db1.png',
            decimals: 18,
            address: '0x1234567461d3f8db7496581774bd869c83d51c93'
        },
        CEEK: {
            symbol: 'CEEK',
            name: 'CEEK VR',
            icon: '63736710-64d1-11e8-b0ae-6d2fb3484860.png',
            decimals: 18,
            address: '0xb056c38f6b7dc4064367403e26424cd2c60655e1'
        },
        CHX: {
            symbol: 'CHX',
            name: 'Chainium',
            icon: '0ab7d240-4605-11e8-963a-05fa26187558.png',
            decimals: 18,
            address: '0x1460a58096d80a50a2f1f956dda497611fa4f165'
        },
        CLN: {
            symbol: 'CLN',
            name: 'Colu Local Network',
            icon: '07600730-68a0-11e8-8840-c7b05733591e.png',
            decimals: 18,
            address: '0x4162178b78d6985480a308b2190ee5517460406d'
        },
        CMCT: {
            symbol: 'CMCT',
            name: 'Crowd Machine',
            icon: '5deccf10-6d97-11e8-b276-f32edc99ad99.png',
            decimals: 8,
            address: '0x47bc01597798dcd7506dcca36ac4302fc93a8cfb'
        },
        CONST: {
            symbol: 'CONST',
            name: 'Constant',
            icon: 'f66be500-5c61-11e9-b1ba-17256a19b712.jpeg',
            decimals: 2,
            address: '0x4983f767b1bc44328e434729ddabea0a064ca1ac'
        },
        COT: {
            symbol: 'COT',
            name: 'CoTrader',
            icon: 'fd8df540-4bdf-11e9-ad0a-c759377f1f63.jpeg',
            decimals: 18,
            address: '0x5c872500c00565505f3624ab435c222e558e9ff8'
        },
        DAI: {
            symbol: 'DAI',
            name: 'Dai',
            icon: 'd4938e40-fc51-11e7-90ab-6d53c6790097.png',
            decimals: 18,
            address: '0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359'
        },
        DAN: {
            symbol: 'DAN',
            name: 'Daneel',
            icon: '9586f930-576e-11e8-b48c-35d88ea2b959.png',
            decimals: 10,
            address: '0x9b70740e708a083c6ff38df52297020f5dfaa5ee'
        },
        DATA: {
            symbol: 'DATA',
            name: 'Streamr',
            icon: '36493a40-52bf-11e8-a473-e17b8e82a26f.png',
            decimals: 18,
            address: '0x0cf0ee63788a0849fe5297f3407f701e122cc023'
        },
        DGD: {
            symbol: 'DGD',
            name: 'DigixDAO',
            icon: 'DigixDAO.png',
            decimals: 9,
            address: '0xe0b7927c4af23765cb51314a0e0521a9645f0e2a'
        },
        DRGN: {
            symbol: 'DRGN',
            name: 'Dragonchain',
            icon: '5663e3a0-f3d5-11e7-9454-0922d1574472.png',
            decimals: 18,
            address: '0x419c4db4b9e25d6db2ad9691ccb832c8d9fda05e'
        },
        DRT: {
            symbol: 'DRT',
            name: 'DomRaider',
            icon: '627afd80-0830-11e8-b83b-855c569b045b.jpeg',
            decimals: 8,
            address: '0x9af4f26941677c706cfecf6d3379ff01bb85d5ab'
        },
        DTRC: {
            symbol: 'DTRC',
            name: 'Datarius Credit',
            icon: '719a99a0-e4aa-11e7-93e8-03f720d5bc8c.png',
            decimals: 18,
            address: '0xc20464e0c373486d2b3335576e83a218b1618a5e'
        },
        EDG: {
            symbol: 'EDG',
            name: 'Edgeless',
            icon: 'd580e490-f537-11e7-bc6b-87a36d827eff.png',
            decimals: 0,
            address: '0x08711d3b02c8758f2fb3ab4e80228418a7f8e39c'
        },
        EFOOD: {
            symbol: 'EFOOD',
            name: 'Eurasia Food coin',
            icon: '9f4446c0-6c31-11e9-9f0e-7591708e99af.jpeg',
            decimals: 18,
            address: '0x47ec6af8e27c98e41d1df7fb8219408541463022'
        },
        ELF: {
            symbol: 'ELF',
            name: 'aelf',
            icon: '6f4bfaa0-0718-11e8-8744-97748b632eaf.jpeg',
            decimals: 18,
            address: '0xbf2179859fc6d5bee9bf9158632dc51678a4100e'
        },
        ELI: {
            symbol: 'ELI',
            name: 'Eligma',
            icon: 'fb289e50-5cfb-11e8-b48c-35d88ea2b959.png',
            decimals: 18,
            address: '0xc7c03b8a3fc5719066e185ea616e87b88eba44a3'
        },
        EMCO: {
            symbol: 'EMCO',
            name: 'Emirate Coin',
            icon: 'emco.png',
            decimals: 18,
            address: '0x9a07fd8a116b7e3be9e6185861496af7a2041460'
        },
        ENJ: {
            symbol: 'ENJ',
            name: 'Enjin',
            icon: '626cb710-d145-11e7-8d93-0dddd703d386.png',
            decimals: 18,
            address: '0xf629cbd94d3791c9250152bd8dfbdf380e2a3b9c'
        },
        ESZ: {
            symbol: 'ESZ',
            name: 'Ethersportz',
            icon: '03032b00-21fa-11e8-85f0-f592f4a72353.png',
            decimals: 18,
            address: '0xe8a1df958be379045e2b46a31a98b93a2ecdfded'
        },
        ETH: {
            symbol: 'ETH',
            name: 'Ethereum',
            icon: 'aea83e97-13a3-4fe7-b682-b2a82299cdf2.png',
            decimals: 18,
            address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
        },
        EURS: {
            symbol: 'EURS',
            name: 'STASIS',
            icon: '7fb80cc0-e684-11e8-acf9-2579a95089da.jpeg',
            decimals: 2,
            address: '0xdb25f211ab05b1c97d595516f45794528a807ad8'
        },
        EVO: {
            symbol: 'EVO',
            name: 'Evolution',
            icon: '25d966d0-0c37-11e9-9f1a-a1c7ebc5a95e.jpeg',
            decimals: 18,
            address: '0xefbd6d7def37ffae990503ecdb1291b2f7e38788'
        },
        FKX: {
            symbol: 'FKX',
            name: 'FortKnoxster',
            icon: '0d32be10-4dec-11e8-a04a-a1dcf04454c8.png',
            decimals: 18,
            address: '0x009e864923b49263c7f10d19b7f8ab7a9a5aad33'
        },
        FLIXX: {
            symbol: 'FLIXX',
            name: 'Flixxo',
            icon: 'Flixxo.png',
            decimals: 18,
            address: '0xf04a8ac553fcedb5ba99a64799155826c136b0be'
        },
        FTR: {
            symbol: 'FTR',
            name: 'Futourist',
            icon: '3b246c20-2c62-11e8-baf6-5fcc218084fc.png',
            decimals: 18,
            address: '0x2023dcf7c438c8c8c0b0f28dbae15520b4f3ee20'
        },
        FTX: {
            symbol: 'FTX',
            name: 'FintruX',
            icon: 'cbea38c0-5dc7-11e8-b48c-35d88ea2b959.jpeg',
            decimals: 18,
            address: '0xd559f20296ff4895da39b5bd9add54b442596a61'
        },
        GES: {
            symbol: 'GES',
            name: 'Galaxy eSolutions',
            icon: 'd22a9fb0-4e02-11e8-a04a-a1dcf04454c8.png',
            decimals: 18,
            address: '0xfb1e5f5e984c28ad7e228cdaa1f8a0919bb6a09b'
        },
        GNO: {
            symbol: 'GNO',
            name: 'Gnosis',
            icon: 'b48283f0-d5c7-11e7-a7f0-3f204353e561.png',
            decimals: 18,
            address: '0x6810e776880c02933d47db1b9fc05908e5386b96'
        },
        GTO: {
            symbol: 'GTO',
            name: 'Gifto',
            icon: 'b86c6900-0f46-11e8-b388-9b9c3ace7f5b.png',
            decimals: 5,
            address: '0xc5bbae50781be1669306b9e001eff57a2957b09d'
        },
        HEDG: {
            symbol: 'HEDG',
            name: 'Hedge Trade',
            icon: '519af5c0-14ef-11e9-9f1a-a1c7ebc5a95e.jpeg',
            decimals: 18,
            address: '0xf1290473e210b2108a85237fbcd7b6eb42cc654f'
        },
        HOT: {
            symbol: 'HOT',
            name: 'Hydro Protocol',
            icon: '22b822b0-5e69-11e8-9952-89831889dec2.png',
            decimals: 18,
            address: '0x9af839687f6c94542ac5ece2e317daae355493a1'
        },
        IND: {
            symbol: 'IND',
            name: 'Indorse',
            icon: '5e67d760-db5b-11e7-91c4-63061ece2a28.png',
            decimals: 18,
            address: '0xf8e386eda857484f5a12e4b5daa9984e06e73705'
        },
        INSTAR: {
            symbol: 'INSTAR',
            name: 'Insights Network',
            icon: '950cff70-164d-11e8-bf39-bd2b2e4b10cf.png',
            decimals: 18,
            address: '0xc72fe8e3dd5bef0f9f31f259399f301272ef2a2d'
        },
        J8T: {
            symbol: 'J8T',
            name: 'Jet8',
            icon: '9030a0e0-546b-11e8-a04a-a1dcf04454c8.png',
            decimals: 8,
            address: '0x0d262e5dc4a06a0f1c90ce79c7a60c09dfc884e4'
        },
        KICK: {
            symbol: 'KICK',
            name: 'KICKICO',
            icon: 'KickCoin.png',
            decimals: 8,
            address: '0x27695e09149adc738a978e9a678f99e4c39e9eb9'
        },
        KIN: {
            symbol: 'KIN',
            name: 'Kin',
            icon: '806f5540-d458-11e7-8d93-0dddd703d386.png',
            decimals: 18,
            address: '0x818fc6c2ec5986bc6e2cbf00939d90556ab12ce5'
        },
        KNC: {
            symbol: 'KNC',
            name: 'Kyber Network',
            icon: 'a0f71130-779c-11e8-a329-1d4492a24b90.png',
            decimals: 18,
            address: '0xdd974d5c2e2928dea5f71b9825b8b646686bd200'
        },
        KUE: {
            symbol: 'KUE',
            name: 'Kuende',
            icon: 'ed1be8a0-249f-11e9-99c6-21750f32c67e.jpeg',
            decimals: 18,
            address: '0xdf1338fbafe7af1789151627b886781ba556ef9a'
        },
        LDC: {
            symbol: 'LDC',
            name: 'Lead Coin',
            icon: '63b76010-1d63-11e8-baf6-5fcc218084fc.png',
            decimals: 18,
            address: '0x5102791ca02fc3595398400bfe0e33d7b6c82267'
        },
        LOC: {
            symbol: 'LOC',
            name: 'LockTrip',
            icon: 'b96fe440-aa9f-11e8-8ea4-41a2afd74217.jpeg',
            decimals: 18,
            address: '0x5e3346444010135322268a4630d2ed5f8d09446c'
        },
        LOCI: {
            symbol: 'LOCI',
            name: 'LOCIcoin',
            icon: 'fda1cfb0-a92e-11e8-9e96-092a24f940bf.jpeg',
            decimals: 18,
            address: '0x9c23d67aea7b95d80942e3836bcdf7e708a747c2'
        },
        MAD: {
            symbol: 'MAD',
            name: 'Mad Network',
            icon: '96bc71a0-6253-11e8-9938-d9099e6ba61c.png',
            decimals: 18,
            address: '0x5b09a0371c1da44a8e24d36bf5deb1141a84d875'
        },
        MANA: {
            symbol: 'MANA',
            name: 'Decentraland',
            icon: '541d40e0-dd8d-11e7-8594-f3366fd77b2c.png',
            decimals: 18,
            address: '0x0f5d2fb29fb7d3cfee444a200298f468908cc942'
        },
        MDT: {
            symbol: 'MDT',
            name: 'Measurable Data Token',
            icon: 'cd2c3530-3e37-11e8-b094-85955a15de56.png',
            decimals: 18,
            address: '0x814e0908b12a99fecf5bc101bb5d0b8b5cdf7d26'
        },
        MFG: {
            symbol: 'MFG',
            name: 'SyncFab',
            icon: '488280b0-2b8f-11e8-891a-85ca6815b23e.png',
            decimals: 18,
            address: '0x6710c63432a2de02954fc0f851db07146a6c0312'
        },
        MFT: {
            symbol: 'MFT',
            name: 'Mainframe',
            icon: 'c871da70-806f-11e8-9a1c-0d4c17b68a0d.png',
            decimals: 18,
            address: '0xdf2c7238198ad8b389666574f2d8bc411a4b7428'
        },
        MKR: {
            symbol: 'MKR',
            name: 'Maker',
            icon: 'Maker.png',
            decimals: 18,
            address: '0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2'
        },
        MNTP: {
            symbol: 'MNTP',
            name: 'Goldmint',
            icon: '5f706490-ea3f-11e7-9b5e-179c6e04aa7c.png',
            decimals: 18,
            address: '0x83cee9e086a77e492ee0bb93c2b0437ad6fdeccc'
        },
        MRG: {
            symbol: 'MRG',
            name: 'Wemerge',
            icon: '1cca2ab0-d209-11e8-acf9-2579a95089da.jpeg',
            decimals: 18,
            address: '0xcbee6459728019cb1f2bb971dde2ee3271bc7617'
        },
        MRPH: {
            symbol: 'MRPH',
            name: 'Morpheus Network',
            icon: 'Morpheus Network.png',
            decimals: 4,
            address: '0x7b0c06043468469967dba22d1af33d77d44056c8'
        },
        MTL: {
            symbol: 'MTL',
            name: 'Metal',
            icon: '5ffa1c20-6d53-11e8-9b33-47ec6716605d.png',
            decimals: 8,
            address: '0xf433089366899d83a9f26a773d59ec7ecf30355e'
        },
        MYB: {
            symbol: 'MYB',
            name: 'MyBit Token',
            icon: '836a9c80-6898-11e8-b276-f32edc99ad99.png',
            decimals: 18,
            address: '0x5d60d8d7ef6d37e16ebabc324de3be57f135e0bc'
        },
        NEXO: {
            symbol: 'NEXO',
            name: 'Nexo',
            icon: 'Nexo (1).png',
            decimals: 18,
            address: '0xb62132e35a6c13ee1ee0f84dc5d40bad8d815206'
        },
        OMG: {
            symbol: 'OMG',
            name: 'OmiseGo',
            icon: '6e2ce740-e343-11e7-8594-f3366fd77b2c.png',
            decimals: 18,
            address: '0xd26114cd6ee289accf82350c8d8487fedb8a0c07'
        },
        ONG: {
            symbol: 'ONG',
            name: 'onG.social',
            icon: 'b430af40-fd84-11e8-9d27-f5eca6f60573.jpeg',
            decimals: 18,
            address: '0xd341d1680eeee3255b8c4c75bcce7eb57f144dae'
        },
        PEG: {
            symbol: 'PEG',
            name: 'PEG Network',
            icon: 'cb6f92d0-d88f-11e8-acf9-2579a95089da.jpeg',
            decimals: 18,
            address: '0x8ae56a6850a7cbeac3c3ab2cb311e7620167eac8'
        },
        PEGUSD: {
            symbol: 'PEGUSD',
            name: 'PEG:US Dollar',
            icon: '03f3edb0-d893-11e8-92f8-87d71887724a.jpeg',
            decimals: 18,
            address: '0xa485bd50228440797abb4d4595161d7546811160'
        },
        PLR: {
            symbol: 'PLR',
            name: 'Pillar',
            icon: 'e052c3b0-35c5-11e8-a132-e5d1db607067.png',
            decimals: 18,
            address: '0xe3818504c1b32bf1557b16c238b2e01fd3149c17'
        },
        POA20: {
            symbol: 'POA20',
            name: 'POA',
            icon: '4be7bb20-53a4-11e8-a04a-a1dcf04454c8.png',
            decimals: 18,
            address: '0x6758b7d441a9739b98552b373703d8d3d14f9e62'
        },
        POE: {
            symbol: 'POE',
            name: 'Po.et',
            icon: '4746e920-5470-11e8-a380-5df7437b363c.png',
            decimals: 8,
            address: '0x0e0989b1f9b8a38983c2ba8053269ca62ec9b195'
        },
        POWR: {
            symbol: 'POWR',
            name: 'Power Ledger',
            icon: '328df670-0751-11e8-aeaa-3305f3982028.png',
            decimals: 6,
            address: '0x595832f8fc6bf59c85c527fec3740a1b7a361269'
        },
        RB: {
            symbol: 'RB',
            name: 'Rabbit Exchange',
            icon: 'b30a6310-2947-11e9-99c6-21750f32c67e.jpeg',
            decimals: 18,
            address: '0x0719046cf7f82f9322479538b69a89c26a70a5bc'
        },
        RBLX: {
            symbol: 'RBLX',
            name: 'Rublix',
            icon: '455c17b0-5381-11e8-a473-e17b8e82a26f.png',
            decimals: 18,
            address: '0xfc2c4d8f95002c14ed0a7aa65102cac9e5953b5e'
        },
        RCN: {
            symbol: 'RCN',
            name: 'Ripio',
            icon: '87cde120-1a2c-11e8-a36b-c1b17c6baaea.png',
            decimals: 18,
            address: '0xf970b8e36e23f7fc3fd752eea86f8be8d83375a6'
        },
        RDN: {
            symbol: 'RDN',
            name: 'Raiden Network Token',
            icon: 'Raiden Network Token.png',
            decimals: 18,
            address: '0x255aa6df07540cb5d3d297f0d0d4d84cb52bc8e6'
        },
        REAL: {
            symbol: 'REAL',
            name: 'REAL',
            icon: 'REAL.png',
            decimals: 18,
            address: '0x9214ec02cb71cba0ada6896b8da260736a67ab10'
        },
        REF: {
            symbol: 'REF',
            name: 'RefToken',
            icon: '63a9d970-f947-11e8-9f1a-a1c7ebc5a95e.jpeg',
            decimals: 8,
            address: '0x89303500a7abfb178b274fd89f2469c264951e1f'
        },
        REM: {
            symbol: 'REM',
            name: 'Remme',
            icon: '36317710-f171-11e8-8779-0bfd3a25128a.jpeg',
            decimals: 4,
            address: '0x83984d6142934bb535793a82adb0a46ef0f66b6d'
        },
        REQ: {
            symbol: 'REQ',
            name: 'Request Network',
            icon: 'b53f2730-0ff1-11e8-9bbb-f9f8c8c99387.png',
            decimals: 18,
            address: '0x8f8221afbb33998d8584a2b05749ba73c37a938a'
        },
        RLC: {
            symbol: 'RLC',
            name: 'iExec',
            icon: '836bdeb0-f6ce-11e7-9454-0922d1574472.png',
            decimals: 9,
            address: '0x607f4c5bb672230e8672085532f7e901544a7375'
        },
        RVT: {
            symbol: 'RVT',
            name: 'Rivetz',
            icon: 'ad978310-3bd9-11e8-a132-e5d1db607067.png',
            decimals: 18,
            address: '0x3d1ba9be9f66b8ee101911bc36d3fb562eac2244'
        },
        SAN: {
            symbol: 'SAN',
            name: 'Santiment Network Token',
            icon: '2b1a6900-1fba-11e9-99c6-21750f32c67e.jpeg',
            decimals: 18,
            address: '0x7c5a0ce9267ed19b22f8cae653f198e3e8daf098'
        },
        SCL: {
            symbol: 'SCL',
            name: 'Sociall',
            icon: 'bbfa82e0-4eee-11e8-a380-5df7437b363c.png',
            decimals: 8,
            address: '0xd7631787b4dcc87b1254cfd1e5ce48e96823dee8'
        },
        SENSE: {
            symbol: 'SENSE',
            name: 'Sense',
            icon: '93fab230-f479-11e7-aabd-a344aed92db1.png',
            decimals: 8,
            address: '0x6745fab6801e376cd24f03572b9c9b0d4edddccf'
        },
        SIG: {
            symbol: 'SIG',
            name: 'Spectiv',
            icon: '194daba0-2606-11e8-891a-85ca6815b23e.png',
            decimals: 18,
            address: '0x6888a16ea9792c15a4dcf2f6c623d055c8ede792'
        },
        SNT: {
            symbol: 'SNT',
            name: 'Status',
            icon: 'Status.png',
            decimals: 18,
            address: '0x744d70fdbe2ba4cf95131626614a1763df805b9e'
        },
        SPD: {
            symbol: 'SPD',
            name: 'Spindle',
            icon: '3667fc10-7d20-11e8-9a1c-0d4c17b68a0d.png',
            decimals: 18,
            address: '0x1dea979ae76f26071870f824088da78979eb91c8'
        },
        SRN: {
            symbol: 'SRN',
            name: 'Sirin Labs',
            icon: 'c8845400-f525-11e7-9454-0922d1574472.png',
            decimals: 18,
            address: '0x68d57c9a1c35f63e2c83ee8e49a64e9d70528d25'
        },
        STAC: {
            symbol: 'STAC',
            name: 'CoinStarter',
            icon: '2ef50240-1bcb-11e8-a36b-c1b17c6baaea.png',
            decimals: 18,
            address: '0x9a005c9a89bd72a4bd27721e7a09a3c11d2b03c4'
        },
        STX: {
            symbol: 'STX',
            name: 'Stox',
            icon: '55d9ef30-a78e-11e7-a91e-3950c0cd8344.png',
            decimals: 18,
            address: '0x006bea43baa3f7a6f765f14f10a1a1b08334ef45'
        },
        SVD: {
            symbol: 'SVD',
            name: 'Savedroid',
            icon: 'Savedroid.png',
            decimals: 18,
            address: '0xbdeb4b83251fb146687fa19d1c660f99411eefe3'
        },
        SXL: {
            symbol: 'SXL',
            name: 'Success Life',
            icon: '9bb2bbe0-1a3d-11e9-99c6-21750f32c67e.jpeg',
            decimals: 4,
            address: '0x222efe83d8cc48e422419d65cf82d410a276499b'
        },
        TAAS: {
            symbol: 'TAAS',
            name: 'TaaS',
            icon: '3693ef10-e346-11e7-b0a9-ed964a07ad49.png',
            decimals: 6,
            address: '0xe7775a6e9bcf904eb39da2b68c5efb4f9360e08c'
        },
        TBX: {
            symbol: 'TBX',
            name: 'Tokenbox',
            icon: 'e0590500-f479-11e7-bc6b-87a36d827eff.png',
            decimals: 18,
            address: '0x3a92bd396aef82af98ebc0aa9030d25a23b11c6b'
        },
        TKN: {
            symbol: 'TKN',
            name: 'TokenCard',
            icon: '745fa0b0-21ed-11e8-85f0-f592f4a72353.png',
            decimals: 8,
            address: '0xaaaf91d9b90df800df4f55c205fd6989c977e73a'
        },
        TNS: {
            symbol: 'TNS',
            name: 'Transcodium',
            icon: '21150a90-4d11-11e8-ad13-7fdc32c9e38a.png',
            decimals: 18,
            address: '0xb0280743b44bf7db4b6be482b2ba7b75e5da096c'
        },
        TRST: {
            symbol: 'TRST',
            name: 'WeTrust',
            icon: 'a8886de0-f533-11e7-aabd-a344aed92db1.png',
            decimals: 6,
            address: '0xcb94be6f13a1182e4a4b6140cb7bf2025d28e41b'
        },
        UP: {
            symbol: 'UP',
            name: 'UpToken',
            icon: '7c584fd0-2b5f-11e8-baf6-5fcc218084fc.png',
            decimals: 8,
            address: '0x6ba460ab75cd2c56343b3517ffeba60748654d26'
        },
        VEE: {
            symbol: 'VEE',
            name: 'BLOCKv',
            icon: 'b50fe640-fb6b-11e7-9454-0922d1574472.png',
            decimals: 18,
            address: '0x340d2bde5eb28c1eed91b2f790723e3b160613b7'
        },
        VIB: {
            symbol: 'VIB',
            name: 'Viberate',
            icon: 'ce96b8c0-208a-11e8-891a-85ca6815b23e.png',
            decimals: 18,
            address: '0x2c974b2d0ba1716e644c1fc59982a89ddd2ff724'
        },
        WAND: {
            symbol: 'WAND',
            name: 'WandX',
            icon: 'bf9d1dd0-bd5e-11e7-9386-c3d5072e15a2.png',
            decimals: 18,
            address: '0x27f610bf36eca0939093343ac28b1534a721dbb4'
        },
        WAX: {
            symbol: 'WAX',
            name: 'Wax',
            icon: '7f4fc5e0-f06f-11e7-9454-0922d1574472.png',
            decimals: 8,
            address: '0x39bb259f66e1c59d5abef88375979b4d20d98022'
        },
        WINGS: {
            symbol: 'WINGS',
            name: 'Wings',
            icon: '5038e430-f51a-11e7-aabd-a344aed92db1.png',
            decimals: 18,
            address: '0x667088b212ce3d06a1b553a7221e1fd19000d9af'
        },
        WISH: {
            symbol: 'WISH',
            name: 'MyWish',
            icon: '929a3af0-d0a2-11e7-a7f0-3f204353e561.jpeg',
            decimals: 18,
            address: '0x1b22c32cd936cb97c28c5690a0695a82abf688e6'
        },
        WLK: {
            symbol: 'WLK',
            name: 'Wolk',
            icon: 'ce0e4f30-fcf9-11e7-9454-0922d1574472.png',
            decimals: 18,
            address: '0xf6b55acbbc49f4524aa48d19281a9a77c54de10f'
        },
        X8X: {
            symbol: 'X8X',
            name: 'x8currency',
            icon: 'dda69360-2064-11e8-85f0-f592f4a72353.png',
            decimals: 18,
            address: '0x910dfc18d6ea3d6a7124a6f8b5458f281060fa4c'
        },
        XBP: {
            symbol: 'XBP',
            name: 'BlitzPredict',
            icon: '94736860-eb28-11e7-875f-03079c4bb7e5.jpeg',
            decimals: 18,
            address: '0x28dee01d53fed0edf5f6e310bf8ef9311513ae40'
        },
        XDCE: {
            symbol: 'XDCE',
            name: 'XinFin',
            icon: 'e90d16e0-163f-11e8-a36b-c1b17c6baaea.png',
            decimals: 18,
            address: '0x41ab1b6fcbb2fa9dced81acbdec13ea6315f2bf2'
        },
        XNK: {
            symbol: 'XNK',
            name: 'Ink Protocol',
            icon: '93e9d680-5e6a-11e8-9952-89831889dec2.png',
            decimals: 18,
            address: '0xbc86727e770de68b1060c91f6bb6945c73e10388'
        },
        XPAT: {
            symbol: 'XPAT',
            name: 'Bitnation',
            icon: 'bbc6da80-5f1a-11e8-a205-7bf13fb32a99.png',
            decimals: 18,
            address: '0xbb1fa4fdeb3459733bf67ebc6f893003fa976a82'
        },
        ZINC: {
            symbol: 'ZINC',
            name: 'ZINC',
            icon: 'a6d31c10-77b1-11e8-a04e-4b9b4af37e24.png',
            decimals: 18,
            address: '0x4aac461c86abfa71e9d00d9a2cde8d74e4e1aeea'
        },
        ZIPT: {
            symbol: 'ZIPT',
            name: 'Zippie',
            icon: 'a0450c30-e81f-11e8-8779-0bfd3a25128a.jpeg',
            decimals: 18,
            address: '0xedd7c94fd7b4971b916d15067bc454b9e1bad980'
        },

// Only Kyber Network Coins
        ABT: {
            symbol: 'ABT',
            name: 'ArcBlock',
            icon: '',
            decimals: 18,
            address: '0xb98d4c97425d9908e66e53a6fdf673acca0be986'
        },
        ABYSS: {
            symbol: 'ABYSS',
            name: 'ABYSS',
            icon: '',
            decimals: 18,
            address: '0x0e8d6b471e332f140e7d9dbb99e5e3822f728da6'
        },
        ADX: {
            symbol: 'ADX',
            name: 'AdEx',
            icon: '',
            decimals: 4,
            address: '0x4470bb87d77b963a013db939be332f927f2b992e'
        },
        APPC: {
            symbol: 'APPC',
            name: 'AppCoins',
            icon: '',
            decimals: 18,
            address: '0x1a7a8bd9106f2b8d977e08582dc7d24c723ab0db'
        },
        AST: {
            symbol: 'AST',
            name: 'AirSwap',
            icon: '',
            decimals: 4,
            address: '0x27054b13b1b798b345b591a4d22e6562d47ea75a'
        },
        BBO: {
            symbol: 'BBO',
            name: 'Bigbom',
            icon: '',
            decimals: 18,
            address: '0x84f7c44b6fed1080f647e354d552595be2cc602f'
        },
        BIX: {
            symbol: 'BIX',
            name: 'BIX Token',
            icon: '',
            decimals: 18,
            address: '0xb3104b4b9da82025e8b9f8fb28b3553ce2f67069'
        },
        BLZ: {
            symbol: 'BLZ',
            name: 'Bluezelle',
            icon: '',
            decimals: 18,
            address: '0x5732046a883704404f284ce41ffadd5b007fd668'
        },
        BQX: {
            symbol: 'BQX',
            name: 'Ethos',
            icon: '',
            decimals: 8,
            address: '0x5af2be193a6abca9c8817001f45744777db30756'
        },
        CDT: {
            symbol: 'CDT',
            name: 'CoinDash',
            icon: '',
            decimals: 18,
            address: '0x177d39ac676ed1c67a2b268ad7f1e58826e5b0af'
        },
        COFI: {
            symbol: 'COFI',
            name: 'CoinFi',
            icon: '',
            decimals: 18,
            address: '0x3136ef851592acf49ca4c825131e364170fa32b3'
        },
        CVC: {
            symbol: 'CVC',
            name: 'Civic',
            icon: '',
            decimals: 8,
            address: '0x41e5560054824ea6b0732e656e3ad64e20e94e45'
        },
        DAT: {
            symbol: 'DAT',
            name: 'Datum',
            icon: '',
            decimals: 18,
            address: '0x81c9151de0c8bafcd325a57e3db5a5df1cebf79c'
        },
        DCC: {
            symbol: 'DCC',
            name: 'Distributed Credit Chain',
            icon: '',
            decimals: 18,
            address: '0xffa93aacf49297d51e211817452839052fdfb961'
        },
        DGX: {
            symbol: 'DGX',
            name: 'Digix Gold Token',
            icon: '',
            decimals: 9,
            address: '0x4f3afec4e5a3f2a6a1a411def7d7dfe50ee057bf'
        },
        DTA: {
            symbol: 'DTA',
            name: 'Data',
            icon: '',
            decimals: 18,
            address: '0x69b148395ce0015c13e36bffbad63f49ef874e03'
        },
        DTH: {
            symbol: 'DTH',
            name: 'Dether',
            icon: '',
            decimals: 18,
            address: '0x5adc961d6ac3f7062d2ea45fefb8d8167d44b190'
        },
        EKO: {
            symbol: 'EKO',
            name: 'EchoLink',
            icon: '',
            decimals: 18,
            address: '0xa6a840e50bcaa50da017b91a0d86b8b2d41156ee'
        },
        ELEC: {
            symbol: 'ELEC',
            name: 'ElectrifyAsia',
            icon: '',
            decimals: 18,
            address: '0xd49ff13661451313ca1553fd6954bd1d9b6e02b9'
        },
        ENG: {
            symbol: 'ENG',
            name: 'Enigma',
            icon: '',
            decimals: 8,
            address: '0xf0ee6b27b759c9893ce4f094b49ad28fd15a23e4'
        },
        INF: {
            symbol: 'INF',
            name: 'InfinitusTokens',
            icon: '',
            decimals: 18,
            address: '0x00e150d741eda1d49d341189cae4c08a73a49c95'
        },
        IOST: {
            symbol: 'IOST',
            name: 'IOStoken',
            icon: '',
            decimals: 18,
            address: '0xfa1a856cfa3409cfa145fa4e20eb270df3eb21ab'
        },
        LBA: {
            symbol: 'LBA',
            name: 'Cred',
            icon: '',
            decimals: 18,
            address: '0xfe5f141bf94fe84bc28ded0ab966c16b17490657'
        },
        LEND: {
            symbol: 'LEND',
            name: 'EthLend',
            icon: '',
            decimals: 18,
            address: '0x80fb784b7ed66730e8b1dbd9820afd29931aab03'
        },
        LINK: {
            symbol: 'LINK',
            name: 'Chain Link',
            icon: '',
            decimals: 18,
            address: '0x514910771af9ca656af840dff83e8264ecf986ca'
        },
        MAS: {
            symbol: 'MAS',
            name: 'MidasProtocol',
            icon: '',
            decimals: 18,
            address: '0x23ccc43365d9dd3882eab88f43d515208f832430'
        },
        MCO: {
            symbol: 'MCO',
            name: 'Monaco',
            icon: '',
            decimals: 8,
            address: '0xb63b606ac810a52cca15e44bb630fd42d8d1d83d'
        },
        MLN: {
            symbol: 'MLN',
            name: 'Melon Token',
            icon: '',
            decimals: 18,
            address: '0xec67005c4e498ec7f55e092bd1d35cbc47c91892'
        },
        MOC: {
            symbol: 'MOC',
            name: 'Moss Land',
            icon: '',
            decimals: 18,
            address: '0x865ec58b06bf6305b886793aa20a2da31d034e68'
        },
        MOT: {
            symbol: 'MOT',
            name: 'Olympus Labs',
            icon: '',
            decimals: 18,
            address: '0x263c618480dbe35c300d8d5ecda19bbb986acaed'
        },
        OCN: {
            symbol: 'OCN',
            name: 'OCoin',
            icon: '',
            decimals: 18,
            address: '0x4092678e4e78230f46a1534c0fbc8fa39780892b'
        },
        OST: {
            symbol: 'OST',
            name: 'Open Simple Token',
            icon: '',
            decimals: 18,
            address: '0x2c4e8f2d746113d0696ce89b35f0d8bf88e0aeca'
        },
        PAX: {
            symbol: 'PAX',
            name: 'Paxos Standard',
            icon: '',
            decimals: 18,
            address: '0x8e870d67f660d95d5be530380d0ec0bd388289e1'
        },
        PAY: {
            symbol: 'PAY',
            name: 'TenX',
            icon: '',
            decimals: 18,
            address: '0xb97048628db6b661d4c2aa833e95dbe1a905b280'
        },
        POLY: {
            symbol: 'POLY',
            name: 'Polymath',
            icon: '',
            decimals: 18,
            address: '0x9992ec3cf6a55b00978cddf2b27bc6882d88d1ec'
        },
        PRO: {
            symbol: 'PRO',
            name: 'Propy',
            icon: '',
            decimals: 8,
            address: '0x226bb599a12c826476e3a771454697ea52e9e220'
        },
        PT: {
            symbol: 'PT',
            name: 'Promotion Token',
            icon: '',
            decimals: 18,
            address: '0x094c875704c14783049ddf8136e298b3a099c446'
        },
        QKC: {
            symbol: 'QKC',
            name: 'QuarkChain',
            icon: '',
            decimals: 18,
            address: '0xea26c4ac16d4a5a106820bc8aee85fd0b7b2b664'
        },
        REN: {
            symbol: 'REN',
            name: 'Republic',
            icon: '',
            decimals: 18,
            address: '0x408e41876cccdc0f92210600ef50372656052a38'
        },
        REP: {
            symbol: 'REP',
            name: 'Augur',
            icon: '',
            decimals: 18,
            address: '0x1985365e9f78359a9b6ad760e32412f4a445e862'
        },
        SSP: {
            symbol: 'SSP',
            name: 'Smartshare Token',
            icon: '',
            decimals: 4,
            address: '0x624d520bab2e4ad83935fa503fb130614374e850'
        },
        STORM: {
            symbol: 'STORM',
            name: 'Storm',
            icon: '',
            decimals: 18,
            address: '0xd0a4b8946cb52f0661273bfbc6fd0e0c75fc6433'
        },
        TTC: {
            symbol: 'TTC',
            name: 'TTC Protocol',
            icon: '',
            decimals: 18,
            address: '0x9389434852b94bbad4c8afed5b7bdbc5ff0c2275'
        },
        TUSD: {
            symbol: 'TUSD',
            name: 'TrueUSD',
            icon: '',
            decimals: 18,
            address: '0x8dd5fbce2f6a956c3022ba3663759011dd51e73e'
        },
        USDC: {
            symbol: 'USDC',
            name: 'USD Coin',
            icon: '',
            decimals: 6,
            address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'
        },
        WABI: {
            symbol: 'WABI',
            name: 'WaBi',
            icon: '',
            decimals: 18,
            address: '0x286bda1413a2df81731d4930ce2f862a35a609fe'
        },
        WBTC: {
            symbol: 'WBTC',
            name: 'Wrapped BTC',
            icon: '',
            decimals: 8,
            address: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599'
        },
        WETH: {
            symbol: 'WETH',
            name: 'Wrapped Ether',
            icon: '',
            decimals: 18,
            address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
        },
        ZRX: {
            symbol: 'ZRX',
            name: '0x Protocol',
            icon: '',
            decimals: 18,
            address: '0xe41d2489571d322189246dafa5ebde1f4699f498'
        },
        NPXS: {
            symbol: 'NPXS',
            name: 'Pundi X Token (NPXS)',
            icon: '',
            decimals: 18,
            address: '0xA15C7Ebe1f07CaF6bFF097D8a589fb8AC49Ae5B3'
        },
        SPANK: {
            symbol: 'SPANK',
            name: 'SpankChain Token (SPANK)',
            icon: '',
            decimals: 18,
            address: '0x42d6622deCe394b54999Fbd73D108123806f6a18'
        },
        GST2: {
            symbol: 'GST2',
            name: 'Gastoken.io 2 (GST2)',
            icon: '',
            decimals: 2,
            address: '0x0000000000b3F879cb30FE243b4Dfee438691c04'
        },
        GEN: {
            symbol: 'GEN',
            name: 'DAOstack (GEN)',
            icon: '',
            decimals: 18,
            address: '0x543Ff227F64Aa17eA132Bf9886cAb5DB55DCAddf'
        },
        BOOTY: {
            symbol: 'BOOTY',
            name: 'BOOTY',
            icon: '',
            decimals: 18,
            address: '0x6b01c3170ae1efebee1a3159172cb3f7a5ecf9e5'
        },
        cBAT: {
            symbol: 'cBAT',
            name: 'Compound Basic Attention Token (cBAT)',
            icon: '',
            decimals: 8,
            address: '0x6c8c6b02e7b2be14d4fa6022dfd6d75921d90e4e'
        },
        cDAI: {
            symbol: 'cDAI',
            name: 'Compound Dai (cDAI)',
            icon: '',
            decimals: 8,
            address: '0xf5dce57282a584d2746faf1593d3121fcac444dc'
        },
        cETH: {
            symbol: 'cETH',
            name: 'Compound ETH (cETH)',
            icon: '',
            decimals: 8,
            address: '0x4ddc2d193948926d02f9b1fe9e1daa0718270ed5'
        },
        cUSDC: {
            symbol: 'cUSDC',
            name: 'Compound USD Coin (cUSDC)',
            icon: '',
            decimals: 8,
            address: '0x39AA39c021dfbaE8faC545936693aC917d5E7563'
        },
        cREP: {
            symbol: 'cREP',
            name: 'Compound Augur (cREP)',
            icon: '',
            decimals: 8,
            address: '0x158079Ee67Fce2f58472A96584A73C7Ab9AC95c1'
        },
        cWBTC: {
            symbol: 'cWBTC',
            name: 'Compound Wrapped BTC',
            icon: '',
            decimals: 8,
            address: '0xc11b1268c1a384e55c48c2391d8d480264a3a7f4'
        },
        cZRX: {
            symbol: 'cZRX',
            name: 'Compound 0x (cZRX)',
            icon: '',
            decimals: 8,
            address: '0xB3319f5D18Bc0D84dD1b4825Dcde5d5f7266d407'
        },
        GOLD: {
            symbol: 'GOLD',
            name: 'Dragonereum Gold (GOLD)',
            icon: '',
            decimals: 8,
            address: '0x150b0b96933b75ce27af8b92441f8fb683bf9739'
        },
        CLM: {
            symbol: 'CLM',
            name: 'Claymore (CLM)',
            icon: '',
            decimals: 18,
            address: '0x0ed8343dfdee32e38b4c4ce15a3b00a59e90f3db'
        },
        ETHPLO: {
            symbol: 'ETHPLO',
            name: 'ETHplode (ETHPLO)',
            icon: '',
            decimals: 6,
            address: '0xe0c6ce3e73029f201e5c0bedb97f67572a93711c'
        },
        EOST: {
            symbol: 'EOST',
            name: 'EOS TRUST (EOST)',
            icon: '',
            decimals: 18,
            address: '0x87210f1d3422ba75b6c40c63c78d79324dabcd55'
        },
        EVN: {
            symbol: 'EVN',
            name: 'Envion (EVN)',
            icon: '',
            decimals: 18,
            address: '0xd780ae2bf04cd96e577d3d014762f831d97129d0'
        },
        BURN: {
            symbol: 'BURN',
            name: 'The Burn Token (BURN)',
            icon: '',
            decimals: 0,
            address: '0x4f7c5bd3f7d62a9c984e265d73a86f5515f3e92b'
        },
        LTO: {
            symbol: 'LTO',
            name: 'LTO Network Token (LTO)',
            icon: '',
            decimals: 8,
            address: '0x3DB6Ba6ab6F95efed1a6E794caD492fAAabF294D'
        },
        MATIC: {
            symbol: 'MATIC',
            name: 'Matic Token (MATIC)',
            icon: '',
            decimals: 18,
            address: '0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0'
        },
        BNC: {
            symbol: 'BNC',
            name: 'Bionic (BNC)',
            icon: '',
            decimals: 8,
            address: '0xef51c9377feb29856e61625caf9390bd0b67ea18'
        },
        iDAI: {
            symbol: 'iDAI',
            name: 'bZx DAI iToken (iDAI)',
            icon: '',
            decimals: 18,
            address: '0x14094949152eddbfcd073717200da82fed8dc960'
        },
        USDT: {
            symbol: 'USDT',
            name: 'Tether USD (USDT)',
            icon: '',
            decimals: 6,
            address: '0xdac17f958d2ee523a2206206994597c13d831ec7'
        },
        QSP: {
            symbol: 'QSP',
            name: 'Quantstamp Token (QSP)',
            icon: '',
            decimals: 18,
            address: '0x99ea4db9ee77acd40b119bd1dc4e33e1c070b80d'
        }
    };

    constructor(
        private web3Service: Web3Service
    ) {

        // @ts-ignore
        this.tokens = this.sortObject(this.tokens);
    }

    sortObject(o) {
        return Object.keys(o).sort().reduce((r, k) => (r[k] = o[k], r), {});
    }

    parseAsset(symbol: string, amount): BigNumber {

        if (symbol === 'ETH') {
            // @ts-ignore
            return ethers.utils.parseEther(amount);
        }

        const token = this.tokens[symbol];
        // @ts-ignore
        return ethers.utils.parseUnits(this.toFixed(amount, token.decimals), token.decimals);
    }

    toFixed(num, fixed) {
        const re = new RegExp('^-?\\d+(?:\.\\d{0,' + (fixed || -1) + '})?');
        return num.toString().match(re)[0];
    }

    formatAsset(symbol: string, amount: BigNumber): string {

        if (symbol === 'ETH') {
            return ethers.utils.formatEther(amount);
        }

        const token = this.tokens[symbol];

        if (!token.decimals) {

            return amount.toString();
        } else {

            return ethers.utils.formatUnits(amount, token.decimals);
        }
    }

    async getTokenBalance(symbol: string, address: string) {

        const contract = new this.web3Service.provider.eth.Contract(
            ERC20ABI,
            this.tokens[symbol].address
        );

        return ethers.utils.bigNumberify(await contract.methods.balanceOf(address).call());
    }
}

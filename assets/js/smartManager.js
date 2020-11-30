let userAccount;
let urentalContract;
// test if metamask is setted on page load
window.addEventListener('load', function() {

    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof web3 !== 'undefined') {
        // Use Mist/MetaMask's provider
        web3js = new Web3(web3.currentProvider);
        ethereum.enable().catch(function( reason ){
            alert(reason);
            alert("you need to sign in")
        }).then(function(accounts){
            if (ethereum.networkVersion !== "3" ) {
                alert("please select ropsten network")
            } else {
                userAccount = accounts[0];
            }
        });

    } else {
        // Handle the case where the user doesn't have web3. Probably
        // show them a message telling them to install Metamask in
        // order to use our app.
        alert( "please download metamask");
    }
    startApp()
});

let accountInterval = setInterval(function() {
    if (web3.eth.accounts[0] !== userAccount ) {
        userAccount = web3.eth.accounts[0];
    }
}, 100);

function startApp() {
    let contractAddress = "0xE3dEeE44Fa603B0c71a9dE0C872FF61AA3dd0Cd4";
    let contractAbi = [
        {
            "constant": false,
            "inputs": [],
            "name": "renounceOwnership",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "owner",
            "outputs": [
                {
                    "name": "",
                    "type": "address"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "isOwner",
            "outputs": [
                {
                    "name": "",
                    "type": "bool"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "newOwner",
                    "type": "address"
                }
            ],
            "name": "transferOwnership",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "name": "previousOwner",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "name": "newOwner",
                    "type": "address"
                }
            ],
            "name": "OwnershipTransferred",
            "type": "event"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "getContractBalance",
            "outputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "_id",
                    "type": "uint256"
                },
                {
                    "name": "_seller",
                    "type": "address"
                },
                {
                    "name": "_caution",
                    "type": "uint256"
                },
                {
                    "name": "_duration",
                    "type": "uint48"
                }
            ],
            "name": "rent",
            "outputs": [
                {
                    "name": "",
                    "type": "bytes32"
                }
            ],
            "payable": true,
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "name": "_id",
                    "type": "bytes32"
                }
            ],
            "name": "getRent",
            "outputs": [
                {
                    "name": "",
                    "type": "address"
                },
                {
                    "name": "",
                    "type": "uint256"
                },
                {
                    "name": "",
                    "type": "uint256"
                },
                {
                    "name": "",
                    "type": "uint48"
                },
                {
                    "name": "",
                    "type": "uint8"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "name": "_id",
                    "type": "bytes32"
                }
            ],
            "name": "getSellerState",
            "outputs": [
                {
                    "name": "",
                    "type": "uint8"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "name": "_id",
                    "type": "bytes32"
                }
            ],
            "name": "getBuyerState",
            "outputs": [
                {
                    "name": "",
                    "type": "uint8"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "_id",
                    "type": "bytes32"
                }
            ],
            "name": "launchRent",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "_id",
                    "type": "bytes32"
                }
            ],
            "name": "releaseRent",
            "outputs": [
                {
                    "name": "success",
                    "type": "bool"
                }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [],
            "name": "deposit",
            "outputs": [],
            "payable": true,
            "stateMutability": "payable",
            "type": "function"
        }
    ];
    urentalContract = new web3.eth.contract( contractAbi, contractAddress)
}

function rent(id, sellerAddress, amount, caution, duration){
    urentalContract.methods.rent(id, sellerAddress, caution, duration).send({ from: userAccount, gasPrice: web3.utils.toHex(20000000000), gasLimit: web3.utils.toHex(4700000), value: web3.utils.toHex(amount) })
        .on('error', function(error){ console.log(error)})
        .on('transactionHash', function(transactionHash){})
        .on('receipt', function(receipt){console.log(receipt)})
        .on('confirmation', function(confirmationNumber, receipt){
            console.log(receipt);
//res.send({return : "ok"});
        });
}

function getRentu(rentHash){
   return urentalContract.methods.getRent( rentHash ).call()
}

function callGetRent(rentHash) {
    getRentu(rentHash).on( 'error' , function(){
        alert("permission denied !")
    }).then(  function(rent) {
        alert(rent)
    })
}

function getSellerState(rentHash){
    urentalContract.methods.getSellerState( rentHash ).call().on( 'error' , function(error){
        alert("permission denied !")
    }).then(  function(sellerState) {
        alert(sellerState)
    })
}

function  getBuyerState (rentHash){
    urentalContract.methods.getBuyerState( rentHash ).call().on( 'error', function(error){
        alert("permission denied !")
    }).then(  function(buyerState) {
        alert(buyerState)
    })
}

function launchRent(rentHash){
    urentalContract.methods.launchRent(rentHash).send({ from: userAccount }).on( 'error', function(error){
        alert(error)
    }).on('receipt', function(receipt){
        alert(receipt)
    })
}

function releaseRent(rentHash){
    urentalContract.methods.releaseRent(rentHash).send({ from: userAccount }).on( 'error', function(error){
        alert(error)
    }).on('receipt', function(receipt){
        alert(receipt)
    })
}


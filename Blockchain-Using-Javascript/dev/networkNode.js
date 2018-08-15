const express = require('express');
const Blockchain = require('./blockchain');
const bodyParser = require('body-parser');
const rp = require('request-promise');
const uuid = require('uuid/v1');

const port = process.argv[2];
const bitcoin = new Blockchain();
const app = express();

const nodeAddress = uuid().split('-').join('');

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
    extended: false
}));

app.get('/blockchain', function (req, res) {
    res.send(bitcoin);
});

app.post('/transaction', function (req, res) {
    const newTransaction = req.body;
    const blockIndex = bitcoin.addTransactionToPendingTransactions(newTransaction);
    res.json({
        note: `Transaction will be added in block ${blockIndex}`
    });

});

app.post('/transaction/broadcast', function (req, res) {
    const newTransaction = bitcoin.createNewTransaction(req.body.amount, req.body.sender, req.body.recipient);

    bitcoin.addTransactionToPendingTransactions(newTransaction);

    const requestPromises = [];

    bitcoin.networkNodes.forEach(networkNodeUrl => {
        const requestOption = {
            url: networkNodeUrl + '/transaction',
            method: 'POST',
            body: newTransaction,
            json: true
        };
        rp(requestOption);
    });

    Promise.all(requestPromises)
        .then(data => {
            res.json({
                note: 'Transaction created and broadcast successfully.'
            });
        });
});

app.get('/mine', function (req, res) {
    const lastBlock = bitcoin.getLastBlock();
    const previousBlockHash = lastBlock['hash'];

    const currentBlockData = {
        transactions: bitcoin.pendingTransactions,
        index: lastBlock['index'] + 1,
    };

    const nonce = bitcoin.proofOfWork(previousBlockHash, currentBlockData);
    const blockHash = bitcoin.hashBlock(previousBlockHash, currentBlockData, nonce);
    const newBlock = bitcoin.createNewBlock(nonce, previousBlockHash, blockHash);
    const requestPromises = [];

    bitcoin.networkNodes.forEach(networkNodeUrl => {
        const requestOption = {
            url: networkNodeUrl + '/receive-new-block',
            method: 'POST',
            body: {
                newBlock: newBlock,
            },
            json: true
        };
        requestPromises.push(rp(requestOption));
    });

    Promise.all(requestPromises)
        .then(data => {
            const requestOption = {
                url: bitcoin.currentNodeUrl + '/transaction/broadcast',
                method: 'POST',
                body: {
                    amount: 12.5,
                    sender: "JHFJHFJHFJHFJHFJH",
                    recipient: "FUVYUYVUJYGDFWKEFGJKG"
                },
                json: true
            };
            return rp(requestOption);
        }).then(data => {
            res.json({
                note: "New block mined and broadcast successfully",
                block: newBlock,
            });
        });

});

app.post('/receive-new-block', function (req, res) {
    const newBlock = req.body.newBlock;
    const lastBlock = bitcoin.getLastBlock();
    const correctHash = lastBlock.hash === newBlock.previousBlockHash;
    const correctIndex = lastBlock['index'] + 1 === newBlock['index'];

    if (correctHash && correctIndex) {
        bitcoin.chain.push(newBlock);
        bitcoin.pendingTransactions = [];
        res.json({
            note: 'New block received and accepted',
            newBlock: newBlock
        });
    } else {
        res.json({
            note: 'New block rejected',
            newBlock: newBlock
        });
    }
})

// register a node and broadcast it the network
app.post('/register-add-brodcast-node', function (req, res) {
    const newNodeUrl = req.body.newNodeUrl;
    const regNodePromises = [];

    if (bitcoin.networkNodes.indexOf(newNodeUrl) === -1) {

        bitcoin.networkNodes.push(newNodeUrl);
    }

    bitcoin.networkNodes.forEach(networkNodeUrl => {
        const requestOption = {
            url: networkNodeUrl + '/register-node',
            method: 'POST',
            body: {
                newNodeUrl: newNodeUrl
            },
            json: true
        };
        regNodePromises.push(rp(requestOption));
    });

    Promise.all(regNodePromises).then(data => {
            const bulkRegisterOption = {
                url: newNodeUrl + "/register-nodes-bulk",
                method: 'POST',
                body: {
                    allNetworkNodes: [...bitcoin.networkNodes, bitcoin.currentNodeUrl]
                },
                json: true
            };
            return rp(bulkRegisterOption);
        })
        .then(data => {
            res.json({
                note: "New node register with network successfully"
            });
        });

});

// register multiple nodes at once 
app.post('/register-node', function (req, res) {
    const newNodeUrl = req.body.newNodeUrl;
    const notCurrentNode = bitcoin.currentNodeUrl !== newNodeUrl;

    if (bitcoin.networkNodes.indexOf(newNodeUrl) === -1 && notCurrentNode) {
        bitcoin.networkNodes.push(newNodeUrl);
    }
    res.json({
        note: "New node registerd sucessfully."
    });
});

// register multiple nodes at once
app.post('/register-nodes-bulk', function (req, res) {
    const allNetworkNodes = req.body.allNetworkNodes;

    allNetworkNodes.forEach(networkNodeUrl => {
        const notCurrentNode = bitcoin.currentNodeUrl !== networkNodeUrl;
        if (bitcoin.networkNodes.indexOf(networkNodeUrl) === -1 && notCurrentNode) bitcoin.networkNodes.push(networkNodeUrl);
    });
    res.json({
        note: "Bulk registration successful."
    });
});

app.get('/consensus', function (req, res) {
    const requestPromises = [];
    bitcoin.networkNodes.forEach(networkNodeUrl => {
        const requestOption = {
            url: networkNodeUrl + '/blockchain',
            method: 'GET/',
            json: true
        };
        requestPromises.push(rp(requestOption));
    });
    Promise.all(requestPromises)
        .then(blockchains => {

            const currentChainLength = bitcoin.chain.length;
            let maxChainLength = currentChainLength;
            let newLongestChain = null;
            let newPendingTransactions = null;

            blockchains.forEach(blockchain => {
                if (blockchain.chain.length > maxChainLength) {
                    maxChainLength = blockchain.chain.length;
                    newLongestChain = blockchain.chain;
                    newPendingTransactions = blockchain.pendingTransactions;
                };
            });
            if (!newLongestChain || (newLongestChain && bitcoin.chainIsValid(newLongestChain))) {
                res.json({
                    note: 'Current chain has not been replaced',
                    chain: bitcoin.chain
                });
            } else if (newLongestChain && bitcoin.chainIsValid(newLongestChain)) {
                bitcoin.chain = newLongestChain;
                bitcoin.pendingTransactions = newPendingTransactions;
                res.json({
                    note: 'This chain has been replaced',
                    chain: bitcoin.chain
                });
            };
        });
});

app.listen(port, function () {
    console.log(`listening on port ${port}..`);
});
const sha256 = require('sha256');
const uuid = require('uuid');
const express = require('express');
require('dotenv').config()
var app = express();
const port = process.argv[2];
function Blockchain() {
    this.chain = [];
    this.createNewBlock(1, '0');
};

Blockchain.prototype.createNewBlock = function (nonce, previousBlockHash) {
    var block = {
        index: this.chain.length + 1,
        timestamp: Date.now(),
        nonce: nonce,
        previousBlockHash: previousBlockHash
    };
    this.chain.push(block);
    return block;
}

Blockchain.prototype.getPreviousBlock = function () {
    return this.chain[this.chain.length - 1];
}

Blockchain.prototype.proofOfWork = function (previousProof) {
    let newProof = 1;
    let checkProof = false;
    while (checkProof === false) {
        let hashOperation = sha256((Math.pow(newProof, 2) - Math.pow(previousProof, 2)).toString());
        if (hashOperation.substring(0, 4) === "0000") {
            checkProof = true;
        } else {
            newProof++;
        }
    }
    return newProof;
}

Blockchain.prototype.hash = function (block) {
    let dataString = JSON.stringify(block);
    return sha256(dataString);
}

Blockchain.prototype.chainIsValid = function (chain) {
    let previousblock = this.chain[0];
    let blockindex = 1;
    while (blockindex < this.chain.length) {
        let block = this.chain[blockindex];
        if (block.previousBlockHash !== this.hash(previousblock)) {
            return false
        }
        previousproof = previousblock['nonce'];
        proof = block['nonce'];
        hashOperation = sha256(String(Math.pow(proof, 2) - Math.pow(previousproof, 2)));
        if (hashOperation.substring(0, 4) !== "0000") {
            return false
        }
        previousblock = block;
        blockindex += 1;
    }
    return true
}

blockchain = new Blockchain();
app.get('/mine_block', (req, res) => {
    previousblock = blockchain.getPreviousBlock();
    previousproof = previousblock['nonce'];
    proof = blockchain.proofOfWork(previousproof);
    previousHash = blockchain.hash(previousblock);
    block = blockchain.createNewBlock(proof, previousHash);
    response = {
        message: 'just mine a block',
        block
    };
    res.send(response);
});

app.get('/get_chain', (req, res) => {
    response = {
        len: blockchain['chain'].length,
        chain: blockchain['chain']
    }
    res.send(response);
});

app.get('/chain_is_valid', (req, res) => {
    var r = blockchain.chainIsValid(blockchain['chain']);
    if (r === true) {
        res.sendStatus(200);
    } else {
        res.sendStatus(404);
    }
});
app.listen(port, () => {
    console.log('Server Started listening on port', port);
});

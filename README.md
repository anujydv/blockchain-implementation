# BLOCKCHAIN-IMPLEMENTATION

## Description

---
>  This repository have three folder each folder contain same logic using different programing language (Python and Javascript). Repository contain different file's which by combining these any one analyse how blockchain work under the hood.

### HOW TO SETUP ENV AND RUN CODE ?
---
  + BLOCKCHAIN-A-Z (JAVASCRIPT)

    * ```cd BLOCKCHAIN-A-Z```
    * ```npm install```
    * ```npm run node_1``` &nbsp; start all five node[node_1, node_2, e.t.c] perform all below listed api

  + API
    * BASE URL &nbsp; &nbsp; ```http://localhost:3000/``` ports change as per running node
    * MINE BLOCK &nbsp; &nbsp; ```/mine_block```
    * GET CHAIN &nbsp; &nbsp; ```/get_chain```
    * CHAIN IS VALID &nbsp; &nbsp; ```/chain_is_valid```
---
  + BLOCKCHAIN-USING-JAVASCRIPT

    * ```cd BLOCKCHAIN-USING-JAVASCRIPT```
    * ```npm install```
    * ```npm run node_1``` &nbsp; start all five node[node_1, node_2, e.t.c] perform all below listed api

  + API
    * BASE URL &nbsp; &nbsp; ```http://localhost:3000/```
    * GET CHAIN &nbsp; &nbsp; ```/blockchain```
    * BROADCAST BLOCK OVER NETWORK &nbsp; &nbsp; ```/transaction/broadcast```
    * MINE BLOCK &nbsp; &nbsp; ```/mine```
    * RECEIVE NEW BLOCK FROM OTHER PEER &nbsp; &nbsp; ```/receive-new-block```
    * RECEIVE AND BROADCAST NEW BLOCK OVER OTHER PEER &nbsp; &nbsp; ```/register-add-brodcast-node```
    * ADD MORE NEW BLOCK INTO NETWORK &nbsp; &nbsp; ```/register-node```
    * ADD MORE THAN ONE NEW BLOCK INTO NETWORK &nbsp; &nbsp; ```/register-nodes-bulk```
    * APPLY CONSENSUS ALGORITHM &nbsp; &nbsp; ```/consensus```
---
  + BLOCKCHAIN-USING-PYTHON (python implementation on BLOCKCHAIN-A-Z inside create_blockchain folder)

    * ```cd BLOCKCHAIN-USING-PYTHON```
    * ```pip install -r requirements.txt```
    * ```python create_blockchain/blockchain.py```
  + API
    * BASE URL &nbsp; &nbsp; ```http://localhost:5000/```
    * Follow BLOCKCHAIN-A-Z (JAVASCRIPT) API routes

  **_Try create_cryptocurrency it help's to create own crypto currency_**
# Blockchain Implementation

A blockchain built from scratch to show how one works under the hood: blocks, hashing, proof-of-work, a peer-to-peer network of nodes, and a longest-chain consensus algorithm.

The same ideas are implemented three times, in JavaScript and Python:

| Folder | Language | What it covers |
|---|---|---|
| `BLOCKCHAIN-A-Z` | JavaScript | Minimal chain: mining, fetching and validating the chain |
| `BLOCKCHAIN-USING-JAVASCRIPT` | JavaScript | Multi-node network: transactions, broadcasting, node registration, consensus |
| `BLOCKCHAIN-USING-PYTHON` | Python | Python version of `BLOCKCHAIN-A-Z` (`create_blockchain`), plus a simple cryptocurrency (`create_cryptocurrency`) |

## How to run

### BLOCKCHAIN-A-Z (JavaScript)

```bash
cd BLOCKCHAIN-A-Z
npm install
npm run node_1   # node_1 … node_5 start the five nodes
```

Base URL: `http://localhost:3000/` (the port changes per node)

| Endpoint | Purpose |
|---|---|
| `/mine_block` | Mine a new block |
| `/get_chain` | Return the full chain |
| `/chain_is_valid` | Validate the chain |

### BLOCKCHAIN-USING-JAVASCRIPT

```bash
cd BLOCKCHAIN-USING-JAVASCRIPT
npm install
npm run node_1   # node_1 … node_5 start the five nodes
```

Base URL: `http://localhost:3000/`

| Endpoint | Purpose |
|---|---|
| `/blockchain` | Return the full chain |
| `/transaction/broadcast` | Create a transaction and broadcast it to the network |
| `/mine` | Mine a new block |
| `/receive-new-block` | Accept a block mined by another peer |
| `/register-add-brodcast-node` | Register a node and broadcast it to the network |
| `/register-node` | Register a single node |
| `/register-nodes-bulk` | Register several nodes at once |
| `/consensus` | Run the consensus algorithm (longest valid chain wins) |

### BLOCKCHAIN-USING-PYTHON

```bash
cd BLOCKCHAIN-USING-PYTHON
pip install -r requirements.txt
python create_blockchain/blockchain.py
```

Base URL: `http://localhost:5000/`. It uses the same routes as `BLOCKCHAIN-A-Z`.

Try `create_cryptocurrency` to build a simple cryptocurrency on top of the chain.

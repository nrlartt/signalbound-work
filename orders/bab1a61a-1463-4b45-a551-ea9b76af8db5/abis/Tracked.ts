export const abi = [
  {
    "name": "PairCreated",
    "type": "event",
    "inputs": [
      {
        "type": "address",
        "name": "token0",
        "indexed": true
      },
      {
        "type": "address",
        "name": "token1",
        "indexed": true
      },
      {
        "type": "address",
        "name": "pair"
      },
      {
        "type": "uint256",
        "name": "allPairsLength"
      }
    ]
  }
] as const;

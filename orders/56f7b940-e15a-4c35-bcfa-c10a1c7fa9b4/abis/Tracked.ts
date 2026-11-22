export const abi = [
  {
    "name": "Deposit",
    "type": "event",
    "inputs": [
      {
        "type": "address",
        "name": "dst",
        "indexed": true
      },
      {
        "type": "uint256",
        "name": "wad"
      }
    ]
  },
  {
    "name": "Withdrawal",
    "type": "event",
    "inputs": [
      {
        "type": "address",
        "name": "src",
        "indexed": true
      },
      {
        "type": "uint256",
        "name": "wad"
      }
    ]
  }
] as const;

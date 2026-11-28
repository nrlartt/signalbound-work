export const abi = [
  {
    "name": "OrderCancelled",
    "type": "event",
    "inputs": [
      {
        "type": "bytes32",
        "name": "orderHash"
      },
      {
        "type": "address",
        "name": "offerer",
        "indexed": true
      },
      {
        "type": "address",
        "name": "zone",
        "indexed": true
      }
    ]
  },
  {
    "name": "CounterIncremented",
    "type": "event",
    "inputs": [
      {
        "type": "uint256",
        "name": "newCounter"
      },
      {
        "type": "address",
        "name": "offerer",
        "indexed": true
      }
    ]
  }
] as const;

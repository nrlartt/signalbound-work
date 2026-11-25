export const abi = [
  {
    "name": "Attested",
    "type": "event",
    "inputs": [
      {
        "type": "address",
        "name": "recipient",
        "indexed": true
      },
      {
        "type": "address",
        "name": "attester",
        "indexed": true
      },
      {
        "type": "bytes32",
        "name": "uid"
      },
      {
        "type": "bytes32",
        "name": "schemaUID",
        "indexed": true
      }
    ]
  },
  {
    "name": "Revoked",
    "type": "event",
    "inputs": [
      {
        "type": "address",
        "name": "recipient",
        "indexed": true
      },
      {
        "type": "address",
        "name": "attester",
        "indexed": true
      },
      {
        "type": "bytes32",
        "name": "uid"
      },
      {
        "type": "bytes32",
        "name": "schemaUID",
        "indexed": true
      }
    ]
  }
] as const;

# sepolia-drip

sepolia-drip is a small open-source CLI that requests testnet ETH from multiple faucets on a schedule.

## Install

npm i -g sepolia-drip

## Quick start

Open question: where is the configuration file expected to live, and what command starts the scheduler?

## Configuration overview

sepolia-drip is configured through a YAML file. See docs/configuration.md for details on the faucets list, wallet address, schedule cron, and rate limits.

Open question: what is the default path for the configuration file, and how is an alternate path supplied?
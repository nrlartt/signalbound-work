# What is a nonce?

Target runtime: 20 seconds
Word count: 49

## Introduction
A nonce is the count of transactions your address has sent, starting at zero.

## Transaction order
Each new transaction must use the next number, so a stuck one blocks the ones after it, and you cannot skip ahead, and you must wait for the stuck one to clear before moving on.
# camelcase

Convert a string or an array of strings to camel case.

## How to run

Install dependencies:

```
npm install
```

Run the example entry point:

```
npm start
```

Run the tests:

```
npm test
```

## What the implementation cannot do

The specification leaves the following questions open, so the implementation does not define behaviour for them:

- The effect of the `locale` option is an open question.
- The effect of the `preserveConsecutiveUppercase` option is an open question.
- The behaviour for invalid input types (anything that is not a string or an array of strings) is an open question.

This project is written from the specification alone and makes no claim of parity with any other implementation.
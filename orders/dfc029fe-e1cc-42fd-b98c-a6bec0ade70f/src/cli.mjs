import { rleEncode, rleDecode } from './rle.mjs';

const encodeArg = process.argv[2];
const decodeArg = process.argv[3];

if (encodeArg) {
  try {
    const input = JSON.parse(encodeArg);
    console.log(JSON.stringify(rleEncode(input)));
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

if (decodeArg) {
  try {
    const input = JSON.parse(decodeArg);
    console.log(JSON.stringify(rleDecode(input)));
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

if (!encodeArg && !decodeArg) {
  console.log('Usage: node src/cli.mjs <encode-json> [decode-json]');
}

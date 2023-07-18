
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { decode } from '@onflow/fcl';
import type { NextApiRequest, NextApiResponse } from 'next'

const { SHA3 } = require("sha3");

var EC = require('elliptic').ec;

const ec = new EC('secp256k1');

const PRIVATE_KEY = process.env.PRIVATE_KEY ?? '';
console.log(PRIVATE_KEY)

const sign = (message: any) => {
  const key = ec.keyFromPrivate(Buffer.from(PRIVATE_KEY, "hex"));
  const sig = key.sign(hash(message)); // hashMsgHex -> hash
  const n = 32;
  const r = sig.r.toArrayLike(Buffer, "be", n);
  const s = sig.s.toArrayLike(Buffer, "be", n);
  return Buffer.concat([r, s]).toString("hex");
}

const hash = (message: any) => {
  const sha = new SHA3(256);
  sha.update(Buffer.from(message, "hex"));
  return sha.digest();
}

type Data = {
  signature?: any
  message?: any
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

  const { signable } = req.body;

  const { message } = signable;
  console.log(message, signable);
  const signature = sign(signable.message);
  res.json({
    signature: (signature as any)
  });
}

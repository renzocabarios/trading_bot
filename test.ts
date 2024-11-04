import { AnchorProvider, Program } from "@coral-xyz/anchor";
import { IDL } from "./idl";
import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
} from "@solana/web3.js";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";
import { base64, bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
import {
  ASSOCIATED_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
} from "@coral-xyz/anchor/dist/cjs/utils/token";

function readString(buffer: Buffer, offset: number): [string, number] {
  const length = buffer.readUInt32LE(offset); // Read the string length
  const start = offset + 4; // Move past the length

  const str = buffer.toString("utf-8", start, start + length); // Read the string
  return [str, start + length]; // Return the string and new offset
}

// Helper function to read a public key (32 bytes)
function readPublicKey(buffer: Buffer, offset: number): [PublicKey, number] {
  if (offset + 32 > buffer.length) {
    throw new RangeError("Invalid offset for publicKey");
  }

  const publicKeyBytes = buffer.slice(offset, offset + 32); // Extract 32 bytes
  const publicKey = new PublicKey(publicKeyBytes); // Convert to PublicKey
  return [publicKey, offset + 32]; // Return the public key and new offset
}

function decodeProgramData(buffer: Buffer) {
  let offset = 8;

  // Read the name (string)
  let [name, newOffset] = readString(buffer, offset);
  offset = newOffset;

  // Read the symbol (string)
  let [symbol, newOffset2] = readString(buffer, offset);
  offset = newOffset2;

  // Read the uri (string)
  let [uri, newOffset3] = readString(buffer, offset);
  offset = newOffset3;

  // Read the mint (publicKey)
  let [mint, newOffset4] = readPublicKey(buffer, offset);
  offset = newOffset4;

  // Read the bondingCurve (publicKey)
  let [bondingCurve, newOffset5] = readPublicKey(buffer, offset);
  offset = newOffset5;

  // Read the user (publicKey)
  let [user, newOffset6] = readPublicKey(buffer, offset);
  offset = newOffset6;

  // Return the decoded data
  return {
    name,
    symbol,
    uri,
    mint: mint.toBase58(),
    bondingCurve: bondingCurve.toBase58(),
    user: user.toBase58(),
  };
}

(async () => {
  const connection = new Connection("");

  connection.onLogs(
    new PublicKey("6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P"),
    (logs, context) => {
      const hasCreated = logs.logs.find((e) =>
        e.includes("Program log: Instruction: Create")
      );
      if (hasCreated) {
        // console.log(logs.signature);
        // console.log(logs);

        logs.logs.forEach((e) => {
          if (e.includes("Program data:")) {
            const encoded = e.split(": ")[1];
            let offset = 8;

            const fields = [
              ["name", "string"],
              ["symbol", "string"],
              ["uri", "string"],
              ["mint", "publicKey"],
              ["bondingCurve", "publicKey"],
              ["user", "publicKey"],
            ];

            let parsedData = {};
            const decoded = base64.decode(encoded);
            const decodedData = decodeProgramData(decoded);

            console.log(decodedData);
            const decodedKeypair = bs58.decode("");
            const keypair = Keypair.fromSecretKey(decodedKeypair);
            const mint = new PublicKey(decodedData.mint);

            const ata = PublicKey.createProgramAddressSync(
              [
                keypair.publicKey.toBuffer(),
                TOKEN_PROGRAM_ID.toBuffer(),
                mint.toBuffer(),
              ],
              ASSOCIATED_PROGRAM_ID
            );

            const amount = LAMPORTS_PER_SOL * 0.0001;

            console.log("Mint", mint.toString());
            console.log("My Kepair", keypair.publicKey.toString());
            console.log("My ATA", ata.toString());
          }
        });
      }
      //   logs.logs.forEach((e) => {
      //     if (e.includes("Program log: Instruction: Create")) {
      //       console.log(logs.signature);
      //       console.log(logs);
      //     }
      //     // console.log(e.includes("CreateEvent"));
      //   });
      //   console.log(context);
    }

    // {
    //   encoding: "jsonParsed",
    // }
  );
})();
// (async () => {
//   //   constructor(connection: Connection, wallet: Wallet, opts?: ConfirmOptions);

//   const decoded = bs58.decode(
//     "4LUipXXQAE8K2AzXQRsQ1QnwbubLKSvmZkomF2n6EtqihbthinBqdi84hCp9s8zfS2cHrYZMbaQg1TRMbM2tmrVj"
//   );
//   const keypai = Keypair.fromSecretKey(decoded);
//   const wallet = new NodeWallet(keypai);
//   const anchor = new AnchorProvider(connection, wallet);
//   // @ts-ignore
//   const program = new Program(IDL, anchor, {});
//   const subscriptionId = program.addEventListener("CreateEvent", (event) => {
//     console.log(event);

//     // Handle event...
//     // Handle event...
//   });
// })();

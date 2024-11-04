// import { AnchorProvider, Program } from "@coral-xyz/anchor";
// import { IDL } from "./idl";
// import { Connection, Keypair } from "@solana/web3.js";
// import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";
// import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";

// (async () => {
//   const connection = new Connection(
//   );

//   const decoded = bs58.decode(
//   );
//   const keypai = Keypair.fromSecretKey(decoded);
//   const wallet = new NodeWallet(keypai);
//   const anchor = new AnchorProvider(connection, wallet);
//   const program = new Program(IDL, anchor);
//   const subscriptionId = program.addEventListener(
//     "CreateEvent",
//     (event, a, v) => {
//       console.log(event);
//       console.log(a);
//       console.log(v);

//       // Handle event...
//       // Handle event...
//     }
//   );
// })();

import Poseidon from './crypto-primitives/Poseidon';
import MerkleCommitment from './crypto-primitives/MerkleCommitment';
import Schnorr from './crypto-primitives/Schnorr';
import Ed25519 from './crypto-primitives/Ed25519';
import AbelianGroup from './crypto-primitives/AbelianGroup';

export default function CryptoPrimitives() {
  return (
    <>
      <Poseidon />
      <MerkleCommitment />
      <Schnorr />
      <Ed25519 />
      <AbelianGroup />
    </>
  );
}

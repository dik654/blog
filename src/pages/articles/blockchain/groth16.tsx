import TrustedSetup from './groth16/TrustedSetup';
import Prove from './groth16/Prove';
import Verify from './groth16/Verify';

export default function Groth16() {
  return (
    <>
      <TrustedSetup />
      <Prove />
      <Verify />
    </>
  );
}

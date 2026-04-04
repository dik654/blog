import Overview from './poseidon-hash/Overview';
import Sponge from './poseidon-hash/Sponge';
import HADES from './poseidon-hash/HADES';
import SBoxMDS from './poseidon-hash/SBoxMDS';
import Poseidon2 from './poseidon-hash/Poseidon2';
import SecurityRescue from './poseidon-hash/SecurityRescue';

export default function PoseidonHash() {
  return (
    <>
      <Overview />
      <Sponge />
      <HADES />
      <SBoxMDS />
      <Poseidon2 />
      <SecurityRescue />
    </>
  );
}

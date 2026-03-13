import Overview from './poseidon-hash/Overview';
import SPNStructure from './poseidon-hash/SPNStructure';
import HadesSponge from './poseidon-hash/HadesSponge';

export default function PoseidonHash() {
  return (
    <div className="space-y-12">
      <Overview />
      <SPNStructure />
      <HadesSponge />
    </div>
  );
}

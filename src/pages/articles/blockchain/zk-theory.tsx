import Overview from './zk-theory/Overview';
import InteractiveProof from './zk-theory/InteractiveProof';
import SchnorrProtocol from './zk-theory/SchnorrProtocol';
import FiatShamir from './zk-theory/FiatShamir';
import CommitmentScheme from './zk-theory/CommitmentScheme';
import ProofSystems from './zk-theory/ProofSystems';

export default function ZKTheory() {
  return (
    <div className="space-y-12">
      <Overview />
      <InteractiveProof />
      <SchnorrProtocol />
      <FiatShamir />
      <CommitmentScheme />
      <ProofSystems />
    </div>
  );
}

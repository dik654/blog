import Overview from './vasp-custody-management/Overview';
import ColdWalletPolicy from './vasp-custody-management/ColdWalletPolicy';
import ProofOfReserves from './vasp-custody-management/ProofOfReserves';
import ExternalCustody from './vasp-custody-management/ExternalCustody';

export default function VaspCustodyManagement() {
  return (
    <div className="space-y-12">
      <Overview />
      <ColdWalletPolicy />
      <ProofOfReserves />
      <ExternalCustody />
    </div>
  );
}

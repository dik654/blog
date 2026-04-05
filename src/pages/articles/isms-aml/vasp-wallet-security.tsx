import Overview from './vasp-wallet-security/Overview';
import WalletArchitecture from './vasp-wallet-security/WalletArchitecture';
import AccessControl from './vasp-wallet-security/AccessControl';
import IncidentResponse from './vasp-wallet-security/IncidentResponse';

export default function VaspWalletSecurity() {
  return (
    <div className="space-y-12">
      <Overview />
      <WalletArchitecture />
      <AccessControl />
      <IncidentResponse />
    </div>
  );
}

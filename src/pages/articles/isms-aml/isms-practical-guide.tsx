import Overview from './isms-practical-guide/Overview';
import CryptoAuth from './isms-practical-guide/CryptoAuth';
import AccessDb from './isms-practical-guide/AccessDb';
import WebAppSecurity from './isms-practical-guide/WebAppSecurity';
import WalletOps from './isms-practical-guide/WalletOps';
import AuditEvidence from './isms-practical-guide/AuditEvidence';

export default function IsmsPracticalGuide() {
  return (
    <div className="space-y-12">
      <Overview />
      <CryptoAuth />
      <AccessDb />
      <WebAppSecurity />
      <WalletOps />
      <AuditEvidence />
    </div>
  );
}

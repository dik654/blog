import Overview from './isms-audit-checklist/Overview';
import ServerNetworkAudit from './isms-audit-checklist/ServerNetworkAudit';
import AccountAccessAudit from './isms-audit-checklist/AccountAccessAudit';
import LogBackupAudit from './isms-audit-checklist/LogBackupAudit';
import PrivacyWebAudit from './isms-audit-checklist/PrivacyWebAudit';

export default function IsmsAuditChecklist() {
  return (
    <div className="space-y-12">
      <Overview />
      <ServerNetworkAudit />
      <AccountAccessAudit />
      <LogBackupAudit />
      <PrivacyWebAudit />
    </div>
  );
}

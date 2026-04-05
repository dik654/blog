import Overview from './isms-overview/Overview';
import AssetRisk from './isms-overview/AssetRisk';
import ProtectionMeasures from './isms-overview/ProtectionMeasures';
import AuditRemediation from './isms-overview/AuditRemediation';

export default function IsmsOverview() {
  return (
    <div className="space-y-12">
      <Overview />
      <AssetRisk />
      <ProtectionMeasures />
      <AuditRemediation />
    </div>
  );
}

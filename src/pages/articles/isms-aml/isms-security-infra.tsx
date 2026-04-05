import Overview from './isms-security-infra/Overview';
import UtmFirewall from './isms-security-infra/UtmFirewall';
import IdsIps from './isms-security-infra/IdsIps';
import WafVpn from './isms-security-infra/WafVpn';
import SiemMonitoring from './isms-security-infra/SiemMonitoring';

export default function IsmsSecurityInfra() {
  return (
    <div className="space-y-12">
      <Overview />
      <UtmFirewall />
      <IdsIps />
      <WafVpn />
      <SiemMonitoring />
    </div>
  );
}

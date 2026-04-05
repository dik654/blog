import Overview from './isms-dev-security/Overview';
import WebSecurity from './isms-dev-security/WebSecurity';
import DeploymentSecurity from './isms-dev-security/DeploymentSecurity';

export default function IsmsDevSecurity() {
  return (
    <div className="space-y-12">
      <Overview />
      <WebSecurity />
      <DeploymentSecurity />
    </div>
  );
}

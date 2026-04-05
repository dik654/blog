import Overview from './isms-privacy-policy/Overview';
import ConsentManagement from './isms-privacy-policy/ConsentManagement';
import ThirdPartySharing from './isms-privacy-policy/ThirdPartySharing';
import CookiePolicy from './isms-privacy-policy/CookiePolicy';

export default function IsmsPrivacyPolicy() {
  return (
    <div className="space-y-12">
      <Overview />
      <ConsentManagement />
      <ThirdPartySharing />
      <CookiePolicy />
    </div>
  );
}

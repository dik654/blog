import Overview from './isms-privacy-lifecycle/Overview';
import RetentionPolicy from './isms-privacy-lifecycle/RetentionPolicy';
import SecureDeletion from './isms-privacy-lifecycle/SecureDeletion';
import PrivacyImpactAssessment from './isms-privacy-lifecycle/PrivacyImpactAssessment';

export default function IsmsPrivacyLifecycle() {
  return (
    <div className="space-y-12">
      <Overview />
      <RetentionPolicy />
      <SecureDeletion />
      <PrivacyImpactAssessment />
    </div>
  );
}

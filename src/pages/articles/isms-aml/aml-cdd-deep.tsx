import Overview from './aml-cdd-deep/Overview';
import IdentityVerification from './aml-cdd-deep/IdentityVerification';
import EnhancedDueDiligence from './aml-cdd-deep/EnhancedDueDiligence';
import TravelRule from './aml-cdd-deep/TravelRule';

export default function AmlCddDeep() {
  return (
    <div className="space-y-12">
      <Overview />
      <IdentityVerification />
      <EnhancedDueDiligence />
      <TravelRule />
    </div>
  );
}

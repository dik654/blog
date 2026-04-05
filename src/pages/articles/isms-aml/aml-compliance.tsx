import Overview from './aml-compliance/Overview';
import CddProcess from './aml-compliance/CddProcess';
import RiskBasedApproach from './aml-compliance/RiskBasedApproach';
import FdsAndStr from './aml-compliance/FdsAndStr';

export default function AmlCompliance() {
  return (
    <div className="space-y-12">
      <Overview />
      <CddProcess />
      <RiskBasedApproach />
      <FdsAndStr />
    </div>
  );
}

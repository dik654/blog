import Overview from './aml-rba-deep/Overview';
import RiskAssessmentProcess from './aml-rba-deep/RiskAssessmentProcess';
import ThreeLines from './aml-rba-deep/ThreeLines';
import DocumentationReview from './aml-rba-deep/DocumentationReview';

export default function AmlRbaDeep() {
  return (
    <div className="space-y-12">
      <Overview />
      <RiskAssessmentProcess />
      <ThreeLines />
      <DocumentationReview />
    </div>
  );
}

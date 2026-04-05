import Overview from './isms-incident-response/Overview';
import DetectionContainment from './isms-incident-response/DetectionContainment';
import RecoveryLessons from './isms-incident-response/RecoveryLessons';

export default function IsmsIncidentResponse() {
  return (
    <div className="space-y-12">
      <Overview />
      <DetectionContainment />
      <RecoveryLessons />
    </div>
  );
}

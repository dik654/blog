import Overview from './isms-access-control/Overview';
import NetworkSegmentation from './isms-access-control/NetworkSegmentation';
import DbAccessControl from './isms-access-control/DbAccessControl';

export default function IsmsAccessControl() {
  return (
    <div className="space-y-12">
      <Overview />
      <NetworkSegmentation />
      <DbAccessControl />
    </div>
  );
}

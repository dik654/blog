import Overview from './discrete-log/Overview';
import PowerTable from './discrete-log/PowerTable';
import BabyGiant from './discrete-log/BabyGiant';
import Applications from './discrete-log/Applications';

export default function DiscreteLog() {
  return (
    <div className="space-y-12">
      <Overview />
      <PowerTable />
      <BabyGiant />
      <Applications />
    </div>
  );
}

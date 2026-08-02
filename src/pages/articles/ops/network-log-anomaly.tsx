import Overview from './network-log-anomaly/Overview';
import Detection from './network-log-anomaly/Detection';
import Patterns from './network-log-anomaly/Patterns';

export default function NetworkLogAnomaly() {
  return (
    <>
      <Overview />
      <Detection />
      <Patterns />
    </>
  );
}

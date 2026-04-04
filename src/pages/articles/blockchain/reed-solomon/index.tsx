import Overview from './Overview';
import Encoding from './Encoding';
import ErrorCorrection from './ErrorCorrection';
import ZKConnection from './ZKConnection';

export default function ReedSolomon() {
  return (
    <div className="space-y-12">
      <Overview />
      <Encoding />
      <ErrorCorrection />
      <ZKConnection />
    </div>
  );
}

import Overview from './crt/Overview';
import NumericalExample from './crt/NumericalExample';
import CryptoUsage from './crt/CryptoUsage';

export default function CRT() {
  return (
    <div className="space-y-12">
      <Overview />
      <NumericalExample />
      <CryptoUsage />
    </div>
  );
}

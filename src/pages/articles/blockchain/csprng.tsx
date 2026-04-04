import Overview from './csprng/Overview';
import EntropySource from './csprng/EntropySource';
import Applications from './csprng/Applications';

export default function CSPRNG() {
  return (
    <div className="space-y-12">
      <Overview />
      <EntropySource />
      <Applications />
    </div>
  );
}

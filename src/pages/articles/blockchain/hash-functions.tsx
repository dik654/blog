import Overview from './hash-functions/Overview';
import SHA256Keccak from './hash-functions/SHA256Keccak';
import Security from './hash-functions/Security';

export default function HashFunctions() {
  return (
    <div className="space-y-12">
      <Overview />
      <SHA256Keccak />
      <Security />
    </div>
  );
}

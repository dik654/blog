import Overview from './elgamal/Overview';
import EncryptDecrypt from './elgamal/EncryptDecrypt';
import Security from './elgamal/Security';

export default function ElGamal() {
  return (
    <div className="space-y-12">
      <Overview />
      <EncryptDecrypt />
      <Security />
    </div>
  );
}

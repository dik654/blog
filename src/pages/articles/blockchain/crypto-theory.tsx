import Overview from './crypto-theory/Overview';
import DigitalSignature from './crypto-theory/DigitalSignature';
import KeyExchange from './crypto-theory/KeyExchange';
import ThresholdCrypto from './crypto-theory/ThresholdCrypto';

export default function CryptoTheory() {
  return (
    <div className="space-y-12">
      <Overview />
      <DigitalSignature />
      <KeyExchange />
      <ThresholdCrypto />
    </div>
  );
}

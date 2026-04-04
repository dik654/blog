import Overview from './hw-security/Overview';
import MemoryEncryption from './hw-security/MemoryEncryption';
import RemoteAttestation from './hw-security/RemoteAttestation';
import SecureBoot from './hw-security/SecureBoot';

export default function HwSecurityArticle() {
  return (
    <>
      <Overview />
      <MemoryEncryption />
      <RemoteAttestation />
      <SecureBoot />
    </>
  );
}

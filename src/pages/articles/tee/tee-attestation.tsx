import Overview from './tee-attestation/Overview';
import Local from './tee-attestation/Local';
import Remote from './tee-attestation/Remote';
import IasDcap from './tee-attestation/IasDcap';

export default function TeeAttestationArticle() {
  return (
    <>
      <Overview />
      <Local />
      <Remote />
      <IasDcap />
    </>
  );
}

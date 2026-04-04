import Overview from './intel-tdx/Overview';
import TdModule from './intel-tdx/TdModule';
import Memory from './intel-tdx/Memory';
import Attestation from './intel-tdx/Attestation';

export default function IntelTdxArticle() {
  return (
    <>
      <Overview />
      <TdModule />
      <Memory />
      <Attestation />
    </>
  );
}

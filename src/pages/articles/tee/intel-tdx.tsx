import Overview from './intel-tdx/Overview';
import SeamModule from './intel-tdx/SeamModule';
import LifecycleAbi from './intel-tdx/LifecycleAbi';
import Memory from './intel-tdx/Memory';
import Tdvmcall from './intel-tdx/Tdvmcall';
import Attestation from './intel-tdx/Attestation';
import Partitioning from './intel-tdx/Partitioning';
import Attacks from './intel-tdx/Attacks';

export default function IntelTdxArticle() {
  return (
    <>
      <Overview />
      <SeamModule />
      <LifecycleAbi />
      <Memory />
      <Tdvmcall />
      <Attestation />
      <Partitioning />
      <Attacks />
    </>
  );
}

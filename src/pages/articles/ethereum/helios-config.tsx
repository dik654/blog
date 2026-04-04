import Overview from './helios-config/Overview';
import NetworkConfig from './helios-config/NetworkConfig';
import Persistence from './helios-config/Persistence';
import ClientInit from './helios-config/ClientInit';

export default function HeliosConfig() {
  return (
    <>
      <Overview onCodeRef={() => {}} />
      <NetworkConfig title="네트워크 + 합의 스펙 + RPC" onCodeRef={() => {}} />
      <ClientInit title="build() 초기화 + FileDB + Multi-RPC" onCodeRef={() => {}} />
      <Persistence title="FileDB + MultiRpc 전략" onCodeRef={() => {}} />
    </>
  );
}

import type { CodeRef } from '@/components/code/types';
import NetworkConfigViz from './viz/NetworkConfigViz';

interface Props { title: string; onCodeRef: (key: string, ref: CodeRef) => void }

export default function NetworkConfig({ title, onCodeRef: _onCodeRef }: Props) {
  return (
    <section id="network-config" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Network enum은 Mainnet, Sepolia, Holesky 세 변형을 갖는다.
          각 variant를 선택하면 genesis_validators_root, fork_versions,
          기본 체크포인트가 자동으로 결정된다.
        </p>
        <p>
          ConsensusSpec은 CL 고유 파라미터다.
          slots_per_epoch(32), epochs_per_period(256)로 Sync Committee 교체 주기를 계산한다.
          Helios가 CL을 직접 구현하기 때문에 필수 — Reth(EL)에는 이 구조체가 없다.
        </p>
        <p>
          RPC 엔드포인트는 두 개가 필요하다.
          consensus_rpc는 Beacon API 서버, execution_rpc는 JSON-RPC 서버를 가리킨다.
        </p>
      </div>

      {/* Viz: Network enum → ConsensusSpec → RPC 연결 */}
      <div className="not-prose my-8">
        <NetworkConfigViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>{'💡'} 네트워크 불일치 시</strong><br />
          genesis_validators_root가 다르면 BLS 도메인 계산이 달라진다.
          잘못된 네트워크를 선택하면 서명 검증 실패 → 부트스트랩이 멈춘다.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>{'💡'} Reth 비교</strong><br />
          Reth는 자체 API를 호스팅한다 (EL: 8545, Engine: 8551).
          Helios는 외부 RPC에 의존하므로 RPC 제공자의 가용성이 곧 Helios의 가용성이다.
        </p>
      </div>
    </section>
  );
}

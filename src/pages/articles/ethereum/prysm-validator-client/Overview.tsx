import ContextViz from './viz/ContextViz';
import ValidatorClientViz from './viz/ValidatorClientViz';
import type { CodeRef } from '@/components/code/types';

export default function Overview({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">검증자 클라이언트 구조</h2>
      <div className="not-prose mb-8"><ContextViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          이 아티클에서는 검증자 클라이언트의 슬롯 틱 루프, 역할 분배, 슬래싱 보호 메커니즘을 코드 수준으로 추적한다.
        </p>

        {/* ── Validator Client 분리 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Validator Client — beacon-chain과 분리 프로세스</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Prysm의 2-binary 구조:
//
// beacon-chain (노드):
// - P2P 네트워킹, state 관리, fork choice
// - validator 키 보유 안 함
// - 보안에 덜 민감
//
// validator (검증자 클라이언트):
// - validator 개인키 보유
// - attestation/block 서명
// - slashing protection DB
// - beacon-chain에 gRPC 연결
// - 보안 critical

// 분리의 이점:
// 1. 키 노출 최소화
//    - beacon-chain에 키 없음 → P2P/RPC 공격 무력
//    - validator만 보호하면 됨
//
// 2. 독립 스케일링
//    - 1개 beacon-chain ↔ N개 validator
//    - 여러 validator fleet 운영 가능
//
// 3. 키 관리 유연성
//    - validator 프로세스만 재시작 가능
//    - beacon-chain 유지보수 중에도 서명 가능 (다른 peer 이용)
//
// 4. Remote signer 통합
//    - validator ↔ Web3Signer (분리된 서명 서비스)
//    - 하드웨어 wallet 통합 가능

// Prysm 실행:
// beacon-chain --execution-endpoint=http://localhost:8551 ...
// validator --beacon-rpc-provider=localhost:4000 ...

// 네트워크 아키텍처:
// EL (Reth) ← Engine API → beacon-chain ← gRPC → validator
// (port 8551)                                (port 4000)`}
        </pre>
        <p className="leading-7">
          Prysm은 <strong>2-binary 분리 구조</strong>.<br />
          beacon-chain(노드) + validator(키 관리) → 보안 격리.<br />
          독립 scaling, remote signer, 유지보수 유연성 확보.
        </p>
      </div>
      <div className="not-prose mt-6"><ValidatorClientViz /></div>
    </section>
  );
}

import BridgeAssemblyViz from './viz/BridgeAssemblyViz';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function BridgeAssembly({ onCodeRef }: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  const open = (key: string) => onCodeRef(key, codeRefs[key]);
  return (
    <section id="bridge-assembly" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Bridge 예제: 프리미티브 조립 실전</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          <code>examples/bridge</code> — Commonware 프리미티브를 모두 조합한 실전 예제
          <br />
          두 네트워크 간 합의 인증서를 교환하는 브릿지 밸리데이터
        </p>
        <p className="leading-7">
          사용 프리미티브: <strong>simplex</strong>(합의) + <strong>authenticated</strong>(P2P)
          + <strong>bls12381</strong>(임계 서명) + <strong>ed25519</strong>(피어 인증)
          <br />
          Anti-Framework 패턴 핵심 — 필요한 것만 선택, 나머지는 직접 구현
        </p>
        <p className="leading-7">
          아래 StepViz가 <code>validator.rs</code>의 조립 과정을 단계별로 추적
        </p>
      </div>
      <div className="not-prose mb-8">
        <BridgeAssemblyViz onOpenCode={open} />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">

        <h3 className="text-xl font-semibold mt-6 mb-3">Bridge Architecture</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// Cross-chain bridge using Commonware

// Components
// - Source chain: 원본 state
// - Destination chain: 미러 state
// - Bridge validators: commit proofs

// Simplex consensus on bridge validators
// - They vote on source chain state
// - Threshold signature as proof
// - Destination verifies threshold sig

// Validator code skeleton
pub struct BridgeValidator {
    ctx: Context,
    identity: Ed25519Keypair,
    bls_share: BlsShare,
    consensus: SimplexConsensus,
    p2p: AuthenticatedP2P,
    source_client: SourceChainClient,
    dest_client: DestChainClient,
}

impl BridgeValidator {
    pub async fn run(&mut self) {
        // 1) Connect to other validators
        self.p2p.connect_peers().await;

        // 2) Watch source chain
        while let Some(block) = self.source_client.next_block().await {
            // 3) Propose to consensus
            let proposal = StateProposal {
                chain_id: SOURCE,
                block_hash: block.hash,
                height: block.number,
            };

            // 4) Reach consensus (simplex)
            let committed = self.consensus.propose(proposal).await?;

            // 5) Generate threshold signature
            let partial_sig = self.bls_share.sign(&committed.digest());
            let agg_sig = self.collect_signatures(partial_sig).await?;

            // 6) Submit to destination chain
            self.dest_client.submit_proof(committed, agg_sig).await?;
        }
    }
}

// Security assumptions
// - 2/3+ bridge validators honest
// - Source/dest chains safe
// - No offline attacks on shared key`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">왜 Commonware로 Bridge 구축</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// 장점 (vs custom 구현)

// 1) Battle-tested primitives
//    - Simplex: deterministic sim 검증
//    - BLS: audited cryptography
//    - P2P: authenticated channels

// 2) Modularity
//    - 원하는 부분만 사용
//    - 다른 consensus로 쉽게 교체
//    - Ed25519 대신 ECDSA 가능

// 3) Deterministic testing
//    - Cross-chain failure scenarios
//    - Byzantine validator testing
//    - Replay attack simulation

// 4) Upgrade path
//    - Primitive update는 library level
//    - Fork 불필요

// vs 대안 프레임워크
// Cosmos SDK:
//   - Full stack (대부분 불필요)
//   - IBC 내장 (but specific)
//   - Fork 어려움

// Axelar / LayerZero:
//   - Closed-source partial
//   - Proprietary protocols
//   - Limited customization

// Commonware:
//   - Open-source all components
//   - Minimal footprint
//   - Direct Rust integration`}</pre>

      </div>
    </section>
  );
}

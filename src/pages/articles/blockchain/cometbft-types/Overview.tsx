import ContextViz from './viz/ContextViz';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function Overview({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">핵심 타입 전체 구조</h2>
      <div className="not-prose mb-8">
        <ContextViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          CometBFT의 합의 메시지(블록 제안, 투표, 커밋)는 모두 <code>types/</code> 패키지의 Go 구조체로 정의된다.<br />
          이 아티클에서는 Block, Vote, ValidatorSet, Evidence의 내부 필드와 핵심 함수를 코드 수준으로 추적한다.
        </p>

        {/* ── types 패키지 구조 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">types 패키지 — 합의 메시지의 타입 계층</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// cometbft/types/ 패키지 구조
types/
├── block.go               // Block, Header, Data, EvidenceData
├── block_meta.go          // BlockMeta (블록 요약)
├── part_set.go            // PartSet (블록 분할 전파)
├── proposal.go            // Proposal (블록 제안)
├── vote.go                // Vote (투표)
├── vote_set.go            // VoteSet (투표 집계)
├── validator.go           // Validator (단일 검증자)
├── validator_set.go       // ValidatorSet (검증자 목록)
├── evidence.go            // Evidence (비잔틴 증거)
├── canonical.go           // CanonicalVote (서명 대상)
├── genesis.go             // GenesisDoc (제네시스 정보)
├── params.go              // ConsensusParams
└── protobuf.go            // protobuf 변환

// 합의 메시지 레이어:
// 1. Block (블록 단위)
//    - Header: 메타데이터
//    - Data: transactions
//    - Evidence: slashing 증거
//    - LastCommit: 이전 블록 투표 집계
// 2. Proposal (리더가 만드는 블록 제안)
// 3. Vote (각 검증자가 서명한 투표)
//    - Prevote: 블록 수용 여부
//    - Precommit: 최종 커밋 투표

// Protobuf-based 직렬화:
// - CometBFT는 Protobuf 3 사용
// - Ethereum은 SSZ, Bitcoin은 bespoke binary
// - gRPC native 지원

// 왜 Protobuf?
// - Tendermint Go 생태계 기본 선택
// - Go codegen 도구 성숙
// - ABCI 앱과 protobuf 공유
// - 스키마 evolution 지원`}
        </pre>
        <p className="leading-7">
          <code>types</code> 패키지는 <strong>합의 메시지 전체의 타입 정의</strong>.<br />
          Block/Vote/Validator 등 13개 파일로 계층 구성.<br />
          Protobuf 직렬화 → ABCI 앱과 호환 + gRPC native.
        </p>

        {/* ── Tendermint BFT 메시지 흐름 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Tendermint BFT 메시지 흐름</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 1 round of consensus (3-phase commit):
//
// Round R, Height H:
//
// Step 1: Propose
//   Proposer (round-robin) → 모든 validator
//   Message: Proposal(block, block_parts)
//
// Step 2: Prevote
//   모든 validator → 모든 validator
//   Message: Vote(type=Prevote, block_hash or nil)
//   2/3+ 수집 → "polka" 달성
//
// Step 3: Precommit
//   모든 validator → 모든 validator
//   Message: Vote(type=Precommit, block_hash or nil)
//   2/3+ 수집 → "commit" → 블록 finalize
//
// Step 4: Commit (새 높이)
//   NewRoundStep 시작
//   H += 1, R = 0
//
// 타이밍:
// - propose timeout: 3초 (+라운드별 증가)
// - prevote timeout: 1초
// - precommit timeout: 1초
// - commit timeout: 1초

// Round 실패 → R += 1 → re-propose
// 목적: 네트워크 지연/장애로 timeout 시 재시도

// 최종성 보장:
// +2/3 Precommit 수집 → 블록 irreversible
// 이더리움 Casper와 달리 단일 슬롯 finality`}
        </pre>
        <p className="leading-7">
          Tendermint BFT는 <strong>3-phase commit</strong> — Propose/Prevote/Precommit.<br />
          각 round에서 모든 메시지 수집 후 다음 단계 진전.<br />
          +2/3 Precommit = 블록 즉시 최종성 (이더리움 대비 강점).
        </p>
      </div>
    </section>
  );
}

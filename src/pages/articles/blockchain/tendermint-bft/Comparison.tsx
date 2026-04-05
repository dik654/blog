export default function Comparison() {
  const rows = [
    { prop: '정상 경로', pbft: 'O(n²)', tm: 'O(n²)', note: '동일' },
    { prop: 'View Change', pbft: 'O(n³)', tm: 'O(n²) 자동', note: 'Tendermint 단순' },
    { prop: '확정 지연', pbft: '5 delays', tm: '4 delays', note: '1 delay 절감' },
    { prop: '확정성', pbft: '즉시', tm: '즉시', note: '동일' },
    { prop: '구현 복잡도', pbft: '높음', tm: '중간', note: '라운드 기반 단순화' },
  ];

  return (
    <section id="comparison" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">PBFT vs Tendermint 비교</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-4 py-2 text-left">속성</th>
                <th className="border border-border px-4 py-2 text-left">PBFT</th>
                <th className="border border-border px-4 py-2 text-left">Tendermint</th>
                <th className="border border-border px-4 py-2 text-left">비고</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.prop}>
                  <td className="border border-border px-4 py-2 font-medium">{r.prop}</td>
                  <td className="border border-border px-4 py-2">{r.pbft}</td>
                  <td className="border border-border px-4 py-2">{r.tm}</td>
                  <td className="border border-border px-4 py-2 text-muted-foreground">{r.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── View Change 비교 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">View Change 메커니즘 비교</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// PBFT View Change:
//
// 1. Replica가 timeout 감지
// 2. VIEW-CHANGE 메시지 broadcast
//    - 모든 prepared proofs 포함 (O(n))
// 3. 2f+1 VIEW-CHANGE 수집
// 4. New primary가 NEW-VIEW 구성
//    - V = VIEW-CHANGE set (O(n²) size)
//    - O = new PRE-PREPARE set
// 5. NEW-VIEW broadcast
//    - 전체 V 포함 → O(n²) per msg
//    - to n nodes → O(n³) total
//
// 비용: O(n³) per view change
// 지연: 명시적 3-round 프로토콜

// Tendermint "view change" (implicit):
//
// 1. timeout 시 round++
// 2. 새 proposer 자동 선정 ((H+R) mod n)
// 3. 새 propose round 시작
// 4. POL round로 이전 polka 전달
//
// 비용: O(n²) per round (normal protocol)
// 지연: 1 round만 추가 (timeout 기반)

// 왜 Tendermint가 단순한가:
// - explicit view change 메시지 없음
// - round가 view 역할
// - proposer 선정 deterministic
// - POL로 prepared 상태 전달

// 단점 (Tendermint):
// - timeout 의존적
// - proposer가 실패하면 매 round timeout
// - 연속 실패 시 지연 누적`}
        </pre>
        <p className="leading-7">
          PBFT view change = <strong>explicit + O(n³)</strong>.<br />
          Tendermint view change = <strong>implicit (round++) + O(n²)</strong>.<br />
          Tendermint는 blockchain 맥락에서 단순화.
        </p>

        {/* ── ABCI 분리 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">ABCI: 합의와 애플리케이션 분리</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// ABCI (Application Blockchain Interface):
//
// 개념:
// - Tendermint Core = consensus engine
// - Application = state machine
// - 두 레이어 사이 인터페이스
//
// Tendermint 책임:
// - P2P networking
// - Consensus (Propose/Prevote/Precommit/Commit)
// - Block propagation
// - Mempool management
// - Validator set 추적
//
// Application 책임:
// - TX validation (CheckTx)
// - State transition (DeliverTx)
// - State commit (Commit)
// - Query handling (Query)
//
// ABCI 메서드 (v0.34):
// - InitChain: 초기 state
// - BeginBlock: block 처리 시작
// - CheckTx: mempool 검증
// - DeliverTx: TX 실행
// - EndBlock: validator 변경
// - Commit: state hash 반환
// - Query: state 조회
//
// ABCI++ (v0.37+):
// - PrepareProposal: block 조립
// - ProcessProposal: block 검증
// - ExtendVote: vote extension
// - VerifyVoteExtension: extension 검증
// - FinalizeBlock: 실행 (BeginBlock + DeliverTx + EndBlock 통합)

// 분리의 이점:
//
// 1. 언어 자유:
//    - Tendermint는 Go
//    - App은 any language (gRPC)
//    - Cosmos SDK: Go
//    - CosmWasm: Rust
//    - EVM: Go/Rust
//
// 2. 재사용성:
//    - 같은 consensus engine이 여러 app 구동
//    - Cosmos Hub, Osmosis, dYdX 모두 Tendermint
//
// 3. 업그레이드 독립성:
//    - consensus 업그레이드 없이 app 수정
//    - app 변경 없이 consensus 최적화

// 단점:
// - RPC 오버헤드 (Tendermint ↔ App)
// - 성능 제약 (typically 10-20K TPS)
// - 복잡도 (두 프로세스 관리)`}
        </pre>
        <p className="leading-7">
          ABCI = <strong>consensus와 state machine 완전 분리</strong>.<br />
          App은 어떤 언어든 가능 — gRPC over socket.<br />
          Cosmos 생태계의 다양성 원천 (Go, Rust, EVM 모두 가능).
        </p>

        {/* ── CometBFT와의 관계 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">CometBFT와의 관계</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Tendermint Core → CometBFT 전환:
//
// 2014-2019: Tendermint Inc. 개발
// 2019-2022: Interchain Foundation 관리
// 2023: Informal Systems가 fork → CometBFT
//
// 이유:
// - Tendermint Inc. 재정 문제
// - 커뮤니티 ownership 필요
// - 지속적 개발 보장
//
// CometBFT 개선사항:
// - ABCI++ (v0.38+)
// - Vote extensions
// - Dynamic gas
// - Performance optimization
// - Better metrics
// - 1ms block times (parameter tunable)

// Cosmos SDK와 통합:
// - SDK v0.50: CometBFT 기반
// - ABCI 2.0 (FinalizeBlock)
// - vote extension 지원
//
// 성능 (실제 배포):
// - Cosmos Hub: 6s block time, ~10K TPS
// - Osmosis: 6s block time, 지속 가능
// - dYdX v4: 1s block time, 100K+ orders/s
// - Celestia: 15s block time, huge blocks

// validator 수 제약:
// - 100-200이 sweet spot
// - 300+ = 성능 저하
// - 500+ = 거의 불가능 (O(n²) 때문)

// Cosmos 생태계 현재 (2026 기준):
// - 50+ active chains
// - IBC로 상호 연결
// - Interchain Security (shared security)
// - CometBFT가 거의 표준`}
        </pre>
        <p className="leading-7">
          CometBFT = <strong>Informal Systems가 관리하는 Tendermint fork</strong>.<br />
          ABCI++, vote extensions 등 현대적 기능 추가.<br />
          Cosmos SDK v0.50+와 통합 — 현재 업계 표준.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 왜 Tendermint가 Paxos/PBFT 넘어 블록체인 표준이 됐나</strong> — ABCI.<br />
          consensus와 app 분리 = 생태계 효과.<br />
          PBFT는 "service" 모델, Tendermint는 "platform" 모델.<br />
          Cosmos Hub 하나의 성공이 100+ chain을 만든 기반.
        </p>
      </div>
    </section>
  );
}

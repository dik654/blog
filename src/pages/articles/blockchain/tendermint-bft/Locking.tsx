import LockingViz from './viz/LockingViz';
import { CitationBlock } from '@/components/ui/citation';

export default function Locking() {
  return (
    <section id="locking" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Polka 잠금 메커니즘</h2>
      <div className="not-prose mb-8"><LockingViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <CitationBlock source="Buchman — Tendermint 논문 §2.3" citeKey={2} type="paper">
          <p className="italic">
            "Once a validator sees a polka for block B, it locks on B and will only precommit B in future rounds until it sees a polka for a different block at a higher round."
          </p>
        </CitationBlock>

        {/* ── Locking 필요성 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">왜 Locking이 필요한가</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Locking 없는 시나리오 (safety violation):
//
// Round 0:
//   proposer A가 block B1 제안
//   validators: polka(B1) 보고 precommit(B1)
//   정족수 미달 (network delay)
//   validators 일부만 precommit(B1) 받음
//
// Round 1:
//   proposer B가 block B2 제안 (다른 block!)
//   validators: polka(B1) 잊고 precommit(B2)
//   정족수 달성 → commit(B2)
//
//   but: 일부는 round 0에서 commit(B1) 가능
//     (2/3+ precommit(B1) 받은 경우)
//
// → 같은 height에 B1, B2 둘 다 committed!
// → Safety 위반

// Locking 해결:
//
// Round 0:
//   polka(B1) 봄 → lock(B1, round=0)
//   precommit(B1)
//   정족수 미달 (network delay)
//
// Round 1:
//   proposer B가 B2 제안
//   but locked on B1 → precommit(lockedValue=B1)
//   or prevote(B1) if no B2 polka
//
//   B2 polka 못 받음 (lock 때문에 B2에 vote 안 함)
//   → round 2로 진행
//
// → safety 유지

// Locking rule:
// 1. polka 보면 lock
// 2. locked 값은 precommit에서 우선
// 3. 다음 round에서도 lockedValue만 support
// 4. unlock 조건: 더 높은 round의 다른 polka

// Lock 상태:
// - lockedRound: 언제 lock 됐는지
// - lockedValue: 어떤 block에 lock 됐는지
// - 초기: (-1, nil)`}
        </pre>
        <p className="leading-7">
          Locking의 목적: <strong>view change 간 safety 유지</strong>.<br />
          이전 round의 polka를 다음 round에서도 존중.<br />
          PBFT의 "prepared" 상태와 본질적으로 동일.
        </p>

        {/* ── Unlock 조건 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Unlock 조건 (Liveness)</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Unlock 없으면 deadlock 가능:
//
// Round 0:
//   validator A, B, C: lock on B1
//   validator D: lock on B2 (equivocation by proposer)
//
// Round 1, 2, ...:
//   A, B, C: precommit(B1)
//   D: precommit(B2)
//   → 2/3 못 맞춤 영원히!
//
// 해결: Unlock 조건

// Unlock 규칙 (POL: Proof of Lock):
//
// 새 proposal의 pol_round >= lockedRound 이면:
//   - 이전 round에서 이 block이 polka 받았음
//   - 안전하게 unlock 가능
//   - 새 block으로 prevote

// Proposer의 책임:
// - 자신이 locked on B일 때 B 재제안
// - 또는 더 최근 polka를 가진 block 제안
// - proposal.pol_round로 증명

// 예시:
// Round 0: polka(B1), A locked on (0, B1)
// Round 1: proposer가 B2 제안, pol_round = ?
//   - pol_round = -1: A는 B2에 prevote 안 함
//   - pol_round = 0 + B2 polka at round 0: A가 B2 polka 증거 봄 → unlock
//
// 증거 교환:
// - A, B, C가 round 0의 polka(B2)를 gossip
// - 서로 다른 block 2/3+ polka 불가능
//   (safety by intersection)
// - 따라서 round 0에서 polka(B1)와 polka(B2) 동시 불가
// - 즉 A가 lock on B1이면 B2 polka 못 봄
//
// Liveness 달성:
// - 정직 proposer가 정직 block 재제안
// - GST 이후 timeout 충분 → polka 형성
// - 2/3+ locked on same block → commit

// Deadlock 회피:
// - Byzantine이 1/3 미만이면
// - 정직 2/3+가 eventually 같은 block에 lock
// - safety + liveness 모두 만족`}
        </pre>
        <p className="leading-7">
          Unlock = <strong>더 최근 polka 증거 봤을 때</strong>.<br />
          pol_round ≥ lockedRound이면 이전 polka 존재 증거.<br />
          proposer가 POL로 증명 제공 → 다른 validator unlock 허용.
        </p>

        {/* ── Formal proof sketch ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Safety 증명 sketch</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Safety: 같은 height에 두 다른 block commit 불가능
//
// 가정:
// round r1에서 block B1 commit
// round r2에서 block B2 commit (r2 > r1, B1 ≠ B2)
//
// 목표: 모순 도출
//
// r1에서 commit 조건:
// 2/3+ precommit(B1) at round r1
// → 2/3+ validator가 locked on (r1, B1)
// → 2/3+ have lockedValue = B1, lockedRound = r1
//
// Round r1+1에 대해:
// 2/3+ locked on B1
// → prevote(B1) 또는 prevote(lockedValue)
// → 2/3+ prevote for same B1 가능
// → polka(B1) 지속
//
// Round r2 ≥ r1+1에서:
// B2가 commit 되려면 polka(B2) 필요
// → 2/3+ prevote(B2)
// → 2/3+ unlock from B1
// → unlock 조건: pol_round >= r1 + polka(B2) 증거
//
// 하지만:
// round r1+1, r1+2, ... 에서 polka(B2) 가능?
// 2/3+ locked on B1 → 그들은 prevote(B1)
// 나머지 1/3 미만 → polka(B2) 불가능!
//
// → Unlock 조건 성립 불가
// → B2 commit 불가
// → 모순
//
// 결론: r1에서 B1 commit → 이후 다른 block commit 불가
// Safety 증명 완료

// 핵심:
// 1. 2/3+ lock은 "과반수 고정"
// 2. 나머지 1/3는 polka 형성 불가
// 3. locked 상태는 이후 round에 전파
// 4. 서로 다른 commit 불가능`}
        </pre>
        <p className="leading-7">
          Safety 증명 핵심: <strong>2/3+ lock은 과반수 고정</strong>.<br />
          나머지 1/3은 polka 형성 불가 → 다른 block commit 불가.<br />
          Tendermint safety의 수학적 기반.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">잠금 규칙</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-1">잠금 획득</p>
            <p className="text-sm">
              +2/3 Prevote(B) 수신(Polka) 시 블록 B에 잠금.<br />
              lockedRound = 현재 라운드, lockedValue = B
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-1">잠금 해제</p>
            <p className="text-sm">
              더 높은 라운드에서 다른 블록 B'에 대한 Polka 관찰 시.<br />
              lockedRound과 validRound 비교로 안전하게 전환
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-1">Safety 보장</p>
            <p className="text-sm">
              잠긴 노드는 해당 블록만 Precommit 가능.<br />
              2/3 이상이 같은 블록에 잠기면 분기 불가능
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-1">Liveness 보장</p>
            <p className="text-sm">
              잠금 해제가 가능하므로 교착 상태 없음.<br />
              GST 이후 정직 제안자가 잠긴 블록 재제안
            </p>
          </div>
        </div>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 Locking vs Unlock 균형</strong> — safety/liveness 절충.<br />
          Lock이 너무 강하면 deadlock (liveness 위협).<br />
          Lock이 너무 약하면 fork (safety 위협).<br />
          POL round 메커니즘이 둘 다 보장 — Tendermint의 핵심 기여.
        </p>
      </div>
    </section>
  );
}

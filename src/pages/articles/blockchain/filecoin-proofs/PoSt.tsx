import { CodeViewButton } from "@/components/code";
import { codeRefs } from "./codeRefs";
import type { CodeRef } from "@/components/code/types";

export default function PoSt({
  title,
  onCodeRef,
}: {
  title?: string;
  onCodeRef?: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="post" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        {title ?? "PoSt — 시공간 저장 증명"}
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>PoSt</strong>(Proof of Spacetime)는 PoRep로 봉인한 섹터가 이후에도 실제로 남아 있는지
          반복해서 확인합니다. 네트워크는 예측하기 어려운 챌린지로 일부 Merkle leaf를 지정하고, 저장 제공자는 해당
          경로를 열어 commitment와 일치한다는 proof를 제출합니다.
        </p>
        <p>
          이때 <strong>WindowPoSt</strong>는 모든 활성 섹터의 storage power를 주기적으로 갱신하고,
          <strong> WinningPoSt</strong>는 블록 생산자로 선택된 제공자가 즉시 저장 상태를 입증하도록 합니다. 두
          방식은 검증 대상과 시간 제약이 다르지만, 챌린지에서 Merkle path를 만들고 SNARK로 압축한다는 기반은
          공유합니다.
        </p>
        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton
              onClick={() => onCodeRef("window-post", codeRefs["window-post"])}
            />
            <span className="text-xs text-muted-foreground self-center">
              window_post.rs
            </span>
            <CodeViewButton
              onClick={() =>
                onCodeRef("fallback-vanilla", codeRefs["fallback-vanilla"])
              }
            />
            <span className="text-xs text-muted-foreground self-center">
              vanilla.rs
            </span>
          </div>
        )}
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>{"💡"} Poseidon을 쓰는 이유</strong>는 BLS12-381 scalar field 위에서 효율적으로 계산할 수
          있기 때문입니다. 일반 코드에서 익숙한 SHA-256보다 증명 회로의 constraint를 적게 사용하므로 Merkle path를
          SNARK 안에서 검증하기에 유리합니다.
        </p>

        {/* ── PoSt 상세 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">PoSt 메커니즘 상세</h3>

        {/* ── WindowPoSt vs WinningPoSt ── */}
        <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          <div className="rounded-lg border border-sky-500/30 bg-sky-500/5 p-4">
            <p className="text-sm font-bold text-sky-400 mb-2">
              WindowPoSt (24h 주기)
            </p>
            <ul className="text-sm space-y-1 text-foreground/80">
              <li>모든 active sectors 대상</li>
              <li>proof type이 정한 partition 단위로 분할</li>
              <li>
                <strong>10 random challenges</strong> per sector
              </li>
              <li>
                deadline-based: <code>24h / 48 = 30min</code> windows
              </li>
            </ul>
          </div>
          <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-4">
            <p className="text-sm font-bold text-emerald-400 mb-2">
              WinningPoSt (leader election)
            </p>
            <ul className="text-sm space-y-1 text-foreground/80">
              <li>trigger: VRF election winner</li>
              <li>1 random sector sampled</li>
              <li>historical leader-election proof path</li>
              <li>현재 network version의 사용 여부를 따로 확인</li>
            </ul>
          </div>
        </div>

        {/* ── WindowPoSt 프로세스 ── */}
        <div className="not-prose rounded-lg border border-border bg-muted/50 p-4 my-4">
          <p className="text-sm font-bold text-foreground mb-2">
            WindowPoSt 프로세스
          </p>
          <ol className="text-sm space-y-1 text-foreground/80 list-decimal list-inside">
            <li>
              <strong>Challenge 생성</strong> — deadline 시작 시, random
              drand-based, per partition
            </li>
            <li>
              <strong>Leaf 선택</strong> — each sector에 10 leaf
            </li>
            <li>
              <strong>Merkle proof</strong> — open leaves + sibling hashes +
              root verification
            </li>
            <li>
              <strong>SNARK proof</strong> — Groth16, GPU accelerated
            </li>
            <li>
              <strong>On-chain submission</strong> —{" "}
              <code>SubmitWindowedPoSt</code> message, within deadline
            </li>
          </ol>
        </div>

        {/* ── Poseidon + Merkle Trees ── */}
        <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4">
            <p className="text-sm font-bold text-amber-400 mb-2">
              Poseidon Hash
            </p>
            <ul className="text-sm space-y-1 text-foreground/80">
              <li>SNARK-friendly hash (MDS + S-box design)</li>
              <li>BLS12-381 field operations</li>
              <li>
                회로 내 SHA256 대비 <strong>3-5x faster</strong>
              </li>
            </ul>
          </div>
          <div className="rounded-lg border border-border bg-muted/50 p-4">
            <p className="text-sm font-bold text-foreground mb-2">
              Merkle Tree Types
            </p>
            <ul className="text-sm space-y-1 text-foreground/80">
              <li>
                <code>base tree</code> — on data
              </li>
              <li>
                <code>tree C</code> — on column commitments
              </li>
              <li>
                <code>tree T_aux</code> — on tree C
              </li>
              <li>tree depth는 sector size와 proof parameter로 결정</li>
            </ul>
          </div>
        </div>

        {/* ── Proof Components + On-chain ── */}
        <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          <div className="rounded-lg border border-border bg-muted/50 p-4">
            <p className="text-sm font-bold text-foreground mb-2">
              Proof Components
            </p>
            <ul className="text-sm space-y-1 text-foreground/80">
              <li>Merkle path for each challenge</li>
              <li>column commitments</li>
              <li>
                <code>replica_id</code>
              </li>
              <li>SNARK wrapping (Groth16)</li>
            </ul>
          </div>
          <div className="rounded-lg border border-border bg-muted/50 p-4">
            <p className="text-sm font-bold text-foreground mb-2">
              On-chain Verification
            </p>
            <ul className="text-sm space-y-1 text-foreground/80">
              <li>SNARK verifier in VM (pairing operations)</li>
              <li>Groth16 verify, batch verification</li>
              <li>verification latency는 proof batch·VM·hardware에서 측정</li>
            </ul>
          </div>
        </div>

        {/* ── Fault + Slashing ── */}
        <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-4">
            <p className="text-sm font-bold text-red-400 mb-2">
              Fault Handling
            </p>
            <ul className="text-sm space-y-1 text-foreground/80">
              <li>missed WindowPoSt → fault fee per epoch</li>
              <li>7-day recovery window</li>
              <li>미복구 시 termination penalty</li>
              <li>skipped sectors — penalty paid, recovery 가능</li>
            </ul>
          </div>
          <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-4">
            <p className="text-sm font-bold text-red-400 mb-2">
              Slashing Conditions
            </p>
            <ul className="text-sm space-y-1 text-foreground/80">
              <li>
                <strong>missed PoSt</strong> → fault fee
              </li>
              <li>
                <strong>wrong proof</strong> → termination
              </li>
              <li>
                <strong>double-signing</strong> → termination + slash
              </li>
            </ul>
          </div>
        </div>

        {/* ── Performance ── */}
        <div className="not-prose rounded-lg border border-border bg-muted/50 p-4 my-4">
          <p className="text-sm font-bold text-foreground mb-2">Performance</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-foreground/80">
            <div className="space-y-1">
              <strong>proving time</strong>
              <span className="block">sector count·hardware dependent</span>
            </div>
            <div className="space-y-1">
              <strong>parallel</strong>
              <span className="block">partition 단위 실행</span>
            </div>
            <div className="space-y-1">
              <strong>verification</strong>
              <span className="block">proof profile·batch dependent</span>
            </div>
            <div className="space-y-1">
              <strong>moderate</strong>
              <span className="block">on-chain gas는 network 규칙 기준</span>
            </div>
          </div>
        </div>

        <p className="leading-7">
          정리하면 WindowPoSt와 WinningPoSt는 서로 다른 운영 시점에서 같은 질문을 던집니다. 저장 제공자가
          randomness로 선택된 데이터를 바로 열 수 있는지를 Merkle proof로 확인하고, 그 검증 과정을 SNARK로
          압축해 체인 비용을 제한합니다. proof를 놓치거나 잘못 제출했을 때 storage power와 담보에 불이익이 생기는
          이유도 이 반복 검사를 경제적 약속으로 연결하기 위해서입니다.
        </p>
      </div>
    </section>
  );
}

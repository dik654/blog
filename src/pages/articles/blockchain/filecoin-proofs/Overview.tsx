import SealingPipelineViz from "./viz/SealingPipelineViz";
import ProofArchViz from "./viz/ProofArchViz";
import { CodeViewButton } from "@/components/code";
import { codeRefs } from "./codeRefs";
import type { CodeRef } from "@/components/code/types";

export default function Overview({
  title,
  onCodeRef,
}: {
  title?: string;
  onCodeRef?: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? "Filecoin은 PoRep와 PoSt로 저장 시점과 보유 기간을 나눠 증명한다"}</h2>
      <div className="not-prose mb-8">
        <SealingPipelineViz
          onOpenCode={
            onCodeRef ? (key) => onCodeRef(key, codeRefs[key]) : undefined
          }
        />
      </div>
      <div className="not-prose mb-8">
        <ProofArchViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Filecoin은 저장 제공자의 선언만 믿지 않고, 저장 상태를 두 시점에서 검증합니다. 먼저
          <strong> PoRep</strong>(Proof of Replication)은 provider·sector에 묶인 인코딩과 commitment가 올바르게
          만들어졌는지를 sealing 시점에 확인합니다. 이후 <strong>PoSt</strong>(Proof of Spacetime)는 프로토콜이
          선택한 challenge에 응답하게 하여 그 데이터에 계속 접근할 수 있는지를 확인합니다.
        </p>
        <p>
          따라서 두 proof는 경쟁 관계가 아닙니다. PoRep가 저장을 시작할 자격을 만들고, PoSt가 그 자격을 계속
          유지할 수 있는지를 검사합니다. 아래 구현 버튼은 이 흐름을 담당하는 <code>rust-fil-proofs</code> 코드로
          바로 이어집니다.
        </p>
        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton
              onClick={() => onCodeRef("seal-pc1", codeRefs["seal-pc1"])}
            />
            <span className="text-xs text-muted-foreground self-center">
              seal.rs — PC1
            </span>
            <CodeViewButton
              onClick={() =>
                onCodeRef("stacked-graph", codeRefs["stacked-graph"])
              }
            />
            <span className="text-xs text-muted-foreground self-center">
              graph.rs
            </span>
          </div>
        )}

        {/* ── PoRep vs PoSt ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">PoRep vs PoSt 구분</h3>

        {/* ── PoRep vs PoSt 비교 카드 ── */}
        <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          <div className="rounded-lg border border-sky-500/30 bg-sky-500/5 p-4">
            <p className="text-sm font-bold text-sky-400 mb-2">
              PoRep (Proof of Replication)
            </p>
            <ul className="text-sm space-y-1 text-foreground/80">
              <li>
                <strong>목적</strong> — provider·sector에 묶인 replica encoding 증명
              </li>
              <li>
                <strong>시점</strong> — sector 초기화 시 (sealing), 1회
              </li>
              <li>
                <strong>과정</strong> — <code>PC1 → PC2 → C1 → C2</code>{" "}
                (4-phase)
              </li>
              <li>
                <strong>출력</strong> — proof type이 정한 SNARK bytes
              </li>
              <li>
                <strong>소요</strong> — sector size·proof parameter·hardware별 실측
              </li>
            </ul>
          </div>
          <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-4">
            <p className="text-sm font-bold text-emerald-400 mb-2">
              PoSt (Proof of SpaceTime)
            </p>
            <ul className="text-sm space-y-1 text-foreground/80">
              <li>
                <strong>목적</strong> — 시간 경과 후 여전히 저장 중
              </li>
              <li>
                <strong>시점</strong> — 지속적 (주기적)
              </li>
              <li>
                <strong>과정</strong> —{" "}
                <code>challenge → Merkle proof → SNARK</code>
              </li>
              <li>
                <strong>출력</strong> — network proof type에 맞는 SNARK bytes
              </li>
            </ul>
          </div>
        </div>

        {/* ── PoSt 2가지 ── */}
        <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4">
            <p className="text-sm font-bold text-amber-400 mb-2">WindowPoSt</p>
            <ul className="text-sm space-y-1 text-foreground/80">
              <li>deadline schedule에 따라 active sector를 partition 처리</li>
              <li>challenge 수는 현재 proof parameter에서 확인</li>
              <li>
                miss → <strong>slashing</strong>
              </li>
            </ul>
          </div>
          <div className="rounded-lg border border-violet-500/30 bg-violet-500/5 p-4">
            <p className="text-sm font-bold text-violet-400 mb-2">
              WinningPoSt
            </p>
            <ul className="text-sm space-y-1 text-foreground/80">
              <li>historical leader-election proof path</li>
              <li>network version에 따른 활성 여부 확인</li>
              <li>현재 block production·F3 규칙과 구분</li>
            </ul>
          </div>
        </div>

        {/* ── Sector Lifecycle ── */}
        <div className="not-prose rounded-lg border border-border bg-muted/50 p-4 my-4">
          <p className="text-sm font-bold text-foreground mb-2">
            Sector Lifecycle
          </p>
          <ol className="text-sm space-y-1 text-foreground/80 list-decimal list-inside">
            <li>
              <code>Empty</code> → accumulate pieces
            </li>
            <li>
              <code>PreCommit</code> — PoRep PC1 + PC2
            </li>
            <li>
              <code>Wait seed</code> — network policy가 정한 기간 대기
            </li>
            <li>
              <code>Commit</code> — PoRep C1 + C2
            </li>
            <li>
              <code>Active</code> → WindowPoSt required
            </li>
            <li>
              <code>Deadline</code> — active network의 deadline schedule을 따름
            </li>
            <li>
              <code>Termination</code> → finalize
            </li>
          </ol>
        </div>

        {/* ── Crypto Stack + Economics ── */}
        <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          <div className="rounded-lg border border-border bg-muted/50 p-4">
            <p className="text-sm font-bold text-foreground mb-2">
              Cryptographic Stack
            </p>
            <ul className="text-sm space-y-1 text-foreground/80">
              <li>
                <strong>SDR</strong> — Stacked DRG for PoRep
              </li>
              <li>
                <strong>Merkle</strong> — trees for PoSt
              </li>
              <li>
                <strong>Groth16</strong> — SNARK proof system
              </li>
              <li>
                <strong>Poseidon</strong> — SNARK-friendly hash
              </li>
              <li>
                <strong>BLS12-381</strong> — elliptic curve
              </li>
            </ul>
          </div>
          <div className="rounded-lg border border-border bg-muted/50 p-4">
            <p className="text-sm font-bold text-foreground mb-2">Economics</p>
            <ul className="text-sm space-y-1 text-foreground/80">
              <li>
                <strong>Initial pledge</strong> — active actor policy와 network state로 계산
              </li>
              <li>
                <strong>Block reward</strong> — from inflation
              </li>
              <li>
                <strong>Deal reward</strong> — from client payments
              </li>
              <li>
                <strong>Verified data</strong> — 현재 DataCap·quality-adjusted power 규칙 확인
              </li>
              <li>
                <strong>Storage power</strong> — WindowPoSt 성공 시 유지, fault
                시 감소
              </li>
            </ul>
          </div>
        </div>

        <p className="leading-7">
          PoRep는 sealing 과정에서 복제본과 commitment를 한 번 확정하고 PoSt는 활성화된 섹터를 주기적으로 다시 확인합니다. 두 경로의 큰 중간 결과는 Groth16
          proof로 압축되므로 체인은 저장 데이터 전체를 읽지 않고도 검증 결과를 확인할 수 있습니다.
        </p>
      </div>
    </section>
  );
}

import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";
import type { ReactNode } from "react";

const SCENES = ["전체", "Build 요청", "Payload 회수", "Block 포함", "실행 검증", "VALID", "미완료·실패", "Head 반영"] as const;

const NOTES = [
  "같은 execution payload E₁을 따라갑니다. Proposal 쪽에서는 forkchoiceUpdated가 build를 시작하고 getPayload가 결과를 가져옵니다. Block 처리 쪽에서는 newPayload가 E₁을 검증하며, 이후 forkchoiceUpdated가 선택된 execution head를 반영합니다.",
  "Prysm은 parent H₀를 head로 둔 ForkchoiceState와 다음 slot의 PayloadAttributes를 보냅니다. Execution client가 head를 VALID로 받아들이고 build를 시작하면 8-byte payloadId P₁을 돌려줍니다.",
  "Prysm은 P₁을 engine_getPayloadVn에 보내 지금까지 만들어진 execution payload E₁을 받습니다. P₁은 block hash가 아니라 해당 execution client 안의 build handle입니다.",
  "Prysm은 E₁을 beacon block B₁의 body에 넣습니다. 이 장면은 Engine API 호출이 아니라, 앞 호출의 결과가 consensus block으로 넘어가는 경계입니다.",
  "B₁을 처리하는 node는 E₁과 fork별 부가 입력을 engine_newPayloadVn에 보냅니다. Prysm v7.3.1은 payload type과 execution requests 유무에 따라 V1부터 V5 가운데 하나를 고릅니다.",
  "VALID이면 latestValidHash는 검증한 payload hash를 가리키고 Prysm은 해당 fork-choice node의 optimistic 표시를 해제할 수 있습니다. JSON-RPC 응답을 받았다는 사실만으로 이 상태가 되지는 않습니다.",
  "SYNCING·ACCEPTED는 아직 VALID가 아니므로 optimistic 상태로 남습니다. INVALID이면 latestValidHash를 기준으로 invalid suffix와 descendant를 제거합니다. Transport timeout은 이 status 집합에 속하지 않습니다.",
  "Fork choice가 B₁을 선택하면 Prysm은 E₁을 head로, 그 조상들을 safe·finalized로 보냅니다. Execution client는 받은 forkchoiceUpdated 순서를 지켜 canonical execution view를 갱신합니다.",
] as const;

const RECEIPTS = [
  "P₁ build handle · E₁ execution payload · B₁ beacon block",
  "FCU(H₀, safe, finalized, attrs) → VALID + P₁",
  "GetPayload(P₁) → E₁",
  "B₁.body.execution_payload = E₁",
  "NewPayload(E₁, fork inputs) → PayloadStatus",
  "VALID · latestValidHash = hash(E₁)",
  "SYNCING/ACCEPTED → optimistic · INVALID → prune",
  "FCU(head=E₁, safe, finalized) → execution view 변경",
] as const;

type CellProps = {
  label: string;
  value: ReactNode;
  detail: string;
  active?: boolean;
  muted?: boolean;
};

function Cell({ label, value, detail, active, muted }: CellProps) {
  return (
    <div className={`min-w-0 bg-background p-2 sm:p-3 ${active ? "ring-2 ring-inset ring-primary" : ""} ${muted ? "opacity-35" : ""}`}>
      <span className="block break-keep text-[8px] font-black leading-3 text-muted-foreground sm:text-[9px]">{label}</span>
      <strong className={`mt-1 block [overflow-wrap:normal] [word-break:normal] text-[10px] leading-4 sm:text-sm sm:leading-5 ${active ? "text-primary" : ""}`}>{value}</strong>
      <span className="mt-1 block break-keep text-[9px] leading-4 text-muted-foreground sm:text-xs sm:leading-5">{detail}</span>
    </div>
  );
}

function EngineBoundary({ active }: { active: number }) {
  const invalidScene = active === 6;
  const headApplied = active === 7;
  return (
    <div aria-label="Prysm과 execution client가 payload를 준비하고 검증한 뒤 head를 반영하는 과정">
      <div className="grid grid-cols-3 gap-px bg-border p-px">
        <Cell label="PRYSM · PROPOSAL" value={active >= 3 ? "B₁에 E₁ 포함" : "Parent H₀ 선택"} detail="Consensus parent와 다음 slot" active={active === 1 || active === 2 || active === 3} />
        <Cell label="PRYSM · BLOCK PROCESSING" value={active >= 5 ? (invalidScene ? "optimistic 또는 invalid" : "E₁ 실행 판정 저장") : "B₁ 대기"} detail="PayloadStatus를 fork-choice 상태로 변환" active={active === 4 || active === 5 || active === 6} />
        <Cell label="PRYSM · FORK CHOICE" value={headApplied ? "B₁ 선택 · head=E₁" : "Head 후보 유지"} detail="Beacon block 선택은 CL의 책임" active={active === 7} />
      </div>

      <div className="my-px grid grid-cols-[1fr_auto_1fr_auto_1fr] gap-px bg-border p-px" aria-label="Engine API 세 호출">
        <Cell
          label="CALL 1"
          value={<>forkchoice<span className="block sm:inline">Updated</span></>}
          detail="Pointers + build attributes"
          active={active === 1 || active === 7}
          muted={active > 1 && active < 7}
        />
        <div className="flex min-w-5 items-center justify-center bg-background text-xs text-muted-foreground" aria-hidden>→</div>
        <Cell label="CALL 2" value="getPayload(P₁)" detail="Build 결과 E₁ 회수" active={active === 2} muted={active > 2} />
        <div className="flex min-w-5 items-center justify-center bg-background text-xs text-muted-foreground" aria-hidden>→</div>
        <Cell label="CALL 3" value="newPayload(E₁)" detail="실행 validity 판정" active={active === 4 || active === 5 || active === 6} muted={active < 4} />
      </div>

      <div className="grid grid-cols-3 gap-px bg-border p-px">
        <Cell label="EXECUTION CLIENT · BUILDER" value={active >= 2 ? "P₁ → E₁" : active === 1 ? "P₁ 발급 · build 시작" : "대기"} detail="Transaction 실행 결과를 payload로 조립" active={active === 1 || active === 2} />
        <Cell label="EXECUTION CLIENT · VALIDATION" value={invalidScene ? "SYNCING 또는 INVALID" : active >= 5 ? "VALID" : active === 4 ? "E₁ 실행 중" : "미검증"} detail={invalidScene ? "latestValidHash로 경계 표시" : "EVM 규칙과 fork 입력 확인"} active={active === 4 || active === 5 || active === 6} />
        <Cell label="EXECUTION CLIENT · CHAIN VIEW" value={headApplied ? "head=E₁ · 조상 safe/finalized" : "head=H₀"} detail="FCU 순서대로 canonical view 갱신" active={active === 7} />
      </div>

      <div className="mt-px grid grid-cols-3 gap-px bg-border p-px">
        <Cell label="BUILD HANDLE" value={active >= 1 ? "P₁ · 8 bytes" : "없음"} detail="Execution client 내부의 opaque ID" active={active === 1 || active === 2} />
        <Cell label="PAYLOAD IDENTITY" value={active >= 2 ? "E₁ · block hash 포함" : "아직 없음"} detail="B₁이 담을 execution payload" active={active === 2 || active === 3 || active === 4} />
        <Cell label="판정" value={invalidScene ? "확정 전 또는 INVALID" : active >= 5 ? "VALID" : "미확정"} detail="HTTP 성공과 별도인 protocol 상태" active={active === 5 || active === 6 || active === 7} />
      </div>
    </div>
  );
}

export default function PrysmEngineAPIFlowViz() {
  const scenes = useAnimatedScenes(SCENES.length, 15000, { loop: false });
  const active = scenes.active;

  return (
    <VizFrame
      eyebrow="개념 경로 · Prysm v7.3.1"
      title="한 payload가 build에서 head까지 가는 경로"
      description="Proposal 준비와 block 검증을 같은 payload E₁로 연결해 봅니다."
      note="P₁·E₁·B₁은 설명용 식별자입니다. 호출과 상태 전이는 Prysm v7.3.1 commit 96d418cd와 Execution APIs v1.0.0-beta.7에서 확인했습니다."
      canvasClassName="p-1.5 sm:p-5"
      documentFlow
    >
      <div
        id={scenes.playbackId}
        data-viz-live-only
        data-prysm-engine-api-scene={active}
        tabIndex={0}
        role="group"
        aria-label="Prysm Engine API payload 생애의 여덟 장면"
        onKeyDown={scenes.onKeyDown}
        className="scroll-mt-20 outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
      >
        <div data-viz-scene-stage>
          <div className="overflow-x-auto" aria-label="Engine API payload 생애의 여덟 장면">
            <div className="grid min-w-[352px] grid-cols-8 gap-px bg-border p-px lg:min-w-0">
              {SCENES.map((scene, index) => (
                <button
                  type="button"
                  key={scene}
                  aria-pressed={index === active}
                  onClick={() => scenes.setActive(index)}
                  className={`min-h-11 min-w-11 bg-background px-0.5 py-1 text-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary lg:min-w-0 lg:py-2 ${index === active ? "text-primary" : index < active ? "text-foreground" : "text-muted-foreground"}`}
                >
                  <span className="block font-mono text-[8px] font-black">{String(index + 1).padStart(2, "0")}</span>
                  <strong className="mt-1 hidden break-keep text-[8px] leading-3 lg:block">{scene}</strong>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-2 sm:mt-3"><EngineBoundary active={active} /></div>

          <div className="mt-2 grid min-h-[4.75rem] grid-cols-[0.5fr_1.5fr] gap-px bg-border p-px sm:mt-3 sm:min-h-[5rem] sm:grid-cols-[0.62fr_1.38fr]">
            <div className="min-w-0 bg-background p-2 sm:p-3">
              <span className="text-[9px] font-bold text-muted-foreground">현재 장면</span>
              <strong className="mt-1 block break-keep text-xs leading-5 sm:text-sm">{SCENES[active]}</strong>
            </div>
            <div className="min-w-0 bg-background p-2 sm:p-3">
              <span className="text-[9px] font-bold text-muted-foreground">남은 상태</span>
              <strong className="mt-1 block break-keep text-[9px] leading-4 text-primary sm:text-sm sm:leading-5">{RECEIPTS[active]}</strong>
            </div>
          </div>

          <p data-scene-note className="mt-2 min-h-[6.25rem] border-l-2 border-primary/50 pl-2.5 text-[10px] leading-4 text-muted-foreground sm:mt-3 sm:min-h-[5rem] sm:pl-4 sm:text-sm sm:leading-6">{NOTES[active]}</p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} controlLabels={SCENES} playLabel="재생" className="mt-0 sm:mt-4" compact />
      </div>
      <StaticSceneList labels={SCENES} notes={NOTES} />
    </VizFrame>
  );
}

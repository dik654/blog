import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import ResponsiveVizTable from "@/components/viz/ResponsiveVizTable";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const REQUEST_LABELS = ["전송", "검증", "79 · 부족", "94 · 통과", "PREPARE", "COMMIT", "DECIDE", "인증서"] as const;

const REQUEST_SCENES = [
  { title: "A가 후보 체인 X를 QUALITY 메시지로 보냅니다", detail: "Gossip에 올렸다는 사실은 전송을 시작했다는 뜻일 뿐, 다른 참여자의 수신이나 합의를 보장하지 않습니다.", voters: ["A"], power: 45, active: 0, result: "전송 시작" },
  { title: "받은 노드는 X를 곧바로 투표로 세지 않고 먼저 검증합니다", detail: "네트워크 이름이 들어간 서명 도메인, 참여자와 투표권, 인스턴스·라운드·단계·값·보조 데이터, 서명과 justification을 확인합니다.", voters: ["A"], power: 45, active: 1, result: "A의 QUALITY만 유효" },
  { title: "A와 B의 QUALITY 투표권은 45+34=79입니다", detail: "총 투표권 120의 strong quorum은 ceil(2×120÷3)=80입니다. 79는 한 표가 아니라 투표권 1만큼 부족합니다.", voters: ["A", "B"], power: 79, active: 2, result: "79/120 · 아직 부족" },
  { title: "D의 15가 더해져 94가 되면 X가 후보 집합에 들어갑니다", detail: "같은 단계·값에 속한 서로 다른 참여자의 투표권만 합칩니다. 다른 단계의 표를 섞거나 한 참여자를 두 번 세지 않습니다.", voters: ["A", "B", "D"], power: 94, active: 2, result: "94/120 · QUALITY 통과" },
  { title: "같은 X에 PREPARE strong quorum을 다시 모읍니다", detail: "QUALITY의 94를 PREPARE에 그대로 더하는 것이 아닙니다. PREPARE라는 새 서명 도메인에서 94를 다시 확인해 다음 표를 정당화합니다.", voters: ["A", "B", "D"], power: 94, active: 3, result: "PREPARE proof 생성" },
  { title: "PREPARE proof를 실은 COMMIT 투표가 94에 도달합니다", detail: "값 X에 대한 strong COMMIT quorum이 생기면 노드는 DECIDE 단계로 들어가고 그 COMMIT 집계를 justification으로 붙입니다.", voters: ["A", "B", "D"], power: 94, active: 4, result: "X를 DECIDE로 전달" },
  { title: "DECIDE 메시지도 별도 strong quorum을 모읍니다", detail: "한 노드가 DECIDE를 보냈다는 사실만으로 함수가 끝나지 않습니다. 같은 X의 DECIDE 투표권이 80 이상인지 다시 확인합니다.", voters: ["A", "B", "D"], power: 94, active: 5, result: "DECIDE 94/120" },
  { title: "strong DECIDE quorum을 집계한 뒤 X와 인증서를 반환합니다", detail: "이제서야 이 인스턴스의 consensus core가 종료됩니다. 애플리케이션 실행과 이후 fork-choice 반영은 다음 계층의 일입니다.", voters: ["A", "B", "D"], power: 94, active: 6, result: "decision X + certificate" },
] as const;

const REQUEST_NOTES = REQUEST_LABELS.map((label, index) => `${label}. ${REQUEST_SCENES[index].title} ${REQUEST_SCENES[index].detail}`);
const PROVIDERS = [
  { name: "A", power: 45 },
  { name: "B", power: 34 },
  { name: "C", power: 26 },
  { name: "D", power: 15 },
] as const;
const PIPELINE = ["Gossip", "검증", "QUALITY", "PREPARE", "COMMIT", "DECIDE", "반환"] as const;

function FlowArrow() {
  return (
    <div aria-hidden="true" className="flex h-7 shrink-0 items-center justify-center font-black text-primary sm:h-auto sm:w-7">
      <span className="sm:hidden">↓</span><span className="hidden sm:inline">→</span>
    </div>
  );
}

export function GpbftRequestTraceViz() {
  const scenes = useAnimatedScenes(REQUEST_SCENES.length, 6500, { loop: false });
  const scene = REQUEST_SCENES[scenes.active];
  return (
    <VizFrame
      eyebrow="설명용 투표권 · A 45 · B 34 · C 26 · D 15 · 합계 120"
      title="메시지 한 번이 아니라 단계마다 새 정족수를 확인해야 결정됩니다"
      description="후보 X가 Gossip에 실린 순간부터 decision certificate가 나올 때까지 한 경로를 여덟 장면으로 따라갑니다."
      note="이 경로는 round 0에서 X가 충분한 지지를 받는 성공 사례입니다. 실제 메시지는 순서가 뒤섞이거나 중복·지연될 수 있습니다."
      documentFlow
      canvasClassName="p-3 sm:p-6"
    >
      <div id={scenes.playbackId} data-viz-live-only tabIndex={0} role="group" aria-label="GossiPBFT 후보가 전송부터 인증서까지 진행하는 여덟 단계" onKeyDown={scenes.onKeyDown} className="outline-none focus-visible:ring-2 focus-visible:ring-primary">
        <div data-viz-scene-stage className="min-h-[49rem] sm:min-h-[27rem]">
          <p className="text-[10px] font-black text-primary">{String(scenes.active + 1).padStart(2, "0")} · {REQUEST_LABELS[scenes.active]}</p>
          <h4 className="mt-2 min-h-14 break-keep text-base font-black leading-7">{scene.title}</h4>
          <p className="mt-1 min-h-20 text-xs font-semibold leading-6 text-muted-foreground sm:min-h-12">{scene.detail}</p>

          <div className="mt-4 grid grid-cols-4 gap-2">
            {PROVIDERS.map((provider) => {
              const selected = scene.voters.includes(provider.name as never);
              return <div key={provider.name} className={`border p-2 text-center ${selected ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-muted-foreground"}`}><p className="text-sm font-black">{provider.name}</p><p className="mt-1 text-[9px] font-bold">투표권 {provider.power}</p></div>;
            })}
          </div>

          <div className="mt-4 h-3 overflow-hidden border border-border bg-background">
            <div className={`h-full transition-[width] duration-500 ${scene.power >= 80 ? "bg-primary" : "bg-amber-500"}`} style={{ width: `${Math.min(100, scene.power / 1.2)}%` }} />
          </div>
          <div className="mt-2 flex items-center justify-between text-[10px] font-black">
            <span>현재 장면의 같은 단계·값: {scene.power}/120</span><span>문턱: 80</span>
          </div>

          <div className="mt-5 flex flex-col sm:flex-row sm:items-stretch">
            {PIPELINE.map((step, index) => (
              <div key={step} className="contents">
                <div className={`flex min-h-12 flex-1 items-center justify-center border px-2 py-3 text-center text-[10px] font-black ${index === scene.active ? "border-primary bg-primary text-primary-foreground" : index < scene.active ? "border-primary bg-primary/10" : "border-border bg-background text-muted-foreground"}`}>{step}</div>
                {index < PIPELINE.length - 1 && <FlowArrow />}
              </div>
            ))}
          </div>

          <div className="mt-5 border-2 border-primary bg-primary/10 p-4">
            <p className="text-[9px] font-black text-primary">이 장면에서만 말할 수 있는 결론</p>
            <p className="mt-1 break-keep text-sm font-black leading-6">{scene.result}</p>
          </div>
        </div>
        <AnimatedSceneControls {...scenes} labels={REQUEST_LABELS} controlLabels={REQUEST_LABELS} playLabel="GossiPBFT 요청 경로 재생" compact />
      </div>
      <StaticSceneList labels={REQUEST_LABELS} notes={REQUEST_NOTES} />
    </VizFrame>
  );
}

const RECOVERY_LABELS = ["후보 확보", "PREPARE 막힘", "bottom", "다음 round", "Y 준비", "Y 확정", "종료"] as const;
const RECOVERY_SCENES = [
  { code: "proposal = longest_quality_prefix(input)", title: "round 0의 QUALITY 결과로 후보 X를 고릅니다", detail: "적어도 이전에 확정된 base chain은 후보로 남습니다.", round: "r=0", phase: "QUALITY", value: "X", proof: "QUALITY(X)" },
  { code: "if !can_reach_strong_quorum(X): value = bottom", title: "PREPARE에서 X가 strong quorum에 닿을 수 없다고 판단합니다", detail: "Timeout 자체가 X를 탈락시키는 것이 아니라, 지금까지 받은 표와 남은 가능성을 함께 봅니다.", round: "r=0", phase: "PREPARE", value: "⊥", proof: "X proof 없음" },
  { code: "broadcast COMMIT(bottom)", title: "특정 후보를 결정하지 않겠다는 bottom 표를 보냅니다", detail: "bottom은 빈 체인을 확정하는 값이 아닙니다. 이번 round에서 특정 후보를 commit하지 않겠다는 표입니다.", round: "r=0", phase: "COMMIT", value: "⊥", proof: "COMMIT(⊥) quorum" },
  { code: "round += 1; proposal stays X", title: "bottom COMMIT 정족수를 근거로 다음 round를 엽니다", detail: "기존 proposal은 보존하고 timeout은 backoff합니다. threshold를 낮추지는 않습니다.", round: "r=1", phase: "CONVERGE", value: "X 또는 Y", proof: "이전 COMMIT(⊥)" },
  { code: "proposal = best_ticket(valid_converge_messages)", title: "정당한 후보 중 보정된 ticket이 가장 좋은 Y로 수렴합니다", detail: "Y는 candidate set에 있거나 이전 round에서 결정됐을 가능성을 보이는 justification이 있어야 합니다.", round: "r=1", phase: "PREPARE", value: "Y", proof: "CONVERGE(Y)" },
  { code: "if strong_commit(Y): broadcast DECIDE(Y)", title: "Y의 PREPARE와 COMMIT 정족수를 차례로 확인합니다", detail: "COMMIT(Y)의 proof를 DECIDE 메시지에 붙여 다른 노드도 같은 근거를 검증할 수 있게 합니다.", round: "r=1", phase: "DECIDE", value: "Y", proof: "COMMIT(Y) quorum" },
  { code: "return Y, aggregate(strong_DECIDE(Y))", title: "Y의 DECIDE 정족수가 생기면 결정과 인증서를 반환합니다", detail: "앞 round가 실패했어도 안전 문턱을 낮추지 않고 새 round에서 진행성을 회복했습니다.", round: "종료", phase: "TERMINATED", value: "Y", proof: "DECIDE(Y) quorum" },
] as const;
const RECOVERY_NOTES = RECOVERY_LABELS.map((label, index) => `${label}. ${RECOVERY_SCENES[index].title} ${RECOVERY_SCENES[index].detail}`);

export function GpbftRecoveryPseudocodeViz() {
  const scenes = useAnimatedScenes(RECOVERY_SCENES.length, 6800, { loop: false });
  const scene = RECOVERY_SCENES[scenes.active];
  return (
    <VizFrame
      eyebrow="한 번 막힌 round를 다음 round로 넘기는 의사코드"
      title="근거가 부족하면 bottom을 commit하고, 다음 round에서 후보를 다시 좁힙니다"
      description="X의 PREPARE가 막힌 뒤 Y로 결정되는 분기 하나를 상태와 함께 실행합니다."
      note="함수 이름은 FIP-0086과 go-f3 v0.8.15의 역할을 읽기 쉽게 줄인 의사코드입니다."
      documentFlow
      canvasClassName="p-3 sm:p-6"
    >
      <div id={scenes.playbackId} data-viz-live-only tabIndex={0} role="group" aria-label="GossiPBFT 실패 round가 다음 round에서 복구되는 의사코드 일곱 단계" onKeyDown={scenes.onKeyDown} className="outline-none focus-visible:ring-2 focus-visible:ring-primary">
        <div data-viz-scene-stage className="min-h-[51rem] space-y-4 sm:min-h-[33rem]">
          <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-7">
            {RECOVERY_LABELS.map((label, index) => <div key={label} className={`border px-1 py-2 text-center text-[9px] font-black ${index === scenes.active ? "border-primary bg-primary/10" : index < scenes.active ? "border-foreground/30 bg-background" : "border-border bg-background text-muted-foreground"}`}>{index + 1}. {label}</div>)}
          </div>
          <div className="border border-border bg-foreground p-4 text-background">
            <p className="text-[10px] font-black text-primary-foreground/70">실행 중인 의사코드 · {scenes.active + 1}/{RECOVERY_SCENES.length}</p>
            <code className="mt-2 block break-words font-mono text-[11px] font-bold leading-6 sm:text-sm">{scene.code}</code>
          </div>
          <div className="border border-border bg-background p-4">
            <h4 className="break-keep text-base font-black leading-7">{scene.title}</h4>
            <p className="mt-2 break-keep text-xs leading-6 text-muted-foreground">{scene.detail}</p>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {[["round", scene.round], ["현재 단계", scene.phase], ["표로 보낼 값", scene.value], ["다음 단계의 근거", scene.proof]].map(([label, value]) => <div key={label} className="min-w-0 border border-border bg-background p-3"><p className="text-[9px] font-bold text-muted-foreground">{label}</p><p className="mt-1 break-keep text-xs font-black leading-5">{value}</p></div>)}
          </div>
          <div className={`border-2 p-4 ${scene.value === "⊥" ? "border-amber-500 bg-amber-500/10" : "border-primary bg-primary/10"}`}>
            <p className="text-[9px] font-black text-muted-foreground">상태 변화</p>
            <p className="mt-1 break-keep text-xs font-black leading-6">{scene.value === "⊥" ? "특정 체인을 결정하지 않고 다음 round의 수렴 조건을 만듭니다." : scenes.active === RECOVERY_SCENES.length - 1 ? "Y와 검증 가능한 인증서를 반환합니다." : `${scene.value}를 안전한 다음 후보로 이어 갑니다.`}</p>
          </div>
        </div>
        <AnimatedSceneControls {...scenes} labels={RECOVERY_LABELS} controlLabels={RECOVERY_LABELS} playLabel="GossiPBFT 복구 의사코드 재생" compact />
      </div>
      <StaticSceneList labels={RECOVERY_LABELS} notes={RECOVERY_NOTES} />
    </VizFrame>
  );
}

const BOUNDARY_ROWS = [
  ["Gossip 전송", "로컬 publish 성공", "메시지를 퍼뜨리기 시작함", "모든 참여자가 받음"],
  ["메시지 수신", "peer에서 받은 bytes", "검증 대기열에 넣을 수 있음", "유효한 투표"],
  ["투표 검증", "도메인·위원회·서명·justification", "정확한 단계·값 bucket에 넣을 수 있음", "정족수 도달"],
  ["단계 정족수", "같은 단계·값의 투표권 ≥ ceil(2W/3)", "다음 단계의 justification을 만들 수 있음", "인스턴스 종료"],
  ["DECIDE 진입", "값에 대한 strong COMMIT proof", "DECIDE 메시지를 보낼 수 있음", "결정 인증서 반환"],
  ["인스턴스 종료", "같은 값의 strong DECIDE proof", "decision과 certificate를 반환", "애플리케이션 실행·EC 반영"],
] as const;

export function GpbftBoundaryViz() {
  return (
    <VizFrame eyebrow="같은 후보에도 여섯 개의 완료 상태가 있습니다" title="전송·수신·검증·정족수·결정을 한 단어로 합치지 않습니다" description="관찰한 증거가 어디까지의 결론을 허용하는지 구분합니다." documentFlow canvasClassName="p-0">
      <ResponsiveVizTable columns={["관찰한 상태", "확인한 증거", "여기까지 말할 수 있음", "아직 말할 수 없음"]} rows={BOUNDARY_ROWS} desktopMinWidthClassName="min-w-[920px]" />
    </VizFrame>
  );
}

const FAILURE_ROWS = [
  ["다른 network name", "서명 검증 실패", "상태 변화 없음"],
  ["다른 instance·round·phase", "현재 bucket에 넣지 않음", "투표권 증가 없음"],
  ["중복 sender", "같은 단계·round에서 한 번만 셈", "중복 투표권 0"],
  ["79/120", "strong quorum 미달", "다음 proof 생성 금지"],
  ["partition 중 무결정", "진행성 문제로 기록", "threshold 완화 금지"],
  ["회복 뒤 단일 인증서", "rebroadcast·backoff 뒤 확인", "충돌 decision 0"],
] as const;

export function GpbftFailureBoundaryViz() {
  return (
    <VizFrame eyebrow="출시 전 실패 주입" title="안전성 실패와 진행성 실패를 서로 다른 판정으로 기록합니다" description="잘못된 메시지는 상태를 바꾸지 않아야 하고, 네트워크 회복 뒤에는 문턱을 낮추지 않은 채 진행해야 합니다." documentFlow canvasClassName="p-0">
      <ResponsiveVizTable columns={["주입한 상황", "기대 판정", "반드시 남길 결과"]} rows={FAILURE_ROWS} desktopMinWidthClassName="min-w-[760px]" />
    </VizFrame>
  );
}

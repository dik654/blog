import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = ["M9 도착", "M7 도착", "M8 도착", "fee 계산", "budget 선택", "head apply", "reorg"] as const;

const SCENES = [
  {
    title: "Nonce 9가 먼저 와도 local acceptance와 실행 가능은 다릅니다",
    detail: "Head H에서 Alice actor nonce는 7입니다. M9는 허용된 gap 안에서 보관될 수 있지만 7·8 없이 block에서 먼저 실행할 수 없습니다.",
    pending: "M9 · gap 뒤 대기",
    executable: "없음 · expected 7",
    candidate: "없음",
    head: "H · actor nonce 7",
    receipt: "admitted @ H, not executable",
  },
  {
    title: "M7이 오면 actor nonce에서 시작하는 첫 prefix가 생깁니다",
    detail: "M7은 현재 state nonce와 일치합니다. M9의 premium이 높아도 M8이 없으므로 실행 가능한 chain은 아직 M7 하나입니다.",
    pending: "M7 · M9",
    executable: "M7",
    candidate: "M7",
    head: "H · actor nonce 7",
    receipt: "contiguous prefix [7]",
  },
  {
    title: "M8이 gap을 메우면 M7→M8→M9가 한 dependency chain이 됩니다",
    detail: "Sender별 nonce는 정확히 1씩 증가해야 합니다. Selection은 M9를 독립 고가 message가 아니라 앞선 두 message에 의존하는 chain으로 봅니다.",
    pending: "M7 · M8 · M9",
    executable: "M7 → M8 → M9",
    candidate: "package 7–9",
    head: "H · actor nonce 7",
    receipt: "contiguous prefix [7,8,9]",
  },
  {
    title: "제시한 premium 대신 base fee 뒤 실제로 남는 폭을 계산합니다",
    detail: "예제 M7은 premium 3, fee cap 12, base fee 10입니다. Effective premium은 min(3, 12−10)=2이며 이 head가 바뀌면 다시 계산합니다.",
    pending: "M7 · M8 · M9",
    executable: "chain별 gas reward·performance",
    candidate: "M7 p_eff=2",
    head: "H · base fee 10",
    receipt: "fee context @ H",
  },
  {
    title: "Block gas·message budget 안에서 dependency를 보존해 자릅니다",
    detail: "예제 budget에는 M7·M8만 들어갑니다. M9만 골라 순서를 뒤집지 않고, 뒤 dependency는 다음 block 후보로 남깁니다.",
    pending: "M7 · M8 · M9",
    executable: "M7 → M8 → M9",
    candidate: "M7 · M8",
    head: "H · selection base",
    receipt: "budget-valid block candidate",
  },
  {
    title: "새 head H′에 M7·M8이 적용되면 pending에서 제거합니다",
    detail: "Actor nonce는 9가 되고 M9가 다음 실행 후보가 됩니다. Local acceptance가 inclusion을 미리 보장한 것이 아니라 head change가 상태를 확정한 것입니다.",
    pending: "M9",
    executable: "M9",
    candidate: "다음 block 후보",
    head: "H′ · actor nonce 9",
    receipt: "applied M7·M8 removed",
  },
  {
    title: "H′가 revert되면 M7·M8을 돌려놓고 새 head에서 다시 검사합니다",
    detail: "Reverted message를 무조건 복사하지 않습니다. 새 actor nonce·balance·base fee와 policy에서 재검사해 stale·invalid entry를 걸러냅니다.",
    pending: "M7 · M8 · M9 재검사",
    executable: "새 head 결과에 따름",
    candidate: "이전 candidate 폐기",
    head: "H″ · reorg target",
    receipt: "reconciled pending set",
  },
] as const;

const NOTES = SCENES.map((scene, index) => `${LABELS[index]}. ${scene.title} ${scene.detail} 이 장면의 확인 기록은 ${scene.receipt}입니다.`);

export function LotusMpoolFlowViz() {
  const scenes = useAnimatedScenes(SCENES.length, 8200, { loop: false });
  const scene = SCENES[scenes.active];

  return <VizFrame
    eyebrow="Alice · head H · actor nonce 7"
    title="현재 head가 바뀌면 실행 가능한 메시지도 바뀝니다"
    description="Nonce 9가 먼저 온 뒤 7·8이 gap을 메우고, 적용과 reorg가 pending set을 바꾸는 과정을 봅니다."
    note="Gap·RBF·queue limits는 pinned Lotus config와 local/untrusted path에 따라 다릅니다. 예제는 실행 순서와 head 의존성을 보여 줍니다."
    documentFlow
    canvasClassName="p-3 sm:p-6"
  >
    <div id={scenes.playbackId} tabIndex={0} onKeyDown={scenes.onKeyDown} className="outline-none focus-visible:ring-2 focus-visible:ring-primary" aria-label="Lotus message pool nonce와 reorg 장면 탐색기">
      <div data-viz-live-only className="space-y-4">
        <div data-viz-scene-stage className="space-y-4">
          <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-7">
            {LABELS.map((label, index) => <div key={label} className={`border px-1 py-2 text-center text-[9px] font-black ${index === scenes.active ? "border-primary bg-primary/10" : index < scenes.active ? "border-foreground/30 bg-background" : "border-border bg-background text-muted-foreground"}`}>{index + 1}. {label}</div>)}
          </div>
          <div className="grid gap-px bg-border p-px lg:grid-cols-[minmax(0,1.4fr)_minmax(13rem,0.6fr)]">
            <div className="bg-background p-4 sm:p-5"><p className="text-[10px] font-black text-primary">현재 변화 · {LABELS[scenes.active]}</p><h4 className="mt-2 break-keep text-base font-black leading-6 sm:text-lg">{scene.title}</h4><p className="mt-2 break-keep text-xs leading-6 text-muted-foreground">{scene.detail}</p></div>
            <div className="bg-background p-4 sm:p-5"><p className="text-[9px] font-bold text-muted-foreground">현재 확인 기록</p><p className="mt-2 border-l-2 border-primary pl-3 font-mono text-xs font-black leading-5">{scene.receipt}</p><p className="mt-4 text-[9px] leading-5 text-muted-foreground">이 기록은 consensus inclusion이나 finality를 증명하지 않습니다.</p></div>
          </div>
          <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
            {[["pending", scene.pending], ["실행 가능", scene.executable], ["block 후보", scene.candidate], ["판단 head", scene.head]].map(([label, value], index) => <article key={label} className={`min-w-0 border bg-background p-3 ${index === 3 ? "border-primary/60" : "border-border"}`}><p className="text-[9px] font-bold text-muted-foreground">{label}</p><p className="mt-2 break-keep font-mono text-[10px] font-black leading-5 sm:text-xs">{value}</p></article>)}
          </div>
          <div className="flex gap-1" aria-hidden="true">{LABELS.map((label, index) => <span key={label} className={`h-1.5 flex-1 ${index <= scenes.active ? "bg-primary" : "bg-border"}`} />)}</div>
        </div>
        <AnimatedSceneControls {...scenes} labels={LABELS} controlLabels={LABELS} playLabel="Mpool nonce·reorg 경로 재생" compact />
      </div>
      <StaticSceneList labels={LABELS} notes={NOTES} />
    </div>
  </VizFrame>;
}

const ADMISSION_LABELS = ["메시지", "head", "검사", "기록"] as const;
const ADMISSION_CHECKS = ["서명·CID", "nonce", "잔액", "network", "local policy"] as const;
const ADMISSION_SCENES = [
  {
    title: "Alice의 signed message M7을 식별합니다",
    detail: "From, To, nonce 7, value, gas fields, method parameters와 signature가 message CID에 들어갑니다.",
    context: "아직 읽지 않음",
    receipt: "생성 전",
    checks: ["확인", "대기", "대기", "대기", "대기"],
  },
  {
    title: "판단에 사용할 heaviest head H를 고정합니다",
    detail: "H의 tipset key와 높이에서 actor nonce 7, balance, base fee, network version을 읽습니다.",
    context: "H · height h · actor nonce 7",
    receipt: "context 고정",
    checks: ["확인", "대기", "대기", "대기", "대기"],
  },
  {
    title: "M7을 H의 actor 상태와 현재 정책으로 검사합니다",
    detail: "서명과 CID만 보지 않고 nonce, required funds, network 규칙, duplicate와 replacement 정책을 함께 확인합니다.",
    context: "H · network NV · policy P",
    receipt: "검사 결과 수집",
    checks: ["통과", "통과", "통과", "통과", "통과"],
  },
  {
    title: "메시지와 head, 정책을 묶어 admission 기록 A를 남깁니다",
    detail: "같은 message CID라도 H나 local policy가 달라지면 A가 달라집니다. A는 block inclusion 증명이 아닙니다.",
    context: "H · NV · P 고정",
    receipt: "A = H(Cmsg | KH | h | NV | P)",
    checks: ["통과", "통과", "통과", "통과", "통과"],
  },
] as const;
const ADMISSION_NOTES = ADMISSION_SCENES.map(
  (scene, index) => `${index + 1}. ${scene.title} ${scene.detail} 확인 기록은 ${scene.receipt}입니다.`,
);

export function MpoolAdmissionViz() {
  const scenes = useAnimatedScenes(ADMISSION_SCENES.length, 7200, { loop: false });
  const scene = ADMISSION_SCENES[scenes.active];

  return (
    <VizFrame
      eyebrow="M7 · head H"
      title="접수 판단에는 메시지와 그때의 head가 함께 필요합니다"
      description="같은 signed message도 actor 상태와 network, local policy가 달라지면 결과가 달라집니다."
      documentFlow
      canvasClassName="p-3 sm:p-6"
    >
      <div
        id={scenes.playbackId}
        tabIndex={0}
        onKeyDown={scenes.onKeyDown}
        className="outline-none focus-visible:ring-2 focus-visible:ring-primary"
        aria-label="Lotus mpool admission 문맥 장면 탐색기"
      >
        <div data-viz-live-only className="space-y-4">
          <div className="border border-border bg-background p-4">
            <h4 className="break-keep text-sm font-black leading-6 sm:text-base">{scene.title}</h4>
            <p className="mt-2 break-keep text-xs leading-6 text-muted-foreground">{scene.detail}</p>
          </div>
          <div className="grid grid-cols-2 gap-px bg-border p-px">
            <div className="bg-background p-3 sm:p-4">
              <p className="text-[9px] font-bold text-muted-foreground">signed message</p>
              <p className="mt-2 font-mono text-xs font-black">Alice · nonce 7 · CID Cmsg</p>
            </div>
            <div className="bg-background p-3 sm:p-4">
              <p className="text-[9px] font-bold text-muted-foreground">판단 문맥</p>
              <p className="mt-2 break-keep font-mono text-xs font-black leading-5">{scene.context}</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-5">
            {ADMISSION_CHECKS.map((check, index) => (
              <div
                key={check}
                className={`border p-2.5 ${
                  scene.checks[index] === "통과"
                    ? "border-primary bg-primary/5"
                    : "border-border bg-background"
                }`}
              >
                <p className="break-keep text-[9px] font-bold leading-4 text-muted-foreground">{check}</p>
                <p className="mt-2 text-[10px] font-black">{scene.checks[index]}</p>
              </div>
            ))}
          </div>
          <div className="border border-primary/60 bg-background p-3">
            <p className="text-[9px] font-bold text-muted-foreground">현재 확인 기록</p>
            <p className="mt-2 break-keep font-mono text-xs font-black text-primary [overflow-wrap:normal]">
              {scene.receipt}
            </p>
          </div>
          <AnimatedSceneControls
            {...scenes}
            labels={ADMISSION_LABELS}
            playLabel="Mpool 접수 판단 재생"
            compact
          />
        </div>
        <StaticSceneList labels={ADMISSION_LABELS} notes={ADMISSION_NOTES} />
      </div>
    </VizFrame>
  );
}

const NONCE_LABELS = ["M9", "M7", "M8", "budget"] as const;
const NONCE_SCENES = [
  {
    title: "Nonce 9만 도착해 expected nonce 7 앞의 gap을 기다립니다",
    detail: "M9는 pending에 보관될 수 있어도 실행 가능한 prefix에는 들어가지 못합니다.",
    states: ["비어 있음", "비어 있음", "대기"],
    executable: "없음 · expected 7",
    selected: "없음",
  },
  {
    title: "M7이 도착해 첫 실행 가능한 prefix가 생깁니다",
    detail: "M9의 fee가 높아도 M8이 없으므로 M7까지만 실행할 수 있습니다.",
    states: ["실행 가능", "비어 있음", "gap 뒤 대기"],
    executable: "M7",
    selected: "M7",
  },
  {
    title: "M8이 gap을 메워 7→8→9가 하나의 dependency chain이 됩니다",
    detail: "Selection은 sender의 actor nonce에서 정확히 1씩 이어지는 prefix를 만듭니다.",
    states: ["실행 가능", "실행 가능", "실행 가능"],
    executable: "M7 → M8 → M9",
    selected: "package 7–9",
  },
  {
    title: "Block budget이 부족하면 뒤쪽 dependency부터 다음 후보로 남깁니다",
    detail: "예제에서는 M7과 M8만 고르고, M9만 따로 앞세워 nonce 순서를 뒤집지 않습니다.",
    states: ["선택", "선택", "다음 block"],
    executable: "M7 → M8 → M9",
    selected: "M7 · M8",
  },
] as const;
const NONCE_NOTES = NONCE_SCENES.map(
  (scene, index) => `${index + 1}. ${scene.title} ${scene.detail} 실행 가능한 prefix는 ${scene.executable}입니다.`,
);

export function NoncePackageViz() {
  const scenes = useAnimatedScenes(NONCE_SCENES.length, 7000, { loop: false });
  const scene = NONCE_SCENES[scenes.active];

  return (
    <VizFrame
      eyebrow="Alice · actor nonce 7"
      title="Nonce가 끊기지 않은 prefix만 실행할 수 있습니다"
      description="도착 순서나 높은 fee가 sender의 nonce dependency를 건너뛰지는 못합니다."
      documentFlow
      canvasClassName="p-3 sm:p-6"
    >
      <div
        id={scenes.playbackId}
        tabIndex={0}
        onKeyDown={scenes.onKeyDown}
        className="outline-none focus-visible:ring-2 focus-visible:ring-primary"
        aria-label="Lotus mpool nonce package 장면 탐색기"
      >
        <div data-viz-live-only className="space-y-4">
          <div className="border border-border bg-background p-4">
            <h4 className="break-keep text-sm font-black leading-6 sm:text-base">{scene.title}</h4>
            <p className="mt-2 break-keep text-xs leading-6 text-muted-foreground">{scene.detail}</p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[7, 8, 9].map((nonce, index) => (
              <div
                key={nonce}
                className={`border p-3 ${
                  scene.states[index] === "선택" || scene.states[index] === "실행 가능"
                    ? "border-primary bg-primary/5"
                    : "border-border bg-background"
                }`}
              >
                <p className="font-mono text-lg font-black">M{nonce}</p>
                <p className="mt-3 break-keep text-[10px] font-bold leading-4 text-muted-foreground">
                  {scene.states[index]}
                </p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="border border-foreground/30 bg-background p-3">
              <p className="text-[9px] font-bold text-muted-foreground">실행 가능한 prefix</p>
              <p className="mt-2 break-keep font-mono text-xs font-black">{scene.executable}</p>
            </div>
            <div className="border border-primary/60 bg-background p-3">
              <p className="text-[9px] font-bold text-muted-foreground">현재 block 후보</p>
              <p className="mt-2 break-keep font-mono text-xs font-black text-primary">{scene.selected}</p>
            </div>
          </div>
          <AnimatedSceneControls
            {...scenes}
            labels={NONCE_LABELS}
            playLabel="Nonce package 변화 재생"
            compact
          />
        </div>
        <StaticSceneList labels={NONCE_LABELS} notes={NONCE_NOTES} />
      </div>
    </VizFrame>
  );
}

const GAS_LABELS = ["입력", "남는 폭", "유효 값", "비교 점수"] as const;
const GAS_SCENES = [
  {
    title: "M7이 premium 3과 fee cap 12를 제시했고 head H의 base fee는 10입니다",
    detail: "세 값은 모두 gas당 가격입니다. Premium과 fee cap은 서로 다른 제한을 표현합니다.",
    expression: "p=3 · f=12 · b=10",
    result: "계산 전",
    active: 0,
  },
  {
    title: "Fee cap에서 base fee를 내고 남는 폭을 계산합니다",
    detail: "12−10=2이므로 sender가 premium에 실제로 쓸 수 있는 최대 폭은 gas당 2입니다.",
    expression: "max(f−b, 0) = max(12−10, 0)",
    result: "2",
    active: 1,
  },
  {
    title: "제시한 premium과 남는 폭 가운데 작은 값을 택합니다",
    detail: "Premium을 3이라고 적어도 fee cap에서 남는 폭이 2이므로 effective premium은 2입니다.",
    expression: "p_eff = min(3, 2)",
    result: "2",
    active: 2,
  },
  {
    title: "Effective premium에 GasLimit을 곱해 package 비교량을 만듭니다",
    detail: "이 값은 selection 시점의 비교량입니다. 실제 gas 사용량이나 inclusion을 보장하지 않습니다.",
    expression: "R = p_eff × G",
    result: "2 × G",
    active: 3,
  },
] as const;
const GAS_NOTES = GAS_SCENES.map(
  (scene, index) => `${index + 1}. ${scene.title} ${scene.detail} 계산 결과는 ${scene.result}입니다.`,
);

export function GasContextViz() {
  const scenes = useAnimatedScenes(GAS_SCENES.length, 7000, { loop: false });
  const scene = GAS_SCENES[scenes.active];

  return (
    <VizFrame
      eyebrow="M7 · head H"
      title="Premium 3이 그대로 priority 3이 되는 것은 아닙니다"
      description="Fee cap과 base fee가 남긴 폭을 먼저 계산한 뒤 effective premium을 정합니다."
      note="Head가 바뀌면 base fee와 actor 상태가 달라질 수 있으므로 같은 순서로 다시 계산합니다."
      documentFlow
      canvasClassName="p-3 sm:p-6"
    >
      <div
        id={scenes.playbackId}
        tabIndex={0}
        onKeyDown={scenes.onKeyDown}
        className="outline-none focus-visible:ring-2 focus-visible:ring-primary"
        aria-label="Lotus mpool gas context 계산 장면 탐색기"
      >
        <div data-viz-live-only className="space-y-4">
          <div className="border border-border bg-background p-4">
            <h4 className="break-keep text-sm font-black leading-6 sm:text-base">{scene.title}</h4>
            <p className="mt-2 break-keep text-xs leading-6 text-muted-foreground">{scene.detail}</p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              ["GasPremium p", "3"],
              ["GasFeeCap f", "12"],
              ["Base fee b", "10"],
            ].map(([label, value], index) => (
              <div
                key={label}
                className={`border p-3 ${scene.active === 0 || index > 0 ? "border-border" : "border-foreground/30"}`}
              >
                <p className="break-keep text-[9px] font-bold leading-4 text-muted-foreground">{label}</p>
                <p className="mt-2 font-mono text-xl font-black">{value}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-[minmax(0,1fr)_5rem] gap-px bg-border p-px sm:grid-cols-[minmax(0,1fr)_8rem]">
            <div className="bg-background p-4">
              <p className="text-[9px] font-bold text-muted-foreground">현재 계산</p>
              <p className="mt-2 break-keep font-mono text-xs font-black leading-5 [overflow-wrap:normal]">
                {scene.expression}
              </p>
            </div>
            <div className="bg-primary/5 p-4 text-right">
              <p className="text-[9px] font-bold text-muted-foreground">결과</p>
              <p className="mt-2 font-mono text-lg font-black text-primary">{scene.result}</p>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            {GAS_LABELS.map((label, index) => (
              <div
                key={label}
                className={`border px-1 py-2 text-center text-[9px] font-black ${
                  index === scenes.active
                    ? "border-primary bg-primary/5"
                    : index < scenes.active
                      ? "border-foreground/30"
                      : "border-border text-muted-foreground"
                }`}
              >
                {label}
              </div>
            ))}
          </div>
          <AnimatedSceneControls
            {...scenes}
            labels={GAS_LABELS}
            playLabel="Gas 계산 재생"
            compact
          />
        </div>
        <StaticSceneList labels={GAS_LABELS} notes={GAS_NOTES} />
      </div>
    </VizFrame>
  );
}

const RECOVERY_LABELS = ["apply", "revert", "재검사", "restart", "판단"] as const;
const RECOVERY_GATES = ["반영", "복원", "nonce", "잔액", "gas", "일치"] as const;
const RECOVERY_SCENES = [
  {
    title: "Head H′에 M7과 M8이 적용돼 pending에서 제거합니다",
    detail: "Actor nonce는 9가 되고 M9가 다음 실행 후보가 됩니다.",
    head: "H′ · nonce 9",
    pending: "M9",
    action: "M7·M8 제거",
    passed: 1,
  },
  {
    title: "H′가 revert되면 M7과 M8을 pending 후보로 되돌립니다",
    detail: "되돌린 메시지를 곧바로 신뢰하지 않고 새 head H″의 문맥으로 넘깁니다.",
    head: "H″ · reorg target",
    pending: "M7 · M8 · M9 후보",
    action: "복원 후 보류",
    passed: 2,
  },
  {
    title: "새 actor nonce와 balance, base fee, policy로 모두 다시 검사합니다",
    detail: "더 이상 유효하지 않은 stale entry는 버리고 nonce chain과 gas context를 다시 만듭니다.",
    head: "H″ · 새 상태",
    pending: "유효한 message만",
    action: "재검사·재구성",
    passed: 4,
  },
  {
    title: "Process restart 뒤 journal과 현재 head를 대조해 중복과 누락을 찾습니다",
    detail: "복구한 local 상태를 그대로 채택하지 않고 현재 head에서 다시 수렴하는지 확인합니다.",
    head: "restart @ H″",
    pending: "복구 후 재검사",
    action: "중복·누락 확인",
    passed: 5,
  },
  {
    title: "새 head의 검사를 통과한 항목만 pending set으로 채택합니다",
    detail: "되돌아온 메시지와 journal 항목도 nonce, 잔액, gas, policy 가운데 하나라도 맞지 않으면 실행 후보에서 빠집니다.",
    head: "H″ · 검증 완료",
    pending: "일관된 pending set",
    action: "P_new 확정",
    passed: 6,
  },
] as const;
const RECOVERY_NOTES = RECOVERY_SCENES.map(
  (scene, index) => `${index + 1}. ${scene.title} ${scene.detail} 다음 행동은 ${scene.action}입니다.`,
);

export function MpoolRecoveryViz() {
  const scenes = useAnimatedScenes(RECOVERY_SCENES.length, 7400, { loop: false });
  const scene = RECOVERY_SCENES[scenes.active];

  return (
    <VizFrame
      eyebrow="Head apply → revert → restart"
      title="되돌린 메시지는 새 head에서 다시 검사합니다"
      description="Pending set을 복사하는 대신 actor 상태와 정책에 맞춰 다시 수렴하는지 확인합니다."
      documentFlow
      canvasClassName="p-3 sm:p-6"
    >
      <div
        id={scenes.playbackId}
        tabIndex={0}
        onKeyDown={scenes.onKeyDown}
        className="outline-none focus-visible:ring-2 focus-visible:ring-primary"
        aria-label="Lotus mpool head 변경과 복구 장면 탐색기"
      >
        <div data-viz-live-only className="space-y-4">
          <div className="border border-border bg-background p-4">
            <h4 className="break-keep text-sm font-black leading-6 sm:text-base">{scene.title}</h4>
            <p className="mt-2 break-keep text-xs leading-6 text-muted-foreground">{scene.detail}</p>
          </div>
          <div className="grid grid-cols-3 gap-px bg-border p-px">
            {[
              ["현재 head", scene.head],
              ["pending", scene.pending],
              ["다음 행동", scene.action],
            ].map(([label, value]) => (
              <div key={label} className="bg-background p-3">
                <p className="text-[9px] font-bold text-muted-foreground">{label}</p>
                <p className="mt-2 break-keep font-mono text-[10px] font-black leading-5">{value}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-6">
            {RECOVERY_GATES.map((gate, index) => (
              <div
                key={gate}
                className={`border p-2.5 text-center ${
                  index < scene.passed
                    ? "border-primary bg-primary/5"
                    : "border-border bg-background text-muted-foreground"
                }`}
              >
                <p className="text-[9px] font-black">{gate}</p>
                <p className="mt-2 text-[9px] font-bold">{index < scene.passed ? "확인" : "대기"}</p>
              </div>
            ))}
          </div>
          <AnimatedSceneControls
            {...scenes}
            labels={RECOVERY_LABELS}
            playLabel="Mpool 복구 경로 재생"
            compact
          />
        </div>
        <StaticSceneList labels={RECOVERY_LABELS} notes={RECOVERY_NOTES} />
      </div>
    </VizFrame>
  );
}

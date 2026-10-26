import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = [
  "입력 고정",
  "첫 상태 계산",
  "초기값 변경",
  "경계 직전",
  "경계 도달",
  "판단 공유",
] as const;

const NOTES = [
  "설명용 체인 두 개는 번호 777, Alice의 초기 잔액 100, 규칙 변경 시각 1,000을 함께 사용합니다. 세 값은 작동 원리를 보기 위한 가정입니다.",
  "초기 계정 전체에서 상태 루트 R₁₀₀을 만들고, 그 값을 첫 블록 헤더에 넣어 제네시스 해시 G₁₀₀을 얻습니다. 실제 해시는 암호학적으로 계산하므로 여기서는 기호로 표시합니다.",
  "두 번째 설정에서 Alice의 잔액만 101로 바꾸면 상태 루트와 첫 블록 해시가 모두 달라집니다. 체인 번호 777이 같아도 같은 출발 상태가 아닙니다.",
  "첫 번째 설정으로 돌아와 후보 블록의 시각이 999라고 하겠습니다. 변경 시각 1,000에 아직 닿지 않았으므로 이전 실행 규칙을 고릅니다.",
  "후보 블록의 시각이 1,000이 되면 조건을 만족합니다. 같은 거래 바이트라도 이제 새 헤더 필드와 새 실행 규칙을 적용해야 합니다.",
  "검증기·EVM·페이로드 빌더·피어 호환성 검사는 같은 규칙 묶음과 같은 블록 문맥을 사용해야 합니다. 하나라도 다른 결정을 내리면 노드 안에서 결과가 갈라집니다.",
] as const;

const STEPS = [
  ["입력", "번호 · 초기 계정 · 변경 시각"],
  ["첫 블록", "상태 루트 · 제네시스 해시"],
  ["차이", "100 → 101"],
  ["이전", "t=999"],
  ["전환", "t=1,000"],
  ["공유", "네 경로의 같은 판단"],
] as const;

const SNAPSHOTS = [
  { balance: "100", root: "계산 전", genesis: "계산 전", time: "—", rule: "선택 전", result: "입력 세 값 고정" },
  { balance: "100", root: "R₁₀₀", genesis: "G₁₀₀", time: "—", rule: "선택 전", result: "첫 상태의 정체성 생성" },
  { balance: "101", root: "R₁₀₁ ≠ R₁₀₀", genesis: "G₁₀₁ ≠ G₁₀₀", time: "—", rule: "선택 전", result: "같은 번호 · 다른 체인" },
  { balance: "100", root: "R₁₀₀", genesis: "G₁₀₀", time: "999", rule: "이전 규칙", result: "999 ≥ 1,000은 거짓" },
  { balance: "100", root: "R₁₀₀", genesis: "G₁₀₀", time: "1,000", rule: "새 규칙", result: "1,000 ≥ 1,000은 참" },
  { balance: "100", root: "R₁₀₀", genesis: "G₁₀₀", time: "1,000", rule: "새 규칙", result: "검증 · 실행 · 제작 · 연결이 일치" },
] as const;

const CONSUMERS = ["블록 검사", "EVM 실행", "후보 블록 제작", "피어 호환성"] as const;

export default function ContextViz() {
  const scenes = useAnimatedScenes(SCENES.length, 5200, { loop: false });
  const active = scenes.active;
  const snapshot = SNAPSHOTS[active];

  return (
    <VizFrame
      eyebrow="한 설정의 생애 · 초기 상태 → 규칙 선택"
      title="체인 번호·첫 상태·규칙 변경 시점을 함께 고정해야 같은 블록을 계산합니다"
      description="번호 777인 설명용 체인에서 Alice의 초기 잔액과 후보 블록 시각을 바꾸며 무엇이 달라지는지 추적합니다. 재생은 직접 시작하며 마지막 장면에서 멈춥니다."
      note="777·잔액 100/101·시각 1,000은 설명용 가정입니다. R₁₀₀·G₁₀₀은 실제 해시값이 아니라 변화 관계를 나타내는 기호입니다."
      canvasClassName="px-2 py-2 sm:p-5"
    >
      <div
        id={scenes.playbackId}
        data-viz-live-only
        data-reth-chainspec-scene={active}
        tabIndex={0}
        role="group"
        aria-label="같은 체인 번호에서 초기 상태와 규칙 변경 시점이 판단을 바꾸는 과정"
        onKeyDown={scenes.onKeyDown}
        className="outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
      >
        <div className="grid grid-cols-3 gap-px bg-border p-px" aria-label="설명용 입력">
          <div className="min-w-0 bg-background px-2 py-2.5 sm:px-3">
            <p className="text-[9px] font-bold text-muted-foreground">체인 번호</p>
            <p className="mt-1 font-mono text-sm font-black">777</p>
          </div>
          <div className="min-w-0 bg-background px-2 py-2.5 sm:px-3">
            <p className="text-[9px] font-bold text-muted-foreground">Alice 잔액</p>
            <p className={`mt-1 font-mono text-sm font-black ${active === 2 ? "text-primary" : ""}`}>{snapshot.balance}</p>
          </div>
          <div className="min-w-0 bg-background px-2 py-2.5 sm:px-3">
            <p className="text-[9px] font-bold text-muted-foreground">규칙 변경 시각</p>
            <p className="mt-1 font-mono text-sm font-black">1,000</p>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-px bg-border p-px lg:grid-cols-6" aria-label="체인 규칙을 고르는 여섯 단계">
          {STEPS.map(([label, detail], index) => {
            const passed = index < active;
            const current = index === active;
            return (
              <div key={label} className={`min-w-0 bg-background px-2 py-2.5 ${current ? "text-foreground" : "text-muted-foreground"}`}>
                <span className={`mb-2 block h-1 w-7 ${current ? "bg-primary" : passed ? "bg-primary/35" : "bg-border"}`} />
                <strong className="block break-keep text-xs">{label}</strong>
                <span className="mt-1 hidden break-keep text-[10px] leading-4 sm:block">{detail}</span>
              </div>
            );
          })}
        </div>

        <div className="mt-3 grid grid-cols-2 gap-px bg-border p-px lg:grid-cols-5" aria-label="현재 장면의 계산 결과">
          {[
            ["상태 루트", snapshot.root],
            ["첫 블록 해시", snapshot.genesis],
            ["후보 시각", snapshot.time],
            ["선택한 규칙", snapshot.rule],
            ["판정", snapshot.result],
          ].map(([label, value], index) => (
            <div key={label} className={`min-w-0 bg-background px-3 py-3 ${index === 4 ? "col-span-2 lg:col-span-1" : ""}`}>
              <p className="text-[9px] font-bold text-muted-foreground">{label}</p>
              <p className="mt-1 break-keep text-xs font-black leading-5">{value}</p>
            </div>
          ))}
        </div>

        <div className={`mt-3 grid grid-cols-2 gap-px bg-border p-px sm:grid-cols-4 ${active === 5 ? "opacity-100" : "opacity-45"}`} aria-label="같은 규칙을 소비하는 네 경로">
          {CONSUMERS.map((consumer) => (
            <div key={consumer} className="min-w-0 bg-background px-2 py-2.5 text-center">
              <strong className="block break-keep text-[10px] leading-4 sm:text-xs">{consumer}</strong>
              <span className="mt-1 block text-[9px] font-bold text-primary">{active === 5 ? "새 규칙" : "판정 대기"}</span>
            </div>
          ))}
        </div>

        <p data-scene-note className="mt-3 min-h-20 border-l-2 border-primary/50 pl-3 text-xs leading-5 text-muted-foreground sm:min-h-16 sm:pl-4 sm:text-sm sm:leading-6">
          {NOTES[active]}
        </p>

        <AnimatedSceneControls
          {...scenes}
          labels={SCENES}
          controlLabels={["입력", "첫 상태", "변경", "999", "1,000", "공유"]}
          playLabel="체인 규칙 선택 재생"
          className="mt-0 sm:mt-4"
        />
      </div>
      <StaticSceneList labels={SCENES} notes={NOTES} />
    </VizFrame>
  );
}

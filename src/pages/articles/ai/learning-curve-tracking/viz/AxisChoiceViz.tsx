import { StableSceneStack } from "@/components/viz/StableSceneStack";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: small-case·why-axes 절.
 * A는 갱신당 1,000토큰, B는 4,000토큰(가정).
 * 갱신 250회: A 25만, B 100만토큰. 100만토큰: A 1,000회, B 250회.
 * 예산 200만과 2,000만토큰에서 진행률 0.5 = 100만과 1,000만토큰(가정).
 */
const PER_UPDATE_A = 1000;
const PER_UPDATE_B = 4000;
const SAME_UPDATE = 250;
const TARGET = 1_000_000;
const BUDGETS = [2_000_000, 20_000_000] as const;
const HALF = 0.5;

const A = "#2563eb";
const B = "#d97706";

const man = (tokens: number) => `${(tokens / 10000).toLocaleString("ko-KR")}만`;

const SCENES = [
  {
    label: "같은 갱신 번호로 맞추면",
    summary: `갱신 ${SAME_UPDATE}회 → ${man(PER_UPDATE_A * SAME_UPDATE)} 대 ${man(PER_UPDATE_B * SAME_UPDATE)}토큰`,
    note: "갱신 250회라는 같은 자리에서 A는 25만토큰, B는 100만토큰을 봤습니다. 이 자리에서 두 손실을 비교하면 본 자료의 양이 4배 다른 효과가 섞입니다.",
  },
  {
    label: "같은 토큰 수로 맞추면",
    summary: `100만토큰 → ${(TARGET / PER_UPDATE_A).toLocaleString("en-US")}회 대 ${TARGET / PER_UPDATE_B}회`,
    note: "가로축을 처리한 토큰으로 바꾸면 두 실행이 같은 양을 본 자리에서 만납니다. 그 대신 갱신 수가 1,000회와 250회로 갈립니다. 갱신 수 차이는 지워지지 않고 드러납니다.",
  },
  {
    label: "같은 진행률로 맞추면",
    summary: `진행률 ${HALF} → ${man(BUDGETS[0] * HALF)} 대 ${man(BUDGETS[1] * HALF)}토큰`,
    note: "전체 예산이 200만과 2,000만토큰인 두 실행은 각자의 막대에서 똑같이 절반입니다. 같은 토큰 눈금에 다시 놓으면 100만과 1,000만토큰으로 10배 차이가 납니다. 그래서 원래의 양과 예산을 함께 남깁니다.",
  },
] as const;

function Bar({ label, ratio, color, text }: { label: string; ratio: number; color: string; text: string }) {
  return (
    <div className="grid grid-cols-[5.5rem_minmax(0,1fr)_5.5rem] items-center gap-2 text-xs sm:grid-cols-[7rem_minmax(0,1fr)_6.5rem] sm:text-sm">
      <span className="font-semibold">{label}</span>
      <div className="h-4 min-w-0 rounded-sm bg-muted/40">
        <div className="h-full rounded-sm" style={{ width: `${Math.min(ratio, 1) * 100}%`, backgroundColor: color }} />
      </div>
      <span className="text-right font-mono font-bold">{text}</span>
    </div>
  );
}

function Axis({ text }: { text: string }) {
  return <p className="text-xs text-muted-foreground">{text}</p>;
}

function SameUpdate() {
  return (
    <div className="space-y-3">
      <Axis text="막대 = 처리한 토큰 (눈금 0 ~ 100만)" />
      <Bar label="A · 1,000/회" ratio={(PER_UPDATE_A * SAME_UPDATE) / TARGET} color={A} text={`${man(PER_UPDATE_A * SAME_UPDATE)}토큰`} />
      <Bar label="B · 4,000/회" ratio={(PER_UPDATE_B * SAME_UPDATE) / TARGET} color={B} text={`${man(PER_UPDATE_B * SAME_UPDATE)}토큰`} />
      <p className="text-xs font-semibold">두 실행 모두 갱신 {SAME_UPDATE}회 · 본 양은 4배 차이</p>
    </div>
  );
}

function SameTokens() {
  return (
    <div className="space-y-3">
      <Axis text="막대 = 처리한 토큰 (눈금 0 ~ 100만)" />
      <Bar label="A · 1,000/회" ratio={1} color={A} text={`${(TARGET / PER_UPDATE_A).toLocaleString("en-US")}회 갱신`} />
      <Bar label="B · 4,000/회" ratio={1} color={B} text={`${TARGET / PER_UPDATE_B}회 갱신`} />
      <p className="text-xs font-semibold">두 실행 모두 100만토큰 · 갱신 수는 4배 차이</p>
    </div>
  );
}

function SameProgress() {
  const max = BUDGETS[1];
  return (
    <div className="space-y-3">
      <Axis text="위 두 줄 = 각자의 예산을 1로 본 진행률" />
      <Bar label="예산 200만" ratio={HALF} color="#64748b" text={`진행률 ${HALF}`} />
      <Bar label="예산 2,000만" ratio={HALF} color="#64748b" text={`진행률 ${HALF}`} />
      <Axis text="아래 두 줄 = 같은 토큰 눈금 (0 ~ 2,000만)" />
      <Bar label="예산 200만" ratio={(BUDGETS[0] * HALF) / max} color="#334155" text={`${man(BUDGETS[0] * HALF)}토큰`} />
      <Bar label="예산 2,000만" ratio={(BUDGETS[1] * HALF) / max} color="#334155" text={`${man(BUDGETS[1] * HALF)}토큰`} />
    </div>
  );
}

export default function AxisChoiceViz() {
  return (
    <SceneShell
      eyebrow="가로축 고르기"
      title="같은 눈금 위치가 같은 학습량은 아닙니다"
      description="A는 한 번 갱신할 때 1,000토큰, B는 4,000토큰을 처리한다고 둡니다(가정). 갱신은 모델의 가중치를 한 번 바꾸는 일이고, 토큰은 정해진 규칙으로 센 학습 자료의 양입니다."
      note="진행률 장면의 두 예산(200만·2,000만토큰)은 본문 5절의 가정이며, A·B 중 어느 실행의 예산인지는 정하지 않았습니다."
      ariaLabel="갱신 번호, 토큰 수, 진행률로 두 학습 실행을 맞췄을 때 드러나는 차이"
      scenes={SCENES}
      render={(active) => (
        <StableSceneStack active={active} scenes={[<SameUpdate key="u" />, <SameTokens key="t" />, <SameProgress key="p" />]} />
      )}
    />
  );
}

import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 한 mechanism: 카드 한 장의 메모리를 가중치·여유·기억 칸으로 나누고, 그 기억 칸이 여덟 장에서 어떻게 쓰이는가.
 * 본문 대응: 3절 계산 장부(595.2GB, 0.92, 70,272 byte/token).
 * 숫자는 공칭 96GB 기준 (계산)이고 장면 4·5의 현장 수치는 rtx6kpro 위키(현장 경험)이다.
 */
const SCENES = ["카드 한 장 나누기", "여덟 장이 같은 모양", "기억 칸은 여덟 장이 같은 내용", "시퀀스를 여덟 조각으로", "넘친 기억은 호스트로"] as const;

const NOTES = [
  "96GB 가운데 0.92만 쓰면 88.3GB, 가중치 595.2GB를 여덟 장에 나누면 장마다 74.4GB입니다. 남는 13.9GB가 대화 기억(KV) 칸입니다.",
  "여덟 장 모두 같은 비율로 나뉩니다. 칸을 합치면 111GB라서 여덟 장 전체가 기억 칸 하나처럼 보입니다. 다음 장면이 이 합산이 틀린 이유입니다.",
  "기억이 층마다 압축 벡터 하나라 카드끼리 나눌 수 없어 여덟 장이 같은 기억을 한 벌씩 듭니다. 용량은 한 장 몫인 약 19.8만 토큰(계산), 현장 측정은 약 19만입니다.",
  "시퀀스를 여덟 조각 내 장마다 한 조각만 두고 값을 1byte로 줄이면 16배가 들어갑니다. 계산은 약 316만, 현장 측정은 3,621,504 토큰(0.93)입니다.",
  "넘친 기억은 호스트로 내립니다. 200K 대화는 1byte 기준 약 7GB라 1TB에 약 142개입니다. 카드마다 같은 기억을 각자 내린다면 17개인데, 이 부분은 확인하지 못했습니다.",
] as const;

const W_COLOR = "#64748b";
const KV_COLOR = "#2563eb";
const RES_COLOR = "#e2e8f0";
const SCALE = 3.6; // 1GB = 3.6 viewBox 단위 (96GB → 345.6)
const X0 = 70;

function CardBar({ y, label, kvLabel, kvFill = KV_COLOR, dim = false }: { y: number; label: string; kvLabel?: string; kvFill?: string; dim?: boolean }) {
  const w = 74.4 * SCALE;
  const kv = 13.9 * SCALE;
  const res = 7.7 * SCALE;
  return (
    <g opacity={dim ? 0.55 : 1}>
      <text x={X0 - 8} y={y + 13} textAnchor="end" fontSize={13} fill="#0f172a">{label}</text>
      <rect x={X0} y={y} width={w} height={18} fill={W_COLOR} />
      <rect x={X0 + w} y={y} width={kv} height={18} fill={kvFill} />
      <rect x={X0 + w + kv} y={y} width={res} height={18} fill={RES_COLOR} stroke="#cbd5e1" strokeWidth={1} />
      {kvLabel && (
        <text x={X0 + w + kv / 2} y={y + 13} textAnchor="middle" fontSize={12} fill="#ffffff" fontWeight={700}>{kvLabel}</text>
      )}
    </g>
  );
}

function OneCard() {
  return (
    <svg viewBox="0 0 480 230" className="h-auto w-full" role="img" aria-label={SCENES[0]}>
      <CardBar y={60} label="카드 0" kvLabel="13.9" />
      <text x={X0 + 74.4 * SCALE / 2} y={100} textAnchor="middle" fontSize={13} fill={W_COLOR}>가중치 74.4GB</text>
      <text x={X0 + 74.4 * SCALE + 13.9 * SCALE / 2} y={100} textAnchor="middle" fontSize={13} fill={KV_COLOR}>기억 칸</text>
      <text x={X0 + 88.3 * SCALE + 7.7 * SCALE / 2} y={52} textAnchor="middle" fontSize={12} fill="#64748b">여유 8%</text>
      <line x1={X0} y1={130} x2={X0 + 96 * SCALE} y2={130} stroke="#94a3b8" strokeWidth={1} />
      <text x={X0} y={146} fontSize={12} fill="#64748b">0</text>
      <text x={X0 + 96 * SCALE} y={146} textAnchor="end" fontSize={12} fill="#64748b">96GB</text>
      <text x={240} y={190} textAnchor="middle" fontSize={13} fill="#0f172a" fontWeight={600}>96 × 0.92 = 88.3GB → 88.3 − 74.4 = 13.9GB</text>
    </svg>
  );
}

function EightCards({ mode }: { mode: "same" | "replicated" | "split" }) {
  return (
    <svg viewBox="0 0 480 230" className="h-auto w-full" role="img" aria-label={SCENES[mode === "same" ? 1 : mode === "replicated" ? 2 : 3]}>
      {Array.from({ length: 8 }, (_, i) => (
        <CardBar
          key={i}
          y={8 + i * 22}
          label={`카드 ${i}`}
          kvLabel={mode === "same" ? undefined : mode === "replicated" ? "A 전체" : `A ${i + 1}/8`}
          kvFill={mode === "split" ? (i % 2 ? "#1d4ed8" : "#3b82f6") : KV_COLOR}
        />
      ))}
      <text x={240} y={204} textAnchor="middle" fontSize={13} fill={KV_COLOR} fontWeight={600}>
        {mode === "same" && "기억 칸 합계 13.9 × 8 = 111GB … 처럼 보입니다"}
        {mode === "replicated" && "같은 요청 A의 기억을 여덟 장이 모두 한 벌씩: 용량은 한 장 몫"}
        {mode === "split" && "요청 A를 여덟 조각으로: 장마다 1/8 · 값 크기 절반"}
      </text>
      <text x={240} y={222} textAnchor="middle" fontSize={12} fill="#64748b">
        {mode === "same" && "회색 가중치 · 파랑 기억 칸 · 연회색 여유"}
        {mode === "replicated" && "약 19.8만 토큰(계산) · 약 19만(현장)"}
        {mode === "split" && "약 316만 토큰(계산) · 3,621,504(현장, 0.93)"}
      </text>
    </svg>
  );
}

function HostSpill() {
  return (
    <svg viewBox="0 0 480 230" className="h-auto w-full" role="img" aria-label={SCENES[4]}>
      <rect x={30} y={20} width={150} height={60} rx={4} fill="#f8fafc" stroke="#94a3b8" strokeWidth={1} />
      <text x={105} y={45} textAnchor="middle" fontSize={13} fill="#0f172a" fontWeight={600}>카드 기억 칸</text>
      <text x={105} y={64} textAnchor="middle" fontSize={12} fill="#64748b">약 18개 대화(200K)</text>
      <line x1={180} y1={50} x2={240} y2={50} stroke={KV_COLOR} strokeWidth={1.2} />
      <text x={210} y={42} textAnchor="middle" fontSize={12} fill={KV_COLOR}>넘침</text>
      <rect x={240} y={14} width={210} height={150} rx={4} fill="#eff6ff" stroke={KV_COLOR} strokeWidth={1} />
      <text x={345} y={34} textAnchor="middle" fontSize={13} fill="#0f172a" fontWeight={600}>호스트 메모리 1TB (가정)</text>
      {Array.from({ length: 48 }, (_, i) => (
        <rect key={i} x={252 + (i % 12) * 16} y={46 + Math.floor(i / 12) * 18} width={12} height={12} fill={KV_COLOR} opacity={0.75} />
      ))}
      <text x={345} y={136} textAnchor="middle" fontSize={12} fill="#0f172a">칸 하나 ≈ 대화 3개 · 한 벌이면 약 142개</text>
      <text x={345} y={152} textAnchor="middle" fontSize={12} fill="#b45309">카드마다 한 벌씩이면 약 17개 (미확인)</text>
      <text x={240} y={204} textAnchor="middle" fontSize={13} fill="#0f172a" fontWeight={600}>200K × 61층 × 576 × 1byte ≈ 7.03GB</text>
    </svg>
  );
}

export default function CardBudgetViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4200);
  const scene = scenes.active;
  return (
    <VizFrame
      eyebrow="카드 한 장의 메모리 장부"
      title="가중치를 넣고 남은 칸은 여덟 장이 함께 쓰지 못합니다"
      description="막대 하나가 카드 한 장입니다. 회색은 가중치, 파랑은 대화 기억(KV) 칸, 연회색은 쓰지 않는 여유입니다."
      note="공칭 96GB와 가중치 균등 분할을 가정한 계산입니다. 실제 카드는 97,887MiB로 보고되고 활성값 작업 공간이 따로 들어가므로 측정값과 몇십 퍼센트 차이가 납니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="카드별 가중치와 KV 칸"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <p className="text-[11px] font-black text-primary">Scene · {String(scene + 1).padStart(2, "0")}</p>
        <h4 className="mt-2 text-base font-bold">{SCENES[scene]}</h4>
        <div className="mt-3 grid min-w-0 gap-3 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:items-center">
        <div className="w-full min-w-0">
          <StableSceneStack
            active={scene}
            scenes={[
              <OneCard key="one" />,
              <EightCards key="same" mode="same" />,
              <EightCards key="rep" mode="replicated" />,
              <EightCards key="split" mode="split" />,
              <HostSpill key="host" />,
            ]}
          />
        </div>
        <StableSceneStack
          active={scene}
          scenes={NOTES.map((note) => (
            <p key={note} className="border-l border-primary/50 pl-4 text-sm leading-6 lg:leading-7 text-muted-foreground">
              {note}
            </p>
          ))}
        />
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}

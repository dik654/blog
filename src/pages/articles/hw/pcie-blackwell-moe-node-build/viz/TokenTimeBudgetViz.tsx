import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 한 mechanism: 단일 스트림 토큰 하나의 시간 = 가중치 읽기 + 층마다 두 번 맞추기 × 61층 + 나머지.
 * 본문 대응: 5절 ExplainedFormula와 계산 장부. 65·44·32 tok/s와 600·900 tok/s는 rtx6kpro 위키(현장 경험).
 * 1.25ms는 활성 32B를 모두 4bit로 본 하한 (계산)이다.
 */
const SCENES = ["65 tok/s의 토큰 하나", "남은 시간 안의 맞추기 122번", "직접 길을 끄면 44 tok/s", "다른 CPU 노드는 32 tok/s", "동시 100개에서는 뒤집힘"] as const;

const NOTES = [
  "단일 사용자 65 tok/s는 토큰 하나에 15.4ms입니다. 카드마다 가중치를 읽는 시간은 하한으로 1.25ms라서, 메모리 읽기가 시간의 대부분이라는 설명으로는 나머지 14.1ms가 남습니다.",
  "61층마다 카드 여덟 장이 결과를 두 번 맞추므로 토큰 하나에 122번입니다. 남은 14.1ms가 모두 맞추기라고 해도 한 번에 약 116µs이고, 한 번에 옮기는 양은 14KiB뿐이라 이 시간은 대역폭보다 왕복 지연에서 나옵니다.",
  "같은 노드에서 카드끼리 직접 쓰는 길만 끄자 44 tok/s, 곧 22.7ms가 됐습니다. 늘어난 7.3ms를 맞추기 122번에 나누면 한 번에 약 60µs가 더 붙은 셈입니다(계산, 차이가 모두 맞추기에서 났다고 가정).",
  "CPU 세대와 메모리 구성이 다른 노드에서는 같은 설정으로 약 32 tok/s, 31.3ms였습니다. 메모리 채널 수, DIMM 수, 소켓 링크 수가 함께 달라 원인 하나로 나눌 수 없는 비교입니다.",
  "동시 요청 100개, 요청마다 40K 토큰에서는 직접 길을 끈 쪽이 약 900 tok/s로 켠 쪽 약 600보다 높았습니다. 요청 하나로 보면 9 대 6입니다. 단일 사용자 최적과 고동시성 최적이 서로 반대 설정입니다.",
] as const;

const X0 = 20;
const MS = 13.2; // 1ms = 13.2 viewBox 단위 (31.3ms → 413)

function Bar({ y, total, label, extra }: { y: number; total: number; label: string; extra?: number }) {
  const read = 1.25;
  return (
    <g>
      <text x={X0} y={y - 6} fontSize={13} fill="#0f172a" fontWeight={600}>{label}</text>
      <rect x={X0} y={y} width={read * MS} height={20} fill="#64748b" />
      <rect x={X0 + read * MS} y={y} width={(total - read - (extra ?? 0)) * MS} height={20} fill="#93c5fd" />
      {extra !== undefined && <rect x={X0 + (total - extra) * MS} y={y} width={extra * MS} height={20} fill="#f59e0b" />}
      <text x={X0 + total * MS + 4} y={y + 14} fontSize={12} fill="#475569">{total.toFixed(1)}ms</text>
    </g>
  );
}

function Ticks({ y, from, to, count }: { y: number; from: number; to: number; count: number }) {
  const step = ((to - from) * MS) / count;
  return (
    <g>
      {Array.from({ length: count }, (_, i) => (
        <line key={i} x1={X0 + from * MS + i * step} y1={y} x2={X0 + from * MS + i * step} y2={y + 20} stroke="#1d4ed8" strokeWidth={0.6} />
      ))}
    </g>
  );
}

function Scene({ index }: { index: number }) {
  if (index === 4) {
    const bar = (y: number, v: number, label: string, color: string) => (
      <g>
        <text x={X0} y={y - 6} fontSize={13} fill="#0f172a" fontWeight={600}>{label}</text>
        <rect x={X0} y={y} width={v * 0.36} height={22} fill={color} />
        <text x={X0 + v * 0.36 + 4} y={y + 15} fontSize={12} fill="#475569">약 {v} tok/s 합계</text>
      </g>
    );
    return (
      <svg viewBox="0 0 480 210" className="h-auto w-full" role="img" aria-label={SCENES[4]}>
        {bar(40, 600, "직접 길 켬 · 요청당 약 6 tok/s", "#93c5fd")}
        {bar(100, 900, "직접 길 끔 · 요청당 약 9 tok/s", "#2563eb")}
        <text x={240} y={168} textAnchor="middle" fontSize={13} fill="#0f172a" fontWeight={600}>동시 100개 × 40K 토큰 · 같은 노드 (현장 경험)</text>
        <text x={240} y={188} textAnchor="middle" fontSize={12} fill="#64748b">요청당 속도는 둘 다 에이전트 기준 20 tok/s에 못 미칩니다</text>
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 480 210" className="h-auto w-full" role="img" aria-label={SCENES[index]}>
      <Bar y={34} total={15.4} label="직접 길 켬 · 65 tok/s" />
      {index === 1 && <Ticks y={34} from={1.25} to={15.4} count={122} />}
      {index >= 2 && <Bar y={92} total={22.7} label="직접 길 끔 · 44 tok/s" extra={7.3} />}
      {index === 3 && <Bar y={150} total={31.3} label="다른 CPU 세대 노드 · 약 32 tok/s" extra={15.9} />}
      {index < 2 && (
        <g>
          <text x={X0} y={92} fontSize={12} fill="#64748b">회색: 가중치 읽기 하한 1.25ms</text>
          <text x={X0} y={110} fontSize={12} fill="#1d4ed8">파랑: 맞추기·커널·스케줄링 등 나머지 14.1ms</text>
          {index === 1 && <text x={X0} y={140} fontSize={13} fill="#0f172a" fontWeight={600}>세로선 122개 = 61층 × 층마다 2번</text>}
          {index === 1 && <text x={X0} y={160} fontSize={12} fill="#475569">14.1ms ÷ 122 ≈ 116µs (모두 맞추기라고 볼 때의 상한)</text>}
        </g>
      )}
      {index === 2 && <text x={X0} y={150} fontSize={12} fill="#b45309">주황: 늘어난 7.3ms ÷ 122 ≈ 60µs씩</text>}
      {index === 3 && <text x={X0} y={200} fontSize={12} fill="#b45309">메모리 채널·DIMM·소켓 링크가 함께 달라 통제된 비교가 아닙니다</text>}
    </svg>
  );
}

export default function TokenTimeBudgetViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4200);
  const scene = scenes.active;
  return (
    <VizFrame
      eyebrow="단일 스트림 토큰 하나의 시간"
      title="가중치 읽기는 짧고, 나머지 대부분이 카드끼리 맞추는 왕복에 걸립니다"
      description="막대 하나가 토큰 하나를 만드는 시간입니다. 세로선은 층마다 두 번 맞추는 통신이고, 주황은 설정을 바꿔 늘어난 시간입니다."
      note="65·44·32·600·900은 rtx6kpro 위키의 현장 보고이고 반복 횟수와 오차가 적혀 있지 않습니다. 1.25ms와 µs 값은 이 글의 계산입니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="토큰 하나의 시간 분해"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <p className="text-[11px] font-black text-primary">Scene · {String(scene + 1).padStart(2, "0")}</p>
        <h4 className="mt-2 text-base font-bold">{SCENES[scene]}</h4>
        <div className="mt-3 grid min-w-0 gap-3 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:items-center">
        <div className="w-full min-w-0">
          <StableSceneStack active={scene} scenes={SCENES.map((_, index) => <Scene key={index} index={index} />)} />
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

import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 한 mechanism: 노드를 늘리는 방식마다 노드 사이로 흐르는 데이터 양이 다르다.
 * 본문 대응: 8절 계산 장부. 14,336 byte/token(hidden 7,168 × 2byte), 70,272 byte/token(MLA KV BF16).
 * 모든 시간은 회선 속도만 쓴 이상값 (계산)이며 프로토콜 오버헤드와 혼잡을 넣지 않았다.
 */
const SCENES = ["복제본으로 늘리기", "층을 두 노드에 나누기", "앞뒤 단계를 나누기", "expert를 노드에 흩기"] as const;

const NOTES = [
  "노드마다 모델 한 벌을 올리고 요청 분배기가 요청을 나눠 주면, 카드끼리 맞추는 통신은 모두 노드 안에서 끝납니다. 노드 사이에는 요청 글자와 응답 글자만 오가므로 기존 100GbE 서비스망으로 충분합니다.",
  "층을 두 노드에 반씩 나누면 경계에서 토큰마다 hidden 벡터 하나, 14,336byte만 넘깁니다. 초당 2,000토큰이어도 0.23Gbps라 회선의 0.2%입니다. 대신 이 방식은 한 사용자를 빠르게 하지 않고 담을 수 있는 양만 늘립니다.",
  "앞 단계 노드가 프롬프트를 읽고 만든 기억을 뒤 단계 노드로 넘기면 데이터가 커집니다. 200K 토큰이면 2byte 기준 14.05GB라 100GbE로 1.12초, 400G로 0.28초가 걸립니다(이상값). 이때부터 RDMA와 400G가 일을 합니다.",
  "expert를 여러 노드에 흩으면 층마다 모든 토큰이 모든 노드를 오갑니다. 이 일을 빠르게 하는 라이브러리는 노드 안 전용 다리를 전제하고, 남는 대체 방식은 참여 노드가 늘수록 트래픽이 커집니다. 그래서 이 노드에서는 보류합니다.",
] as const;

const X0 = 24;

function Replica() {
  return (
    <svg viewBox="0 0 480 200" className="h-auto w-full" role="img" aria-label={SCENES[0]}>
      {[0, 1, 2].map((n) => (
        <g key={n}>
          <rect x={30 + n * 150} y={70} width={120} height={60} rx={5} fill="#f8fafc" stroke="#94a3b8" strokeWidth={1} />
          <text x={90 + n * 150} y={96} textAnchor="middle" fontSize={13} fill="#0f172a" fontWeight={600}>노드 {n + 1}</text>
          <text x={90 + n * 150} y={114} textAnchor="middle" fontSize={12} fill="#64748b">모델 한 벌 전부</text>
          <line x1={240} y1={40} x2={90 + n * 150} y2={70} stroke="#94a3b8" strokeWidth={1} />
        </g>
      ))}
      <rect x={180} y={14} width={120} height={26} rx={4} fill="#eff6ff" stroke="#2563eb" strokeWidth={1} />
      <text x={240} y={31} textAnchor="middle" fontSize={12} fill="#1d4ed8" fontWeight={600}>요청 분배기</text>
      <text x={240} y={164} textAnchor="middle" fontSize={13} fill="#0f172a" fontWeight={600}>노드 사이 카드 통신: 0</text>
      <text x={240} y={184} textAnchor="middle" fontSize={12} fill="#64748b">노드를 하나 더하면 담는 대화와 처리량이 한 벌만큼 늘어납니다</text>
    </svg>
  );
}

function Pipeline() {
  const full = 400;
  return (
    <svg viewBox="0 0 480 200" className="h-auto w-full" role="img" aria-label={SCENES[1]}>
      <text x={X0} y={34} fontSize={13} fill="#0f172a" fontWeight={600}>100GbE 회선</text>
      <rect x={X0} y={42} width={full} height={20} fill="#e2e8f0" />
      <text x={X0 + full + 4} y={57} fontSize={12} fill="#475569">100</text>
      <text x={X0} y={94} fontSize={13} fill="#0f172a" fontWeight={600}>경계 전송 · 2,000 tok/s</text>
      <rect x={X0} y={102} width={Math.max(2, (0.23 / 100) * full)} height={20} fill="#2563eb" />
      <text x={X0 + 10} y={117} fontSize={12} fill="#1d4ed8">0.23Gbps</text>
      <text x={240} y={158} textAnchor="middle" fontSize={13} fill="#0f172a" fontWeight={600}>7,168 × 2byte = 14,336byte/토큰</text>
      <text x={240} y={178} textAnchor="middle" fontSize={12} fill="#64748b">2,000 × 14,336 × 8bit ≈ 0.23Gbps</text>
    </svg>
  );
}

function Disagg() {
  const scale = 300; // 1.12초 → 336
  const bar = (y: number, s: number, label: string, color: string) => (
    <g>
      <text x={X0} y={y - 6} fontSize={13} fill="#0f172a" fontWeight={600}>{label}</text>
      <rect x={X0} y={y} width={s * scale} height={18} fill={color} />
      <text x={X0 + s * scale + 4} y={y + 13} fontSize={12} fill="#475569">{s.toFixed(2)}초</text>
    </g>
  );
  return (
    <svg viewBox="0 0 480 200" className="h-auto w-full" role="img" aria-label={SCENES[2]}>
      {bar(30, 1.12, "100GbE · 2byte 기억 14.05GB", "#93c5fd")}
      {bar(76, 0.28, "400G · 2byte 기억 14.05GB", "#2563eb")}
      {bar(122, 0.14, "400G · 1byte 기억 7.03GB", "#1d4ed8")}
      <text x={240} y={176} textAnchor="middle" fontSize={13} fill="#0f172a" fontWeight={600}>200K × 70,272byte ≈ 14.05GB · 한 벌 기준 이상값</text>
    </svg>
  );
}

function WideEp() {
  return (
    <svg viewBox="0 0 480 200" className="h-auto w-full" role="img" aria-label={SCENES[3]}>
      {[0, 1, 2, 3].map((n) => (
        <g key={n}>
          <rect x={40 + n * 105} y={60} width={88} height={44} rx={5} fill="#f8fafc" stroke="#94a3b8" strokeWidth={1} />
          <text x={84 + n * 105} y={86} textAnchor="middle" fontSize={13} fill="#0f172a">노드 {n + 1}</text>
        </g>
      ))}
      {[0, 1, 2, 3].flatMap((a) =>
        [0, 1, 2, 3]
          .filter((b) => b > a)
          .map((b) => (
            <path
              key={`${a}-${b}`}
              d={`M ${84 + a * 105} 60 Q ${84 + ((a + b) / 2) * 105} ${30 - (b - a) * 6} ${84 + b * 105} 60`}
              fill="none"
              stroke="#d97706"
              strokeWidth={1}
            />
          )),
      )}
      <text x={240} y={134} textAnchor="middle" fontSize={13} fill="#b45309" fontWeight={600}>층마다 모든 노드 쌍이 토큰을 주고받습니다</text>
      <text x={240} y={156} textAnchor="middle" fontSize={12} fill="#64748b">빠른 경로는 노드 안 전용 다리 필요 · 대체 경로는 노드 수에 비례해 증가</text>
      <text x={240} y={178} textAnchor="middle" fontSize={12} fill="#64748b">이 노드 설계에서는 비교 실험으로만 남깁니다</text>
    </svg>
  );
}

export default function NetworkNeedViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4200);
  const scene = scenes.active;
  return (
    <VizFrame
      eyebrow="노드 밖으로 나가는 데이터"
      title="노드를 늘리는 방식이 망 크기를 정합니다"
      description="같은 모델을 노드 여러 대로 늘리는 네 방식에서 노드 사이로 무엇이 얼마나 흐르는지 셉니다."
      note="시간은 회선 속도만으로 나눈 이상값입니다. 실제 전송은 프로토콜 오버헤드, 혼잡, 호스트 복사 여부에 따라 더 깁니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="확장 방식별 노드 간 트래픽"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <p className="text-[11px] font-black text-primary">Scene · {String(scene + 1).padStart(2, "0")}</p>
        <h4 className="mt-2 text-base font-bold">{SCENES[scene]}</h4>
        <div className="mt-3 grid min-w-0 gap-3 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:items-center">
        <div className="w-full min-w-0">
          <StableSceneStack active={scene} scenes={[<Replica key="r" />, <Pipeline key="p" />, <Disagg key="d" />, <WideEp key="w" />]} />
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
        <StaticSceneList labels={SCENES} notes={NOTES} />
      </div>
    </VizFrame>
  );
}

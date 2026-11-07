import SceneShell from "./SceneShell";

/**
 * 본문 대응: #channel — 위치에 따라 채널 전위가 오르면 국소 여유와 전자 층이 줄어든다.
 * 곡선은 9절의 조건(모든 위치에서 전류가 같음)에서 계산합니다.
 * 여분 전압 1.0 V, t=소스에서 간 거리 비율: V(t) = 1 − √(1 − 2·I·t), I = 0.18(양끝 0.2 V) 또는 0.5(1.0 V 이상).
 * 층 높이는 1 − V(t)에 비례합니다. 0.2 V 드레인 끝 1 − 0.2 = 0.8, 1.0 V 드레인 끝 1 − 1 = 0.
 */
const X0 = 70;
const X1 = 290;
const TOP = 36;
const LAYER = 36;
const BASE_Y = 208;
const V_SCALE = 62;
const SAMPLES = Array.from({ length: 61 }, (_, index) => 1 - (1 - index / 60) ** 2);

const SCENES = [
  { label: "양끝 0.2 V", summary: "드레인 쪽 여유 1.0−0.2=0.8 V", drain: 0.2, end: 0.2, current: 0.18, note: "소스 쪽에는 여분 전압 1.0 V가 온전히 걸리고, 드레인으로 갈수록 채널 전위가 올라 여유가 0.8 V까지 줄어듭니다. 전자 층은 얇아져도 끝까지 이어집니다." },
  { label: "양끝 1.0 V", summary: "드레인 쪽 여유 1.0−1.0=0 V", drain: 1.0, end: 1.0, current: 0.5, note: "드레인 끝의 여유가 이상 모델에서 0 V가 되어 채널 끝이 잘록해집니다. 그래도 전자가 드레인에 닿는 길이 완전히 막힌 것은 아니고, 소스 쪽에서는 전자가 계속 공급되므로 층 전체가 한꺼번에 사라지지도 않습니다." },
  { label: "양끝 1.5 V", summary: "1.5−1.0=0.5 V는 잘록한 끝에", drain: 1.5, end: 1.0, current: 0.5, note: "긴 채널의 이상 모델에서는 1.0 V를 넘는 0.5 V가 잘록해진 부분에 주로 걸립니다. 그래서 그 앞쪽 층의 모양은 1.0 V 때와 거의 같게 남습니다." },
] as const;

const vAt = (t: number, current: number) => 1 - Math.sqrt(Math.max(0, 1 - 2 * current * t));
const xAt = (t: number) => X0 + t * (X1 - X0);
const yV = (v: number) => BASE_Y - v * V_SCALE;

function round(value: number) {
  return Math.round(value * 10) / 10;
}

export default function ChannelProfileViz() {
  return (
    <SceneShell
      eyebrow="같은 길의 위치별 전압"
      title="드레인으로 갈수록 전자 층은 왜 얇아질까요"
      description="위는 게이트 아래 전자 층, 아래는 같은 가로 위치의 채널 전압입니다. 아래 전압이 오른 만큼 위의 층이 얇아집니다. 게이트 1.5 V, 문턱 0.5 V, 소스 0 V는 가정입니다."
      note="층 높이는 국소 여유에 비례하게 그린 개념도(가정)이며 실제 두께 치수가 아닙니다. 전압 곡선은 9절 이상 모델에서 계산했습니다. 1.0 V 위쪽의 세로 점선은 잘록한 끝에 몰리는 전압을 뜻하며, 그 구간의 실제 길이나 모양을 나타내지 않습니다."
      ariaLabel="양끝 전압 0.2, 1.0, 1.5 볼트에서 위치별 채널 전압과 전자 층"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const layerPoints = SAMPLES.map((t) => `${round(xAt(t))},${round(TOP + (1 - vAt(t, scene.current)) * LAYER)}`).join(" ");
        const curve = SAMPLES.map((t) => `${round(xAt(t))},${round(yV(vAt(t, scene.current)))}`).join(" ");
        const margin = Math.max(0, 1 - scene.end);
        return (
          <svg viewBox="0 0 360 236" className="mx-auto h-auto w-full max-w-[470px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <rect x={X0} y={6} width={X1 - X0} height={20} rx={3} fill="#64748b" fillOpacity={0.28} stroke="#64748b" strokeWidth={1} />
            <text x={(X0 + X1) / 2} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill="currentColor">게이트 1.5 V</text>
            <rect x={X0} y={26} width={X1 - X0} height={10} fill="#94a3b8" fillOpacity={0.45} stroke="#64748b" strokeWidth={1} />
            <rect x={18} y={36} width={X0 - 18} height={LAYER + 4} rx={3} fill="#2563eb" fillOpacity={0.14} stroke="#2563eb" strokeWidth={1} />
            <rect x={X1} y={36} width={342 - X1} height={LAYER + 4} rx={3} fill="#2563eb" fillOpacity={0.14} stroke="#2563eb" strokeWidth={1} />
            <text x={44} y={58} textAnchor="middle" fontSize={11} fill="currentColor">소스</text>
            <text x={316} y={58} textAnchor="middle" fontSize={11} fill="currentColor">드레인</text>
            <polygon points={`${X0},${TOP} ${X1},${TOP} ${layerPoints.split(" ").reverse().join(" ")}`} fill="#2563eb" fillOpacity={0.55} stroke="#2563eb" strokeWidth={1} />
            <text x={X0 + 4} y={92} fontSize={11} fontWeight={700} fill="#2563eb">소스 쪽 여유 1.0 V</text>
            <text x={X1 - 4} y={92} textAnchor="end" fontSize={11} fontWeight={700} fill="#2563eb">드레인 쪽 여유 {margin === 0 ? "0" : margin.toFixed(1)} V</text>

            <line x1={X0} x2={X1} y1={BASE_Y} y2={BASE_Y} stroke="#94a3b8" strokeWidth={1} />
            <line x1={X0} x2={X0} y1={yV(1.5)} y2={BASE_Y} stroke="#94a3b8" strokeWidth={1} />
            <line x1={X0} x2={X1} y1={yV(1)} y2={yV(1)} stroke="#94a3b8" strokeWidth={1} strokeDasharray="3 3" />
            <text x={X0 - 5} y={yV(1) + 4} textAnchor="end" fontSize={10} fill="currentColor">1.0 V</text>
            <text x={X0 - 5} y={BASE_Y + 4} textAnchor="end" fontSize={10} fill="currentColor">0 V</text>
            <text x={X0 - 5} y={yV(1.5) + 4} textAnchor="end" fontSize={10} fill="currentColor">1.5 V</text>
            <text x={X0 + 6} y={yV(1.5) + 10} fontSize={10} fill="currentColor">채널 전압</text>
            <polyline points={curve} fill="none" stroke="#d97706" strokeWidth={1.25} />
            {scene.drain > 1 && <line x1={X1} x2={X1} y1={yV(1)} y2={yV(scene.drain)} stroke="#d97706" strokeWidth={1.25} strokeDasharray="3 3" />}
            <circle cx={X1} cy={yV(scene.drain)} r={3.5} fill="#d97706" />
            <text x={X1 + 7} y={yV(scene.drain) + 4} fontSize={11} fontWeight={700} fill="#d97706">{scene.drain.toFixed(1)} V</text>
            <text x={X0} y={BASE_Y + 16} fontSize={10} fill="currentColor">소스 쪽</text>
            <text x={X1} y={BASE_Y + 16} textAnchor="end" fontSize={10} fill="currentColor">드레인 쪽</text>
          </svg>
        );
      }}
    />
  );
}

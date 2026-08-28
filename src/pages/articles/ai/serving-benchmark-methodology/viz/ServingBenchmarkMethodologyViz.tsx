import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * Offered load λ 를 올리면서 throughput 과 평균 latency 가 어떻게 갈라지는지를
 * M/M/1(μ = 10 req/s) 로 그린다. 한 mechanism: throughput 은 λ 를 따라가다 μ 에서 포화하고,
 * latency 는 1/(μ−λ) 로 그 전에 먼저 꺾여 오른다. 장면마다 곡선이 현재 λ 까지만 그려진다.
 */
const MU = 10;
const SCENES = ["λ = 2 (ρ 0.2)", "λ = 5 (ρ 0.5)", "λ = 8 (ρ 0.8)", "λ = 9.5 (ρ 0.95)"] as const;
const SCENE_LAMBDA = [2, 5, 8, 9.5] as const;

const LAMBDAS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 8.5, 9, 9.25, 9.5, 9.75] as const;

const NOTES = [
  "Utilization 20 % 에서는 도착했을 때 서버가 놀고 있을 확률이 높아 체류 시간 0.125 s 가 service time 0.1 s 와 거의 같습니다. Throughput 은 λ 그대로 2 req/s 입니다.",
  "λ = 5 에서 체류 시간은 1/(10−5) = 0.2 s 로 service time 의 두 배입니다. 절반이 기다림입니다. Throughput 은 여전히 λ 를 그대로 따라 5 req/s 입니다.",
  "λ = 8 에서 체류 시간은 0.5 s, queueing delay 는 0.4 s 로 service time 의 네 배입니다. Throughput 은 8 req/s 로 아직 오르지만 latency 곡선은 이미 꺾이기 시작했습니다.",
  "λ = 9.5 에서 체류 시간은 2.0 s, 대기열에는 평균 L = λW = 19 개가 있습니다. Throughput 은 9.5 로 μ 에 붙었고 saturation point 직전입니다. λ 가 10 을 넘으면 정상 상태가 없습니다.",
] as const;

interface Point {
  lambda: number;
  throughput: number | null;
  latency: number | null;
}

function buildData(activeLambda: number): Point[] {
  return LAMBDAS.map((lambda) => {
    const visible = lambda <= activeLambda;
    return {
      lambda,
      throughput: visible ? lambda : null,
      latency: visible ? 1 / (MU - lambda) : null,
    };
  });
}

export default function ServingBenchmarkMethodologyViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3000);
  const activeLambda = SCENE_LAMBDA[scenes.active];
  const data = buildData(activeLambda);
  const rho = activeLambda / MU;
  const wait = 1 / (MU - activeLambda);
  const queueing = wait - 1 / MU;
  const inSystem = activeLambda * wait;

  return (
    <VizFrame
      eyebrow="Utilization–latency curve"
      title="Throughput 은 μ 에서 포화하고 latency 는 그 전에 먼저 꺾여 오릅니다"
      description="μ = 10 req/s 인 M/M/1 서버에 offered load λ 를 올립니다. 파란 선은 처리한 throughput(왼쪽 축), 주황 선은 평균 체류 시간 W = 1/(μ−λ)(오른쪽 축) 입니다. 장면마다 곡선이 현재 λ 까지 그려집니다."
      note="M/M/1 은 직관용 model 입니다. 실제 LLM serving 은 batch 가 μ 를 바꾸고 service time 이 출력 길이를 따르므로 곡선의 무릎 위치는 λ sweep 으로 실측해야 합니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="Offered load 에 따른 throughput 과 latency 곡선"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(32rem,calc(100dvh-15rem))] min-h-[27rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">
            Scene · {String(scenes.active + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[scenes.active]}</h4>

          <div className="mt-4 h-52 min-w-0 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 8, right: 8, bottom: 4, left: -8 }}>
                <CartesianGrid stroke="#9ca3af" strokeOpacity={0.25} strokeDasharray="2 4" />
                <XAxis
                  dataKey="lambda"
                  type="number"
                  domain={[0, 10]}
                  ticks={[0, 2, 4, 6, 8, 10]}
                  tick={{ fill: "#6b7280", fontSize: 10 }}
                  stroke="#9ca3af"
                  tickLine={false}
                />
                <YAxis
                  yAxisId="left"
                  domain={[0, 10]}
                  ticks={[0, 5, 10]}
                  tick={{ fill: "#2563eb", fontSize: 10 }}
                  stroke="#9ca3af"
                  tickLine={false}
                  width={28}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  domain={[0, 4]}
                  ticks={[0, 1, 2, 3, 4]}
                  tick={{ fill: "#d97706", fontSize: 10 }}
                  stroke="#9ca3af"
                  tickLine={false}
                  width={28}
                />
                <Tooltip
                  isAnimationActive={false}
                  formatter={(value, name) =>
                    name === "latency"
                      ? [`${Number(value).toFixed(2)} s`, "W (s)"]
                      : [`${Number(value).toFixed(1)} req/s`, "throughput"]
                  }
                  labelFormatter={(label) => `λ = ${label} req/s`}
                  contentStyle={{ fontSize: 11, padding: "4px 8px" }}
                />
                <ReferenceLine yAxisId="left" y={MU} stroke="#6b7280" strokeDasharray="4 4" strokeWidth={1} />
                <ReferenceLine yAxisId="left" x={activeLambda} stroke="#6b7280" strokeWidth={1} />
                <Line
                  yAxisId="left"
                  type="linear"
                  dataKey="throughput"
                  stroke="#2563eb"
                  strokeWidth={1.25}
                  dot={false}
                  isAnimationActive={false}
                  connectNulls={false}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="latency"
                  stroke="#d97706"
                  strokeWidth={1.25}
                  dot={false}
                  isAnimationActive={false}
                  connectNulls={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-1 flex justify-between text-[10px] font-bold text-muted-foreground">
            <span style={{ color: "#2563eb" }}>throughput (req/s)</span>
            <span>offered load λ (req/s) · 점선 = μ</span>
            <span style={{ color: "#d97706" }}>W (s)</span>
          </div>

          <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 font-mono text-xs sm:grid-cols-4">
            <div>
              <dt className="text-muted-foreground">ρ = λ/μ</dt>
              <dd className="font-bold text-foreground">{rho.toFixed(2)}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Service 1/μ</dt>
              <dd className="font-bold text-foreground">0.10 s</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Queueing ρ/(μ−λ)</dt>
              <dd className="font-bold text-foreground">{queueing.toFixed(3)} s</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">L = λW</dt>
              <dd className="font-bold text-foreground">{inSystem.toFixed(1)} 개</dd>
            </div>
          </dl>

          <p className="mt-4 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
            {NOTES[scenes.active]}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}

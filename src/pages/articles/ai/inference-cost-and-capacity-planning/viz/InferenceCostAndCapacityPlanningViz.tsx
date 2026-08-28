import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 하루 트래픽 곡선 위에 capacity 선을 놓고, 고정 용량의 over/underprovisioning 과
 * reserved + autoscaling 이 트래픽을 따라가는 모습을 보여 준다.
 * 한 mechanism: 용량은 GPU 수 × GPU 당 SLO 처리량 × 목표 utilization 이고, 그 선이 트래픽 위에 있어야 SLO 가 지켜진다.
 */
const SCENES = ["트래픽과 peak", "고정 9 장 (over)", "고정 6 장 (under)", "reserved 6 + autoscale 9"] as const;

/** 시간대별 요청률(RPS). peak 20 at 11시, 평균 약 11. */
const TRAFFIC = [6, 5, 4, 4, 4, 5, 7, 10, 14, 17, 19, 20, 19, 18, 18, 17, 16, 15, 13, 11, 10, 9, 8, 7] as const;

/** GPU 한 장이 SLO 아래에서 내는 1,000 tokens/s 를 요청당 300 token 으로 나눈 3.33 RPS 에 목표 utilization 0.7 을 곱한 값. */
const RPS_PER_GPU = (1000 / 300) * 0.7;
const RESERVED = 6;
const MAX_GPUS = 9;

const NOTES = [
  "새벽 4 RPS 에서 11 시 peak 20 RPS 까지 5 배 차이입니다. 요청당 300 token 이면 peak 는 6,000 tokens/s 이고, GPU 한 장이 SLO 아래에서 1,000 tokens/s 를 내므로 utilization 0.7 기준 GPU 당 2.33 RPS 입니다.",
  "9 장 고정이면 용량 21 RPS 로 peak 를 headroom 5 % 로 덮습니다. 하지만 새벽 4 RPS 에서는 utilization 이 13 % 라 GPU-hour 대부분이 비어 나가고 그 시간대 cost/token 은 만차 기준의 5 배가 넘습니다.",
  "6 장 고정이면 용량 14 RPS 로 09 시부터 17 시까지 트래픽이 용량을 넘습니다. 그 구간은 offered load 가 capacity 를 넘어 대기열이 쌓이는 발산 구간이라 P95 TTFT 가 SLO 를 어기고 timeout 이 납니다.",
  "기본 6 장을 reserved 로 두고 9 장까지 autoscaling 하면 낮에만 3 장이 더 뜹니다. 반응형은 한 시간 전 트래픽으로 결정하므로 09 시와 10 시에는 트래픽이 용량보다 먼저 올라 잠깐 위반이 납니다. 그 간격이 headroom 과 scheduled scaling 이 필요한 이유입니다.",
] as const;

interface Point {
  hour: number;
  traffic: number;
  capacity: number | null;
  violation: number | null;
}

function gpusFor(scene: number, hour: number): number | null {
  if (scene === 0) return null;
  if (scene === 1) return MAX_GPUS;
  if (scene === 2) return RESERVED;
  const previous = TRAFFIC[(hour + 23) % 24];
  const desired = Math.ceil(previous / RPS_PER_GPU);
  return Math.min(MAX_GPUS, Math.max(RESERVED, desired));
}

function buildData(scene: number): Point[] {
  return TRAFFIC.map((traffic, hour) => {
    const gpus = gpusFor(scene, hour);
    const capacity = gpus === null ? null : Math.round(gpus * RPS_PER_GPU * 10) / 10;
    const violation = capacity !== null && traffic > capacity ? traffic : null;
    return { hour, traffic, capacity, violation };
  });
}

function gpuHours(scene: number): number {
  return TRAFFIC.reduce((sum, _, hour) => sum + (gpusFor(scene, hour) ?? 0), 0);
}

export default function InferenceCostAndCapacityPlanningViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3200);
  const scene = scenes.active;
  const data = buildData(scene);
  const violations = data.filter((point) => point.violation !== null).length;
  const hours = gpuHours(scene);
  const peakGpus = Math.max(...data.map((_, hour) => gpusFor(scene, hour) ?? 0));
  const peakCapacity = peakGpus * RPS_PER_GPU;
  const headroom = scene === 0 ? null : Math.round((peakCapacity / 20 - 1) * 100);
  const avgUtil = scene === 0 ? null : Math.round((TRAFFIC.reduce((a, b) => a + b, 0) / (hours * RPS_PER_GPU)) * 100);

  return (
    <VizFrame
      eyebrow="Capacity planning"
      title="용량 선이 트래픽 위에 있어야 SLO 가 지켜지고, 너무 위에 있으면 GPU-hour 가 비어 나갑니다"
      description="가로축은 하루 24 시간, 세로축은 요청률(RPS) 입니다. 회색 면이 트래픽, 파란 계단선이 GPU 수 × 2.33 RPS 의 용량이며, 주황 점은 트래픽이 용량을 넘은 시간대입니다."
      note="트래픽 곡선·GPU 당 처리량·$2/GPU-h 는 설명용 가정값입니다. Autoscaling 장면은 한 시간 지연의 반응형 정책을 단순화한 것이며 실제 준비 시간은 replica 의 ready-capacity 경로가 정합니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="하루 트래픽 위의 capacity 선과 autoscaling"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(32rem,calc(100dvh-15rem))] min-h-[27rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">
            Scene · {String(scene + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[scene]}</h4>

          <div className="mt-4 h-52 min-w-0 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={data} margin={{ top: 8, right: 8, bottom: 4, left: -12 }}>
                <CartesianGrid stroke="#9ca3af" strokeOpacity={0.25} strokeDasharray="2 4" />
                <XAxis
                  dataKey="hour"
                  type="number"
                  domain={[0, 23]}
                  ticks={[0, 6, 12, 18, 23]}
                  tickFormatter={(value) => `${String(value).padStart(2, "0")}시`}
                  tick={{ fill: "#6b7280", fontSize: 10 }}
                  stroke="#9ca3af"
                  tickLine={false}
                />
                <YAxis
                  domain={[0, 24]}
                  ticks={[0, 6, 12, 18, 24]}
                  tick={{ fill: "#6b7280", fontSize: 10 }}
                  stroke="#9ca3af"
                  tickLine={false}
                  width={32}
                />
                <Tooltip
                  isAnimationActive={false}
                  formatter={(value, name) => [`${Number(value).toFixed(1)} RPS`, name === "capacity" ? "용량" : name === "violation" ? "초과" : "트래픽"]}
                  labelFormatter={(label) => `${String(label).padStart(2, "0")}:00`}
                  contentStyle={{ fontSize: 11, padding: "4px 8px" }}
                />
                <Area
                  type="monotone"
                  dataKey="traffic"
                  stroke="#6b7280"
                  strokeWidth={1}
                  fill="#9ca3af"
                  fillOpacity={0.3}
                  isAnimationActive={false}
                />
                <Line
                  type="stepAfter"
                  dataKey="capacity"
                  stroke="#2563eb"
                  strokeWidth={1.25}
                  dot={false}
                  isAnimationActive={false}
                  connectNulls={false}
                />
                <Line
                  type="monotone"
                  dataKey="violation"
                  stroke="#d97706"
                  strokeWidth={0}
                  dot={{ r: 3, fill: "#d97706", stroke: "#d97706" }}
                  isAnimationActive={false}
                  connectNulls={false}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-1 flex justify-between text-[10px] font-bold text-muted-foreground">
            <span>회색 면 = 트래픽 (RPS)</span>
            <span style={{ color: "#2563eb" }}>파란 계단 = 용량</span>
            <span style={{ color: "#d97706" }}>주황 점 = 초과</span>
          </div>

          <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 font-mono text-xs sm:grid-cols-4">
            <div>
              <dt className="text-muted-foreground">GPU-h / 일</dt>
              <dd className="font-bold text-foreground">{scene === 0 ? "—" : `${hours}`}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Headroom (peak)</dt>
              <dd className="font-bold text-foreground">{headroom === null ? "—" : `${headroom} %`}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">평균 부하 / 용량</dt>
              <dd className="font-bold text-foreground">{avgUtil === null ? "—" : `${avgUtil} %`}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">초과 시간대</dt>
              <dd className="font-bold text-foreground">{scene === 0 ? "—" : `${violations} h`}</dd>
            </div>
          </dl>

          <p className="mt-4 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
            {NOTES[scene]}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}

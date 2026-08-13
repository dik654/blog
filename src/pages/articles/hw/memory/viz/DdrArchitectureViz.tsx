import { motion } from "framer-motion";
import StepViz from "@/components/ui/step-viz";
import {
  ActionBox,
  AlertBox,
  DataBox,
  ModuleBox,
  StatusBox,
} from "@/components/viz/boxes";
import { C } from "./ContextVizData";

const STEPS = [
  {
    label: "DDR5 DIMM은 두 개의 독립 subchannel로 요청을 나눈다",
    body: "일반 DIMM의 총 data width는 유지하면서 더 작은 전송 단위와 독립 command 경로로 bank 이용률을 높입니다.",
  },
  {
    label: "대역폭은 세대보다 채널 채움과 실제 MT/s에서 계산한다",
    body: "CPU가 지원하는 채널을 고르게 채우고 BIOS가 훈련한 동작 속도를 기준으로 이론 상한을 구합니다.",
  },
  {
    label: "CAS 숫자는 cycle이고 실제 지연은 시간으로 환산한다",
    body: "더 큰 CL도 clock period가 짧으면 nanosecond 지연이 비슷할 수 있어 MT/s와 timing을 함께 봅니다.",
  },
  {
    label: "1DPC와 2DPC는 속도·용량·신호 무결성의 교환이다",
    body: "두 번째 DIMM은 용량을 늘리지만 플랫폼이 동작 속도를 낮추거나 허용 rank 조합을 제한할 수 있습니다.",
  },
  {
    label: "메모리 성능은 workload와 NUMA 배치로 검증한다",
    body: "STREAM 같은 대역폭 측정과 실제 애플리케이션의 cache miss·local/remote access를 함께 관찰합니다.",
  },
];

const reveal = (delay: number) => ({
  initial: { opacity: 0, y: 7 },
  animate: { opacity: 1, y: 0 },
  transition: { delay },
});

function Subchannels() {
  return (
    <g>
      <text
        x={240}
        y={23}
        textAnchor="middle"
        fontSize={12}
        fontWeight={700}
        fill="var(--foreground)"
      >
        DDR4와 DDR5 module command 경로
      </text>
      <ModuleBox
        x={20}
        y={52}
        w={190}
        h={58}
        label="DDR4 DIMM"
        sub="single 64-bit data channel"
        color={C.ddr4}
      />
      <ModuleBox
        x={270}
        y={52}
        w={190}
        h={58}
        label="DDR5 DIMM"
        sub="two independent subchannels"
        color={C.ddr5}
      />
      <DataBox
        x={43}
        y={137}
        w={144}
        h={32}
        label="one command stream"
        color={C.ddr4}
      />
      <DataBox
        x={276}
        y={131}
        w={84}
        h={38}
        label="SubCh A"
        sub="32-bit data"
        color={C.ddr5}
      />
      <DataBox
        x={370}
        y={131}
        w={84}
        h={38}
        label="SubCh B"
        sub="32-bit data"
        color={C.info}
      />
      <motion.path
        d="M115 111 V136 M365 111 V122 H318 V130 M365 122 H412 V130"
        fill="none"
        stroke={C.ddr5}
        strokeWidth={1.4}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
      />
    </g>
  );
}

function Bandwidth() {
  const channels = [
    { x: 19, label: "CH0", color: C.ddr5 },
    { x: 129, label: "CH1", color: C.info },
    { x: 239, label: "CH2", color: C.ecc },
    { x: 349, label: "CH3", color: C.warn },
  ];
  return (
    <g>
      <text
        x={240}
        y={23}
        textAnchor="middle"
        fontSize={12}
        fontWeight={700}
        fill="var(--foreground)"
      >
        활성 채널의 대역폭 합산
      </text>
      {channels.map((channel, index) => (
        <motion.g key={channel.label} {...reveal(0.08 + index * 0.11)}>
          <ModuleBox
            x={channel.x}
            y={51}
            w={96}
            h={58}
            label={channel.label}
            sub="same capacity"
            color={channel.color}
          />
          <line
            x1={channel.x + 48}
            y1={109}
            x2={channel.x + 48}
            y2={137}
            stroke={channel.color}
          />
        </motion.g>
      ))}
      <ActionBox
        x={74}
        y={140}
        w={332}
        h={42}
        label="memory controller interleave"
        sub="MT/s × 8 bytes × active channels"
        color={C.ddr5}
      />
    </g>
  );
}

function Latency() {
  return (
    <g>
      <text
        x={240}
        y={23}
        textAnchor="middle"
        fontSize={12}
        fontWeight={700}
        fill="var(--foreground)"
      >
        timing cycle을 실제 시간으로 환산
      </text>
      <DataBox
        x={24}
        y={62}
        w={118}
        h={52}
        label="CAS cycles"
        sub="CL value"
        color={C.warn}
      />
      <text
        x={158}
        y={94}
        textAnchor="middle"
        fontSize={14}
        fontWeight={700}
        fill="var(--muted-foreground)"
      >
        ×
      </text>
      <DataBox
        x={174}
        y={62}
        w={132}
        h={52}
        label="clock period"
        sub="ns per cycle"
        color={C.ddr5}
      />
      <text
        x={322}
        y={94}
        textAnchor="middle"
        fontSize={14}
        fontWeight={700}
        fill="var(--muted-foreground)"
      >
        =
      </text>
      <ModuleBox
        x={338}
        y={58}
        w={120}
        h={60}
        label="CAS time"
        sub="nanoseconds"
        color={C.info}
      />
      <AlertBox
        x={78}
        y={151}
        w={324}
        h={34}
        label="전체 memory latency는 row·queue·NUMA 비용도 포함"
        color={C.err}
      />
    </g>
  );
}

function Dpc() {
  return (
    <g>
      <text
        x={240}
        y={23}
        textAnchor="middle"
        fontSize={12}
        fontWeight={700}
        fill="var(--foreground)"
      >
        한 채널의 DIMM 수가 만드는 교환
      </text>
      <ModuleBox
        x={24}
        y={54}
        w={192}
        h={68}
        label="1 DIMM / channel"
        sub="higher speed · lower capacity"
        color={C.ddr5}
      />
      <ModuleBox
        x={264}
        y={54}
        w={192}
        h={68}
        label="2 DIMMs / channel"
        sub="more capacity · heavier load"
        color={C.warn}
      />
      <StatusBox
        x={44}
        y={139}
        w={152}
        h={50}
        label="signal margin"
        sub="platform validated"
        color={C.ecc}
        progress={0.82}
      />
      <StatusBox
        x={284}
        y={139}
        w={152}
        h={50}
        label="capacity"
        sub="platform limit"
        color={C.warn}
        progress={0.92}
      />
    </g>
  );
}

function Validate() {
  const metrics = [
    { x: 18, label: "bandwidth", sub: "GB/s · scaling", color: C.ddr5 },
    { x: 174, label: "latency", sub: "local · remote", color: C.warn },
    { x: 330, label: "application", sub: "throughput · tail", color: C.ecc },
  ];
  return (
    <g>
      <text
        x={240}
        y={23}
        textAnchor="middle"
        fontSize={12}
        fontWeight={700}
        fill="var(--foreground)"
      >
        세 단계 성능 검증
      </text>
      {metrics.map((metric, index) => (
        <motion.g key={metric.label} {...reveal(0.08 + index * 0.14)}>
          <ModuleBox
            x={metric.x}
            y={58}
            w={132}
            h={62}
            label={metric.label}
            sub={metric.sub}
            color={metric.color}
          />
        </motion.g>
      ))}
      <DataBox
        x={76}
        y={151}
        w={328}
        h={32}
        label="채널·NUMA·workload를 같은 조건으로 비교"
        color={C.info}
      />
    </g>
  );
}

const SCENES = [Subchannels, Bandwidth, Latency, Dpc, Validate];

export default function DdrArchitectureViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const Scene = SCENES[step];
        return (
          <svg
            viewBox="0 0 480 200"
            className="w-full max-w-3xl"
            style={{ height: "auto" }}
          >
            <Scene />
          </svg>
        );
      }}
    </StepViz>
  );
}

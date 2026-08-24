import { motion } from "framer-motion";
import StepViz from "@/components/ui/step-viz";
import {
  AlertBox,
  DataBox,
  ModuleBox,
  StatusBox,
} from "@/components/viz/boxes";
import { C } from "./ContextVizData";

const STEPS = [
  {
    label: "M.2 숫자는 폭과 길이를 뜻한다",
    body: "2280은 22mm 폭과 80mm 길이이며, 길이·키·단면 여부가 슬롯 호환성을 결정합니다.",
  },
  {
    label: "작은 기판의 열을 히트스프레더로 옮긴다",
    body: "컨트롤러와 NAND의 열이 패드·히트싱크·공기 흐름을 거쳐 섀시 밖으로 빠져야 합니다.",
  },
  {
    label: "버스트 수치와 정상 상태 수치를 분리한다",
    body: "캐시와 낮은 초기 온도에서 나온 최고 속도는 장시간 쓰기의 지속 속도와 다를 수 있습니다.",
  },
  {
    label: "M.2는 내부 장착 조건이 맞을 때 효율적이다",
    body: "작은 공간과 짧은 배선이 장점이지만 현장 교체가 잦으면 외부 접근형 베이가 더 적합합니다.",
  },
];

const reveal = (delay: number) => ({
  initial: { opacity: 0, y: 7 },
  animate: { opacity: 1, y: 0 },
  transition: { delay },
});

function Dimensions() {
  const modules = [
    { x: 40, w: 62, label: "2230" },
    { x: 130, w: 87, label: "2242" },
    { x: 245, w: 166, label: "2280" },
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
        M.2 모듈 길이 비교
      </text>
      {modules.map((item, index) => (
        <motion.g key={item.label} {...reveal(0.08 + index * 0.14)}>
          <rect
            x={item.x}
            y={65}
            width={item.w}
            height={52}
            rx={4}
            fill={`${C.m2}12`}
            stroke={C.m2}
          />
          <circle cx={item.x + 12} cy={91} r={5} fill="none" stroke={C.m2} />
          <text
            x={item.x + item.w / 2}
            y={139}
            textAnchor="middle"
            fontSize={10}
            fontWeight={700}
            fill={C.m2}
          >
            {item.label}
          </text>
        </motion.g>
      ))}
      <DataBox
        x={102}
        y={158}
        w={276}
        h={30}
        label="22 mm 폭 · 뒤 두 자리 = 길이(mm)"
        color={C.m2}
      />
    </g>
  );
}

function HeatPath() {
  const path = [
    { x: 19, label: "controller", sub: "열 발생", color: C.err },
    { x: 129, label: "thermal pad", sub: "접촉", color: C.u2 },
    { x: 239, label: "heatsink", sub: "열 확산", color: C.m2 },
    { x: 349, label: "airflow", sub: "섀시 밖으로", color: C.e1s },
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
        작은 기판의 열 배출 경로
      </text>
      {path.map((item, index) => (
        <motion.g key={item.label} {...reveal(0.08 + index * 0.12)}>
          <ModuleBox
            x={item.x}
            y={63}
            w={96}
            h={58}
            label={item.label}
            sub={item.sub}
            color={item.color}
          />
          {index < path.length - 1 && (
            <line
              x1={item.x + 97}
              y1={92}
              x2={item.x + 109}
              y2={92}
              stroke="var(--muted-foreground)"
            />
          )}
        </motion.g>
      ))}
      <AlertBox
        x={100}
        y={151}
        w={280}
        h={34}
        label="패드 접촉과 실제 풍량까지 함께 검증"
        color={C.err}
      />
    </g>
  );
}

function SteadyState() {
  const states = [
    {
      y: 41,
      label: "초기 버스트",
      sub: "캐시 여유 · 낮은 온도",
      progress: 0.95,
      color: C.m2,
    },
    {
      y: 94,
      label: "캐시 전환",
      sub: "NAND 직접 쓰기 영향",
      progress: 0.66,
      color: C.u2,
    },
    {
      y: 147,
      label: "열 정상 상태",
      sub: "냉각과 전력 제한 반영",
      progress: 0.52,
      color: C.e1s,
    },
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
        시간에 따라 달라지는 처리량
      </text>
      {states.map((state, index) => (
        <motion.g key={state.label} {...reveal(0.08 + index * 0.14)}>
          <StatusBox
            x={54}
            y={state.y}
            w={372}
            h={48}
            label={state.label}
            sub={state.sub}
            color={state.color}
            progress={state.progress}
          />
        </motion.g>
      ))}
    </g>
  );
}

function Fit() {
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
        M.2가 잘 맞는 운영 조건
      </text>
      <ModuleBox
        x={28}
        y={58}
        w={132}
        h={62}
        label="내부 장착"
        sub="작은 공간 · 짧은 경로"
        color={C.m2}
      />
      <ModuleBox
        x={174}
        y={58}
        w={132}
        h={62}
        label="계획 정비"
        sub="전원 중단 후 교체"
        color={C.hw}
      />
      <ModuleBox
        x={320}
        y={58}
        w={132}
        h={62}
        label="열 검증"
        sub="heatsink · airflow"
        color={C.e1s}
      />
      <motion.path
        d="M94 132 H386"
        stroke={C.ok}
        strokeWidth={1.2}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
      />
      <DataBox
        x={104}
        y={153}
        w={272}
        h={30}
        label="세 조건이 맞으면 가장 단순한 패키지"
        color={C.ok}
      />
    </g>
  );
}

const SCENES = [Dimensions, HeatPath, SteadyState, Fit];

export default function M2ThermalViz() {
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

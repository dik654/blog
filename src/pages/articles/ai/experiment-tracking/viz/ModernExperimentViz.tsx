import { motion } from "framer-motion";
import type { ReactNode } from "react";
import {
  AnimatedSceneControls,
  useAnimatedScenes,
} from "@/components/viz/AnimatedSceneControls";
import VizFrame from "@/components/viz/VizFrame";

const accent = "var(--primary)";
const border = "var(--border)";
const muted = "var(--muted-foreground)";

function Scene({
  id,
  title,
  description,
  labels,
  notes,
  children,
}: {
  id: string;
  title: string;
  description: string;
  labels: readonly string[];
  notes: readonly string[];
  children: (active: number) => ReactNode;
}) {
  const controls = useAnimatedScenes(labels.length, 3000);
  return (
    <VizFrame title={title} description={description} className="my-8">
      <div
        id={id}
        data-viz
        tabIndex={0}
        onKeyDown={controls.onKeyDown}
        className="min-w-0 overflow-hidden border-y border-border/70 bg-background px-4 py-6 outline-none focus-visible:ring-2 focus-visible:ring-primary sm:px-6"
      >
        <p className="text-[11px] font-black uppercase tracking-[.16em] text-primary">
          Animated lesson · {String(controls.active + 1).padStart(2, "0")}
        </p>
        <h3 className="mt-2 text-lg font-bold leading-7">
          {labels[controls.active]}
        </h3>
        <div data-viz-canvas className="mt-5 min-w-0 overflow-hidden">
          {children(controls.active)}
        </div>
        <p className="mt-4 border-l border-primary/50 pl-4 text-sm leading-6 text-muted-foreground">
          {notes[controls.active]}
        </p>
        <AnimatedSceneControls labels={labels} {...controls} />
      </div>
    </VizFrame>
  );
}

function Box({
  x,
  y,
  width,
  label,
  detail,
  active,
}: {
  x: number;
  y: number;
  width: number;
  label: string;
  detail: string;
  active: boolean;
}) {
  return (
    <motion.g
      initial={false}
      animate={{ opacity: active ? 1 : 0.25, scale: active ? 1.02 : 1 }}
      style={{ transformOrigin: `${x + width / 2}px ${y + 25}px` }}
    >
      <rect
        x={x}
        y={y}
        width={width}
        height="50"
        rx="8"
        fill={
          active
            ? "color-mix(in srgb, var(--primary) 10%, transparent)"
            : "var(--background)"
        }
        stroke={active ? accent : border}
        strokeWidth="1.25"
      />
      <text
        x={x + width / 2}
        y={y + 21}
        textAnchor="middle"
        className="fill-foreground text-[9px] font-bold"
      >
        {label}
      </text>
      <text
        x={x + width / 2}
        y={y + 37}
        textAnchor="middle"
        className="fill-muted-foreground text-[7px]"
      >
        {detail}
      </text>
    </motion.g>
  );
}

function Link({
  x1,
  y1,
  x2,
  y2,
  active,
  id,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  active: boolean;
  id: string;
}) {
  return (
    <g>
      <defs>
        <marker
          id={id}
          markerWidth="7"
          markerHeight="7"
          refX="6"
          refY="3.5"
          orient="auto"
        >
          <path d="M0 0L7 3.5L0 7Z" fill={active ? accent : muted} />
        </marker>
      </defs>
      <motion.line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={active ? accent : muted}
        strokeWidth="1.25"
        markerEnd={`url(#${id})`}
        initial={false}
        animate={{ opacity: active ? 1 : 0.2, pathLength: active ? 1 : 0.7 }}
      />
    </g>
  );
}

export function ProvenanceDagViz() {
  const labels = [
    "Experiment spec 고정",
    "Attempt를 별도 실행으로 생성",
    "Output artifact에 producer 연결",
    "Report에서 input까지 역추적",
  ] as const;
  const notes = [
    "Code·data·split·resolved config·environment·command digest가 같은 실행 조건을 식별합니다.",
    "Seed·retry·worker는 같은 spec 아래의 서로 다른 attempt입니다. 실패 attempt도 덮어쓰지 않습니다.",
    "Checkpoint·prediction·report는 URI뿐 아니라 digest·schema·size·producer를 가집니다.",
    "결과 숫자에서 producer attempt, spec, 모든 immutable inputs까지 거슬러 갈 수 있어야 provenance가 닫힙니다.",
  ] as const;
  return (
    <Scene
      id="provenance-dag-viz"
      title="Input에서 report까지 이어지는 provenance DAG"
      description="같은 실험 조건과 실제 실행을 분리해 artifact edge를 연결합니다."
      labels={labels}
      notes={notes}
    >
      {(active) => (
        <svg
          viewBox="0 0 440 235"
          role="img"
          aria-label={labels[active]}
          className="block h-auto w-full"
        >
          <Box
            x={18}
            y={24}
            width={96}
            label="immutable inputs"
            detail="code · data · split"
            active={active === 0 || active === 3}
          />
          <Link
            x1={115}
            y1={49}
            x2={151}
            y2={49}
            active={active <= 1 || active === 3}
            id="prov-a"
          />
          <Box
            x={153}
            y={24}
            width={98}
            label="spec digest"
            detail="resolved contract"
            active={active === 0 || active === 3}
          />
          <Link
            x1={202}
            y1={75}
            x2={202}
            y2={111}
            active={active >= 1}
            id="prov-b"
          />
          <Box
            x={153}
            y={113}
            width={98}
            label="attempt"
            detail="seed · retry · worker"
            active={active === 1 || active === 3}
          />
          <Link
            x1={252}
            y1={138}
            x2={286}
            y2={138}
            active={active >= 2}
            id="prov-c"
          />
          <Box
            x={288}
            y={113}
            width={104}
            label="artifact"
            detail="digest · schema"
            active={active === 2 || active === 3}
          />
          <Link
            x1={340}
            y1={112}
            x2={340}
            y2={75}
            active={active >= 2}
            id="prov-d"
          />
          <Box
            x={288}
            y={24}
            width={104}
            label="report"
            detail="metric · slices"
            active={active >= 2}
          />
          <motion.path
            d="M340 24C340 4 66 4 66 23"
            fill="none"
            stroke={accent}
            strokeWidth="1.25"
            strokeDasharray="4 5"
            initial={false}
            animate={{ opacity: active === 3 ? 1 : 0.05 }}
          />
        </svg>
      )}
    </Scene>
  );
}

export function ProgressCoordinateViz() {
  const labels = [
    "Logging call을 step으로 착각",
    "Update·token·time을 따로 기록",
    "같은 token budget에서 정렬",
    "Validation fixture와 hardware까지 비교",
  ] as const;
  const notes = [
    "log 호출 횟수는 optimizer update·sample·token 중 어느 것도 자동으로 뜻하지 않습니다.",
    "Metric observation마다 update, processed units, wall time를 함께 저장합니다.",
    "Batch가 다른 두 run은 같은 update가 아니라 같은 processed-token 위치에서 비교할 수 있습니다.",
    "같은 x축이어도 evaluation artifact·reducer·hardware가 다르면 quality나 speed 차이를 바로 해석할 수 없습니다.",
  ] as const;
  return (
    <Scene
      id="progress-coordinate-viz"
      title="두 learning curve를 같은 자원 좌표에 놓기"
      description="불분명한 step을 update·token·time tuple로 교체합니다."
      labels={labels}
      notes={notes}
    >
      {(active) => (
        <svg
          viewBox="0 0 440 235"
          role="img"
          aria-label={labels[active]}
          className="block h-auto w-full"
        >
          <line
            x1="45"
            y1="184"
            x2="412"
            y2="184"
            stroke={border}
            strokeWidth="1.25"
          />
          <line
            x1="45"
            y1="28"
            x2="45"
            y2="184"
            stroke={border}
            strokeWidth="1.25"
          />
          <text
            x="228"
            y="213"
            textAnchor="middle"
            className="fill-muted-foreground text-[9px]"
          >
            processed tokens
          </text>
          <path
            d="M52 160C112 139 150 92 212 86C274 80 328 54 402 48"
            fill="none"
            stroke={accent}
            strokeWidth="1.25"
          />
          <path
            d="M52 167C100 154 148 132 202 111C276 82 332 77 402 64"
            fill="none"
            stroke={muted}
            strokeWidth="1.25"
          />
          <motion.line
            x1="202"
            y1="31"
            x2="202"
            y2="184"
            stroke={accent}
            strokeWidth="1.25"
            strokeDasharray="4 4"
            initial={false}
            animate={{ opacity: active >= 2 ? 1 : 0.08 }}
          />
          <motion.g
            initial={false}
            animate={{ opacity: active >= 1 ? 1 : 0.1 }}
          >
            <Box
              x={74}
              y={22}
              width={94}
              label="run A"
              detail="u=1000 · n=1M"
              active={active >= 1}
            />
            <Box
              x={266}
              y={126}
              width={110}
              label="run B"
              detail="u=250 · n=1M"
              active={active >= 1}
            />
          </motion.g>
          <motion.rect
            x="180"
            y="34"
            width="44"
            height="148"
            fill="color-mix(in srgb, var(--primary) 8%, transparent)"
            stroke={accent}
            strokeWidth="1.25"
            initial={false}
            animate={{ opacity: active >= 2 ? 0.8 : 0 }}
          />
        </svg>
      )}
    </Scene>
  );
}

export function RegistryParityViz() {
  const labels = [
    "Metadata와 object store 분리",
    "Required artifact integrity 검사",
    "Alias를 immutable version으로 resolve",
    "Registry와 endpoint parity 확인",
  ] as const;
  const notes = [
    "Run row와 큰 artifact는 다른 stores에 둘 수 있지만 backup·retention·access lifecycle은 함께 복구되어야 합니다.",
    "필수 object의 존재·read access·digest·schema 중 하나라도 실패하면 replayable run이 아닙니다.",
    "candidate 같은 alias는 움직입니다. 승인 시점에 resolve한 version·digest·승인자를 receipt에 고정합니다.",
    "Registry가 가리키는 model과 실제 endpoint가 읽은 artifact·container·serving config가 모두 같아야 합니다.",
  ] as const;
  return (
    <Scene
      id="registry-parity-viz"
      title="Run metadata에서 production endpoint까지"
      description="두 stores와 mutable alias 사이의 끊어질 수 있는 경계를 봅니다."
      labels={labels}
      notes={notes}
    >
      {(active) => (
        <svg
          viewBox="0 0 440 245"
          role="img"
          aria-label={labels[active]}
          className="block h-auto w-full"
        >
          <Box
            x={16}
            y={30}
            width={92}
            label="backend DB"
            detail="run · URI · tags"
            active={active === 0 || active === 1}
          />
          <Box
            x={16}
            y={142}
            width={92}
            label="object store"
            detail="model · prediction"
            active={active === 0 || active === 1}
          />
          <Link
            x1={109}
            y1={55}
            x2={153}
            y2={100}
            active={active === 1}
            id="reg-a"
          />
          <Link
            x1={109}
            y1={167}
            x2={153}
            y2={120}
            active={active === 1}
            id="reg-b"
          />
          <Box
            x={155}
            y={82}
            width={92}
            label="integrity gate"
            detail="exists · digest"
            active={active === 1}
          />
          <Link
            x1={248}
            y1={107}
            x2={282}
            y2={107}
            active={active >= 2}
            id="reg-c"
          />
          <Box
            x={284}
            y={30}
            width={118}
            label="candidate alias"
            detail="today → v17"
            active={active === 2}
          />
          <Box
            x={284}
            y={142}
            width={118}
            label="endpoint"
            detail="loaded v17"
            active={active === 3}
          />
          <Link
            x1={343}
            y1={81}
            x2={343}
            y2={141}
            active={active === 3}
            id="reg-d"
          />
          <motion.rect
            x="272"
            y="18"
            width="142"
            height="186"
            rx="10"
            fill="none"
            stroke={accent}
            strokeWidth="1.25"
            strokeDasharray="4 5"
            initial={false}
            animate={{ opacity: active === 3 ? 1 : 0.05 }}
          />
          <text
            x="343"
            y="226"
            textAnchor="middle"
            className="fill-muted-foreground text-[8px]"
          >
            version · digest · config parity
          </text>
        </svg>
      )}
    </Scene>
  );
}

export function ReproductionTestViz() {
  const labels = [
    "같음의 수준 선택",
    "Root seed에서 child streams 파생",
    "빈 environment에서 재실행",
    "첫 divergence와 acceptance 판정",
  ] as const;
  const notes = [
    "Bitwise·numeric·statistical·behavioral equality는 서로 다른 claim입니다. 목적에 맞는 수준을 먼저 고릅니다.",
    "Run·rank·worker·epoch coordinates를 root seed와 섞어 독립적이고 다시 만들 수 있는 streams를 만듭니다.",
    "개발 machine의 cache와 숨은 state 없이 immutable inputs·image·command만으로 실행합니다.",
    "입력부터 artifact·metric·slice까지 순서대로 비교해 최초 divergence와 허용 수준을 report합니다.",
  ] as const;
  return (
    <Scene
      id="reproduction-test-viz"
      title="Seed 고정에서 clean-room acceptance까지"
      description="재현을 하나의 버튼이 아니라 단계별 검증 ladder로 봅니다."
      labels={labels}
      notes={notes}
    >
      {(active) => (
        <svg
          viewBox="0 0 440 245"
          role="img"
          aria-label={labels[active]}
          className="block h-auto w-full"
        >
          {["bitwise", "numeric", "statistical", "behavioral"].map(
            (label, index) => (
              <motion.g
                key={label}
                initial={false}
                animate={{ opacity: active === 0 ? 1 : 0.14 }}
              >
                <rect
                  x={28 + index * 100}
                  y={24 + index * 14}
                  width="78"
                  height="32"
                  rx="7"
                  fill={
                    index === active
                      ? "color-mix(in srgb, var(--primary) 10%, transparent)"
                      : "var(--background)"
                  }
                  stroke={index === active ? accent : border}
                  strokeWidth="1.25"
                />
                <text
                  x={67 + index * 100}
                  y={44 + index * 14}
                  textAnchor="middle"
                  className="fill-foreground text-[8px] font-bold"
                >
                  {label}
                </text>
              </motion.g>
            ),
          )}
          <motion.g
            initial={false}
            animate={{ opacity: active === 1 ? 1 : 0.08 }}
          >
            <circle
              cx="90"
              cy="143"
              r="18"
              fill="var(--background)"
              stroke={accent}
              strokeWidth="1.25"
            />
            <text
              x="90"
              y="147"
              textAnchor="middle"
              className="fill-foreground text-[9px] font-bold"
            >
              root
            </text>
            {[
              [190, 112, "rank 0"],
              [190, 174, "rank 1"],
              [330, 96, "worker 0"],
              [330, 144, "worker 1"],
              [330, 192, "worker 2"],
            ].map(([x, y, label], i) => (
              <g key={String(label)}>
                <line
                  x1={i < 2 ? 108 : 208}
                  y1={i < 2 ? 143 : i === 2 ? 112 : 174}
                  x2={Number(x) - 26}
                  y2={Number(y)}
                  stroke={border}
                  strokeWidth="1.25"
                />
                <rect
                  x={Number(x) - 26}
                  y={Number(y) - 15}
                  width="52"
                  height="30"
                  rx="7"
                  fill="var(--background)"
                  stroke={accent}
                  strokeWidth="1.25"
                />
                <text
                  x={Number(x)}
                  y={Number(y) + 3}
                  textAnchor="middle"
                  className="fill-foreground text-[7px] font-bold"
                >
                  {label}
                </text>
              </g>
            ))}
          </motion.g>
          <motion.g
            initial={false}
            animate={{ opacity: active >= 2 ? 1 : 0.06 }}
          >
            <Box
              x={30}
              y={126}
              width={94}
              label="immutable inputs"
              detail="digest verified"
              active={active >= 2}
            />
            <Link
              x1={125}
              y1={151}
              x2={166}
              y2={151}
              active={active >= 2}
              id="rep-a"
            />
            <Box
              x={168}
              y={126}
              width={94}
              label="fresh runner"
              detail="image · command"
              active={active >= 2}
            />
            <Link
              x1={263}
              y1={151}
              x2={304}
              y2={151}
              active={active >= 3}
              id="rep-b"
            />
            <Box
              x={306}
              y={126}
              width={104}
              label="acceptance"
              detail="first divergence"
              active={active >= 3}
            />
          </motion.g>
        </svg>
      )}
    </Scene>
  );
}

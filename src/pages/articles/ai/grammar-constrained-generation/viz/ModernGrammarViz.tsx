import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const primary = "var(--primary)";
const border = "var(--border)";
const muted = "var(--muted-foreground)";

function Lesson({
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
  const controls = useAnimatedScenes(labels.length, 3200);
  return (
    <VizFrame title={title} description={description} className="my-9">
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
        <h3 className="mt-2 min-h-[6.5rem] text-lg font-bold leading-7 sm:min-h-[1.75rem]">
          {labels[controls.active]}
        </h3>
        <div data-viz-canvas className="mt-5 min-w-0 overflow-hidden">
          {children(controls.active)}
        </div>
        <p className="mt-4 min-h-[6.5rem] border-l border-primary/50 pl-4 text-sm leading-6 text-muted-foreground sm:min-h-[4.5rem]">
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
  w,
  label,
  sub,
  on,
}: {
  x: number;
  y: number;
  w: number;
  label: string;
  sub: string;
  on: boolean;
}) {
  return (
    <motion.g initial={false} animate={{ opacity: on ? 1 : 0.18 }}>
      <rect
        x={x}
        y={y}
        width={w}
        height="58"
        rx="8"
        fill={
          on
            ? "color-mix(in srgb, var(--primary) 8%, transparent)"
            : "var(--background)"
        }
        stroke={on ? primary : border}
        strokeWidth="1.25"
      />
      <text
        x={x + w / 2}
        y={y + 23}
        textAnchor="middle"
        className="fill-foreground text-[11px] font-bold"
      >
        {label}
      </text>
      <text
        x={x + w / 2}
        y={y + 42}
        textAnchor="middle"
        className="fill-muted-foreground text-[9px]"
      >
        {sub}
      </text>
    </motion.g>
  );
}

function Arrow({
  x1,
  y1,
  x2,
  y2,
  on,
  id,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  on: boolean;
  id: string;
}) {
  return (
    <g opacity={on ? 1 : 0.18}>
      <defs>
        <marker
          id={id}
          markerWidth="7"
          markerHeight="7"
          refX="6"
          refY="3.5"
          orient="auto"
        >
          <path d="M0 0L7 3.5L0 7Z" fill={on ? primary : muted} />
        </marker>
      </defs>
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={on ? primary : muted}
        strokeWidth="1.25"
        markerEnd={`url(#${id})`}
      />
    </g>
  );
}

export function FormalLanguageViz() {
  const labels = [
    "Alphabet에서 symbol을 고릅니다",
    "Symbol을 순서대로 이어 string을 만듭니다",
    "규칙을 만족한 string만 language에 넣습니다",
    "Production으로 start symbol을 전개합니다",
  ] as const;
  const notes = [
    "Alphabet은 사용할 수 있는 symbol의 유한 집합입니다.",
    "String은 symbol의 순서이며 길이 0인 empty string도 구분합니다.",
    "Language는 가능한 모든 string이 아니라 membership rule을 통과한 집합입니다.",
    "Terminal은 출력에 남고 nonterminal은 다음 production으로 계속 전개됩니다.",
  ] as const;
  return (
    <Lesson
      id="formal-language-viz"
      title="Symbol에서 derivation까지"
      description="Formal language의 물체를 한 단계씩 조립합니다."
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
          <Box x={18} y={68} w={78} label="Σ" sub="[, ], 0, 1" on />
          <Arrow x1={98} y1={97} x2={126} y2={97} on={active >= 1} id="fg-1" />
          <Box
            x={130}
            y={68}
            w={78}
            label="[ 0 ]"
            sub="string"
            on={active >= 1}
          />
          <Arrow x1={210} y1={97} x2={238} y2={97} on={active >= 2} id="fg-2" />
          <Box
            x={242}
            y={68}
            w={82}
            label="L"
            sub="valid set"
            on={active >= 2}
          />
          <Arrow x1={326} y1={97} x2={350} y2={97} on={active >= 3} id="fg-3" />
          <Box
            x={354}
            y={68}
            w={70}
            label="S⇒[0]"
            sub="derive"
            on={active >= 3}
          />
        </svg>
      )}
    </Lesson>
  );
}

export function PushdownStackViz() {
  const labels = [
    "Finite state가 기억할 수 있는 범위를 봅니다",
    "여는 괄호를 stack에 push합니다",
    "닫는 괄호가 최근 열린 항목을 pop합니다",
    "Empty end와 invalid pop으로 accept를 판정합니다",
  ] as const;
  const notes = [
    "유한 state 번호만으로는 임의 깊이의 열린 중첩 수를 모두 구분할 수 없습니다.",
    "Stack은 나중에 닫아야 할 delimiter를 LIFO 순서로 저장합니다.",
    "가장 최근에 연 구조부터 닫혀야 nested syntax가 맞습니다.",
    "입력이 끝날 때 stack이 비어야 하고 empty stack pop은 즉시 reject합니다.",
  ] as const;
  return (
    <Lesson
      id="pushdown-stack-viz"
      title="괄호 입력과 stack state"
      description="PDA가 임의 깊이 nesting을 기억하는 형태를 보여 줍니다."
      labels={labels}
      notes={notes}
    >
      {(active) => (
        <svg
          viewBox="0 0 440 250"
          role="img"
          aria-label={labels[active]}
          className="block h-auto w-full"
        >
          <text x="38" y="46" className="fill-muted-foreground text-[10px]">
            input
          </text>
          {["(", "(", ")", "(", ")", ")"].map((c, i) => (
            <g key={i} opacity={i <= active + 1 ? 1 : 0.2}>
              <rect
                x={38 + i * 48}
                y="62"
                width="34"
                height="34"
                rx="6"
                fill="var(--background)"
                stroke={primary}
                strokeWidth="1.25"
              />
              <text
                x={55 + i * 48}
                y="84"
                textAnchor="middle"
                className="fill-foreground text-[12px] font-bold"
              >
                {c}
              </text>
            </g>
          ))}
          <Arrow
            x1={334}
            y1={79}
            x2={372}
            y2={79}
            on={active >= 1}
            id="pda-1"
          />
          <g transform="translate(360 104)">
            {[0, 1, 2].map((i) => (
              <rect
                key={i}
                x="0"
                y={52 - i * 34}
                width="56"
                height="28"
                rx="4"
                fill={
                  i < Math.max(1, active)
                    ? "color-mix(in srgb, var(--primary) 8%, transparent)"
                    : "var(--background)"
                }
                stroke={i < Math.max(1, active) ? primary : border}
                strokeWidth="1.25"
              />
            ))}
            <text
              x="28"
              y="100"
              textAnchor="middle"
              className="fill-muted-foreground text-[9px]"
            >
              LIFO stack
            </text>
          </g>
          <Box
            x={126}
            y={160}
            w={128}
            label={active >= 3 ? "accept / reject" : "parser state"}
            sub={active >= 3 ? "empty end · invalid pop" : "control + stack"}
            on={active >= 2}
          />
        </svg>
      )}
    </Lesson>
  );
}

export function IncrementalParserViz() {
  const labels = [
    "이미 존재하는 source text를 읽습니다",
    "Source를 concrete syntax tree로 만듭니다",
    "Edit range만 새 tree에 반영합니다",
    "Decoder matcher와 입출력을 분리합니다",
  ] as const;
  const notes = [
    "Tree-sitter의 입력은 생성 logits가 아니라 이미 존재하는 source와 optional old tree입니다.",
    "Concrete syntax tree는 punctuation을 포함한 source 구조를 보존합니다.",
    "Incremental parse는 바뀌지 않은 subtree를 재사용해 editor feedback을 빠르게 갱신합니다.",
    "Decoder matcher는 prefix에서 next-token mask를 만들며 invalid source에서도 useful tree를 주는 error recovery와 목표가 다릅니다.",
  ] as const;
  return (
    <Lesson
      id="incremental-parser-viz"
      title="Source edit에서 syntax tree update까지"
      description="Tree-sitter와 generation matcher를 같은 parser라는 말로 섞지 않습니다."
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
            x={18}
            y={38}
            w={98}
            label="source text"
            sub="old tree optional"
            on
          />
          <Arrow x1={118} y1={67} x2={156} y2={67} on={active >= 1} id="ts-1" />
          <Box
            x={160}
            y={38}
            w={108}
            label="syntax tree"
            sub="object · pair · value"
            on={active >= 1}
          />
          <Arrow x1={270} y1={67} x2={306} y2={67} on={active >= 2} id="ts-2" />
          <Box
            x={310}
            y={38}
            w={112}
            label="updated tree"
            sub="reuse unchanged"
            on={active >= 2}
          />
          <line
            x1="28"
            y1="142"
            x2="412"
            y2="142"
            stroke={border}
            strokeWidth="1.25"
            strokeDasharray="5 5"
          />
          <Box
            x={78}
            y={166}
            w={124}
            label="generated prefix"
            sub="decoder input"
            on={active >= 3}
          />
          <Arrow
            x1={204}
            y1={195}
            x2={238}
            y2={195}
            on={active >= 3}
            id="ts-3"
          />
          <Box
            x={242}
            y={166}
            w={120}
            label="token bitmask"
            sub="decoder output"
            on={active >= 3}
          />
        </svg>
      )}
    </Lesson>
  );
}

export function TokenMaskViz() {
  const labels = [
    "Character grammar와 tokenizer vocabulary를 놓습니다",
    "Token 전체 byte를 matcher state에서 소비합니다",
    "Valid token index만 bitmask에 남깁니다",
    "Mask 뒤 logits에서 sampling하고 state를 갱신합니다",
  ] as const;
  const notes = [
    "한 model token은 공백·숫자·닫는 괄호처럼 여러 문자를 함께 담을 수 있습니다.",
    "Compiler는 token의 각 byte가 만드는 state transition과 최종 state를 계산합니다.",
    "중간 byte가 invalid이면 token 전체를 금지하고 allowed set만 남깁니다.",
    "금지 logit은 −∞가 되어 probability 0이 되고 선택 token은 요청별 matcher가 accept합니다.",
  ] as const;
  return (
    <Lesson
      id="token-mask-viz"
      title="Grammar state에서 next-token mask까지"
      description="문자 규칙과 model vocabulary 사이 compilation을 시각화합니다."
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
            x={18}
            y={42}
            w={92}
            label="grammar s"
            sub={'prefix {"age":'}
            on
          />
          <Box x={18} y={132} w={92} label="token vᵢ" sub="space · 42 · }" on />
          <Arrow x1={112} y1={71} x2={154} y2={98} on={active >= 1} id="tm-1" />
          <Arrow
            x1={112}
            y1={161}
            x2={154}
            y2={118}
            on={active >= 1}
            id="tm-2"
          />
          <Box
            x={158}
            y={78}
            w={104}
            label="consume bytes"
            sub="state transition"
            on={active >= 1}
          />
          <Arrow
            x1={264}
            y1={107}
            x2={294}
            y2={107}
            on={active >= 2}
            id="tm-3"
          />
          <Box
            x={298}
            y={38}
            w={110}
            label="allowed mask"
            sub="1 · 0 · 1 · 0"
            on={active >= 2}
          />
          <Box
            x={298}
            y={136}
            w={110}
            label="masked logits"
            sub="ℓ · −∞ · ℓ · −∞"
            on={active >= 3}
          />
        </svg>
      )}
    </Lesson>
  );
}

export function StructuredServingViz() {
  const labels = [
    "요청이 허용 tool과 schema를 고릅니다",
    "Schema·tokenizer version으로 compile key를 만듭니다",
    "Sequence마다 matcher state를 따로 갱신합니다",
    "Syntax 뒤 semantic validator와 policy를 통과합니다",
  ] as const;
  const notes = [
    "동적 agent request는 tool union과 parameter schema가 서로 다를 수 있습니다.",
    "Cache identity에는 schema뿐 아니라 tokenizer·engine revision도 포함해야 합니다.",
    "Batch를 공유해도 generated prefix가 다르면 token mask state는 요청별입니다.",
    "Parse·schema success는 ID 존재·권한·금액·명령 안전성을 보장하지 않습니다.",
  ] as const;
  return (
    <Lesson
      id="structured-serving-viz"
      title="Dynamic schema에서 실행 승인까지"
      description="Compile cache와 semantic validation의 책임을 분리합니다."
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
          <Box x={18} y={44} w={86} label="request" sub="tools · schema" on />
          <Arrow x1={106} y1={73} x2={132} y2={73} on={active >= 1} id="sv-1" />
          <Box
            x={136}
            y={44}
            w={102}
            label="compile key"
            sub="schema · tokenizer"
            on={active >= 1}
          />
          <Arrow x1={240} y1={73} x2={268} y2={73} on={active >= 2} id="sv-2" />
          <Box
            x={272}
            y={44}
            w={84}
            label="matcher"
            sub="per sequence"
            on={active >= 2}
          />
          <Arrow x1={358} y1={73} x2={382} y2={73} on={active >= 3} id="sv-3" />
          <Box
            x={362}
            y={132}
            w={64}
            label="policy"
            sub="meaning"
            on={active >= 3}
          />
          <Arrow
            x1={314}
            y1={104}
            x2={374}
            y2={132}
            on={active >= 3}
            id="sv-4"
          />
          <Box
            x={176}
            y={158}
            w={142}
            label="syntax-valid output"
            sub="not yet executable"
            on={active >= 3}
          />
        </svg>
      )}
    </Lesson>
  );
}

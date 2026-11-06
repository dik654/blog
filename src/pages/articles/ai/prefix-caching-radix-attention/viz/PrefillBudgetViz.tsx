import SceneShell from "./SceneShell";

/**
 * 본문 대응: #fairness — step마다 새 prefill 위치 상한 3200, chunk 없음(가정).
 * hit 우선: 새 100 × 8 = 800, 남은 2400 < 3000. FCFS: 3000 + 100 × 2 = 3200, 6개 밀림.
 */
const LIMIT = 3200;
const X0 = 12;
const UNIT = 316 / LIMIT;
const BLUE = "#2563eb";
const AMBER = "#b45309";
const RED = "#dc2626";
const SLATE = "#64748b";

const SCENES = [
  { label: "hit 요청 8개 먼저", summary: "100 × 8 = 800 · 남은 2400", note: "앞 2500을 hit한 요청은 새 100만 상한에 씁니다. 8개가 먼저 선택되면 800을 쓰고 2400이 남습니다. 요청을 나누어(chunk) 넣지 못하는 이 모형에서 3000자리 요청은 들어가지 못합니다." },
  { label: "매 step 반복", summary: "3000 요청 계속 대기", note: "매 step 같은 선택이 되풀이되면 3000자리 요청은 차례를 얻지 못합니다. 이런 상태가 starvation입니다. step 시간은 측정하지 않아 몇 ms라고 말할 수 없습니다." },
  { label: "FCFS로 먼저 받으면", summary: "3000 + 100 × 2 = 3200", note: "먼저 온 순서인 FCFS로 3000자리 요청을 먼저 받으면 새 100짜리는 2개만 함께 들어가고 6개가 뒤로 밀립니다. 선택 규칙에 따라 기다리는 쪽이 달라집니다." },
  { label: "chunked prefill이면", summary: "3000을 나누어 일부 진행", note: "chunked prefill은 한 요청을 나누어 계산합니다. 3000의 일부가 진행될 수 있어 같은 starvation 결론을 그대로 적용하지 않습니다. 나누는 크기는 본문에 없어 점선 칸의 폭은 뜻을 갖지 않습니다." },
];

function Row({ y, name, blocks, waiting }: { y: number; name: string; blocks: readonly { size: number; fill: string; label?: string; dashed?: boolean }[]; waiting?: string }) {
  return (
    <g>
      <text x={X0} y={y - 4} fontSize={11} fontWeight={700} fill="currentColor">{name}</text>
      <rect x={X0} y={y} width={LIMIT * UNIT} height={28} fill="none" stroke="#94a3b8" strokeWidth={1} />
      {blocks.map((block, i) => {
        const before = blocks.slice(0, i).reduce<number>((sum, item) => sum + item.size, 0);
        return (
          <g key={i}>
            <rect
              x={X0 + before * UNIT}
              y={y}
              width={block.size * UNIT}
              height={28}
              fill={block.dashed ? "none" : block.fill}
              stroke={block.dashed ? block.fill : "#ffffff"}
              strokeWidth={1}
              strokeDasharray={block.dashed ? "4 3" : undefined}
            />
            {block.label && (
              <text x={X0 + (before + block.size / 2) * UNIT} y={y + 18} textAnchor="middle" fontSize={11} fontWeight={700} fill={block.dashed ? block.fill : "#ffffff"}>{block.label}</text>
            )}
          </g>
        );
      })}
      {waiting && <text x={X0 + LIMIT * UNIT} y={y - 4} textAnchor="end" fontSize={11} fill={RED}>{waiting}</text>}
    </g>
  );
}

const EIGHT = Array.from({ length: 8 }, () => ({ size: 100, fill: BLUE }));
const TWO = Array.from({ length: 2 }, () => ({ size: 100, fill: BLUE }));

export default function PrefillBudgetViz() {
  return (
    <SceneShell
      eyebrow="(가정) step당 새 계산 3200"
      title="남은 2400에는 3000자리 요청이 들어가지 못합니다"
      description="막대 전체가 한 step에 새로 계산할 수 있는 입력 위치 3200입니다. 파란 칸 하나는 새 100, 주황은 3000자리 요청입니다."
      ariaLabel="새 prefill 위치 상한 3200을 요청들이 나눠 쓰는 두 선택 규칙 비교"
      scenes={SCENES}
      render={(index) => (
        <svg viewBox="0 0 340 152" className="mx-auto h-auto w-full max-w-[540px]" role="img" aria-label={`${SCENES[index].label}: ${SCENES[index].summary}`}>
          {index === 0 && (
            <>
              <Row y={22} name="step 1" blocks={EIGHT} waiting="3000 요청: 못 들어감" />
              <text x={X0 + 800 * UNIT} y={68} fontSize={11} fill={SLATE}>사용 800</text>
              <text x={X0 + LIMIT * UNIT} y={68} textAnchor="end" fontSize={11} fontWeight={700} fill={RED}>남은 2400 &lt; 3000</text>
              <rect x={X0} y={84} width={3000 * UNIT} height={26} fill="none" stroke={AMBER} strokeWidth={1.25} strokeDasharray="4 3" />
              <text x={X0 + 1500 * UNIT} y={101} textAnchor="middle" fontSize={11} fontWeight={700} fill={AMBER}>대기 중인 3000</text>
            </>
          )}
          {index === 1 && (
            <>
              <Row y={22} name="step 1" blocks={EIGHT} waiting="3000 대기" />
              <Row y={74} name="step 2" blocks={EIGHT} waiting="3000 대기" />
              <text x={X0} y={124} fontSize={13} fontWeight={700} fill={SLATE}>…</text>
            </>
          )}
          {index === 2 && (
            <>
              <Row y={22} name="step 1" blocks={[{ size: 3000, fill: AMBER, label: "3000" }, ...TWO]} />
              <text x={X0 + LIMIT * UNIT} y={68} textAnchor="end" fontSize={11} fontWeight={700} fill={BLUE}>100 × 2로 상한 3200 도달</text>
              <text x={X0} y={96} fontSize={11} fill={RED}>뒤로 밀린 새 100 × 6</text>
              {Array.from({ length: 6 }, (_, i) => (
                <rect key={i} x={X0 + i * 100 * UNIT} y={102} width={100 * UNIT} height={20} fill="none" stroke={BLUE} strokeWidth={1} strokeDasharray="3 2" />
              ))}
            </>
          )}
          {index === 3 && (
            <>
              <Row y={22} name="step 1" blocks={[...EIGHT, { size: 2400, fill: AMBER, label: "3000의 일부 (크기 미정)", dashed: true }]} />
              <text x={X0} y={76} fontSize={11} fill={SLATE}>요청을 나누면 남은 자리에도 일부가 들어갈 수 있습니다</text>
            </>
          )}
        </svg>
      )}
    />
  );
}

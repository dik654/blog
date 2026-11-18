import { StableSceneStack } from "@/components/viz/StableSceneStack";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case 둘째 문단 — 식민 수출 장부 100 = 30 + 15 + 35 + 20(1·3절),
 * 수출 제조 장부 100 = 수입 부품 45 + 현지 임금 15 + 현지 공급업체 10 + 세금 5 + 기업 이익 25(3절).
 * 글: "현지 몫의 크기는 기업 소유·부품 국산화·임금·세금과 이익 재투자에 따라 달라집니다."
 * 칸 하나가 판매액 1이다(설명용 단위). 이익 25가 어디에 남는지는 글이 정하지 않으므로 점선으로 둔다.
 */
interface Part {
  mark: string;
  name: string;
  value: number;
  color: string;
}

const COLONIAL: readonly Part[] = [
  { mark: "생", name: "생산 투입·농장·광산 비용", value: 30, color: "#64748b" },
  { mark: "운", name: "운송·보험", value: 15, color: "#0284c7" },
  { mark: "외", name: "식민정부·상사·해외 자본의 세금·이익 송금", value: 35, color: "#dc2626" },
  { mark: "현", name: "현지 임금과 소득", value: 20, color: "#16a34a" },
];

const FACTORY: readonly Part[] = [
  { mark: "부", name: "수입 부품", value: 45, color: "#dc2626" },
  { mark: "임", name: "현지 임금", value: 15, color: "#16a34a" },
  { mark: "공", name: "현지 공급업체", value: 10, color: "#0f766e" },
  { mark: "세", name: "세금", value: 5, color: "#7c3aed" },
  { mark: "이", name: "기업 이익", value: 25, color: "#d97706" },
];

interface Scene {
  label: string;
  summary: string;
  parts: readonly Part[];
  focus: readonly number[];
  dashed: readonly number[];
  note: string;
}

const SCENES: readonly Scene[] = [
  { label: "식민 수출 장부", summary: "100 − 30 − 15 − 35 = 20", parts: COLONIAL, focus: [3], dashed: [], note: "1·3절의 설명용 장부입니다. 판매액 100 가운데 현지 임금과 소득으로 남는 칸은 20개입니다. 다만 생산 비용 30 안에도 현지 소농의 소득과 수입 비료·기계가 섞일 수 있고, 35 안에도 국가 세금과 외국 기업 이익이 함께 있을 수 있어 실제 자료에서는 다시 나눠야 합니다." },
  { label: "수출 제조 장부", summary: "45 + 15 + 10 + 5 + 25 = 100", parts: FACTORY, focus: [0, 1, 2, 3, 4], dashed: [], note: "3절 둘째 문단의 가정입니다. 제조품 판매액 100이 수입 부품 45, 현지 임금 15, 현지 공급업체 10, 세금 5, 기업 이익 25로 나뉩니다. 글은 이 장부에서 현지 몫을 하나의 숫자로 정하지 않습니다. 다음 장면들은 글이 꼽은 요인이 어느 칸에 닿는지 봅니다." },
  { label: "부품 국산화: 수입 부품 45", summary: "가장 큰 칸 45", parts: FACTORY, focus: [0], dashed: [], note: "가장 큰 칸은 수입 부품 45입니다. 글이 꼽은 요인 가운데 '부품 국산화'가 이 칸에 닿습니다. 국산화가 되면 이 칸의 일부가 현지 공급업체 칸으로 옮겨 갈 수 있지만, 얼마나 옮겨 갈지는 글이 정하지 않아 칸을 옮겨 그리지 않았습니다." },
  { label: "임금과 세금", summary: "임금 15 · 공급업체 10 · 세금 5", parts: FACTORY, focus: [1, 2, 3], dashed: [], note: "현지 임금 15와 현지 공급업체 10은 이름 그대로 현지 사람과 기업에 지급되는 칸입니다. 글은 '임금'과 '세금'도 현지 몫을 바꾸는 요인으로 꼽습니다. 이 칸들의 크기도 고정된 값이 아니라 가정입니다." },
  { label: "기업 이익 25", summary: "남을지는 소유·재투자에 달림", parts: FACTORY, focus: [4], dashed: [4], note: "기업 이익 25는 점선으로 그렸습니다. 글은 이 몫이 현지에 남는지 정하지 않고, 기업 소유와 이익 재투자에 따라 달라진다고만 씁니다. 그래서 수출 제조 장부의 현지 몫은 식민 장부의 20처럼 하나의 숫자로 적지 않았습니다." },
];

const COLS = 20;
const ROWS = 5;
const CELL = 18;
const GAP = 2;
const MAX_ROWS = 5;

function ownerOf(index: number, parts: readonly Part[]) {
  return parts.findIndex((_, partIndex) => {
    const start = parts.slice(0, partIndex).reduce<number>((sum, part) => sum + part.value, 0);
    return index >= start && index < start + parts[partIndex].value;
  });
}

function Body({ sceneIndex }: { sceneIndex: number }) {
  const scene = SCENES[sceneIndex];
  const { focus, dashed } = scene;
  return (
    <div className="min-w-0 space-y-3">
      <svg viewBox={`0 0 ${COLS * CELL + (COLS - 1) * GAP} ${ROWS * CELL + (ROWS - 1) * GAP}`} className="mx-auto h-auto w-full max-w-[560px] text-foreground" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
        {Array.from({ length: COLS * ROWS }, (_, index) => {
          const owner = ownerOf(index, scene.parts);
          const part = scene.parts[owner];
          const on = focus.includes(owner);
          const isDashed = dashed.includes(owner);
          const x = (index % COLS) * (CELL + GAP);
          const y = Math.floor(index / COLS) * (CELL + GAP);
          return (
            <g key={index} opacity={on ? 1 : 0.3}>
              <rect x={x + 0.5} y={y + 0.5} width={CELL - 1} height={CELL - 1} rx={3} fill={isDashed ? "none" : part.color} fillOpacity={0.22} stroke={part.color} strokeWidth={1} strokeDasharray={isDashed ? "3 2" : undefined} />
              <text x={x + CELL / 2} y={y + CELL / 2 + 4} textAnchor="middle" fontSize={11} fontWeight={600} fill="currentColor">{part.mark}</text>
            </g>
          );
        })}
      </svg>
      <ul className="min-w-0 space-y-1 text-sm">
        {Array.from({ length: MAX_ROWS }, (_, rowIndex) => {
          const part = scene.parts[rowIndex] as Part | undefined;
          const on = focus.includes(rowIndex);
          return (
            <li key={rowIndex} className={`grid grid-cols-[1.25rem_minmax(0,1fr)_2.5rem] items-center gap-2 ${part ? "" : "invisible"} ${on ? "" : "opacity-50"}`}>
              <span className="text-center text-xs font-bold" style={{ color: part?.color }}>{part?.mark ?? "·"}</span>
              <span className={`leading-5 ${on ? "font-semibold" : ""}`}>{part?.name ?? "·"}</span>
              <span className="text-right font-mono font-bold">{part ? part.value : 0}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function ExportLedgerCellsViz() {
  return (
    <SceneShell
      eyebrow="두 장부 비교"
      title="같은 판매액 100도 칸이 나뉘는 방식이 다릅니다"
      description="칸 하나가 판매액 1이고, 칸 안 글자는 아래 목록 왼쪽 표시와 같습니다. 두 장부는 모두 1·3절의 설명용 가정이며 실제 나라의 통계가 아닙니다. 흐린 칸은 그 장면의 초점이 아닌 몫입니다."
      ariaLabel="식민 수출 장부 100에서 현지 몫 20과, 수출 제조 장부 100의 다섯 몫이 글이 꼽은 요인과 닿는 자리"
      scenes={SCENES}
      render={(active) => <StableSceneStack active={active} scenes={SCENES.map((scene, index) => <Body key={scene.label} sceneIndex={index} />)} />}
    />
  );
}

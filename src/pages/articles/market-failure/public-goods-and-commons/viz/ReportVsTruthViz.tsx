import type { ReactNode } from "react";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #revelation — 걷는 방식에 따라 신고가 줄거나 부풀고, 합이 드는 값 9를 넘는지가 뒤집힌다.
 * 둘째 가로등 참값 5, 3, 2(합 10), 셋째 가로등 참값 4, 2, 1(합 7).
 */
const COST = 9;
const AXIS_MAX = 12;
const WHO = ["가", "나", "다"] as const;
const SEGMENT = ["#2563eb", "#60a5fa", "#93c5fd"] as const;
const SEGMENT_TEXT = ["#ffffff", "#0f172a", "#0f172a"] as const;
const CHANGED = "#d97706";

type Scene = {
  label: string;
  summary: string;
  note: string;
  scheme: string;
  truth: readonly number[];
  report: readonly number[];
  /** 각자 내는 값. 안 세워지는 데다 가정도 하지 않는 장면이면 null */
  pays: readonly number[] | null;
  gainLabel: string;
};

const SCENES: readonly Scene[] = [
  {
    label: "신고한 만큼 걷기 · 참말",
    summary: "신고 합 10 ≥ 9 → 세워짐",
    note: "둘째 가로등입니다. 참값 합이 10이라 세우는 것이 맞고 참말하면 세워집니다. 다만 각자 말한 만큼 내고 그만큼 받으므로 남는 것이 정확히 0입니다.",
    scheme: "신고한 값이 곧 자기 부담",
    truth: [5, 3, 2],
    report: [5, 3, 2],
    pays: [5, 3, 2],
    gainLabel: "남는 것",
  },
  {
    label: "가만 4로 줄이면",
    summary: "신고 합 9 ≥ 9 → 세워짐",
    note: "가가 4라고 말해도 합이 9라 여전히 세워집니다. 4만 내고 5를 얻으니 가에게 1이 남습니다. 그래서 줄여 말할 이유가 생깁니다.",
    scheme: "신고한 값이 곧 자기 부담",
    truth: [5, 3, 2],
    report: [4, 3, 2],
    pays: [4, 3, 2],
    gainLabel: "남는 것",
  },
  {
    label: "셋이 다 1씩 줄이면",
    summary: "신고 합 7 < 9 → 안 세워짐",
    note: "같은 이유로 셋이 다 줄이면 합이 7이 되어 9에 못 미칩니다. 참값 합은 그대로 10인데 세워지지 않습니다.",
    scheme: "신고한 값이 곧 자기 부담",
    truth: [5, 3, 2],
    report: [4, 2, 1],
    pays: null,
    gainLabel: "남는 것",
  },
  {
    label: "똑같이 나눠 걷기 · 참말",
    summary: "신고 합 7 < 9 → 안 세워짐",
    note: "이번에는 셋째 가로등이고 신고와 무관하게 셋이 3씩 냅니다. 참값 합이 7이라 세우면 안 되고 참말하면 안 세워집니다. 그런데 세워진다면 가는 3을 내고 4를 얻습니다.",
    scheme: "신고와 무관하게 3씩 부담",
    truth: [4, 2, 1],
    report: [4, 2, 1],
    pays: [3, 3, 3],
    gainLabel: "세워진다면 남는 것",
  },
  {
    label: "가가 6으로 부풀리면",
    summary: "신고 합 9 ≥ 9 → 세워짐",
    note: "가가 6이라고 말해도 내는 돈은 3으로 같은데 합이 9가 되어 세워집니다. 가는 1을 얻고 나는 1을, 다는 2를 잃어 합치면 2를 깎아먹습니다.",
    scheme: "신고와 무관하게 3씩 부담",
    truth: [4, 2, 1],
    report: [6, 2, 1],
    pays: [3, 3, 3],
    gainLabel: "남는 것",
  },
];

const sumOf = (values: readonly number[]) => values.reduce<number>((total, value) => total + value, 0);
const signed = (value: number) => (value > 0 ? `+${value}` : value < 0 ? `−${Math.abs(value)}` : "0");

function Stack({ name, values, truth, total }: { name: string; values: readonly number[]; truth: readonly number[]; total: number }) {
  return (
    <>
      <span className="text-xs font-bold leading-7 sm:text-sm">{name}</span>
      <div className="relative h-7 min-w-0 rounded-sm bg-muted/40">
        <div className="flex h-full">
          {values.map((value, index) => {
            const changed = value !== truth[index];
            return (
              <span
                key={WHO[index]}
                className="flex h-full items-center justify-start overflow-hidden border-r border-background pl-1 font-mono text-xs font-bold"
                style={{
                  width: `${(value / AXIS_MAX) * 100}%`,
                  backgroundColor: changed ? CHANGED : SEGMENT[index],
                  color: changed ? "#ffffff" : SEGMENT_TEXT[index],
                }}
              >
                {value}
              </span>
            );
          })}
        </div>
        <div className="absolute -inset-y-1 w-px" style={{ left: `${(COST / AXIS_MAX) * 100}%`, backgroundColor: "#dc2626" }} />
      </div>
      <span className="text-right font-mono text-sm font-bold leading-7">{total}</span>
    </>
  );
}

function Cell({ children, strong = false }: { children: ReactNode; strong?: boolean }) {
  return <span className={`border-t border-border py-1 text-center font-mono ${strong ? "font-bold" : ""}`}>{children}</span>;
}

function RowName({ children }: { children: ReactNode }) {
  return <span className="border-t border-border py-1 text-muted-foreground">{children}</span>;
}

export default function ReportVsTruthViz() {
  return (
    <SceneShell
      eyebrow="값을 물어볼 때"
      title="걷는 방식이 신고를 줄이기도 부풀리기도 합니다"
      description="신고는 내게 이 가로등이 얼마의 값인지 답한 숫자이고 참값은 실제로 얻는 값입니다. 신고 합이 드는 값 9(빨간 선) 이상이면 세운다고 보고, 막대는 왼쪽부터 가·나·다이며 주황 칸은 참값과 다르게 말한 값입니다."
      note="세 사람과 가로등 하나씩으로 줄인 예입니다. 거짓말의 방향을 보이려고 값을 안다고 둔 계산입니다."
      ariaLabel="신고한 만큼 걷는 방식과 똑같이 나눠 걷는 방식에서 신고 합과 세워지는지 비교"
      scenes={SCENES}
      render={(scene) => {
        const item = SCENES[scene];
        const reportTotal = sumOf(item.report);
        const truthTotal = sumOf(item.truth);
        const built = reportTotal >= COST;
        const right = truthTotal >= COST;
        const pays = item.pays;
        const gains = pays ? item.truth.map((value, index) => value - pays[index]) : null;
        return (
          <div key={scene} className="min-w-0 space-y-3">
            <p className="text-xs font-bold text-muted-foreground sm:text-sm">{item.scheme}</p>
            <div className="grid grid-cols-[2.5rem_minmax(0,1fr)_1.75rem] items-center gap-x-2 gap-y-2">
              <span />
              <div className="relative h-5 text-xs font-bold text-red-700 dark:text-red-400">
                <span className="absolute -translate-x-1/2 whitespace-nowrap" style={{ left: `${(COST / AXIS_MAX) * 100}%` }}>드는 값 {COST}</span>
              </div>
              <span className="text-right text-xs text-muted-foreground">합</span>
              <Stack name="참값" values={item.truth} truth={item.truth} total={truthTotal} />
              <Stack name="신고" values={item.report} truth={item.truth} total={reportTotal} />
            </div>

            <div className="grid grid-cols-[minmax(0,1fr)_repeat(3,2.5rem)_2.5rem] text-xs leading-5 sm:text-sm">
              <span className="py-1" />
              {WHO.map((name) => (
                <span key={name} className="py-1 text-center font-bold">{name}</span>
              ))}
              <span className="py-1 text-center text-muted-foreground">합</span>

              <RowName>낼 돈</RowName>
              {[0, 1, 2].map((index) => (
                <Cell key={index}>{pays ? pays[index] : "−"}</Cell>
              ))}
              <Cell>{" "}</Cell>

              <RowName>{item.gainLabel}</RowName>
              {[0, 1, 2].map((index) => (
                <Cell key={index} strong>{gains ? signed(gains[index]) : "−"}</Cell>
              ))}
              <Cell strong>{gains ? signed(sumOf(gains)) : "−"}</Cell>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs leading-5 sm:text-sm">
              <div className="rounded-lg border border-border bg-background px-3 py-2">
                <span className="block text-muted-foreground">참값 합으로 보면</span>
                <span className="block font-bold">{right ? "세우는 것이 맞음" : "세우면 안 됨"}</span>
              </div>
              <div className={`rounded-lg border px-3 py-2 ${built !== right ? "border-dashed border-red-600" : "border-border bg-background"}`}>
                <span className="block text-muted-foreground">신고 합으로 정하면</span>
                <span className={`block font-bold ${built !== right ? "text-red-700 dark:text-red-400" : ""}`}>
                  {built ? "세워짐" : "안 세워짐"}{built !== right ? " · 어긋남" : ""}
                </span>
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}

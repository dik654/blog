import type { ReactNode } from "react";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #conditions — 규칙의 입력·판단·출력에 걸리는 다섯 조건.
 * 쌍별 다수결: 판단 세 조건을 지키고 사회적 순서를 어김(4절). 점수제: 두 안만 보고 비교하기를 어김(3절).
 */
type Status = "" | "keep" | "break" | "unchecked";
const STATUS_TEXT: Record<Status, string> = { "": "", keep: "✓ 지킴", break: "✗ 깨짐", unchecked: "− 따지지 않음" };

const CONDITIONS = {
  input: { name: "선호 제한 없음", plain: "일관된 개인 순서면 어떤 조합도 받기" },
  unanimity: { name: "전원일치 존중", plain: "모두가 가를 나보다 원하면 사회도 그렇게" },
  independence: { name: "두 안만 보고 비교하기", plain: "가와 나를 정할 때 다의 위치는 보지 않기" },
  dictator: { name: "한 사람에게 맡기지 않기", plain: "한 사람 선호가 늘 사회 선호가 되지 않기" },
  output: { name: "사회적 순서", plain: "어떤 입력에서도 앞뒤가 이어지는 완전한 순서" },
} as const;
type Key = keyof typeof CONDITIONS;

const SCENES: readonly (
  { label: string; summary: string; note: string; inputValue: string; outputValue: string; status: Record<Key, Status> }
)[] = [
  {
    label: "조건이 걸리는 자리",
    summary: "입력 1 · 판단 3 · 출력 1",
    note: "규칙의 출력은 당선자 이름이 아니라 모든 안을 앞뒤로 세운 사회의 순서입니다.",
    inputValue: "개인들의 순서",
    outputValue: "사회의 순서",
    status: { input: "", unanimity: "", independence: "", dictator: "", output: "" },
  },
  {
    label: "쌍별 다수결: 입력과 판단",
    summary: "세 표 허용 · 판단 셋 지킴",
    note: "처음의 세 표는 허용되는 입력이고, 쌍별 다수결은 판단의 세 제한을 지킵니다.",
    inputValue: "처음의 세 표",
    outputValue: "다음 장면에서 확인",
    status: { input: "keep", unanimity: "keep", independence: "keep", dictator: "keep", output: "" },
  },
  {
    label: "쌍별 다수결: 출력",
    summary: "가>나>다>가",
    note: "같은 입력의 결과는 앞뒤로 세운 순서가 아니라 고리입니다. 모든 선호 조합을 받으면 사회적 순서가 무너집니다.",
    inputValue: "처음의 세 표",
    outputValue: "고리: 가>나>다>가",
    status: { input: "keep", unanimity: "keep", independence: "keep", dictator: "keep", output: "break" },
  },
  {
    label: "점수제로 바꾸면",
    summary: "깨지는 자리가 옮겨 갑니다",
    note: "3절의 예에서는 다의 위치만 달라졌는데 가와 나의 순서가 뒤집혔습니다. 나머지 네 조건은 그 예에서 따지지 않았습니다.",
    inputValue: "3절의 다섯 명",
    outputValue: "3절에서 따지지 않음",
    status: { input: "unchecked", unanimity: "unchecked", independence: "break", dictator: "unchecked", output: "unchecked" },
  },
];

function Condition({ id, status }: { id: Key; status: Status }) {
  const tone = status === "break" ? "border-red-600 bg-red-600/[0.06]" : status === "keep" ? "border-primary/60" : "border-border";
  return (
    <div className={`rounded-lg border bg-background px-2.5 py-1.5 ${tone}`}>
      <p className="flex flex-wrap items-baseline justify-between gap-x-2 text-sm font-bold leading-5">
        <span>{CONDITIONS[id].name}</span>
        <span className={`text-xs ${status === "break" ? "text-red-700 dark:text-red-400" : status === "keep" ? "text-primary" : "font-normal text-muted-foreground"}`}>
          {STATUS_TEXT[status]}
        </span>
      </p>
      <p className="text-xs leading-5 text-muted-foreground">{CONDITIONS[id].plain}</p>
    </div>
  );
}

function Zone({ title, value, children }: { title: string; value?: string; children: ReactNode }) {
  return (
    <div className="min-w-0 space-y-1.5">
      <p className="text-xs font-black text-primary">
        {title}
        {value && <span className="ml-2 font-semibold text-foreground">{value}</span>}
      </p>
      {children}
    </div>
  );
}

export default function ConditionsMapViz() {
  return (
    <SceneShell
      eyebrow="다섯 조건의 자리"
      title="다섯 조건은 규칙의 입력, 판단, 출력에 걸립니다"
      description="규칙을 입력에서 출력으로 가는 상자로 펼치고, 처음의 세 표와 3절의 점수제 예를 차례로 넣어 봅니다."
      ariaLabel="다섯 조건이 규칙의 입력 판단 출력에 걸리는 자리와 쌍별 다수결, 점수제가 깨는 조건"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="grid min-w-0 gap-3 lg:grid-cols-[1fr_1.15fr_1fr]">
            <Zone title="① 입력" value={scene.inputValue}>
              <Condition id="input" status={scene.status.input} />
            </Zone>
            <Zone title="② 판단">
              <Condition id="unanimity" status={scene.status.unanimity} />
              <Condition id="independence" status={scene.status.independence} />
              <Condition id="dictator" status={scene.status.dictator} />
            </Zone>
            <Zone title="③ 출력" value={scene.outputValue}>
              <Condition id="output" status={scene.status.output} />
            </Zone>
          </div>
        );
      }}
    />
  );
}

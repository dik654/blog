import { StableSceneStack } from "@/components/viz/StableSceneStack";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #reading-procedure 와 AlgorithmBlock — 위에서 아래로 읽는 문을 사례별로 따라간다.
 * 기준 80%·90%, DRAM 80%·20% 는 글의 값이다. 사례의 통과 값 중 글에 없는 것은 (가정)으로 표시한다.
 */
type Status = "pass" | "stop" | "skip";

const GATES = [
  "SM active 80% 미만?",
  "Issue active 90% 이상?",
  "Not selected 비율 높음?",
  "가장 큰 stall·몰린 instruction",
  "Long 이면 DRAM throughput",
  "변경 하나 뒤 profiler 없이 elapsed 재측정",
] as const;

const PASS_TO_STALL: readonly (readonly [Status, string])[] = [["pass", "아니요, 98%"], ["pass", "아니요, 40%"], ["pass", "아니요 (가정)"], ["pass", "long scoreboard 60%"]];
const NOT_READ: readonly [Status, string] = ["skip", "읽지 않음"];

const CASES: readonly { label: string; summary: string; note: string; rows: readonly (readonly [Status, string])[] }[] = [
  {
    label: "SM 절반이 빈 kernel",
    summary: "첫 문에서 멈춤",
    note: "Tail 로 SM 절반이 놀던 kernel 에서 stall 을 고쳐도 chip 의 절반은 여전히 비어 있습니다.",
    rows: [["stop", "예, 약 50% → grid·tail·launch 간격"], NOT_READ, NOT_READ, NOT_READ, NOT_READ, NOT_READ],
  },
  {
    label: "Issue active 95%",
    summary: "long 60% 여도",
    note: "이미 매 clock 일하고 있었으므로 memory 를 고쳐도 elapsed 는 줄지 않습니다.",
    rows: [["pass", "아니요 (가정)"], ["stop", "예, 95% → roofline 의 pipe utilization"], NOT_READ, NOT_READ, NOT_READ, NOT_READ],
  },
  {
    label: "DRAM 높음",
    summary: "bandwidth → byte 절감",
    note: "Bandwidth 에 묶인 kernel 입니다. 재사용을 늘려 HBM 을 지나는 byte 를 줄입니다.",
    rows: [...PASS_TO_STALL, ["stop", "peak 80% 이상 → byte 절감"], ["skip", "처방 적용 뒤"]],
  },
  {
    label: "DRAM 낮음",
    summary: "latency → MLP",
    note: "Outstanding 요청이 부족한 경우입니다. 20%와 80% 사이의 기준은 이 글에 없습니다.",
    rows: [...PASS_TO_STALL, ["stop", "peak 20% 아래 → warp 당 독립 load"], ["skip", "처방 적용 뒤"]],
  },
  {
    label: "다시 재기",
    summary: "세 값의 방향을 함께",
    note: "Stall 비율이 줄었는데 elapsed 가 그대로면 그 stall 은 병목이 아니었던 것입니다.",
    rows: [...PASS_TO_STALL, ["pass", "처방 하나 적용"], ["stop", "stall 비율·issue active·elapsed 기록"]],
  },
];

const BADGE: Record<Status, string> = { pass: "통과", stop: "여기", skip: "—" };
const ROW_CLASS: Record<Status, string> = {
  pass: "border-border",
  stop: "border-primary bg-primary/10",
  skip: "border-dashed border-border/60 opacity-45",
};

const SCENES = CASES.map(({ label, summary, note }) => ({ label, summary, note }));

export default function ReadingGateViz() {
  return (
    <SceneShell
      eyebrow="읽는 순서"
      title="위의 문을 통과한 kernel 만 stall 처방에 닿습니다"
      description="한 줄이 문 하나이고 위에서 아래로 읽습니다. 수치는 글의 가정 사례입니다."
      ariaLabel="사례별로 판정 순서를 따라가며 어디서 멈추는지 보여 주는 그림"
      scenes={SCENES}
      render={(active) => (
        <StableSceneStack
          active={active}
          scenes={CASES.map((item) => (
            <ol key={item.label} className="grid gap-1">
              {GATES.map((gate, index) => {
                const [status, value] = item.rows[index];
                return (
                  <li key={gate} className={`grid grid-cols-[2rem_minmax(0,1fr)] items-center gap-1.5 border px-1.5 py-0.5 ${ROW_CLASS[status]}`}>
                    <span className={`text-center font-mono text-xs ${status === "stop" ? "font-bold text-primary" : "text-muted-foreground"}`}>{BADGE[status]}</span>
                    <span className="min-w-0 text-xs leading-[1.1rem] sm:text-sm sm:leading-5">
                      <span className="block font-semibold">{gate}</span>
                      <span className="block text-muted-foreground">{value}</span>
                    </span>
                  </li>
                );
              })}
            </ol>
          ))}
        />
      )}
    />
  );
}

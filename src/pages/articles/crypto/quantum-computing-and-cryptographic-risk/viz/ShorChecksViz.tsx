import SceneShell from "./SceneShell";

/**
 * 본문 대응: #source — 항상 한 번에 성공하지는 않는다. 서로소, 짝수 주기, 자명하지 않은 최대공약수를 확인한다.
 * 밑 2는 본문 사례입니다. 밑 3은 본문의 약수, 밑 14는 15−1로, 15에서 직접 셈한 예입니다(가정).
 * 3: 공약수 3이 곧 인수이고 15÷3=5이므로 주기 계산이 필요 없음(나머지 1·3·9·12·6·3…은 1로 돌아오지 않음). 14: 14²=196, 196을 15로 나눈 나머지 1 → 주기 2, 14−1=13, 14+1=15.
 */
type State = "pass" | "found" | "stop" | "wait";

interface Scene {
  label: string;
  summary: string;
  note: string;
  gates: readonly { state: State; value: string }[];
}

const NAMES = ["밑과 15가 서로소인가", "주기가 짝수인가", "최대공약수가 1·15가 아닌가"] as const;

const SCENES: readonly Scene[] = [
  {
    label: "밑 2",
    summary: "세 관문 모두 통과 → 3 · 5",
    note: "본문 사례입니다. 2와 15의 공약수는 1뿐이고, 주기 4는 짝수이며, 마지막에 얻은 3과 5는 1도 15도 아닙니다.",
    gates: [
      { state: "pass", value: "최대공약수(2, 15) = 1" },
      { state: "pass", value: "주기 4 → 절반 2" },
      { state: "pass", value: "3과 5" },
    ],
  },
  {
    label: "밑 3",
    summary: "첫 관문에서 이미 3 · 5",
    note: "3은 15의 약수라서 서로소가 아닙니다. 그 공약수 3이 곧 인수이고 15÷3=5이므로 주기를 찾을 필요가 없습니다. 나머지도 1·3·9·12·6·3으로 흘러 1로 돌아오지 않아 주기 자체가 없습니다. 밑 3은 이 그림에서 고른 예입니다(가정).",
    gates: [
      { state: "found", value: "최대공약수(3, 15) = 3 → 15÷3 = 5" },
      { state: "wait", value: "−" },
      { state: "wait", value: "−" },
    ],
  },
  {
    label: "홀수 주기",
    summary: "둘째 관문에서 멈춤",
    note: "앞 계산은 주기의 절반을 지수로 씁니다. 주기가 홀수이면 절반이 정수가 아니라 그 지수를 만들 수 없습니다. 숫자 없이 조건만 보입니다.",
    gates: [
      { state: "pass", value: "서로소라고 둠" },
      { state: "stop", value: "절반이 정수가 아님" },
      { state: "wait", value: "−" },
    ],
  },
  {
    label: "밑 14",
    summary: "마지막 관문에서 멈춤",
    note: "14×14=196을 15로 나눈 나머지가 1이라 주기는 2입니다. 절반 지수로 14를 얻으면 14−1=13, 14+1=15이고, 15와의 최대공약수는 1과 15뿐이라 새 인수가 없습니다. 밑 14는 이 그림에서 고른 예입니다(가정).",
    gates: [
      { state: "pass", value: "최대공약수(14, 15) = 1" },
      { state: "pass", value: "주기 2 → 절반 1" },
      { state: "stop", value: "13 → 1, 15 → 15" },
    ],
  },
];

const TONE: Record<State, string> = {
  pass: "border-primary bg-primary/10",
  found: "border-2 border-amber-600 bg-amber-500/10",
  stop: "border-dashed border-red-600 bg-red-600/10",
  wait: "border-border/50 opacity-50",
};

const MARK: Record<State, string> = { pass: "통과", found: "인수 얻음", stop: "멈춤", wait: "가지 않음" };

function Gates({ scene }: { scene: Scene }) {
  return (
    <ol className="mx-auto max-w-[480px] space-y-3">
      {scene.gates.map((gate, index) => (
        <li key={NAMES[index]} className="relative">
          <div className={`grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 rounded-lg border px-3 py-2 ${TONE[gate.state]}`}>
            <span className="text-xs font-bold leading-5 text-muted-foreground">{NAMES[index]}</span>
            <span className={`row-span-2 text-xs font-bold ${gate.state === "stop" ? "text-red-700 dark:text-red-400" : gate.state === "found" ? "text-amber-700 dark:text-amber-400" : gate.state === "pass" ? "text-primary" : "text-muted-foreground"}`}>
              {MARK[gate.state]}
            </span>
            <span className="font-mono text-sm font-bold">{gate.value}</span>
          </div>
          {index < 2 && <span aria-hidden="true" className="absolute left-6 top-full h-3 w-px bg-border" />}
        </li>
      ))}
    </ol>
  );
}

export default function ShorChecksViz() {
  return (
    <SceneShell
      eyebrow="세 번의 확인"
      title="세 관문에서 각각 무슨 일이 생기는가"
      description="위에서 아래로 차례로 확인합니다. 둘째나 셋째 관문에서 멈추면 이번 시도로는 3과 5를 얻지 못합니다."
      ariaLabel="밑 2는 세 확인을 통과하고, 밑 3은 첫 확인에서 인수를 얻고, 홀수 주기와 밑 14는 둘째와 셋째 확인에서 멈추는 과정"
      scenes={SCENES}
      render={(active) => <Gates scene={SCENES[active]} />}
    />
  );
}

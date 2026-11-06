import SceneShell from "./SceneShell";

/**
 * 본문 대응: #source-pipeline — SIMULATE_IO를 켜면 host memcpy가 cycleDone 대기보다 앞에 놓인다.
 * 앞의 두 장면은 원문 processWithStreams의 코드 순서, 셋째 장면은 본문이 말한 옮김의 원칙입니다.
 */
type Tone = "plain" | "host" | "wait" | "bad";
type Step = readonly [string, Tone];

const LOOP: readonly Step[] = [
  ["cycleDone[next] 대기", "wait"],
  ["kernel(current)", "plain"],
  ["H2D(next)", "plain"],
  ["D2H(current)", "plain"],
  ["record cycleDone[current]", "plain"],
];

const SCENES: readonly { label: string; summary: string; note: string; steps: readonly Step[] }[] = [
  { label: "꺼져 있을 때", summary: "대기가 맨 앞", steps: LOOP, note: "원문의 기본 상태입니다. 반복은 다음 자리의 표식을 기다리는 일로 시작하고, host는 buffer 내용을 직접 만지지 않습니다." },
  { label: "SIMULATE_IO를 켜면", summary: "memcpy 둘이 대기보다 앞", steps: [["memcpy: 결과 저장", "bad"], ["memcpy: 새 입력 읽기", "bad"], ...LOOP], note: "host memcpy 두 줄이 cycleDone 대기보다 앞에 놓여, 복사 완료를 확인하기 전에 host가 buffer를 만집니다." },
  { label: "응용에 옮겨 쓰려면", summary: "복사 완료 확인 → host 접근", steps: [["복사 제출", "plain"], ["그 복사의 완료 확인", "wait"], ["host가 입력 덮어쓰기·출력 읽기", "host"]], note: "입력 덮어쓰기와 출력 읽기까지 응용하려면 각 복사의 완료를 확인한 뒤 host가 접근하도록 옮깁니다." },
];

const TONE: Record<Tone, string> = {
  plain: "border-border text-foreground",
  host: "border-primary bg-primary/15 text-foreground",
  wait: "border-amber-600 text-amber-700 dark:text-amber-400",
  bad: "border-dashed border-red-600 text-red-700 dark:text-red-400",
};

export default function SimulateIoOrderViz() {
  return (
    <SceneShell
      eyebrow="host 접근 순서"
      title="memcpy가 대기보다 앞에 오면 무엇이 달라질까요"
      description="위에서 아래로 한 반복의 코드 순서입니다. SIMULATE_IO는 데이터 입출력 시간을 흉내 내는 원문의 꺼진 옵션이고, 점선 칸은 완료 확인 전에 놓인 host 접근입니다."
      ariaLabel="SIMULATE_IO를 끄고 켤 때 한 반복의 순서와 응용에 옮겨 쓸 때의 순서 비교"
      scenes={SCENES}
      render={(index) => (
        <ol className="space-y-1">
          {SCENES[index].steps.map(([text, tone], step) => (
            <li key={text} className={`flex items-baseline gap-2 rounded border px-3 py-1 text-sm ${TONE[tone]}`}>
              <span className="font-mono text-xs text-muted-foreground">{step + 1}</span>
              <span className="min-w-0 break-words font-mono text-xs sm:text-sm">{text}</span>
            </li>
          ))}
        </ol>
      )}
    />
  );
}

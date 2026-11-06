import SceneShell, { type ShellScene } from "./SceneShell";

/**
 * 본문 대응: #roundtrip — E(D(b))=b, D(E(N(s)))=N(s), N(N(s))=N(s), 전체 경로 11 ≠ 10,
 * 그리고 개수만 비교하면 A와 B가 같아 보이는 자소군 검사.
 */
interface TripScene extends ShellScene {
  start: string;
  stepA: string;
  middle: string;
  stepB: string;
  end: string;
  check: string;
  fails: boolean;
}

const SCENES: readonly TripScene[] = [
  { label: "원시 byte 보존", summary: "E(D(b)) = b", note: "유효한 UTF-8을 변환 없이, 같은 부호화 규칙으로 해독·부호화했을 때 byte가 바뀌지 않았는지 확인합니다. 정규화와 BOM 제거, 개행 변경 같은 처리는 별도 계약입니다.", start: "b · 11 byte", stepA: "해독 D", middle: "문자열", stepB: "부호화 E", end: "b · 11 byte", check: "처음과 끝의 byte가 같은지", fails: false },
  { label: "정규형 보존", summary: "D(E(N(s))) = N(s)", note: "기준이 원시 byte가 아니라 정규화한 문자열입니다. 저장했다 읽어도 정규형이 그대로인지 확인합니다.", start: "N(s) · 번호 4개", stepA: "부호화 E", middle: "10 byte", stepB: "해독 D", end: "N(s) · 번호 4개", check: "처음과 끝의 정규형이 같은지", fails: false },
  { label: "다시 정규화", summary: "N(N(s)) = N(s)", note: "같은 정규화를 다시 해도 더 바뀌지 않는지 확인합니다.", start: "N(s)", stepA: "정규화 N", middle: "N(N(s))", stepB: "비교", end: "N(s)", check: "한 번 더 해도 그대로인지", fails: false },
  { label: "전체 경로", summary: "11 byte ≠ 10 byte", note: "원시 byte 11개를 NFC의 10개로 바꾸는 전체 경로는 첫 등식의 변환 없음 전제와 다릅니다. 정규형을 기준으로 한 나머지 계약과 모순되지는 않습니다.", start: "b_raw · 11 byte", stepA: "NFC", middle: "N(s)", stepB: "부호화 E", end: "b_NFC · 10 byte", check: "첫 등식으로 검사할 경로가 아님", fails: true },
  { label: "자소군 검사", summary: "개수만 비교하면 부족", note: "A와 B는 둘 다 자소군 한 개지만 내용은 다릅니다. 고정한 분할 버전에서 기대값을 정하고 묶음의 내용과 경계를 함께 대조해야 합니다.", start: "A", stepA: "개수 1", middle: "개수가 같음", stepB: "개수 1", end: "B", check: "내용과 경계까지 대조해야 함", fails: true },
];

function Node({ text, tone }: { text: string; tone: "plain" | "end" }) {
  return <span className={`flex min-h-14 min-w-0 items-center justify-center rounded-sm border p-1.5 text-center font-mono text-[11px] leading-4 sm:text-xs ${tone === "end" ? "border-primary bg-primary/10 font-bold" : "border-border"}`}>{text}</span>;
}

function Step({ text, back = false }: { text: string; back?: boolean }) {
  return (
    <span className="flex min-w-0 flex-col items-center justify-center text-center text-[10px] leading-3 text-muted-foreground sm:text-[11px]">
      <span className="block">{text}</span>
      <span aria-hidden className="mt-1 block font-mono text-sm text-foreground">{back ? "←" : "→"}</span>
    </span>
  );
}

export default function RoundTripViz() {
  return (
    <SceneShell
      eyebrow="한 바퀴의 기준"
      title="무엇을 비교하느냐에 따라 ‘돌아왔다’의 뜻이 달라집니다"
      description="왼쪽에서 출발해 오른쪽 값과 비교합니다. 굵은 두 칸이 각 검사에서 같아야 하거나 구별해야 할 대상입니다."
      note="b는 byte 열, s는 문자열, N은 선택한 정규화이며 이 사례에서는 NFC입니다. 등식은 검사할 계약이고, 11·10 byte와 번호 4개는 이 글의 원문 Aé가😀에서 센 값입니다."
      ariaLabel="원시 byte, 정규형, 재정규화, 전체 경로, 자소군 검사의 비교 대상"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0">
            <div className="grid grid-cols-[minmax(0,1fr)_2.75rem_minmax(0,1fr)_2.75rem_minmax(0,1fr)] gap-1 sm:grid-cols-[minmax(0,1fr)_4.5rem_minmax(0,1fr)_4.5rem_minmax(0,1fr)]">
              <Node text={scene.start} tone="end" />
              <Step text={scene.stepA} />
              <Node text={scene.middle} tone="plain" />
              <Step text={scene.stepB} back={active === 4} />
              <Node text={scene.end} tone="end" />
            </div>
            <p className="mt-3 rounded-sm border px-3 py-2 text-center text-xs font-semibold leading-5" style={{ borderColor: scene.fails ? "#d97706" : "#16a34a", borderStyle: scene.fails ? "dashed" : "solid" }}>
              {scene.check}
            </p>
          </div>
        );
      }}
    />
  );
}

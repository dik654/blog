import SceneShell from "./SceneShell";

/**
 * 본문 대응: #source-bug, #authority — 같은 입력이 어느 검사에서 멈추는지.
 * ① 길이 = 64 (출판본은 Exception만 만들고 raise 없음, 덧붙인 함수는 거부)
 * ② 서명식 S·G = R + hA (원문 verify)
 * ③ authorize: 예상 공개키 d75a9801…·예상 배치 비교
 */
type Result = "pass" | "fail" | "skip" | "none" | "absent";

const GATES = [
  { name: "① 길이가 64바이트인가", owner: "출판본은 raise 누락" },
  { name: "② 서명식 S·G=R+hA", owner: "원문 verify" },
  { name: "③ 예상 키·배치와 같은가", owner: "authorize (작은 정책 예)" },
] as const;

const SCENES = [
  { label: "정상 64바이트", summary: "① 통과 → ② 통과 → ③ 통과", input: "가게 키로 만든 64바이트 서명 · 배치 1", results: ["pass", "pass", "pass"], verdict: "승인으로 받아들임", note: "등록된 키 d75a9801…로 47바이트 영수증 메시지에 서명한 입력입니다. 세 검사를 모두 통과합니다." },
  { label: "65바이트 · 출판본", summary: "① 그냥 지나감 → ② 통과", input: "같은 서명 뒤에 00 한 바이트", results: ["skip", "pass", "absent"], verdict: "출판본 verify 통과", note: "출판본은 길이가 64가 아니면 Exception 객체만 만들고 raise하지 않습니다. S를 little-endian으로 읽어 뒤의 00이 S의 수치를 바꾸지 않으니 서명식이 맞습니다." },
  { label: "65바이트 · 길이 검사", summary: "① 거부", input: "같은 서명 뒤에 00 한 바이트", results: ["fail", "none", "none"], verdict: "거부", note: "덧붙인 함수는 원문 verify를 부르기 전에 정확한 길이를 확인합니다. 정상 64바이트는 그대로 통과합니다." },
  { label: "항등원 키 A=O", summary: "① 통과 → ② 통과 → ③ 거부", input: "A=O · R=O · S=0 (64바이트)", results: ["pass", "pass", "fail"], verdict: "서명식은 성공, 승인은 거부", note: "항등원 O(더해도 아무것도 바뀌지 않는 점)를 A와 R에 넣고 S=0이면 메시지와 무관하게 양변이 O입니다. 정상 키의 위조가 아니라 키를 바꾼 입력이라 ③에서 멈춥니다." },
] as const;

const STYLE: Record<Result, { text: string; color: string; dashed: boolean }> = {
  pass: { text: "통과", color: "#16a34a", dashed: false },
  fail: { text: "거부", color: "#dc2626", dashed: false },
  skip: { text: "그냥 지나감", color: "#d97706", dashed: true },
  none: { text: "도달 안 함", color: "#94a3b8", dashed: true },
  absent: { text: "출판본엔 없음", color: "#94a3b8", dashed: true },
};

export default function VerifyGatesViz() {
  return (
    <SceneShell
      eyebrow="세 겹의 검사"
      title="서명식을 통과한 입력도 다른 검사에서 멈출 수 있습니다"
      description="위에서 아래로 차례대로 검사합니다. 18–19절에서 실제로 실행한 네 입력을 같은 순서의 검사에 넣었습니다."
      ariaLabel="길이 검사, 서명식, 등록 키 정책에서 네 입력이 멈추는 위치"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0 space-y-2">
            <p className="rounded-md border border-border bg-background px-3 py-1.5 text-sm"><span className="text-muted-foreground">입력 </span><span className="font-semibold">{scene.input}</span></p>
            {GATES.map((gate, i) => {
              const s = STYLE[scene.results[i] as Result];
              return (
                <div key={gate.name} className="grid grid-cols-[minmax(0,1fr)_4.5rem] items-center gap-2 rounded-md border px-3 py-1.5 sm:grid-cols-[minmax(0,1fr)_9rem]" style={{ borderColor: s.color, borderStyle: s.dashed ? "dashed" : "solid" }}>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold leading-5">{gate.name}</p>
                    <p className="hidden text-xs leading-4 text-muted-foreground sm:block">{gate.owner}</p>
                  </div>
                  <span className="text-right text-xs font-bold" style={{ color: s.color }}>{s.text}</span>
                </div>
              );
            })}
            <p className="pt-1 text-sm"><span className="text-muted-foreground">결과 </span><span className="font-bold">{scene.verdict}</span></p>
          </div>
        );
      }}
    />
  );
}

import SceneShell from "./SceneShell";

/**
 * 본문 대응: #verify·#why — 후보가 어느 검사에서 멈추는지. 파일의 손상·출처 검사와 기능 검사는 다른 질문에 답한다.
 * 기대 해시까지 바뀐 경우는 해시가 통과해도 서명에서 걸린다. 공개 키가 바뀌지 않았다는 조건은 14절의 단서를 따른다.
 */
type Mark = "pass" | "fail" | "wait";

const GATES = [
  { name: "다 받았나", question: "파일이 완전한가" },
  { name: "길이·해시", question: "기대 해시와 같은가 · 손상" },
  { name: "서명", question: "공개 키로 확인되나 · 출처" },
  { name: "제품 자가 검사", question: "시험 실행에서 센서·설정·주기 작업이 되나" },
] as const;

const SCENES: readonly { label: string; summary: string; note: string; marks: readonly [Mark, Mark, Mark, Mark]; result: string }[] = [
  { label: "받다가 전원이 끊김", summary: "1번에서 멈춤", marks: ["fail", "wait", "wait", "wait"], result: "시험 표시 안 함 → v1 계속 실행", note: "후보가 불완전하면 시험 부팅 상태로 표시하지 않습니다." },
  { label: "파일이 손상됨", summary: "2번에서 멈춤", marks: ["pass", "fail", "wait", "wait"], result: "시험 표시 안 함 → v1 유지", note: "신뢰한 기대 해시와 비교하면 손상을 찾을 수 있습니다." },
  { label: "파일과 기대 해시를 함께 바꿈", summary: "2번 통과 · 3번에서 멈춤", marks: ["pass", "pass", "fail", "wait"], result: "후보 사용 안 함 → v1 유지", note: "이럴 수 있다면 해시 일치만으로 출처가 확인되지 않습니다. 공개 키는 그대로라고 둡니다(14절의 단서)." },
  { label: "정상 서명된 고장 프로그램", summary: "3번까지 통과 · 4번에서 멈춤", marks: ["pass", "pass", "pass", "fail"], result: "미확정 재시작 → 시험 모드면 v1 복귀", note: "기능 확인 전에 영구 사용을 결정했다면 이 프로그램도 계속 실행할 수 있습니다." },
  { label: "모두 통과", summary: "네 검사 통과", marks: ["pass", "pass", "pass", "pass"], result: "앱이 이미지 OK 기록 → v2 확정", note: "앞의 세 검사를 통과해야 시험 대상이 되고, 네 번째까지 통과해야 확정합니다." },
];

const MARK_TEXT: Record<Mark, string> = { pass: "통과", fail: "멈춤", wait: "도달 안 함" };
const MARK_CLASS: Record<Mark, string> = {
  pass: "border-emerald-600 text-emerald-700 dark:text-emerald-400",
  fail: "border-red-600 font-bold text-red-700 dark:text-red-400",
  wait: "border-dashed border-border text-muted-foreground/70",
};

export default function VerifyGatesViz() {
  return (
    <SceneShell
      eyebrow="후보가 멈추는 자리"
      title="검사마다 답하는 질문이 달라 걸리는 후보도 다릅니다"
      description="해시는 파일 내용으로 계산한 짧은 지문이고, 서명은 비밀 키 보유자가 만들어 공개 키로 확인하는 표시입니다."
      ariaLabel="다운로드 완료, 길이와 해시, 서명, 제품 자가 검사의 네 단계에서 다섯 후보가 멈추는 위치"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0">
            <ol className="space-y-1.5">
              {GATES.map((gate, index) => (
                <li key={gate.name}>
                  <div className="grid grid-cols-[minmax(0,1fr)_4.75rem] items-center gap-2 rounded-lg border border-border bg-background px-3 py-1">
                    <div className="min-w-0">
                      <p className="text-sm font-bold">{index + 1}. {gate.name}</p>
                      <p className="text-xs leading-5 text-muted-foreground">{gate.question}</p>
                    </div>
                    <span className={`rounded-md border px-1 py-1 text-center text-xs ${MARK_CLASS[scene.marks[index]]}`}>{MARK_TEXT[scene.marks[index]]}</span>
                  </div>
                </li>
              ))}
            </ol>
            <p className="mt-2 rounded-lg bg-muted/50 px-3 py-1.5 text-sm font-semibold leading-6">{scene.result}</p>
          </div>
        );
      }}
    />
  );
}

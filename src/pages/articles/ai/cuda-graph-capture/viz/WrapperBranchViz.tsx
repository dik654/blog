import SceneShell from "./SceneShell";

/**
 * 본문 대응: #wrapper — CUDAGraphWrapper가 호출마다 고르는 경로와 CPU 관찰 결과.
 * 같은 주소로 캡처 한 번·재생 두 번이면 원래 함수 1회, 재생 2회. 다른 주소는 DEBUG에서 거부, 검사를 끄면 재생 분기.
 * 앞의 세 장면은 이어지는 호출이고 뒤의 세 장면은 조건을 바꾼 별도 상황이다.
 */
type Answer = "yes" | "no" | "skip";

interface Scene {
  label: string;
  summary: string;
  note: string;
  mode: Answer;
  record: Answer;
  debug: Answer;
  replay: boolean;
}

const SCENES: readonly Scene[] = [
  { label: "첫 호출", summary: "원래 함수 1회 · 재생 0회", mode: "no", record: "yes", debug: "skip", replay: false, note: "이 실행 조건의 기록이 없으니 캡처할 수 있는 시점인지 검사하고 입력 주소를 저장한 뒤 원래 함수를 돌려 기록을 남깁니다." },
  { label: "둘째 호출 · 같은 주소", summary: "원래 함수 1회 · 재생 1회", mode: "no", record: "no", debug: "no", replay: true, note: "기록이 있으면 원래 함수를 다시 호출하지 않고 저장한 graph를 재생한 뒤 출력 참조를 돌려줍니다. 원래 함수 호출 수는 그대로입니다." },
  { label: "셋째 호출 · 같은 주소", summary: "원래 함수 1회 · 재생 2회", mode: "no", record: "no", debug: "no", replay: true, note: "CPU 관찰에서 대역 객체로 확인한 횟수입니다. Python 분기만 확인했고 실제 장치의 메모리 안전성을 검증한 실행은 아닙니다." },
  { label: "다른 주소 · DEBUG", summary: "거부", mode: "no", record: "no", debug: "yes", replay: false, note: "이 버전의 주소 비교는 VLLM_LOGGING_LEVEL=DEBUG일 때 수행됩니다. 저장한 주소와 다르면 거부합니다. A 대신 B를 넘겨도 A로 복사해 주지는 않습니다." },
  { label: "다른 주소 · 검사 끔", summary: "재생 분기로 들어감", mode: "no", record: "no", debug: "skip", replay: true, note: "검사를 끄면 재생 분기로 들어갑니다. 검사하지 않는 모드가 주소 변경을 올바르게 만들어 주는 것은 아닙니다." },
  { label: "실행 모드 NONE", summary: "원래 함수 호출", mode: "yes", record: "skip", debug: "skip", replay: false, note: "실행 모드가 NONE이거나 wrapper의 모드와 다르면 기록을 찾지 않고 원래 함수를 호출합니다. 무슨 조건을 기록할지는 다음 절의 선택기가 정합니다." },
];

function Gate({ question, answer, yesLabel, yesText }: { question: string; answer: Answer; yesLabel: string; yesText: string }) {
  const on = answer !== "skip";
  const leaves = answer === "yes";
  return (
    <div className={`grid grid-cols-2 gap-2 text-xs leading-5 ${on ? "" : "opacity-40"}`}>
      <div className={`min-w-0 rounded-md border px-2 py-1.5 ${on ? "border-primary bg-background" : "border-border/60"}`}>
        <p className="font-semibold [overflow-wrap:anywhere]">{question}</p>
        <p className="font-mono text-muted-foreground">{answer === "skip" ? "거치지 않음" : leaves ? `→ ${yesLabel}` : "↓ 아니오"}</p>
      </div>
      <div className={`min-w-0 rounded-md border px-2 py-1.5 [overflow-wrap:anywhere] ${leaves ? "border-[#b45309] bg-background font-semibold" : "border-dashed border-border/60 text-muted-foreground"}`}>
        {yesText}
      </div>
    </div>
  );
}

export default function WrapperBranchViz() {
  return (
    <SceneShell
      eyebrow="wrapper의 갈림길"
      title="호출마다 원래 함수, 캡처, 재생 중 하나로 갑니다"
      description="왼쪽이 차례로 묻는 질문이고 오른쪽은 그 질문에서 빠져나갈 때의 일입니다. 실행 모드 NONE은 graph를 쓰지 않는 실행입니다. 앞 셋은 이어지는 호출이고 뒤 셋은 조건을 바꾼 별도 상황입니다. DEBUG에서 주소가 다르면 세 길 대신 거부로 끝납니다."
      ariaLabel="vLLM wrapper가 호출마다 고르는 경로"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="space-y-1.5">
            <Gate question="모드가 NONE이거나 wrapper와 다른가?" answer={scene.mode} yesLabel="예" yesText="원래 함수 호출" />
            <Gate question="이 조건의 기록이 없는가?" answer={scene.record} yesLabel="예" yesText="캡처 가능 검사 · 입력 주소 저장 · 원래 함수를 돌려 기록" />
            <Gate question="DEBUG: 입력 주소가 저장값과 다른가?" answer={scene.debug} yesLabel="다름" yesText="거부" />
            <div className={`rounded-md border px-2 py-1.5 text-xs font-semibold leading-5 ${scene.replay ? "border-primary bg-primary/10" : "border-dashed border-border/60 text-muted-foreground"}`}>
              저장한 graph 재생 · 출력 참조 반환
            </div>
          </div>
        );
      }}
    />
  );
}

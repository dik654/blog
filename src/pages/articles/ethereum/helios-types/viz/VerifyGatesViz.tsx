import HeliosSceneShell from "./HeliosSceneShell";

/**
 * 본문 대응: #validation-boundary — 검증 함수가 확인하는 순서와 실패 시 즉시 종료, 성공 시 후보만 반환.
 * 관문 순서는 본문 문장 그대로다. 실패 위치(finality branch)와 participation bit 8칸은 설명용 가정이다.
 */
const GATES = [
  "참여 0이 아닌지",
  "execution proof",
  "시간 순서",
  "committee period",
  "finality branch",
  "next committee branch",
  "participant key · BLS signature",
] as const;
const GATE_COUNT = GATES.length;

/** 예시 participation bit 8칸(가정). 1인 칸의 public key만 모읍니다. */
const PARTICIPATION: readonly number[] = [1, 1, 0, 1, 1, 0, 1, 1];

type GateState = "wait" | "pass" | "fail" | "check" | "skip";

const SCENES = [
  {
    label: "일곱 가지를 차례로",
    summary: "앞에서부터 하나씩",
    passed: 0,
    fail: -1,
    checking: -1,
    note: "검증 함수는 GenericUpdate 하나를 받아 위에서 아래 순서로 확인합니다. 아직 아무것도 확인하지 않은 상태이고 LightClientStore도 그대로입니다.",
  },
  {
    label: "중간에서 하나가 틀리면",
    summary: "finality branch 실패 → 오류",
    passed: 4,
    fail: 4,
    checking: -1,
    note: "예를 들어 finality branch를 접은 root가 맞지 않으면(가정) 그 자리에서 오류로 끝납니다. 뒤의 next committee branch와 서명은 확인하지 않고, 후보도 만들지 않습니다.",
  },
  {
    label: "마지막 관문: 서명",
    summary: "bit가 1인 key만 모아 확인",
    passed: 6,
    fail: -1,
    checking: 6,
    note: "Signature slot으로 period와 fork version을 고르고, participation bit가 1인 자리의 public key만 모읍니다. genesis root·fork version이 들어간 domain과 그 key 집합으로 aggregate signature를 확인합니다. U1422라면 period는 1,422입니다. fork version은 코드가 signature slot − 1이 속한 fork에서 고르며, 그 slot이 Electra 구간이면 0x05000000입니다.",
  },
  {
    label: "모두 통과",
    summary: "Ok(()) → 이 update가 후보",
    passed: 7,
    fail: -1,
    checking: -1,
    note: "일곱 가지를 모두 통과하면 검증 함수는 Ok(())만 돌려주고, 넘겨받은 GenericUpdate가 검증된 후보로 다음 단계에 갑니다. Store는 immutable reference로만 받으므로 LightClientStore를 고치지 않습니다. optimistic·finalized header와 committee를 바꾸는 조건은 Store update 글의 책임입니다.",
  },
] as const;

const STYLE: Record<GateState, { mark: string; text: string; box: string }> = {
  wait: { mark: "대기", text: "text-muted-foreground", box: "border-border" },
  pass: { mark: "통과", text: "text-[#16a34a]", box: "border-border" },
  fail: { mark: "실패", text: "text-[#dc2626]", box: "border-[#dc2626]" },
  check: { mark: "확인 중", text: "text-[#2563eb]", box: "border-[#2563eb]" },
  skip: { mark: "안 함", text: "text-muted-foreground/60", box: "border-dashed border-border" },
};

export default function VerifyGatesViz() {
  return (
    <HeliosSceneShell
      eyebrow="verify 순서"
      title="하나라도 틀리면 바로 끝나고, 모두 맞아도 Store는 그대로입니다"
      description="줄 하나가 검증 함수가 확인하는 항목 하나이며 위에서 아래 순서로 진행합니다. 나머지 칸은 서명에 쓰는 key 선택, 검증 결과, LightClientStore 상태입니다."
      note="항목 순서는 본문을 따릅니다. 실패 위치와 participation bit 8칸은 설명용 가정이며 실제 sync committee 크기나 U1422의 참여 비트가 아닙니다."
      ariaLabel="검증 함수의 일곱 확인 항목, 실패 시 종료와 성공 시 후보 반환"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const states = GATES.map((_, index): GateState => {
          if (index === scene.fail) return "fail";
          if (index === scene.checking) return "check";
          if (index < scene.passed) return "pass";
          if (scene.fail >= 0 && index > scene.fail) return "skip";
          return "wait";
        });
        const failed = scene.fail >= 0;
        const done = scene.passed === GATE_COUNT;
        const sigActive = scene.checking === 6 || done;
        const selected = PARTICIPATION.reduce<number>((sum, bit) => sum + bit, 0);
        return (
          <div className="grid min-w-0 gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
            <ol className="grid min-w-0 gap-1.5">
              {GATES.map((gate, index) => {
                const s = STYLE[states[index]];
                return (
                  <li key={gate} className={`flex min-w-0 items-center justify-between gap-2 rounded-lg border px-3 py-1 text-xs ${s.box}`}>
                    <span className="min-w-0 break-keep">
                      <span className="mr-2 font-mono text-muted-foreground">{index + 1}</span>
                      {gate}
                    </span>
                    <span className={`shrink-0 font-mono font-bold ${s.text}`}>{s.mark}</span>
                  </li>
                );
              })}
            </ol>
            <div className="grid min-w-0 content-start gap-3">
              <div className={`rounded-lg border px-3 py-2 text-xs ${sigActive ? "border-[#2563eb]" : "border-dashed border-border"}`}>
                <p className="font-bold text-muted-foreground">participation bit → public key (가정 8칸)</p>
                <div className="mt-2 grid grid-cols-8 gap-1">
                  {PARTICIPATION.map((bit, index) => (
                    <span
                      key={index}
                      className={`rounded-sm border py-1 text-center font-mono text-[11px] ${
                        sigActive && bit === 1 ? "border-[#2563eb] font-bold text-[#2563eb]" : "border-border text-muted-foreground"
                      }`}
                    >
                      {bit}
                    </span>
                  ))}
                </div>
                <p className={`mt-2 break-keep ${sigActive ? "text-foreground" : "text-muted-foreground"}`}>
                  key {selected}개 + domain(genesis root · fork version) → aggregate signature 확인
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
              <div className={`rounded-lg border px-3 py-2 text-xs ${failed ? "border-[#dc2626]" : done ? "border-[#16a34a]" : "border-border"}`}>
                <p className="font-bold text-muted-foreground">검증 결과</p>
                <p className={`mt-1 font-bold ${failed ? "text-[#dc2626]" : done ? "text-[#16a34a]" : "text-muted-foreground"}`}>
                  {failed ? "오류 반환 · 후보 없음" : done ? "Ok(()) · GenericUpdate가 후보" : "아직 없음"}
                </p>
              </div>
              <div className="rounded-lg border border-border px-3 py-2 text-xs">
                <p className="font-bold text-muted-foreground">LightClientStore</p>
                <p className="mt-1 font-bold">변경 없음</p>
              </div>
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}

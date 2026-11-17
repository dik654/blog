import XmlSceneShell from "./XmlSceneShell";

/**
 * 본문 대응: #parsing — size/frame→parse→allowlist/schema→domain/evidence→policy→typed result 순서와
 * 실패 원인별 다음 경로(재생성·재검색·abstention·human review·실행 안 함).
 * 사례 다섯 개는 모두 본문이 든 실패이며, 각 장면은 출력 하나가 어느 관문에서 멈추는지를 보인다.
 */
const GATES = [
  ["size/frame", "크기·최상위 frame 수"],
  ["parse", "strict parser로 well-formed 확인"],
  ["allowlist/schema", "허용 element·필수 field·type"],
  ["domain/evidence", "실재 ID·근거·업무 규칙"],
  ["policy", "caller 권한·실행 정책"],
] as const;

type Case = {
  label: string;
  summary: string;
  note: string;
  output: string;
  /** 멈춘 관문 번호, GATES.length면 전부 통과 */
  stop: number;
  error: string;
  next: string;
};

const CASES: readonly Case[] = [
  {
    label: "바깥에 붙은 설명",
    summary: "1번 size/frame에서 멈춤",
    note: "계약은 <result> 하나인데 앞에 설명 문장이 붙었습니다. 바깥 text를 조용히 버리고 넘어가지 않고 framing error로 남깁니다.",
    output: "다음은 결과입니다. <result>…</result>",
    stop: 0,
    error: "framing error",
    next: "명시적으로 기록 · 조용히 무시하지 않음",
  },
  {
    label: "닫는 tag 누락",
    summary: "2번 parse에서 멈춤",
    note: "문법 오류는 다시 생성하면 고쳐질 수 있는 실패입니다. Error location과 기대 root를 담아 한 번 재생성합니다. 관대한 parser나 regex로 몰래 고치지 않습니다.",
    output: "<result><order_id>A-104</result>",
    stop: 1,
    error: "parse error (typed)",
    next: "error location·기대 root를 담아 한 번 재생성",
  },
  {
    label: "필수 field 누락",
    summary: "3번 schema에서 멈춤",
    note: "XML 문법은 맞지만 계약의 필수 field가 없습니다. 누락된 field만 알려 주고 다시 받습니다.",
    output: "<result><order_id>A-104</order_id></result>",
    stop: 2,
    error: "schema error",
    next: "누락 field만 알려 재생성",
  },
  {
    label: "없는 상품 ID",
    summary: "4번 domain에서 멈춤",
    note: "구조는 모두 맞지만 그 ID가 실제 catalog에 없습니다. 문법을 다시 요청해도 해결되지 않으므로 재생성 대신 다른 경로로 보냅니다.",
    output: "<result>… <product_id>없는 ID</product_id> …</result>",
    stop: 3,
    error: "domain/evidence violation",
    next: "evidence 재검색 · abstention · human review",
  },
  {
    label: "승인 권한 없음",
    summary: "5번 policy에서 멈춤",
    note: "구조와 금액이 모두 정상이어도 현재 사용자에게 환불을 승인할 권한이 없으면 side effect를 실행하지 않습니다.",
    output: "<result>… 환불 요청 …</result>",
    stop: 4,
    error: "policy reject",
    next: "side effect를 실행하지 않음",
  },
  {
    label: "모두 통과",
    summary: "다섯 관문 통과 → typed result",
    note: "이 출력만 typed result가 되어 업무 로직으로 넘어갑니다. 재생성은 어느 경우든 retry 횟수와 token·latency 예산 안에서만 하고, 한도를 넘으면 명시적으로 실패시킵니다.",
    output: "<result>… 검사를 모두 통과한 값 …</result>",
    stop: GATES.length,
    error: "—",
    next: "downstream 업무 로직으로 전달",
  },
];

export default function OutputGateRoutingViz() {
  return (
    <XmlSceneShell
      eyebrow="실패 원인별 경로"
      title="출력마다 멈추는 관문이 다르고, 다음 경로도 다릅니다"
      description="모델 출력 하나가 위에서 아래로 관문을 지납니다. ✓는 통과, ✕는 그 관문에서 멈춤, 흐린 칸은 도달하지 않은 관문입니다. 출력 문자열은 설명용 예시입니다(가정). 재생성은 정해진 retry 횟수·token·latency 예산 안에서만 합니다."
      ariaLabel="본문의 실패 사례 다섯 개와 통과 사례 하나가 검증 관문 어디에서 멈추고 어디로 가는지"
      scenes={CASES}
      render={(index) => {
        const item = CASES[index];
        return (
          <div className="grid min-w-0 gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-muted-foreground">모델 출력</p>
              <code className="mt-1 block min-h-[2.5rem] break-all border border-border bg-muted/20 px-2 py-1.5 font-mono text-[11px] leading-5">
                {item.output}
              </code>
              <ol className="mt-2 space-y-1">
                {GATES.map(([name, check], gate) => {
                  const passed = gate < item.stop;
                  const stopped = gate === item.stop;
                  return (
                    <li
                      key={name}
                      className={`grid grid-cols-[1.25rem_minmax(0,1fr)] items-baseline gap-1 border px-2 py-1 ${
                        stopped
                          ? "border-red-600"
                          : passed
                            ? "border-green-600/60"
                            : "border-dashed border-border/60 opacity-50"
                      }`}
                    >
                      <span
                        className={`font-mono text-xs font-bold ${
                          stopped ? "text-red-700 dark:text-red-400" : passed ? "text-green-700 dark:text-green-400" : "text-muted-foreground"
                        }`}
                      >
                        {stopped ? "✕" : passed ? "✓" : "·"}
                      </span>
                      <span className="min-w-0">
                        <strong className="font-mono text-[11px]">{gate + 1}. {name}</strong>
                        <span className="ml-2 text-[10px] text-muted-foreground">{check}</span>
                      </span>
                    </li>
                  );
                })}
              </ol>
            </div>
            <div className="min-w-0 space-y-3 sm:border-l sm:border-border sm:pl-4">
              <div>
                <p className="text-[10px] font-bold text-muted-foreground">기록되는 결과</p>
                <p className={`mt-1 font-mono text-sm font-bold ${item.stop === GATES.length ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"}`}>
                  {item.stop === GATES.length ? "typed result" : item.error}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-muted-foreground">다음 경로</p>
                <p className="mt-1 break-keep text-sm font-semibold leading-6">{item.next}</p>
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}

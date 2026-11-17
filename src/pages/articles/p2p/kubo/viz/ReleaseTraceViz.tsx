import SceneShell from "./SceneShell";

/**
 * 본문 대응: #release "한 trace로 묶어야 하는 release test" — add·provide queue·후보 발견·P1 timeout·P2 수신·
 * block별 CID 검증·DAG 완성·pin·GC를 같은 trace ID로 잇고, 실패 종류마다 처리 방식을 나눈다.
 * 정책(size·codec·authorization)은 같은 절의 release gate 문단에서 가져왔다.
 */
type Boundary = "queue" | "routing" | "retrieval" | "validation" | "pin·GC" | "Alice";

const EVENTS: readonly { text: string; boundary: Boundary }[] = [
  { text: "Alice가 A·B·C를 add", boundary: "Alice" },
  { text: "provide queue에 넣은 시각", boundary: "queue" },
  { text: "Bob이 후보 P1·P2를 발견", boundary: "routing" },
  { text: "P1에서 timeout", boundary: "retrieval" },
  { text: "P2에서 block 수신", boundary: "retrieval" },
  { text: "block별 CID 검증", boundary: "validation" },
  { text: "DAG 완성 · size·codec·authorization", boundary: "validation" },
  { text: "recursive pin", boundary: "pin·GC" },
  { text: "GC 뒤 A·B·C가 남았는지 확인", boundary: "pin·GC" },
];

const SCENES = [
  { label: "한 trace ID", summary: "9개 사건 · 같은 trace ID", hits: [] as number[], verdict: "모든 사건을 같은 trace ID로 연결", action: "실패하면 어느 경계에서 끊겼는지 찾음", tone: "info", note: "같은 trace ID에 사건을 시간순으로 남기면 “provide API가 성공했는데 왜 fetch가 실패했나”를 queue, routing, retrieval, validation 중 어느 경계의 문제인지로 좁힐 수 있습니다." },
  { label: "Timeout · stale", summary: "다음 후보로 재시도", hits: [2, 3], verdict: "응답 없음 · 오래된 광고", action: "같은 CID로 다음 후보에 재시도할 수 있음", tone: "retry", note: "Timeout과 stale provider는 다음 후보로 재시도할 수 있습니다. 같은 CID를 다음 후보에 요청하며, timeout을 CID 오류로 바꾸지 않습니다." },
  { label: "Hash mismatch", summary: "손상·악성 응답으로 분리", hits: [5], verdict: "받은 bytes의 hash ≠ 요청 CID", action: "재시도 queue와 섞지 않고 따로 분리", tone: "stop", note: "Hash mismatch는 손상되었거나 악성인 응답입니다. Timeout과 같은 queue에 넣지 않고 분리하며, 불일치 bytes는 검증된 결과로 공개하지 않습니다." },
  { label: "Partial DAG", summary: "누락 CID 기록", hits: [6], verdict: "A는 받았지만 child 일부가 없음", action: "빠진 CID를 기록 · 완성 전 공개 안 함", tone: "record", note: "Root A 검증에 성공해도 B나 C가 빠지면 완성된 DAG가 아닙니다. 어떤 CID가 빠졌는지 기록합니다." },
  { label: "Authorization 실패", summary: "provider를 바꿔도 안 풀림", hits: [6], verdict: "정책 단계에서 거부", action: "다른 provider를 찾는 것으로 해결되지 않음", tone: "stop", note: "Authorization은 release gate의 둘째 층에서 확인하는 정책입니다. 이 단계의 실패는 다른 provider를 찾는다고 해결되지 않습니다." },
  { label: "취소", summary: "열린 자원 닫기", hits: [] as number[], verdict: "요청이 중간에 취소됨", action: "stream·iterator를 닫고 검증 전 임시 결과 삭제", tone: "record", note: "취소되면 열린 stream과 iterator를 닫고, 검증을 통과하기 전의 임시 결과를 삭제합니다." },
] as const;

const TONE: Record<string, { border: string; text: string }> = {
  info: { border: "#2563eb", text: "text-blue-700 dark:text-blue-300" },
  retry: { border: "#d97706", text: "text-amber-700 dark:text-amber-400" },
  stop: { border: "#dc2626", text: "text-red-700 dark:text-red-400" },
  record: { border: "#7c3aed", text: "text-violet-700 dark:text-violet-300" },
};

export default function ReleaseTraceViz() {
  return (
    <SceneShell
      eyebrow="Release trace"
      title="실패는 trace의 어느 칸에서 났는지에 따라 처리가 갈립니다"
      description="한 줄이 trace에 남기는 사건 하나이고, 오른쪽은 그 사건이 속한 경계입니다. 첫 장면은 정상 흐름, 이후 장면은 실패 종류마다 걸리는 칸과 처리를 보여 줍니다."
      ariaLabel="release test trace의 사건 순서와 실패 종류별 처리"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const tone = TONE[scene.tone];
        const hits = new Set<number>(scene.hits);
        return (
          <div className="min-w-0">
            <ol className="space-y-1">
              {EVENTS.map((event, index) => {
                const hit = hits.has(index);
                return (
                  <li
                    key={event.text}
                    className="grid grid-cols-[1.5rem_minmax(0,1fr)_4.75rem] items-center gap-2 rounded-md border px-2 py-1 text-xs"
                    style={{ borderColor: hit ? tone.border : "transparent" }}
                  >
                    <span className="font-mono text-muted-foreground">{index + 1}</span>
                    <span className={hit ? `font-semibold ${tone.text}` : ""}>{event.text}</span>
                    <span className="truncate rounded-sm bg-muted/60 px-1.5 py-0.5 text-center font-mono text-[11px] text-muted-foreground">{event.boundary}</span>
                  </li>
                );
              })}
            </ol>
            <div className="mt-3 grid min-h-[4.5rem] grid-cols-[3rem_minmax(0,1fr)] gap-x-2 gap-y-1 rounded-md border px-3 py-2 text-xs" style={{ borderColor: tone.border }}>
              <span className="text-muted-foreground">판정</span>
              <span className="font-semibold">{scene.verdict}</span>
              <span className="text-muted-foreground">처리</span>
              <span className={`font-semibold ${tone.text}`}>{scene.action}</span>
            </div>
          </div>
        );
      }}
    />
  );
}

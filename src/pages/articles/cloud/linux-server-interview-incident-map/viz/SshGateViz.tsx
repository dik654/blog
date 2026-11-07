import SceneShell from "./SceneShell";

/**
 * 본문 대응: #interview 첫 문제 — SSH가 안 된다는 신고를 바깥에서 안으로 관문별로 좁힌다.
 * 어느 관문에서 실패할지는 글이 정하지 않았으므로 방화벽이 22번을 막은 경우를 가정으로 둔다.
 */
type Status = "미확인" | "통과" | "실패" | "되돌림";

interface Scene {
  label: string;
  summary: string;
  note: string;
  gates: readonly [Status, Status, Status, Status];
}

const SCENES: readonly Scene[] = [
  { label: "먼저 범위를 묻습니다", summary: "전부? 한 사람만? 언제부터?", gates: ["미확인", "미확인", "미확인", "미확인"], note: "확인 질문은 전부 안 되는지 한 사람만 안 되는지, 언제부터인지입니다. 아직 어느 관문도 보지 않았습니다." },
  { label: "관문 1 · 이름", summary: "맞는 주소로 풀림", gates: ["통과", "미확인", "미확인", "미확인"], note: "(가정) 이름이 맞는 주소로 풀립니다. 이 관문은 용의선에서 빠지고 한 칸 안으로 들어갑니다." },
  { label: "관문 2 · 22번 포트", summary: "TCP가 닿지 않음", gates: ["통과", "실패", "미확인", "미확인"], note: "(가정) 22번 포트까지 TCP가 닿지 않습니다. 원인을 방화벽 규칙으로 둔 예시입니다. 첫 실패가 나왔으므로 안쪽 두 관문은 미확인으로 남습니다." },
  { label: "단기·장기 조치", summary: "규칙 하나 되돌림 + 바깥 감시", gates: ["통과", "되돌림", "미확인", "미확인"], note: "단기 조치는 실패한 첫 관문만 고치는 것이라 그 규칙 하나를 되돌립니다. 장기 조치는 그 관문을 바깥에서 검사하는 감시를 다는 것입니다." },
];

const GATES = [
  { name: "이름 풀이", detail: "맞는 주소로 풀리는가" },
  { name: "22번 포트", detail: "TCP가 닿는가" },
  { name: "sshd", detail: "프로세스가 떠 있는가" },
  { name: "인증 로그", detail: "거절이 찍히는가" },
] as const;

const STYLE: Record<Status, { color: string; dashed: boolean }> = {
  미확인: { color: "#94a3b8", dashed: true },
  통과: { color: "#059669", dashed: false },
  실패: { color: "#dc2626", dashed: false },
  되돌림: { color: "#2563eb", dashed: false },
};

function Gate({ index, status }: { index: number; status: Status }) {
  const gate = GATES[index];
  const style = STYLE[status];
  return (
    <div className="min-w-0 rounded-lg border bg-background p-2.5" style={{ borderColor: style.color, borderStyle: style.dashed ? "dashed" : "solid" }}>
      <p className="text-xs font-bold leading-5">{index + 1}. {gate.name}</p>
      <p className="text-[11px] leading-4 text-muted-foreground">{gate.detail}</p>
      <p className="mt-1.5 text-xs font-bold" style={{ color: style.color }}>{status}</p>
    </div>
  );
}

export default function SshGateViz() {
  return (
    <SceneShell
      eyebrow="바깥에서 안으로"
      title="SSH 신고는 네 관문을 바깥부터 지우며 첫 실패에서 멈춥니다"
      description="앞 두 관문은 서버에 닿기까지의 경로이고 뒤 두 관문은 서버 안입니다. 이 글이 답변 틀을 보이려고 든 예시입니다(가정)."
      ariaLabel="SSH 접속 실패를 이름, 포트, sshd, 인증 로그 순서로 좁히는 과정"
      scenes={SCENES}
      render={(active) => {
        const gates = SCENES[active].gates;
        return (
          <div className="grid min-w-0 gap-3 sm:grid-cols-2">
            <div className="min-w-0">
              <p className="mb-2 text-xs text-muted-foreground">서버에 닿기까지 →</p>
              <div className="grid grid-cols-2 gap-2">
                <Gate index={0} status={gates[0]} />
                <Gate index={1} status={gates[1]} />
              </div>
            </div>
            <div className="min-w-0">
              <p className="mb-2 text-xs text-muted-foreground">서버 안 →</p>
              <div className="grid grid-cols-2 gap-2">
                <Gate index={2} status={gates[2]} />
                <Gate index={3} status={gates[3]} />
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}

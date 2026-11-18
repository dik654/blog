import SceneShell from "./SceneShell";

/**
 * 본문 대응: #picture 둘째 문단 — DNS → 유효 경로 → 유효 NSG → 대상 상태 → 앱 설정과 로그 순서로 첫 실패 지점을 찾는다.
 * 첫 장면은 1절 사고(사설 연결은 있지만 앱이 공개 주소를 해석한 뒤 timeout, 관리자는 규칙만 넓힘)다.
 * 주소 10.20.1.7 · 52.1.2.3과 경로 10.20.1.0/24 VirtualNetwork는 8절 실습의 예시 출력(실측 아님)에서 가져왔다.
 * "공개 IP가 나오면 경로표나 NSG보다 DNS를 먼저 고친다 · 아직 NSG를 바꿀 근거는 없다"도 같은 실습의 판독이다.
 */
type Light = "pass" | "fail" | "open" | "wide";

const GATES = ["DNS", "유효 경로", "유효 NSG", "대상 상태", "앱 설정·로그"] as const;

const SCENES = [
  {
    label: "1절 사고: 이름이 공개 주소로 풀림",
    summary: "첫 실패 · DNS",
    answer: "52.1.2.3",
    inside: false,
    lights: ["fail", "open", "open", "open", "open"] as readonly Light[],
    note: "사설 끝점이 있어도 앱이 저장소 이름을 공개 주소로 해석하면 요청은 그 주소를 향하고, 1절처럼 timeout이 납니다. 첫 번째 관문인 DNS에서 이미 어긋났습니다.",
  },
  {
    label: "규칙만 넓히면",
    summary: "DNS 답은 그대로 · 첫 실패도 그대로",
    answer: "52.1.2.3",
    inside: false,
    lights: ["fail", "open", "wide", "open", "open"] as readonly Light[],
    note: "1절의 관리자는 규칙만 넓혔습니다. 여기서는 NSG 규칙을 넓혔다고 가정합니다. 넓힌 규칙은 DNS 답을 바꾸지 않으므로 요청은 여전히 공개 주소를 향합니다. 8절 실습의 판독처럼 공개 IP가 나온 상태에서는 아직 NSG를 바꿀 근거가 없습니다.",
  },
  {
    label: "DNS를 고치면 사설 끝점으로",
    summary: "DNS·경로 통과 → 다음은 유효 NSG",
    answer: "10.20.1.7",
    inside: true,
    lights: ["pass", "pass", "open", "open", "open"] as readonly Light[],
    note: "이름이 사설 끝점 주소로 풀리면 요청이 VNet 안에 머뭅니다. 8절 예시 출력처럼 실제 적용된 경로(유효 경로)도 10.20.1.0/24를 VNet 안으로 보내면 다음 관문으로 넘어가, 한 칸씩 첫 실패를 찾습니다. 앞 장면에서 근거 없이 넓힌 NSG 규칙은 7절처럼 최소 설정만 남기도록 되돌린 상태로 그렸습니다.",
  },
] as const;

const LIGHT: Record<Light, { mark: string; color: string; word: string; dashed: boolean }> = {
  pass: { mark: "✓", color: "#16a34a", word: "통과", dashed: false },
  fail: { mark: "✕", color: "#dc2626", word: "첫 실패", dashed: false },
  open: { mark: "–", color: "#94a3b8", word: "아직 안 봄", dashed: true },
  wide: { mark: "!", color: "#d97706", word: "넓힘(가정)", dashed: false },
};

const ACCENT = "#2563eb";
const BAD = "#dc2626";

function Node({ title, sub, on, color }: { title: string; sub: string; on: boolean; color: string }) {
  return (
    <div className="min-w-0 rounded-md border bg-background/70 px-2.5 py-2" style={{ borderColor: on ? color : "#94a3b8" }}>
      <p className="break-words text-sm font-bold leading-5 text-foreground">{title}</p>
      <p className="break-words text-xs leading-5 text-muted-foreground">{sub}</p>
      <p className={`text-xs font-semibold leading-5 ${on ? "" : "invisible"}`} style={{ color }}>
        ● 요청이 향하는 곳
      </p>
    </div>
  );
}

export default function DnsPathViz() {
  return (
    <SceneShell
      eyebrow="첫 실패 관문"
      title="DNS 답 하나가 요청이 VNet 안에 머물지를 정합니다"
      description="점선 상자가 VNet(Azure 안의 사설 네트워크)입니다. 사설 끝점은 VNet 안에 만든 저장소용 사설 주소입니다. 주소는 8절 실습의 예시 출력이며 실측이 아닙니다. 아래 다섯 칸이 이 절의 진단 순서이며, NSG는 서브넷이나 네트워크 인터페이스에 붙이는 허용·차단 규칙 묶음입니다."
      ariaLabel="DNS 답에 따라 요청이 사설 끝점 또는 공개 주소로 향하는 경로와 다섯 관문의 통과 여부"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0">
            <div className="grid min-w-0 gap-2 sm:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] sm:gap-3">
              <div className="min-w-0 rounded-lg border border-dashed border-[#64748b] p-2.5">
                <p className="text-xs font-semibold text-muted-foreground">VNet</p>
                <div className="mt-2 grid min-w-0 grid-cols-2 gap-2">
                  <div className="min-w-0 rounded-md border border-[#94a3b8] bg-background/70 px-2.5 py-2">
                    <p className="text-sm font-bold leading-5 text-foreground">앱 (VM)</p>
                    <p className="break-words text-xs leading-5 text-muted-foreground">
                      DNS 답 · <span className="font-mono font-semibold" style={{ color: scene.inside ? ACCENT : BAD }}>{scene.answer}</span>
                    </p>
                  </div>
                  <Node title="사설 끝점" sub="10.20.1.7" on={scene.inside} color={ACCENT} />
                </div>
              </div>
              <div className="min-w-0 rounded-lg border border-[#94a3b8] p-2.5">
                <p className="text-xs font-semibold text-muted-foreground">VNet 밖</p>
                <div className="mt-2">
                  <Node title="저장소 공개 주소" sub="52.1.2.3 · timeout" on={!scene.inside} color={BAD} />
                </div>
              </div>
            </div>
            <ol className="mt-4 grid min-w-0 grid-cols-5 gap-1">
              {GATES.map((gate, index) => {
                const light = LIGHT[scene.lights[index]];
                return (
                  <li key={gate} className="min-w-0 text-center">
                    <span
                      aria-hidden="true"
                      className={`mx-auto flex h-7 w-7 items-center justify-center rounded-full border text-sm font-bold ${light.dashed ? "border-dashed" : ""}`}
                      style={{ borderColor: light.color, color: light.color }}
                    >
                      {light.mark}
                    </span>
                    <p className="mt-1 break-keep text-[11px] font-semibold leading-4 text-foreground sm:text-xs">
                      {index + 1}. {gate}
                    </p>
                    <p className="text-[11px] leading-4 text-muted-foreground">{light.word}</p>
                  </li>
                );
              })}
            </ol>
          </div>
        );
      }}
    />
  );
}

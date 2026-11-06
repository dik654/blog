import SceneShell, { type ShellScene } from "./SceneShell";

/**
 * 본문 대응: #routing — ip rule로 표를 고른 뒤, main 표에서 가장 긴 prefix를 고른다.
 * 한 칸 = 8비트. /24는 앞 3칸, /16은 앞 2칸, /0은 0칸이 목적지와 같아야 맞는다.
 * 10.244.1.9 → /24 cni0, 10.244.3.5 → /16 tunl0, 8.8.8.8 → /0 eth0.
 */
interface Scene extends ShellScene {
  dest: readonly number[];
  chosen: number;
  showMatch: boolean;
}

const ROUTES: readonly { octets: readonly number[]; bits: number; dev: string }[] = [
  { octets: [10, 244, 1, 0], bits: 24, dev: "cni0" },
  { octets: [10, 244, 0, 0], bits: 16, dev: "tunl0" },
  { octets: [0, 0, 0, 0], bits: 0, dev: "eth0 (via 10.0.0.1)" },
];

const RULES = ["0→local", "32766→main", "32767→default"] as const;

const SCENES: readonly Scene[] = [
  { label: "표 고르기", summary: "local에 없음 → main", dest: [10, 244, 1, 9], chosen: -1, showMatch: false, note: "규칙을 우선순위 순으로 봅니다. 규칙 0의 local 표에서 10.244.1.9는 내 주소가 아니라 못 찾고, 다음 규칙이 main 표를 가리킵니다. 아래가 그 표(가정)입니다." },
  { label: "10.244.1.9", summary: "셋 다 맞음 → /24", dest: [10, 244, 1, 9], chosen: 0, showMatch: true, note: "/24는 앞 24비트, 곧 앞 세 칸이 같아야 맞습니다. 세 경로가 모두 맞지만 가장 긴 /24를 골라 cni0로 갑니다. 이것이 longest prefix match입니다." },
  { label: "10.244.3.5", summary: "/24 탈락 → /16", dest: [10, 244, 3, 5], chosen: 1, showMatch: true, note: "셋째 칸이 3과 1로 달라 /24는 맞지 않습니다. 남은 것 가운데 가장 긴 /16을 골라 터널 장치 tunl0으로 갑니다." },
  { label: "8.8.8.8", summary: "/0만 맞음 → eth0", dest: [8, 8, 8, 8], chosen: 2, showMatch: true, note: "첫 칸부터 달라 /24와 /16은 맞지 않습니다. /0은 같아야 할 칸이 없어 무엇이든 맞으므로 기본 경로를 타고 eth0으로 나갑니다." },
];

export default function LongestPrefixViz() {
  return (
    <SceneShell
      eyebrow="longest prefix match"
      title="prefix는 앞에서 몇 칸이 같아야 하는지를 정합니다"
      description="칸 하나가 IPv4 주소의 8비트이고, 이 표의 prefix가 8의 배수라 칸으로 딱 떨어집니다. 진한 칸이 목적지와 같아야 하는 자리이고, ✕는 달라서 탈락한 칸입니다."
      ariaLabel="라우팅 규칙 목록과 main 표에서 가장 긴 prefix를 고르는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0">
            <div className="grid grid-cols-3 gap-1.5">
              {RULES.map((rule, index) => (
                <span key={rule} className={`rounded border px-1 py-1 text-center font-mono text-[11px] leading-4 ${index === 1 ? "border-[#2563eb] font-bold text-[#2563eb] dark:text-[#93c5fd]" : "border-border/70 text-muted-foreground"}`}>
                  {rule}
                </span>
              ))}
            </div>
            <div className="mt-3 grid grid-cols-[2.5rem_repeat(4,minmax(0,1fr))] items-center gap-1 font-mono text-xs">
              <span className="font-sans text-[11px] font-bold leading-4">목적지</span>
              {scene.dest.map((octet, index) => (
                <span key={index} className="rounded border border-foreground/60 py-1 text-center font-bold">{octet}</span>
              ))}
            </div>
            <div className="mt-2 space-y-1">
              {ROUTES.map((route, row) => {
                const fixed = route.bits / 8;
                const chosen = row === scene.chosen;
                const fails = route.octets.some((octet, index) => index < fixed && octet !== scene.dest[index]);
                return (
                  <div key={route.dev} className={`rounded-lg border px-1.5 py-1 ${chosen ? "border-[#b45309]" : "border-transparent"}`}>
                    <div className="grid grid-cols-[2.5rem_repeat(4,minmax(0,1fr))] items-center gap-1 font-mono text-xs">
                      <span className="font-bold">/{route.bits}</span>
                      {route.octets.map((octet, index) => {
                        const must = index < fixed;
                        const wrong = scene.showMatch && must && octet !== scene.dest[index];
                        return (
                          <span
                            key={index}
                            className={`rounded border py-1 text-center ${must ? (wrong ? "border-[#dc2626] font-bold text-[#dc2626]" : "border-[#2563eb] bg-[#2563eb] font-bold text-white") : "border-dashed border-border text-muted-foreground"}`}
                          >
                            {must ? `${wrong ? "✕ " : ""}${octet}` : "*"}
                          </span>
                        );
                      })}
                    </div>
                    <p className="mt-1 pl-11 text-xs leading-4">
                      <span className="font-mono">{route.dev}</span>
                      <span className={`ml-2 font-semibold ${chosen ? "text-[#b45309] dark:text-[#fbbf24]" : "text-muted-foreground"}`}>{!scene.showMatch ? "" : chosen ? "선택" : fails ? "탈락" : "맞지만 더 짧음"}</span>
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        );
      }}
    />
  );
}

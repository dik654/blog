import SceneShell from "./SceneShell";

/**
 * 본문 대응: #comparison 둘째 문단 — 주소만 사설로 만들고 이름이 공개 주소를 가리키면 의도한 경로를 쓰지 않는다.
 * 주소 10.20.1.7·52.1.2.3과 시간 값은 #source 실습 블록의 정상·실패 예시 출력(실측 아님)에서 그대로 가져왔다.
 */
type Edge = "clientDns" | "dnsPrivate" | "dnsPublic";
type Tone = "ok" | "block" | "idle";

const SCENES = [
  {
    label: "사설 끝점을 만듭니다",
    summary: "서비스 접점이 VNet 안 사설 주소로",
    edges: { clientDns: "idle", dnsPrivate: "idle", dnsPublic: "idle" },
    focus: "private",
    output: ["이름 조회 전", ""],
    note: "사설 끝점은 관리형 서비스의 접점을 소비자 네트워크(VNet) 안의 사설 주소로 보이게 하는 연결 방식입니다. 여기서는 8절 실습 예시의 10.20.1.7을 그 주소로 씁니다.",
  },
  {
    label: "이름이 사설 주소로 풀립니다",
    summary: "이름 → 10.20.1.7 → 의도한 사설 경로",
    edges: { clientDns: "ok", dnsPrivate: "ok", dnsPublic: "idle" },
    focus: "private",
    output: ["A 10.20.1.7", "connect=0.021 total=0.084"],
    note: "사설 DNS가 서비스 이름을 사설 주소로 대응시키면 VNet 안의 클라이언트는 사설 끝점으로 갑니다. 이름과 주소가 같은 사설 경로를 가리킵니다.",
  },
  {
    label: "이름이 여전히 공개 주소를 가리킵니다",
    summary: "이름 → 52.1.2.3 → 의도하지 않은 길",
    edges: { clientDns: "ok", dnsPrivate: "idle", dnsPublic: "block" },
    focus: "public",
    output: ["A 52.1.2.3", "connect=5.001 total=5.001"],
    note: "주소만 사설로 만들고 이름이 여전히 공개 주소를 가리키면 의도한 경로를 쓰지 않습니다. 8절 실패 예시처럼 공개 주소를 받았다면 방화벽부터 바꾸지 말고 사설 DNS 영역·VNet 연결·DNS 전달 설정을 먼저 확인합니다.",
  },
] as const satisfies readonly {
  label: string;
  summary: string;
  edges: Record<Edge, Tone>;
  focus: "private" | "public";
  output: readonly [string, string];
  note: string;
}[];

const COLOR: Record<Tone, string> = { ok: "#16a34a", block: "#dc2626", idle: "#cbd5e1" };

const PATHS: Record<Edge, string> = {
  clientDns: "M92 92 H112",
  dnsPrivate: "M200 84 L232 44",
  dnsPublic: "M200 100 L232 140",
};

function Box({ x, y, w, lines, strong }: { x: number; y: number; w: number; lines: readonly string[]; strong: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={40} rx={6} fill="none" stroke={strong ? "#2563eb" : "#64748b"} strokeWidth={strong ? 1.25 : 1} />
      {lines.map((line, index) => (
        <text
          key={line}
          x={x + w / 2}
          y={lines.length === 1 ? y + 24 : y + 17 + index * 15}
          textAnchor="middle"
          fontSize={index === 0 ? 12 : 11}
          fontWeight={index === 0 ? 600 : 400}
          fill={strong ? "#2563eb" : "#64748b"}
        >
          {line}
        </text>
      ))}
    </g>
  );
}

export default function PrivateEndpointDnsViz() {
  return (
    <SceneShell
      eyebrow="사설 끝점과 사설 DNS"
      title="주소를 사설로 만들어도 이름이 공개 주소를 가리키면 그 길로 갑니다"
      description="왼쪽 클라이언트는 VNet 안에 있습니다. 주소와 시간 값은 8절 실습 블록의 예시 출력이며 실측이 아닙니다."
      ariaLabel="서비스 이름이 사설 주소로 풀릴 때와 공개 주소로 풀릴 때의 경로 차이"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0">
            <svg viewBox="0 0 360 184" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
              <defs>
                {(Object.keys(COLOR) as Tone[]).map((tone) => (
                  <marker key={tone} id={`pe-arrow-${tone}`} viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto">
                    <path d="M0 0 L8 4 L0 8 z" fill={COLOR[tone]} />
                  </marker>
                ))}
              </defs>
              {(Object.keys(PATHS) as Edge[]).map((edge) => {
                const tone = scene.edges[edge];
                return (
                  <path
                    key={edge}
                    d={PATHS[edge]}
                    fill="none"
                    stroke={COLOR[tone]}
                    strokeWidth={tone === "idle" ? 1 : 1.25}
                    strokeDasharray={tone === "block" ? "4 3" : undefined}
                    markerEnd={`url(#pe-arrow-${tone})`}
                  />
                );
              })}
              <Box x={8} y={72} w={84} lines={["클라이언트", "VNet 안"]} strong={false} />
              <Box x={116} y={72} w={84} lines={["이름 조회", "DNS"]} strong={false} />
              <Box x={236} y={14} w={116} lines={["사설 끝점", "10.20.1.7"]} strong={scene.focus === "private"} />
              <Box x={236} y={130} w={116} lines={["공개 주소", "52.1.2.3"]} strong={scene.focus === "public"} />
              <text x={294} y={68} textAnchor="middle" fontSize={10} fill={scene.edges.dnsPrivate === "ok" ? "#16a34a" : "#94a3b8"}>의도한 사설 경로</text>
              <text x={294} y={124} textAnchor="middle" fontSize={10} fill={scene.edges.dnsPublic === "block" ? "#dc2626" : "#94a3b8"}>의도하지 않은 길</text>
            </svg>
            <div className="mt-3 min-h-[3.25rem] rounded-md border border-border bg-muted/20 px-3 py-2 font-mono text-xs leading-5 text-foreground">
              <p>{scene.output[0]}</p>
              <p className="text-muted-foreground">{scene.output[1] || " "}</p>
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">예시 출력 — 실측 아님 (8절 실습 블록)</p>
          </div>
        );
      }}
    />
  );
}

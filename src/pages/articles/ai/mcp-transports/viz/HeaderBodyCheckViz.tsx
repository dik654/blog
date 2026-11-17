import SceneShell from "./SceneShell";

/**
 * 본문 대응: #streamable-http — routing header는 body를 전부 읽기 전에 route를 고르게 돕고,
 * server는 header와 JSON-RPC body가 같은 method·name을 말하는지 다시 검사한다.
 * 위 = POST 한 건(header 줄 + body 줄), 아래 = gateway 판단과 server 대조.
 */
const SCENES = [
  {
    label: "POST 한 건이 도착합니다",
    summary: "header + body",
    note: "요청마다 POST 한 건입니다. 앞쪽 header에는 MCP-Protocol-Version·Mcp-Method·Mcp-Name이, 뒤쪽 body에는 JSON-RPC id·method·params가 실립니다.",
  },
  {
    label: "Gateway는 header로 route를 고릅니다",
    summary: "body는 아직 안 읽음",
    note: "Gateway는 body를 전부 읽기 전에 Mcp-Method=tools/call, Mcp-Name=search를 route key로 써서 맞는 policy로 보냅니다.",
  },
  {
    label: "Server가 body와 header를 대조합니다",
    summary: "method·name 일치",
    note: "Server는 body의 method와 name이 header와 같은지 다시 검사합니다. 일치해도 body schema validation은 따로 남습니다. Header 검사가 그것을 대신하지 않습니다.",
  },
  {
    label: "둘이 다르면 거부합니다",
    summary: "HeaderMismatch",
    note: "Header는 search라고 말하는데 body는 다른 name을 담고 있으면 HeaderMismatch로 거부합니다.",
  },
] as const;

const ACCENT = "#2563eb";
const BAD = "#dc2626";
const GOOD = "#16a34a";

function Row({ k, v, tone }: { k: string; v: string; tone?: string }) {
  return (
    <div className="grid grid-cols-[minmax(0,9.5rem)_minmax(0,1fr)] gap-2 font-mono text-[11px] leading-6 sm:text-xs">
      <span className="truncate text-muted-foreground">{k}</span>
      <span className="break-all font-bold" style={tone ? { color: tone } : undefined}>{v}</span>
    </div>
  );
}

export default function HeaderBodyCheckViz() {
  return (
    <SceneShell
      eyebrow="Streamable HTTP · header와 body"
      title="Header로 길을 고르고, body와 다시 맞춰 봅니다"
      description="TLS·Origin 연결 확인과 token·ACL 권한 확인은 이 그림 밖의 별도 층입니다. 암호화된 연결만으로 caller 권한이 증명되지는 않습니다. id 7과 delete는 설명용 가정입니다."
      ariaLabel="HTTP POST의 routing header와 JSON-RPC body를 gateway와 server가 각각 읽는 순서"
      scenes={SCENES}
      render={(active) => {
        const bodyOpen = active >= 2;
        const mismatch = active === 3;
        const gatewayOn = active >= 1;
        return (
          <div className="min-w-0 space-y-4">
            <div className="rounded-lg border border-border">
              <div className={`border-b border-border px-3 py-2 ${active === 1 ? "bg-primary/5" : ""}`}>
                <p className="mb-1 text-[11px] font-bold text-primary">HEADER</p>
                <Row k="MCP-Protocol-Version" v="(revision)" />
                <Row k="Mcp-Method" v="tools/call" tone={gatewayOn ? ACCENT : undefined} />
                <Row k="Mcp-Name" v="search" tone={gatewayOn ? ACCENT : undefined} />
              </div>
              <div className={`px-3 py-2 ${bodyOpen ? "" : "opacity-50"}`}>
                <p className="mb-1 text-[11px] font-bold text-muted-foreground">BODY · JSON-RPC {bodyOpen ? "" : "(아직 읽지 않음)"}</p>
                <Row k="id · method" v={bodyOpen ? "7 · tools/call" : "· · ·"} tone={bodyOpen ? GOOD : undefined} />
                <Row k="params.name" v={bodyOpen ? (mismatch ? "delete" : "search") : "· · ·"} tone={bodyOpen ? (mismatch ? BAD : GOOD) : undefined} />
              </div>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <div className={`rounded-lg border px-3 py-2 text-xs leading-5 ${gatewayOn ? "border-[#2563eb]" : "border-border text-muted-foreground"}`}>
                <strong className="block text-foreground">Gateway</strong>
                {gatewayOn ? "tools/call · search policy로 route" : "대기"}
              </div>
              <div
                className="rounded-lg border px-3 py-2 text-xs leading-5"
                style={{ borderColor: bodyOpen ? (mismatch ? BAD : GOOD) : undefined }}
              >
                <strong className="block text-foreground">Server</strong>
                <span className={bodyOpen ? "" : "text-muted-foreground"} style={bodyOpen ? { color: mismatch ? BAD : GOOD } : undefined}>
                  {!bodyOpen ? "대기" : mismatch ? "✗ search ≠ delete → HeaderMismatch 거부" : "✓ header = body → schema 검사는 따로"}
                </span>
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}

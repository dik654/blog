import StepSceneShell from "./StepSceneShell";

/**
 * 본문 대응: #overview "먼저 output type을 따라갑니다" — TCP 경로는 Noise·Yamux를 바깥에서 덧붙이고,
 * QUIC은 TLS 인증과 stream 다중화를 transport 안에 갖는다. 두 경로 모두 Swarm 위에서는 같은 모양이 된다.
 */
const SCENES = [
  {
    label: "TCP 경로",
    summary: "TcpStream → + Noise → + Yamux",
    note: "Base TCP는 peer identity가 없는 TcpStream만 냅니다. 그 위에 Noise(암호 채널과 상대 PeerId 인증)와 Yamux(한 연결 위에 여러 substream을 여는 multiplexer)를 바깥에서 차례로 덧붙입니다.",
  },
  {
    label: "QUIC 경로",
    summary: "QUIC 안에 TLS 인증 + stream 다중화",
    note: "QUIC은 TLS 기반 인증과 stream multiplexing을 transport 안에서 제공합니다. 그래서 바깥에 덧붙이는 upgrade 칸이 없고, 조립 위치만 다릅니다.",
  },
  {
    label: "Swarm 위에서는 같은 모양",
    summary: "인증된 peer connection + substream",
    note: "두 경로 모두 Swarm 위에서는 인증된 peer connection과 substream이라는 공통 형태로 정규화됩니다. Ping 같은 application protocol은 TCP socket option이나 QUIC packet number를 직접 다루지 않습니다.",
  },
] as const;

function Box({ title, sub, on, dashed = false }: { title: string; sub: string; on: boolean; dashed?: boolean }) {
  return (
    <div
      className={`rounded-lg border px-2 py-2 text-center leading-5 transition-opacity duration-300 motion-reduce:transition-none ${
        dashed ? "border-dashed" : ""
      } ${on ? "border-[#2563eb] bg-[#2563eb]/10 opacity-100" : "border-border bg-background opacity-45"}`}
    >
      <span className={`block text-xs font-bold sm:text-sm ${on ? "text-[#2563eb]" : ""}`}>{title}</span>
      <span className="block break-keep text-[11px] text-muted-foreground sm:text-xs">{sub}</span>
    </div>
  );
}

function Arrow({ on }: { on: boolean }) {
  return <div className={`mx-auto h-4 w-px ${on ? "bg-[#2563eb]" : "bg-border"}`} aria-hidden />;
}

export default function TransportPathsViz() {
  return (
    <StepSceneShell
      eyebrow="두 transport 경로"
      title="TCP는 바깥에서 쌓고, QUIC은 안에 갖고 옵니다"
      description="왼쪽은 이 글의 고정 사례인 TCP+Noise+Yamux, 오른쪽은 QUIC입니다. 칸 하나가 책임 하나이며, 아래 칸은 두 경로가 Swarm에 넘기는 공통 형태입니다."
      ariaLabel="TCP와 QUIC이 인증과 다중화를 붙이는 위치 비교"
      scenes={SCENES}
      render={(active) => {
        const tcp = active === 0 || active === 2;
        const quic = active === 1 || active === 2;
        const merged = active === 2;
        return (
          <div className="min-w-0">
            <div className="grid grid-cols-2 gap-3 sm:gap-6">
              <div className="min-w-0">
                <p className="mb-2 text-center text-xs font-bold text-muted-foreground">TCP 경로</p>
                <Box title="TCP" sub="TcpStream · identity 없음" on={tcp} />
                <Arrow on={tcp} />
                <Box title="+ Noise" sub="PeerId 인증 · 암호화" on={tcp} />
                <Arrow on={tcp} />
                <Box title="+ Yamux" sub="substream 다중화" on={tcp} />
              </div>
              <div className="flex min-w-0 flex-col">
                <p className="mb-2 text-center text-xs font-bold text-muted-foreground">QUIC 경로</p>
                <div
                  className={`flex flex-1 flex-col justify-center gap-2 rounded-lg border px-2 py-2 transition-opacity duration-300 motion-reduce:transition-none ${
                    quic ? "border-[#0f766e] bg-[#0f766e]/10 opacity-100" : "border-border bg-background opacity-45"
                  }`}
                >
                  <span className={`text-center text-xs font-bold sm:text-sm ${quic ? "text-[#0f766e]" : ""}`}>QUIC transport</span>
                  <span className="rounded-md border border-dashed border-border px-1 py-1 text-center text-[11px] text-muted-foreground sm:text-xs">안에: TLS 인증</span>
                  <span className="rounded-md border border-dashed border-border px-1 py-1 text-center text-[11px] text-muted-foreground sm:text-xs">안에: stream 다중화</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-6">
              <Arrow on={merged} />
              <Arrow on={merged} />
            </div>
            <Box title="Swarm이 받는 공통 형태" sub="인증된 peer connection + substream" on={merged} />
          </div>
        );
      }}
    />
  );
}

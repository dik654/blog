import type { ReactNode } from "react";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #assembly — validator는 indexer에 먼저 연결하고 인증 P2P network를 만든다.
 * channel 0 vote, 1 certificate, 2 resolver. Application mailbox 하나가
 * Simplex 설정의 automaton·relay·reporter 세 자리에 함께 들어간다.
 * 같은 mailbox라도 propose·verify·report는 다른 일이다.
 */
const SCENES = [
  { label: "연결 먼저", summary: "indexer 연결 → 인증 P2P network", note: "Validator는 먼저 indexer에 연결하고, 이어서 인증 P2P network를 만듭니다. 바깥 점선은 이 실행 주체들을 만드는 Runtime Context입니다." },
  { label: "채널 세 개", summary: "0 vote · 1 certificate · 2 resolver", note: "인증 P2P에는 합의 메시지 종류마다 채널 번호가 따로 등록됩니다. 인증 P2P는 이런 합의 메시지만 peer 사이에 전달합니다." },
  { label: "mailbox 하나, 자리 셋", summary: "automaton · relay · reporter → 같은 mailbox", note: "Application을 만들 때 받은 mailbox 하나가 Simplex 설정의 세 자리에 모두 꽂힙니다. 그래서 Simplex 쪽에서 보면 세 연결 모두 같은 Application으로 이어집니다." },
  { label: "들어오는 일은 셋", summary: "propose · verify · report", note: "같은 mailbox로 들어와도 일은 다릅니다. Propose는 새 digest를 내주고, verify는 digest에 해당하는 블록을 확인하며, report는 notarization·finalization 같은 합의 활동을 알려 줍니다." },
] as const;

const CHANNELS = [
  ["0", "vote"],
  ["1", "certificate"],
  ["2", "resolver"],
] as const;
const SLOTS = ["automaton", "relay", "reporter"] as const;
const JOBS = [
  ["propose", "새 digest 제공"],
  ["verify", "블록 확인"],
  ["report", "합의 활동 통지"],
] as const;

function Cell({ on, children, className = "" }: { on: boolean; children: ReactNode; className?: string }) {
  return (
    <div className={`min-w-0 rounded-lg border px-2 py-2 text-center transition-opacity duration-300 motion-reduce:transition-none ${on ? "border-primary bg-background" : "border-border bg-background opacity-40"} ${className}`}>
      {children}
    </div>
  );
}

export default function BridgeWiringViz() {
  return (
    <SceneShell
      eyebrow="Bridge 조립"
      title="mailbox 하나가 Simplex 설정의 세 자리에 함께 들어갑니다"
      description="Validator 프로그램이 실행 주체를 연결하는 순서입니다. Mailbox는 한 실행 주체에 메시지를 넣는 입구입니다."
      ariaLabel="Bridge validator가 indexer, 인증 P2P 채널, Simplex 설정과 Application mailbox를 연결하는 네 장면"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0 rounded-xl border border-dashed border-slate-400 p-2 sm:p-4">
          <p className="text-[11px] font-bold text-muted-foreground">Runtime Context</p>
          <div className="mt-2 grid min-w-0 grid-cols-2 gap-2 sm:gap-3">
            <Cell on={active === 0}>
              <span className="block text-[10px] font-bold text-muted-foreground">① 먼저</span>
              <strong className="block break-keep text-xs sm:text-sm">Indexer 연결</strong>
            </Cell>
            <Cell on={active <= 1}>
              <span className="block text-[10px] font-bold text-muted-foreground">② 다음</span>
              <strong className="block break-keep text-xs sm:text-sm">인증 P2P network</strong>
            </Cell>
          </div>
          <div className="mt-2 grid min-w-0 grid-cols-3 gap-1.5 sm:gap-2">
            {CHANNELS.map(([n, kind]) => (
              <Cell key={n} on={active === 1}>
                <span className="block font-mono text-[10px] font-bold text-primary">channel {n}</span>
                <span className="block break-all text-[11px] sm:text-xs">{kind}</span>
              </Cell>
            ))}
          </div>
          <div className="mt-3 rounded-lg border border-border p-2">
            <p className="text-[11px] font-bold text-muted-foreground">Simplex 설정</p>
            <div className="mt-1.5 grid min-w-0 grid-cols-3 gap-1.5 sm:gap-2">
              {SLOTS.map((slot) => (
                <Cell key={slot} on={active === 2}>
                  <span className="block break-all font-mono text-[11px] sm:text-xs">{slot}</span>
                </Cell>
              ))}
            </div>
          </div>
          <svg viewBox="0 0 300 28" preserveAspectRatio="none" className="block h-7 w-full" aria-hidden="true">
            {[50, 150, 250].map((x) => (
              <line key={x} x1={x} y1={0} x2={150} y2={28} stroke={active >= 2 ? "#2563eb" : "#94a3b8"} strokeWidth={1.25} vectorEffect="non-scaling-stroke" opacity={active >= 2 ? 1 : 0.4} />
            ))}
          </svg>
          <Cell on={active >= 2}>
            <strong className="block text-xs sm:text-sm">Application mailbox (하나)</strong>
            <span className="block text-[10px] text-muted-foreground">세 자리 중 어디서 왔든 같은 입구로 들어오는 일</span>
            <div className="mt-1.5 flex min-w-0 flex-wrap justify-center gap-1">
              {JOBS.map(([job, meaning]) => (
                <div key={job} className={`flex min-w-0 items-baseline gap-1.5 rounded-full border px-2 py-0.5 transition-opacity duration-300 motion-reduce:transition-none ${active === 3 ? "border-amber-600" : "border-border opacity-40"}`}>
                  <span className="font-mono text-[11px] font-bold sm:text-xs">{job}</span>
                  <span className="break-keep text-[10px] leading-4 text-muted-foreground sm:text-[11px]">{meaning}</span>
                </div>
              ))}
            </div>
          </Cell>
        </div>
      )}
    />
  );
}

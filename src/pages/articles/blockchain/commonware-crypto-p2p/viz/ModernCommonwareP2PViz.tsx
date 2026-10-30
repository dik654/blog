import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const FLOW_SCENES = [
  "channel 등록",
  "identity 확인",
  "Syn 검증",
  "session 확정",
  "로컬 접수",
  "relay 전송",
  "Bob 검증",
  "Application 수신",
] as const;

const FLOW_SHORT_LABELS = ["등록", "identity", "Syn", "session", "접수", "전송", "검증", "수신"] as const;

const FLOW_NOTES = [
  "양쪽 Application이 channel 7을 등록합니다. Bob 쪽에는 허용 peer 수와 quota burst에서 계산한 bounded inbound mailbox가 생깁니다. 이때 연결도 m7도 아직 없습니다.",
  "Alice가 연결을 열면 static public key를 먼저 보냅니다. Bob listener의 bouncer가 허용한 identity여야 handshake frame을 더 읽습니다. 이 단계는 peer 허용 여부이지 message 수신 확인이 아닙니다.",
  "Alice의 Syn에는 시각, ephemeral public key와 transcript signature가 들어갑니다. Bob은 namespace·역할·양쪽 identity·시각 범위를 같은 transcript에 넣어 signature를 검증합니다.",
  "Bob의 SynAck와 Alice의 Ack confirmation까지 맞으면 양방향 ChaCha20-Poly1305 cipher가 열립니다. Alice→Bob과 Bob→Alice는 서로 다른 key material과 counter를 사용합니다.",
  "Alice가 channel 7의 payload m7을 보냅니다. Sender의 rate check와 bounded router mailbox가 받아들여도 이는 Alice 노드의 local submission입니다. Bob receipt는 아직 없습니다.",
  "Router는 현재 연결된 Bob relay를 찾고 priority에 따라 bounded high 또는 low queue에 m7 frame을 넣습니다. Bob이 offline이거나 relay queue가 가득 찬 뒤의 결과는 최초 caller에게 원격 receipt로 돌아오지 않습니다.",
  "Bob peer actor가 ciphertext를 복호화하고 frame을 decode합니다. 등록 channel인지 확인하고 Alice에게 적용되는 channel별 rate limit이 찼으면 기다린 뒤 inbound mailbox에 non-blocking enqueue를 시도합니다.",
  "Bob Application의 Receiver가 (Alice public key, decrypted bytes m7)을 반환할 때 node-local application receipt가 생깁니다. Durable commit, 업무 승인과 Alice에게 돌아가는 acknowledgement는 이 P2P 경로 밖의 책임입니다.",
] as const;

const ACTORS = [
  ["ALICE APP", "channel 7 sender"],
  ["ALICE ROUTER", "rate · bounded ingress"],
  ["ENCRYPTED LINK", "relay · AEAD frame"],
  ["BOB PEER ACTOR", "decode · channel · rate"],
  ["CHANNEL 7 INBOX", "bounded unreliable mailbox"],
  ["BOB APP", "Receiver<(peer, bytes)>"],
] as const;

const ACTIVE: readonly (readonly number[])[] = [
  [0, 4, 5],
  [0, 2, 3],
  [0, 2, 3],
  [0, 2, 3],
  [0, 1],
  [1, 2, 3],
  [3, 4],
  [4, 5],
];

const TOKEN_AT = [-1, -1, -1, -1, 1, 2, 3, 5] as const;

const STATE = [
  ["session", "없음", "m7", "없음", "Bob receipt", "없음"],
  ["peer identity", "bouncer 검사", "session", "handshake 중", "m7", "없음"],
  ["Syn", "signature 검증", "timestamp", "허용 범위", "session", "미확정"],
  ["confirmation", "일치", "cipher", "방향별 준비", "m7", "아직 없음"],
  ["Alice local", "접수", "m7 위치", "router mailbox", "Bob receipt", "없음"],
  ["relay", "Bob 연결", "m7 위치", "encrypted link", "remote ack", "없음"],
  ["channel 7", "등록 확인", "Alice quota", "허용 또는 대기", "m7 위치", "Bob actor"],
  ["Receiver", "(Alice, m7)", "Bob receipt", "생성", "durable", "별도"],
] as const;

function FlowMap({ active }: { active: number }) {
  return (
    <div aria-label="Alice의 channel 등록과 handshake부터 Bob Application의 bytes 수신까지 이어지는 경로">
      <div className="grid grid-cols-2 gap-px bg-border p-px xl:grid-cols-3">
        {ACTORS.map(([name, role], index) => {
          const isActive = ACTIVE[active].includes(index);
          const hasToken = TOKEN_AT[active] === index;
          return (
            <div key={name} className={`relative min-w-0 bg-background px-3 py-3 sm:min-h-28 ${isActive ? "ring-2 ring-inset ring-primary" : "opacity-45"}`}>
              <div className="flex items-start justify-between gap-2">
                <span className={`font-mono text-[9px] font-black ${isActive ? "text-primary" : "text-muted-foreground"}`}>{name}</span>
                <span className="font-mono text-[8px] text-muted-foreground">{String(index + 1).padStart(2, "0")}</span>
              </div>
              <strong className="mt-2 block break-keep text-xs leading-5">{role}</strong>
              {hasToken && (
                <span className="mt-2 inline-flex min-h-7 items-center border border-primary bg-primary/10 px-2 font-mono text-[10px] font-black text-primary" aria-label="설명용 payload m7의 현재 위치">
                  m7 · channel 7
                </span>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-3 grid grid-cols-3 gap-px bg-border p-px text-center text-[9px] leading-4 sm:text-xs sm:leading-5">
        {[0, 1, 2].map((index) => (
          <div key={STATE[active][index * 2]} className="min-w-0 bg-background px-2 py-3">
            <span className="block break-keep text-muted-foreground">{STATE[active][index * 2]}</span>
            <strong className="mt-1 block break-keep text-primary">{STATE[active][index * 2 + 1]}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CommonwareP2PFlowViz() {
  const scenes = useAnimatedScenes(FLOW_SCENES.length, 5200, { loop: false });
  const active = scenes.active;

  return (
    <VizFrame eyebrow="한 payload 추적 · Commonware v2026.9.0" title="Alice의 로컬 접수와 Bob의 수신 사이에는 여섯 개의 실행 경계가 있습니다" description="글 안의 설명용 payload m7을 channel 등록, authenticated handshake, router·relay, 복호화와 Bob의 bounded inbox까지 추적합니다." note="m7과 channel 7은 흐름을 고정하기 위한 가정입니다. 실제 wire에는 이 설명용 이름이 들어가지 않습니다." canvasClassName="p-1.5 sm:p-5" documentFlow>
      <div id={scenes.playbackId} data-viz-live-only data-commonware-p2p-scene={active} tabIndex={0} role="group" aria-label="Commonware P2P가 한 payload를 전달하는 여덟 장면" onKeyDown={scenes.onKeyDown} className="outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
        <div data-viz-scene-stage>
          <div className="overflow-x-auto" aria-label="Commonware P2P 전달 경로의 여덟 장면">
            <div className="grid min-w-[352px] grid-cols-8 gap-px bg-border p-px lg:min-w-0">
              {FLOW_SCENES.map((scene, index) => (
                <button type="button" key={scene} aria-pressed={index === active} onClick={() => scenes.setActive(index)} className={`min-h-11 min-w-11 bg-background px-0.5 py-1 text-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary lg:min-w-0 lg:py-2 ${index === active ? "text-primary" : index < active ? "text-foreground" : "text-muted-foreground"}`}>
                  <span className="block font-mono text-[8px] font-black">{String(index + 1).padStart(2, "0")}</span>
                  <strong className="mt-1 block break-keep text-[7px] leading-3 lg:hidden">{FLOW_SHORT_LABELS[index]}</strong>
                  <strong className="mt-1 hidden break-keep text-[8px] leading-3 lg:block">{scene}</strong>
                </button>
              ))}
            </div>
          </div>
          <div className="mt-2 sm:mt-3"><FlowMap active={active} /></div>
          <p data-scene-note className="mt-2 min-h-[10.5rem] border-l-2 border-primary/50 pl-2.5 text-[10px] leading-4 text-muted-foreground sm:mt-3 sm:min-h-[6rem] sm:pl-4 sm:text-sm sm:leading-6">{FLOW_NOTES[active]}</p>
        </div>
        <AnimatedSceneControls {...scenes} labels={FLOW_SCENES} controlLabels={FLOW_SCENES} playLabel="P2P 전달 경로 재생" className="mt-0 sm:mt-4" compact />
      </div>
      <StaticSceneList labels={FLOW_SCENES} notes={FLOW_NOTES} />
    </VizFrame>
  );
}

export function CommonwareHandshakeViz() {
  const messages = [
    ["ALICE → BOB", "static public key", "Bouncer가 허용 peer인지 먼저 판단"],
    ["ALICE → BOB", "Syn(time, epk, sig)", "Bob이 시각 범위와 Alice signature 검증"],
    ["BOB → ALICE", "SynAck(time, epk, sig, confirmation)", "Alice가 Bob signature·shared secret·confirmation 검증"],
    ["ALICE → BOB", "Ack(confirmation)", "Bob도 같은 transcript를 확인한 뒤 ciphers 공개"],
  ] as const;

  return (
    <VizFrame eyebrow="Session을 여는 네 번의 wire 전달" title="Static identity를 먼저 거른 뒤 세 handshake message로 같은 transcript를 확인합니다" description="Syn·SynAck·Ack라는 세 handshake message 앞에 listener bouncer용 static public key 전달이 있습니다." note="이 절차는 identity·session key·message confidentiality와 integrity를 다룹니다. Application 권한과 durable delivery는 다루지 않습니다." canvasClassName="p-2 sm:p-5">
      <ol className="grid gap-px bg-border p-px sm:grid-cols-2" aria-label="Commonware encrypted stream handshake 순서">
        {messages.map(([direction, message, result], index) => (
          <li key={message} className="min-w-0 bg-background p-3">
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-[9px] font-black text-primary">{String(index + 1).padStart(2, "0")} · {direction}</span>
              <span className="text-primary" aria-hidden>{direction.includes("ALICE →") ? "→" : "←"}</span>
            </div>
            <strong className="mt-2 block break-words font-mono text-[11px] leading-5 sm:text-xs">{message}</strong>
            <p className="mt-1 break-keep text-[10px] leading-5 text-muted-foreground sm:text-xs">{result}</p>
          </li>
        ))}
      </ol>
      <div className="mt-3 grid gap-px bg-border p-px sm:grid-cols-2">
        <p className="bg-background p-3 text-xs leading-6"><strong className="block text-primary">Alice → Bob cipher</strong>별도 key material · 별도 counter</p>
        <p className="bg-background p-3 text-xs leading-6"><strong className="block text-primary">Bob → Alice cipher</strong>반대 방향 label · 별도 counter</p>
      </div>
    </VizFrame>
  );
}

export function CommonwareChannelCapacityViz() {
  return (
    <VizFrame eyebrow="공식 test의 수치로 mailbox 읽기" title="허용 peer 2명과 burst 2건이면 channel inbox 용량은 4건입니다" description="모든 허용 peer가 같은 channel receiver로 들어오므로 register 시점에 max_peers × burst_size를 계산합니다." note="용량 4는 queue가 항상 네 건을 보장한다는 뜻이 아닙니다. Application이 늦게 읽어 이미 차 있으면 다섯 번째 새 도착은 Rejected로 버려집니다." canvasClassName="p-2 sm:p-5">
      <div className="grid gap-px bg-border p-px sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:items-stretch" aria-label="두 peer와 burst 두 건에서 channel mailbox 용량 네 건을 계산하는 과정">
        <div className="min-w-0 bg-background p-3 text-center"><span className="font-mono text-[9px] font-black text-primary">MAX PEERS</span><strong className="mt-2 block text-2xl">2</strong><p className="mt-1 text-[10px] text-muted-foreground">허용된 발신자 수</p></div>
        <span className="hidden items-center bg-background px-2 text-primary sm:flex" aria-hidden>×</span>
        <div className="min-w-0 bg-background p-3 text-center"><span className="font-mono text-[9px] font-black text-primary">BURST SIZE</span><strong className="mt-2 block text-2xl">2</strong><p className="mt-1 text-[10px] text-muted-foreground">peer 한 명의 순간 허용량</p></div>
        <span className="hidden items-center bg-background px-2 text-primary sm:flex" aria-hidden>=</span>
        <div className="min-w-0 bg-background p-3 text-center ring-2 ring-inset ring-primary"><span className="font-mono text-[9px] font-black text-primary">INBOX CAPACITY</span><strong className="mt-2 block text-2xl">4</strong><p className="mt-1 text-[10px] text-muted-foreground">channel 하나의 bounded queue</p></div>
      </div>
      <div className="mt-3 grid grid-cols-5 gap-px bg-border p-px text-center text-[9px] leading-4 sm:text-xs sm:leading-5" aria-label="네 건 접수 뒤 다섯 번째 새 도착이 버려지는 상태">
        {["1 · 접수", "2 · 접수", "3 · 접수", "4 · 접수", "5 · 버림"].map((label, index) => (
          <div key={label} className={`min-w-0 bg-background px-1 py-3 ${index === 4 ? "text-destructive ring-2 ring-inset ring-destructive" : "text-primary"}`}><strong className="break-keep">{label}</strong></div>
        ))}
      </div>
    </VizFrame>
  );
}

export function CommonwareP2PBoundaryViz() {
  const boundaries = [
    ["SESSION", "Ack confirmation 일치", "Authenticated encrypted connection"],
    ["LOCAL SUBMISSION", "rate check · router mailbox", "Alice 노드가 m7을 접수"],
    ["NODE-LOCAL RECEIPT", "Receiver → (Alice, m7)", "Bob process가 bytes를 획득"],
    ["APPLICATION", "schema · signature · 업무 상태", "P2P crate 밖의 승인·저장"],
  ] as const;

  return (
    <VizFrame eyebrow="완료 증거를 분리하기" title="Session 성공, 로컬 접수, Bob 수신과 업무 완료는 서로 다른 상태입니다" description="장애 원인과 재시도 지점을 정하려면 어느 경계까지 통과했는지 따로 기록해야 합니다." note="P2P Receiver 반환 뒤에도 disk commit과 side effect가 실패할 수 있습니다. 반대로 Alice의 local acceptance만으로 Bob 수신을 추론할 수 없습니다." canvasClassName="p-2 sm:p-5">
      <div className="grid gap-px bg-border p-px sm:grid-cols-2" aria-label="Commonware P2P 과정의 네 가지 완료 상태">
        {boundaries.map(([name, evidence, meaning]) => (
          <div key={name} className="min-w-0 bg-background p-3"><span className="font-mono text-[9px] font-black text-primary">{name}</span><strong className="mt-1 block break-keep text-xs sm:text-sm">{evidence}</strong><p className="mt-1 break-keep text-[10px] leading-5 text-muted-foreground sm:text-xs">{meaning}</p></div>
        ))}
      </div>
    </VizFrame>
  );
}

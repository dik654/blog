import { useEffect, useRef } from "react";
import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = [
  "채널 등록",
  "연결 인증",
  "Envelope 생성",
  "로컬 큐 수용",
  "Packet 선택",
  "Message 재조립",
  "Reactor 전달",
  "CheckTx 판정",
  "재전파·실패",
] as const;

type StateKey = "link" | "queue" | "wire" | "dispatch" | "mempool";

const STATES: readonly {
  method: string;
  owner: string;
  input: string;
  link: string;
  queue: string;
  wire: string;
  dispatch: string;
  mempool: string;
  receipt: string;
  changed: readonly StateKey[];
}[] = [
  {
    method: "AddReactor",
    owner: "Switch",
    input: "mempool Reactor · channel 0x30",
    link: "연결 전",
    queue: "0x30 · priority 5",
    wire: "없음",
    dispatch: "0x30 → mempool",
    mempool: "변화 없음",
    receipt: "Channel ID 하나에는 Reactor owner 하나만 등록됩니다.",
    changed: ["queue", "dispatch"],
  },
  {
    method: "upgrade · handshake",
    owner: "MultiplexTransport",
    input: "TCP connection · remote public key · NodeInfo",
    link: "peer ID 인증 · 0x30 지원",
    queue: "비어 있음",
    wire: "SecretConnection 준비",
    dispatch: "0x30 → mempool",
    mempool: "변화 없음",
    receipt: "연결 상대와 지원 channel을 확인했지만 transaction은 아직 없습니다.",
    changed: ["link", "wire"],
  },
  {
    method: "Peer.Send",
    owner: "보내는 peer",
    input: "alice→bob 10 · Envelope{0x30, Txs}",
    link: "peer 실행 중",
    queue: "protobuf marshal 전",
    wire: "전송 전",
    dispatch: "0x30 owner 확인",
    mempool: "보낸 node에만 존재",
    receipt: "Peer가 실행 중이고 상대가 0x30을 지원해야 marshal과 enqueue를 시도합니다.",
    changed: ["link", "dispatch"],
  },
  {
    method: "MConnection.Send",
    owner: "Channel 0x30 queue",
    input: "protobuf bytes",
    link: "연결 유지",
    queue: "1 message 수용",
    wire: "아직 미전송",
    dispatch: "깨우기 signal",
    mempool: "remote 미판정",
    receipt: "Send=true는 local bounded queue가 bytes를 받았다는 뜻일 뿐입니다.",
    changed: ["queue"],
  },
  {
    method: "selectChannelToGossipOn",
    owner: "sendRoutine",
    input: "recentlySent / priority",
    link: "연결 유지",
    queue: "0x30 message 분할 중",
    wire: "Packet 1 · EOF=false",
    dispatch: "아직 remote 미도착",
    mempool: "remote 미판정",
    receipt: "가장 작은 정규화 비용의 channel에서 payload ceiling만큼 보냅니다.",
    changed: ["queue", "wire"],
  },
  {
    method: "recvPacketMsg",
    owner: "remote recvRoutine",
    input: "Packet 1 … Packet n · EOF=true",
    link: "연결 유지",
    queue: "sender queue 감소",
    wire: "message bytes 완성",
    dispatch: "decode 전",
    mempool: "remote 미판정",
    receipt: "EOF까지 재조립됐다는 사실은 message 완성이지 transaction 유효성 증명이 아닙니다.",
    changed: ["queue", "wire"],
  },
  {
    method: "onReceive",
    owner: "peer · 같은 recvRoutine",
    input: "FilterMsgBytes → Unmarshal → Unwrap",
    link: "peer source 보존",
    queue: "다음 packet 대기",
    wire: "0x30 Txs decode",
    dispatch: "mempool.Receive 호출",
    mempool: "판정 직전",
    receipt: "Raw-byte filter와 decode를 통과한 Envelope가 channel owner에게 전달됩니다.",
    changed: ["wire", "dispatch"],
  },
  {
    method: "mempool.CheckTx",
    owner: "Mempool Reactor",
    input: "transaction bytes · SenderID",
    link: "peer 연결 유지",
    queue: "remote channel 비어 있음",
    wire: "수신 완료",
    dispatch: "Reactor 처리 완료",
    mempool: "CheckTx 통과 시 수용",
    receipt: "여기서 처음 transaction admission을 판단합니다. Block 포함·Commit은 아직 아닙니다.",
    changed: ["dispatch", "mempool"],
  },
  {
    method: "broadcastTxRoutine · stopForError",
    owner: "caller와 connection",
    input: "수용 transaction 또는 queue/filter/decode 오류",
    link: "정상은 gossip · framing 오류는 disconnect",
    queue: "full이면 Send=false",
    wire: "다음 peer로 재전파 가능",
    dispatch: "invalid CheckTx는 기록 후 종료",
    mempool: "수용 또는 거절",
    receipt: "Queue full, protocol 오류와 invalid transaction은 서로 다른 실패 경로입니다.",
    changed: ["link", "queue", "wire", "dispatch", "mempool"],
  },
] as const;

const NOTES = [
  "Switch가 mempool Reactor의 ChannelDescriptor를 읽어 0x30의 유일한 owner와 protobuf message type을 등록합니다. 같은 ID를 다른 Reactor가 소유하려 하면 시작 단계에서 panic합니다.",
  "Transport는 TCP를 SecretConnection으로 올리고 remote public key와 NodeInfo를 교환합니다. 인증된 peer ID와 NodeInfo ID가 다르면 연결을 거절합니다.",
  "보내는 쪽은 transaction을 Txs message와 channel 0x30으로 묶습니다. Peer.Send는 실행 상태와 상대의 지원 channel을 확인한 뒤 protobuf bytes로 직렬화합니다.",
  "MConnection.Send는 channel의 bounded queue에 넣을 때까지 제한된 시간 기다립니다. TrySend는 자리가 없으면 즉시 false입니다. 둘의 true는 remote acknowledgement가 아닙니다.",
  "sendRoutine은 pending channel 가운데 recentlySent/priority가 가장 작은 곳을 고릅니다. 큰 message는 여러 PacketMsg로 나뉘며 마지막 조각만 EOF=true입니다.",
  "Remote recvRoutine은 channel별 buffer에 조각을 붙입니다. RecvMessageCapacity를 넘거나 알 수 없는 channel이면 connection을 오류로 중지합니다.",
  "완성된 bytes는 raw-byte filter, protobuf unmarshal과 wrapper 해제를 거쳐 Reactor.Receive로 갑니다. 이 호출은 같은 recvRoutine에서 실행되므로 느린 Reactor는 그 peer connection의 다음 수신을 막을 수 있습니다.",
  "Mempool Reactor는 sync 중인지, Txs가 비지 않았는지 확인한 뒤 sender 정보를 붙여 transaction마다 CheckTx를 호출합니다. 이 시점의 성공도 local mempool admission입니다.",
  "수용된 transaction은 sender를 제외한 다른 peer로 전파할 수 있습니다. Queue full은 caller가 retry를 판단하지만 oversize·unknown channel·decode 오류는 peer disconnect로 이어집니다. CheckTx 거절은 transport 오류와 구분합니다.",
] as const;

function StateCell({ label, value, active }: { label: string; value: string; active: boolean }) {
  return (
    <div className={`min-w-0 border p-2.5 ${active ? "border-primary bg-primary/10" : "border-border bg-background"}`}>
      <span className="block text-[9px] font-black text-muted-foreground">{label}</span>
      <strong className="mt-1 block break-keep text-[10px] leading-5 sm:text-xs">{value}</strong>
    </div>
  );
}

export default function P2PTransactionTraceViz() {
  const scenes = useAnimatedScenes(SCENES.length, 7000, { loop: false });
  const tabsRef = useRef<HTMLDivElement>(null);
  const state = STATES[scenes.active];
  const active = (key: StateKey) => state.changed.includes(key);

  useEffect(() => {
    const scroller = tabsRef.current;
    const selected = scroller?.querySelector<HTMLElement>('button[aria-pressed="true"]');
    if (!scroller || !selected) return;
    const left = selected.getBoundingClientRect().left - scroller.getBoundingClientRect().left + scroller.scrollLeft;
    scroller.scrollTo({ left: left - (scroller.clientWidth - selected.offsetWidth) / 2, behavior: "auto" });
  }, [scenes.active]);

  return (
    <VizFrame
      eyebrow="CometBFT v0.40.0 · 한 transaction의 P2P 경로"
      title="alice→bob 10 bytes가 remote CheckTx에 닿을 때까지 추적합니다"
      description="연결, queue, packet, dispatch와 mempool이 남기는 성공의 의미를 단계마다 구분합니다."
      note="호출과 실패 분기는 v0.40.0 content commit 0880b4d3의 공식 코드에 맞췄습니다."
      canvasClassName="p-1.5 sm:p-5"
      documentFlow
    >
      <div
        id={scenes.playbackId}
        data-viz-live-only
        data-cometbft-p2p-scene={scenes.active}
        tabIndex={0}
        role="group"
        aria-label="alice에서 bob으로 보내는 transaction의 P2P 경로를 아홉 장면으로 추적"
        onKeyDown={scenes.onKeyDown}
        className="outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
      >
        <div data-viz-scene-stage>
          <div ref={tabsRef} className="overflow-x-auto">
            <div className="grid grid-cols-9 gap-px bg-border p-px" style={{ width: "max(100%, 720px)" }}>
              {SCENES.map((label, index) => (
                <button
                  key={label}
                  type="button"
                  aria-pressed={index === scenes.active}
                  onClick={() => scenes.setActive(index)}
                  className={`min-h-11 min-w-0 bg-background px-1 py-1 text-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary ${index === scenes.active ? "text-primary" : index < scenes.active ? "text-foreground" : "text-muted-foreground"}`}
                >
                  <span className="block font-mono text-[8px] font-black">{String(index + 1).padStart(2, "0")}</span>
                  <strong className="mt-1 block break-keep text-[8px] leading-3">{label}</strong>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-3 min-h-[31rem] border-y border-border py-3 sm:min-h-[32rem] sm:py-4">
            <div className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-px bg-border p-px sm:grid-cols-[8.5rem_minmax(0,1fr)]">
              <div className="bg-background p-3 text-[9px] font-bold text-muted-foreground">이번 입력</div>
              <div className="min-w-0 bg-background p-3 font-mono text-[10px] font-bold leading-5 text-primary sm:text-xs">{state.input}</div>
            </div>

            <div className="my-3 grid grid-cols-2 gap-2 sm:gap-3">
              <section className="border border-border bg-background p-2.5 sm:p-3" aria-label="연결과 전송 상태">
                <span className="text-[9px] font-black text-muted-foreground">CONNECTION</span>
                <div className="mt-2 grid gap-1.5">
                  <StateCell label="PEER LINK" value={state.link} active={active("link")} />
                  <StateCell label="CHANNEL QUEUE" value={state.queue} active={active("queue")} />
                  <StateCell label="WIRE · RECEIVE" value={state.wire} active={active("wire")} />
                </div>
              </section>

              <section className="border border-border bg-background p-2.5 sm:p-3" aria-label="프로토콜과 mempool 상태">
                <span className="text-[9px] font-black text-muted-foreground">PROTOCOL</span>
                <div className="mt-2 grid gap-1.5">
                  <StateCell label="DISPATCH" value={state.dispatch} active={active("dispatch")} />
                  <StateCell label="MEMPOOL" value={state.mempool} active={active("mempool")} />
                  <StateCell label="현재 OWNER" value={`${state.method} · ${state.owner}`} active />
                </div>
              </section>
            </div>

            <div className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-px bg-border p-px sm:grid-cols-[8.5rem_minmax(0,1fr)]">
              <div className="bg-background p-3 text-[9px] font-bold text-muted-foreground">남은 사실</div>
              <div className="min-w-0 bg-background p-3 text-[10px] font-bold leading-5 sm:text-xs">{state.receipt}</div>
            </div>

            <p data-scene-note className="mt-3 min-h-[6rem] border-l-2 border-primary/50 pl-3 text-[10px] leading-5 text-muted-foreground sm:min-h-[7rem] sm:text-sm sm:leading-6">
              {NOTES[scenes.active]}
            </p>
          </div>
        </div>

        <AnimatedSceneControls {...scenes} labels={SCENES} controlLabels={SCENES} playLabel="P2P 전달 경로 재생" compact />
      </div>
      <StaticSceneList labels={SCENES} notes={NOTES} />
    </VizFrame>
  );
}

import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * listen(fd, 511) 서버의 accept 대기열 512칸을 32칸짜리 묶음 16개로 그린다.
 * accept()가 1초 멈춘 동안 초당 600개 handshake가 끝나면 512개만 줄을 서고 나머지 SYN은 버려진다.
 * 한 mechanism: sk_ack_backlog > sk_max_ack_backlog 이면 새 SYN을 버리고, 클라이언트는 1초 뒤 다시 보낸다.
 */
const SLOTS = 512;
const GROUP = 32;
const GROUPS = SLOTS / GROUP; // 16
const SCENES = ["평소", "0.5초 정지", "0.85초", "1초", "재개", "ss로 보기"] as const;

interface Scene {
  queued: number;
  dropped: number;
  label: string;
  note: string;
}

const STATES: readonly Scene[] = [
  { queued: 3, dropped: 0, label: "accept() 동작 중", note: "handshake가 끝난 연결은 accept 대기열에 잠깐 섰다가 프로그램의 accept()가 곧바로 꺼내 갑니다. 줄은 거의 비어 있습니다." },
  { queued: 300, dropped: 0, label: "accept() 멈춤", note: "프로그램이 1초 동안 accept()를 부르지 못한다고 합시다. (가정) 0.5초 동안 끝난 handshake 300개가 줄에 쌓입니다." },
  { queued: 512, dropped: 0, label: "줄 가득", note: "512 ÷ 600 ≈ 0.85초에 512개가 찹니다. backlog는 511이지만 판정이 > 라서 512번째까지 들어갑니다." },
  { queued: 512, dropped: 88, label: "SYN 버림", note: "남은 0.15초에 온 SYN 88개는 대기열 검사에서 버려지고 ListenOverflows와 ListenDrops가 88씩 늘어납니다. 서버는 응답하지 않으므로 클라이언트에는 오류도 보이지 않습니다." },
  { queued: 0, dropped: 88, label: "1초 늦은 재전송", note: "accept()가 돌아오면 줄이 비지만, 버려진 88개는 첫 재전송 시간인 1초가 지나서야 SYN을 다시 보냅니다. 이 요청들의 응답 시간에 1초가 그대로 더해집니다." },
  { queued: 512, dropped: 88, label: "ss -lnt", note: "LISTEN 줄의 Recv-Q는 지금 서 있는 연결 수, Send-Q는 상한입니다. 0.85~1초 사이에 찍었다면 Recv-Q 512, Send-Q 511이 보입니다." },
];

export default function AcceptQueueViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3800);
  const scene = scenes.active;
  const state = STATES[scene];
  const fullGroups = Math.floor(state.queued / GROUP);
  const partial = (state.queued % GROUP) / GROUP;

  return (
    <VizFrame
      eyebrow="Listen backlog"
      title="accept()가 멈춘 1초 동안 512개만 줄을 섭니다"
      description="막대 하나가 listen(fd, 511) 소켓의 accept 대기열 512칸이고, 칸 하나는 연결 32개입니다. 오른쪽 수는 대기열이 차서 버려진 SYN입니다."
      note="초당 600개 도착과 1초 정지는 설명용 가정입니다. 실제로는 handshake 마지막 ACK 단계에서 버려지는 연결도 섞일 수 있습니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="accept 대기열이 차고 SYN이 버려지는 과정"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex shrink-0 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">Scene · {String(scene + 1).padStart(2, "0")}</p>
          <h4 className="mt-2 text-base font-bold">{SCENES[scene]}</h4>

          <div className="mt-4 grid grid-cols-[minmax(0,1fr)_4.5rem] items-end gap-3">
            <div className="min-w-0">
              <p className="mb-1 font-mono text-[10px] text-muted-foreground">accept 대기열 · {state.label}</p>
              <div className="grid grid-cols-16 gap-0.5" aria-hidden>
                {Array.from({ length: GROUPS }, (_, index) => (
                  <div key={index} className="relative h-6 overflow-hidden rounded-[2px] border border-border bg-muted/40">
                    <div
                      className="absolute inset-x-0 bottom-0 transition-[height] duration-500"
                      style={{
                        height: index < fullGroups ? "100%" : index === fullGroups ? `${partial * 100}%` : "0%",
                        backgroundColor: "#2563eb",
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="text-center">
              <p className="mb-1 font-mono text-[10px] text-muted-foreground">버린 SYN</p>
              <p className="rounded-md border border-border py-1 font-mono text-sm font-bold" style={{ color: state.dropped > 0 ? "#dc2626" : undefined }}>
                {state.dropped}
              </p>
            </div>
          </div>

          <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 font-mono text-xs sm:grid-cols-4">
            <div>
              <dt className="text-muted-foreground">Recv-Q</dt>
              <dd className="font-bold text-foreground">{state.queued}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Send-Q</dt>
              <dd className="font-bold text-foreground">511</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">ListenOverflows</dt>
              <dd className="font-bold text-foreground">+{state.dropped}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">추가 지연</dt>
              <dd className="font-bold text-foreground">{state.dropped > 0 && scene >= 4 ? "≥ 1초 (88건)" : "없음"}</dd>
            </div>
          </dl>

          <p className="mt-4 min-h-[10.5rem] border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground min-[390px]:min-h-[9rem] sm:min-h-[3.5rem]">
            {state.note}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}

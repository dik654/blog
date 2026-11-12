import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mbarrier-handshake — stage 하나의 full barrier 가 도착 1 과 transaction byte 32,768 을 세다가
 * 둘 다 0 이 되면 phase 를 뒤집고, consumer 는 기다리는 parity 를 들고 다닌다.
 * A·B 가 16 KB 씩 끝나는 순서(A 먼저)는 설명용 가정.
 */
const FULL_BYTES = 32768;

interface State {
  arrivals: number;
  bytes: number;
  phaseBit: 0 | 1;
  waitParity: 0 | 1;
  released: boolean;
  from: "none" | "producer" | "tma";
}

const STATES: readonly State[] = [
  { arrivals: 1, bytes: 0, phaseBit: 0, waitParity: 0, released: false, from: "none" },
  { arrivals: 0, bytes: 32768, phaseBit: 0, waitParity: 0, released: false, from: "producer" },
  { arrivals: 0, bytes: 16384, phaseBit: 0, waitParity: 0, released: false, from: "tma" },
  { arrivals: 0, bytes: 0, phaseBit: 1, waitParity: 0, released: true, from: "tma" },
  { arrivals: 1, bytes: 0, phaseBit: 1, waitParity: 1, released: false, from: "none" },
];

const SCENES = [
  { label: "초기 상태", summary: "남은 도착 1 · 남은 byte 0", note: "Full barrier 는 도착 1번을 기다리도록 초기화돼 있습니다. Consumer 는 try_wait.parity 로 phase 0 이 끝나기를 기다리며 멈춰 있습니다." },
  { label: "expect_tx 도착", summary: "도착 1 → 0, byte +32,768", note: "Producer thread 가 도착하면서 32 KB 가 올 것이라고 적습니다. 도착은 채워졌지만 기다릴 byte 가 생겨 phase 는 아직 그대로입니다." },
  { label: "A 16 KB 완료", summary: "32,768 − 16,384 = 16,384", note: "TMA hardware 가 copy 하나를 끝낼 때마다 옮긴 byte 만큼 complete_tx 로 뺍니다. A·B 중 어느 쪽이 먼저 끝나는지는 그림을 위한 가정입니다." },
  { label: "B 16 KB 완료", summary: "도착 0 · byte 0 → phase 뒤집힘", note: "도착 수와 byte 가 모두 0 이 되는 순간 phase 0 이 끝나고 bit 가 1 로 바뀝니다. phase 0 을 기다리던 consumer 가 풀려 이 stage 를 읽습니다." },
  { label: "다음 바퀴", summary: "이제 parity 1 을 기다림", note: "Ring 이 한 바퀴 돌아 같은 stage 에 오면 barrier 는 다시 도착 1 을 기다립니다. Consumer 가 parity 1 을 들고 오므로 지난 바퀴의 phase 0 완료를 보고 미리 풀리지 않습니다." },
] as const;

const C = { producer: "#0284c7", tma: "#0891b2", barrier: "#4f46e5", consumer: "#d97706", stop: "#dc2626", go: "#059669", base: "#64748b" } as const;

export default function MbarrierPhaseViz() {
  return (
    <SceneShell
      eyebrow="mbarrier 의 두 계수"
      title="Full barrier 는 도착 1과 32 KB 가 모두 0이 될 때 phase 를 뒤집습니다"
      description="가운데가 stage 하나에 붙은 full barrier 입니다. mbarrier 는 shared memory 에 놓인 64 bit 객체로, 남은 도착 수와 아직 오지 않은 byte 수를 셉니다. Phase 는 그 barrier 가 몇 번째 완료를 세는 중인지를 0·1 로 나타냅니다."
      ariaLabel="Full mbarrier 의 도착 수와 transaction byte 가 0 이 되며 phase 가 뒤집히는 과정"
      scenes={SCENES}
      render={(active) => {
        const s = STATES[active];
        const gauge = (s.bytes / FULL_BYTES) * 104;
        return (
          <svg viewBox="0 0 360 214" className="mx-auto h-auto w-full max-w-[480px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <rect x={6} y={14} width={92} height={40} rx={8} fill={s.from === "producer" ? `${C.producer}22` : "none"} stroke={C.producer} strokeWidth={1} />
            <text x={52} y={31} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.producer}>producer</text>
            <text x={52} y={45} textAnchor="middle" fontSize={10} fill="currentColor" opacity={0.8}>thread 하나</text>
            <rect x={6} y={78} width={92} height={40} rx={8} fill={s.from === "tma" ? `${C.tma}22` : "none"} stroke={C.tma} strokeWidth={1} />
            <text x={52} y={95} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.tma}>TMA</text>
            <text x={52} y={109} textAnchor="middle" fontSize={10} fill="currentColor" opacity={0.8}>hardware</text>

            {s.from === "producer" ? (
              <>
                <line x1={98} y1={34} x2={124} y2={50} stroke={C.producer} strokeWidth={1.25} />
                <text x={52} y={68} textAnchor="middle" fontSize={9.5} fill={C.producer}>arrive.expect_tx</text>
              </>
            ) : null}
            {s.from === "tma" ? (
              <>
                <line x1={98} y1={98} x2={124} y2={82} stroke={C.tma} strokeWidth={1.25} />
                <text x={52} y={134} textAnchor="middle" fontSize={9.5} fill={C.tma}>complete_tx</text>
              </>
            ) : null}

            <rect x={126} y={14} width={124} height={118} rx={10} fill={`${C.barrier}0f`} stroke={C.barrier} strokeWidth={1} />
            <text x={188} y={30} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.barrier}>full barrier</text>
            <text x={136} y={52} fontSize={10.5} fill="currentColor">남은 도착</text>
            <text x={240} y={52} textAnchor="end" fontSize={12} fontWeight={700} fill="currentColor">{s.arrivals}</text>
            <text x={136} y={74} fontSize={10.5} fill="currentColor">남은 byte</text>
            <text x={240} y={74} textAnchor="end" fontSize={10.5} fontWeight={700} fill="currentColor">{s.bytes.toLocaleString("en-US")}</text>
            <rect x={136} y={80} width={104} height={8} fill="none" stroke={C.base} strokeWidth={1} />
            <rect x={136} y={80} width={gauge} height={8} fill={`${C.barrier}66`} />
            <text x={136} y={112} fontSize={10.5} fill="currentColor">phase bit</text>
            <text x={240} y={112} textAnchor="end" fontSize={12} fontWeight={700} fill={active === 3 ? C.go : "currentColor"}>{active === 3 ? "0 → 1" : s.phaseBit}</text>

            <line x1={250} y1={60} x2={270} y2={60} stroke={s.released ? C.go : C.base} strokeWidth={s.released ? 1.25 : 1} strokeDasharray={s.released ? undefined : "3 3"} />
            <rect x={272} y={14} width={82} height={92} rx={8} fill={s.released ? `${C.go}1a` : `${C.stop}10`} stroke={s.released ? C.go : C.stop} strokeWidth={1} />
            <text x={313} y={31} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.consumer}>consumer</text>
            <text x={313} y={52} textAnchor="middle" fontSize={10} fill="currentColor">wait</text>
            <text x={313} y={65} textAnchor="middle" fontSize={10} fill="currentColor">parity {s.waitParity}</text>
            <text x={313} y={90} textAnchor="middle" fontSize={10.5} fontWeight={700} fill={s.released ? C.go : C.stop}>{s.released ? "풀림 · 읽기" : "멈춤"}</text>

            <line x1={6} y1={150} x2={354} y2={150} stroke={C.base} strokeWidth={1} opacity={0.4} />
            {[0, 1].map((lap) => {
              const current = (active === 4 ? 1 : 0) === lap;
              return (
                <g key={lap} opacity={current ? 1 : 0.3}>
                  <rect x={6 + lap * 178} y={162} width={170} height={40} rx={8} fill="none" stroke={current ? C.barrier : C.base} strokeWidth={1} />
                  <text x={91 + lap * 178} y={179} textAnchor="middle" fontSize={10.5} fontWeight={700} fill="currentColor">{lap === 0 ? "1번째 바퀴" : "2번째 바퀴"}</text>
                  <text x={91 + lap * 178} y={194} textAnchor="middle" fontSize={10} fill="currentColor">{lap === 0 ? "phase 0 완료를 기다림" : "phase 1 완료를 기다림"}</text>
                </g>
              );
            })}
          </svg>
        );
      }}
    />
  );
}

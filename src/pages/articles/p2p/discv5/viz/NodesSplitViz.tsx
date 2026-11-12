import SceneShell from "./SceneShell";

/**
 * 본문 대응: #findnode — 최악의 ENR 16개 × 300 B = 4800 B > 1280 B.
 * Overhead를 0으로 둔 하한(글의 가정): 한 packet에 300 B record 4개(1200 B, 5개면 1500 B) → 4 packets.
 * 수신: request ID가 R₁인지, expected = min(total, local cap 5), 중복은 한 번만, timeout이면 partial.
 * 도착 순서·끼어든 packet·중복 record·누락 packet은 설명을 위한 가정입니다.
 */
const RECORDS = 16;
const RECORD_B = 300;
const PACKET_B = 1280;
const ALL_B = RECORDS * RECORD_B;
const PER_PACKET = Math.floor(PACKET_B / RECORD_B);
const PACKETS = Math.ceil(ALL_B / PACKET_B);
const LOCAL_CAP = 5;
const CLAIMED_TOTAL = 200;

const SCENES = [
  {
    label: "한 packet에 넣어 보기",
    summary: `${RECORDS} × ${RECORD_B} B = ${ALL_B} B > ${PACKET_B} B`,
    note: "칸 하나가 최대 크기 300 B인 ENR 하나입니다. 16개면 record bytes만 4800 B로, header와 GCM tag를 더하기 전부터 packet 상한 1280 B의 3.75배입니다.",
  },
  {
    label: "packet 여러 개로 나누기",
    summary: `overhead 0 가정 → 최소 ${PACKETS} packets`,
    note: "Overhead를 0으로 둔 이론적 하한에서는 300 B record가 한 packet에 4개(1200 B) 들어가고, 5개(1500 B)는 넘칩니다. 그래서 최소 4 packets이고, 각 NODES에 적는 total(이 응답의 전체 packet 수)은 4입니다. 실제로는 header·RLP·request ID·tag가 더해지고 geth v1.17.8은 record 묶음에 1000-byte budget을 두므로 더 필요할 수 있습니다.",
  },
  {
    label: "섞여서 도착",
    summary: "도착 순서가 아니라 R₁과 total로 묶음",
    note: "UDP는 순서를 지키지 않으므로 3번 packet이 먼저 올 수 있습니다. Alice는 request ID가 R₁인 packet만 모읍니다. 다른 lookup의 packet이나 늦게 온 이전 response(여기서는 R₀, 가정)는 현재 결과에 섞지 않습니다. 도착 순서는 예시입니다(가정).",
  },
  {
    label: "같은 ENR가 또 오면",
    summary: "후보표에는 한 번만",
    note: "같은 ENR가 여러 NODES packet에 반복돼도 이미 본 node ID면 shortlist에 다시 넣지 않습니다. 4번 packet에 16번 대신 6번 record가 다시 실린 것은 가정입니다. 그래서 packet은 4개가 다 왔어도 후보는 15개입니다.",
  },
  {
    label: "일부만 오고 timeout",
    summary: "받은 3 / total 4 → partial",
    note: "2번 packet이 끝내 오지 않으면(가정) Alice는 받은 packet 수가 total에 닿기 전에 timeout을 맞습니다. 일부만 온 partial response라는 사실도 함께 남깁니다.",
  },
  {
    label: "total을 크게 적어 오면",
    summary: `min(${CLAIMED_TOTAL}, ${LOCAL_CAP}) = ${Math.min(CLAIMED_TOTAL, LOCAL_CAP)}`,
    note: "첫 response의 total이 200이어도 그대로 믿고 200개를 기다릴 상태를 만들지 않습니다. 기다릴 수는 local 상한과 비교한 작은 쪽입니다. 상한 5는 geth v1.17.8의 구현 값이며 wire 규격 전체의 고정 상수가 아닙니다.",
  },
] as const;

const INK = "#334155";
const MUTED = "#64748b";
const LINE = "#cbd5e1";
const REC = "#0f766e";
const CAP = "#b45309";
const FAIL = "#dc2626";
const OK = "#16a34a";
const DUP = "#7c3aed";

type Arrival = { packet: number | null; missing?: boolean };
const ARRIVALS: readonly Arrival[] = [{ packet: 3 }, { packet: 1 }, { packet: null }, { packet: 4 }, { packet: 2 }];

const recordsOf = (packet: number, dup: boolean) =>
  Array.from({ length: PER_PACKET }, (_, k) => (dup && packet === 4 && k === PER_PACKET - 1 ? 6 : (packet - 1) * PER_PACKET + k + 1));

export default function NodesSplitViz() {
  return (
    <SceneShell
      eyebrow="NODES 분할과 수신"
      title="최악의 ENR 16개는 한 packet에 들어가지 않아, 나눠 보내고 R₁·total로 다시 묶습니다"
      description="칸 하나가 300 B짜리 ENR 하나입니다. 처음 두 장면의 길이는 byte에 비례합니다. 도착 순서, 끼어든 packet, 중복, 누락은 설명을 위한 가정입니다."
      ariaLabel="ENR 16개를 NODES packet 여러 개로 나누고 순서가 섞인 채 받아 합치는 과정"
      scenes={SCENES}
      render={(active) => {
        if (active === 0) {
          const scale = 340 / ALL_B;
          const capX = 10 + PACKET_B * scale;
          return (
            <svg viewBox="0 0 360 210" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[0].label}: ${SCENES[0].summary}`}>
              {Array.from({ length: RECORDS }, (_, i) => (
                <g key={i}>
                  <rect x={10 + i * RECORD_B * scale} y={70} width={RECORD_B * scale - 2} height={30} rx={2} fill={(i + 1) * RECORD_B > PACKET_B ? "#fee2e2" : "#ccfbf1"} stroke={(i + 1) * RECORD_B > PACKET_B ? FAIL : REC} strokeWidth={1} />
                  <text x={10 + i * RECORD_B * scale + (RECORD_B * scale - 2) / 2} y={89} textAnchor="middle" fontSize={8.5} fill={INK}>{i + 1}</text>
                </g>
              ))}
              <line x1={capX} x2={capX} y1={50} y2={118} stroke={CAP} strokeWidth={1.25} />
              <text x={capX} y={44} textAnchor="middle" fontSize={10} fontWeight={700} fill={CAP}>1280 B 상한</text>
              <text x={350} y={124} textAnchor="end" fontSize={10} fontWeight={700} fill={INK}>{`${ALL_B} B`}</text>
              <text x={180} y={156} textAnchor="middle" fontSize={10.5} fill={INK}>{`${ALL_B} ÷ ${PACKET_B} = ${(ALL_B / PACKET_B).toFixed(2)}배`}</text>
              <text x={180} y={178} textAnchor="middle" fontSize={10} fill={MUTED}>header·GCM tag는 아직 더하지 않음</text>
            </svg>
          );
        }
        if (active === 1) {
          const scale = 236 / PACKET_B;
          return (
            <svg viewBox="0 0 360 210" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[1].label}: ${SCENES[1].summary}`}>
              {Array.from({ length: PACKETS }, (_, p) => {
                const y = 22 + p * 38;
                return (
                  <g key={p}>
                    <text x={10} y={y + 18} fontSize={10} fontWeight={700} fill={INK}>{`packet ${p + 1}`}</text>
                    <rect x={64} y={y} width={PACKET_B * scale} height={26} rx={3} fill="#ffffff" stroke={CAP} strokeWidth={1} />
                    {recordsOf(p + 1, false).map((r, k) => (
                      <g key={r}>
                        <rect x={65 + k * RECORD_B * scale} y={y + 2} width={RECORD_B * scale - 2} height={22} rx={2} fill="#ccfbf1" stroke={REC} strokeWidth={1} />
                        <text x={65 + k * RECORD_B * scale + (RECORD_B * scale - 2) / 2} y={y + 17} textAnchor="middle" fontSize={8.5} fill={INK}>{r}</text>
                      </g>
                    ))}
                    <text x={64 + PACKET_B * scale + 6} y={y + 17} fontSize={9} fill={MUTED}>total 4</text>
                  </g>
                );
              })}
              <text x={180} y={182} textAnchor="middle" fontSize={10} fill={INK}>{`${PER_PACKET} × ${RECORD_B} = ${PER_PACKET * RECORD_B} B ≤ ${PACKET_B} B · 5개면 ${(PER_PACKET + 1) * RECORD_B} B`}</text>
              <text x={180} y={200} textAnchor="middle" fontSize={9.5} fill={MUTED}>overhead 0인 하한 · 실제로는 더 필요할 수 있음</text>
            </svg>
          );
        }
        if (active === 5) {
          return (
            <svg viewBox="0 0 360 210" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[5].label}: ${SCENES[5].summary}`}>
              <text x={10} y={50} fontSize={10} fontWeight={700} fill={INK}>첫 response의 total</text>
              <text x={350} y={50} textAnchor="end" fontSize={12} fontWeight={700} fill={FAIL}>{CLAIMED_TOTAL}</text>
              <text x={10} y={84} fontSize={10} fontWeight={700} fill={INK}>local 상한 (geth v1.17.8)</text>
              <text x={350} y={84} textAnchor="end" fontSize={12} fontWeight={700} fill={CAP}>{LOCAL_CAP}</text>
              <line x1={10} x2={350} y1={100} y2={100} stroke={LINE} strokeWidth={1} />
              <text x={10} y={128} fontSize={10.5} fontWeight={700} fill={OK}>기다릴 packet 수</text>
              <text x={350} y={128} textAnchor="end" fontSize={12} fontFamily="monospace" fontWeight={700} fill={OK}>{`min(${CLAIMED_TOTAL}, ${LOCAL_CAP}) = ${Math.min(CLAIMED_TOTAL, LOCAL_CAP)}`}</text>
              {Array.from({ length: LOCAL_CAP }, (_, i) => (
                <rect key={i} x={10 + i * 30} y={146} width={24} height={20} rx={3} fill="#dcfce7" stroke={OK} strokeWidth={1} />
              ))}
              <text x={164} y={160} fontSize={9.5} fill={MUTED}>이만큼만 상태를 만듦</text>
              <text x={180} y={196} textAnchor="middle" fontSize={9.5} fill={MUTED}>받은 ENR마다 요청 거리는 따로 다시 계산</text>
            </svg>
          );
        }
        const dup = active === 3;
        const lost = active === 4;
        const rows = ARRIVALS.map((a) => (lost && a.packet === 2 ? { ...a, missing: true } : a));
        const received = rows.filter((a) => a.packet !== null && !a.missing).length;
        // 받은 R₁ packet의 record를 node 번호로 모아 중복을 한 번만 셉니다.
        const unique = new Set(
          rows.flatMap((a) => (a.packet !== null && !a.missing ? recordsOf(a.packet, dup) : [])),
        ).size;
        return (
          <svg viewBox="0 0 360 210" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <text x={10} y={14} fontSize={9.5} fontWeight={700} fill={MUTED}>도착 순서 ↓</text>
            {rows.map((a, i) => {
              const y = 22 + i * 30;
              if (a.packet === null) {
                return (
                  <g key={i}>
                    <rect x={10} y={y} width={196} height={24} rx={3} fill="#fee2e2" stroke={FAIL} strokeWidth={1} strokeDasharray="3 2" />
                    <text x={18} y={y + 16} fontSize={9.5} fill={INK}>request ID R₀ · 다른 요청</text>
                    <text x={214} y={y + 16} fontSize={9.5} fontWeight={700} fill={FAIL}>R₁ 아님 → 버림</text>
                  </g>
                );
              }
              if (a.missing) {
                return (
                  <g key={i}>
                    <rect x={10} y={y} width={196} height={24} rx={3} fill="none" stroke={LINE} strokeWidth={1} strokeDasharray="3 3" />
                    <text x={18} y={y + 16} fontSize={9.5} fill={MUTED}>{`packet ${a.packet} · 오지 않음`}</text>
                    <text x={214} y={y + 16} fontSize={9.5} fontWeight={700} fill={CAP}>timeout</text>
                  </g>
                );
              }
              return (
                <g key={i}>
                  <rect x={10} y={y} width={196} height={24} rx={3} fill="#ffffff" stroke={LINE} strokeWidth={1} />
                  <text x={18} y={y + 16} fontSize={9.5} fill={INK}>{`R₁ · #${a.packet}`}</text>
                  {recordsOf(a.packet, dup).map((r, k) => {
                    const isDup = dup && a.packet === 4 && k === PER_PACKET - 1;
                    return (
                      <g key={k}>
                        <rect x={80 + k * 31} y={y + 3} width={27} height={18} rx={2} fill={isDup ? "#ede9fe" : "#ccfbf1"} stroke={isDup ? DUP : REC} strokeWidth={1} />
                        <text x={93.5 + k * 31} y={y + 16} textAnchor="middle" fontSize={8.5} fill={INK}>{r}</text>
                      </g>
                    );
                  })}
                  <text x={214} y={y + 16} fontSize={9.5} fontWeight={700} fill={a.packet === 4 && dup ? DUP : OK}>
                    {a.packet === 4 && dup ? "6은 이미 있음" : "받음"}
                  </text>
                </g>
              );
            })}
            <line x1={10} x2={350} y1={176} y2={176} stroke={LINE} strokeWidth={1} />
            <text x={10} y={196} fontSize={10.5} fontWeight={700} fill={lost ? CAP : INK}>
              {lost
                ? `R₁ packet 받은 수 ${received} / total ${PACKETS} → partial`
                : `R₁ packet 받은 수 ${received} / total ${PACKETS} → 완료`}
            </text>
            <text x={350} y={196} textAnchor="end" fontSize={10.5} fontWeight={700} fill={dup ? DUP : lost ? CAP : INK}>
              {`후보 ENR ${unique}개`}
            </text>
          </svg>
        );
      }}
    />
  );
}

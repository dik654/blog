import SceneShell from "./SceneShell";

/**
 * 본문 대응: #release — timeout은 미완료 offset만 다른 peer에게 다시 맡기고,
 * hash mismatch는 piece 전체 승인을 취소한다.
 * piece 0 = 256 KiB = 16 KiB block 16개. peer 배분(A 1–6, B 7–11, C 12–16)과
 * B의 미완료 block 9–11은 설명용 가정이다. 다시 맡긴 구간 3 × 16 = 48 KiB, hash 실패로 버린 byte 16 × 16 = 256 KiB.
 */
type BlockState = "flight" | "got" | "released" | "discarded" | "verified";

const BLOCK_KIB = 16;
const BLOCKS = 16;
const TIMED_OUT = [9, 10, 11] as const;
const RETRY_KIB = TIMED_OUT.length * BLOCK_KIB;
const PIECE_KIB = BLOCKS * BLOCK_KIB;

function owner(block: number, active: number) {
  if (active >= 2 && (TIMED_OUT as readonly number[]).includes(block)) return "A";
  if (block <= 6) return "A";
  if (block <= 11) return "B";
  return "C";
}

function stateOf(block: number, active: number): BlockState {
  const timedOut = (TIMED_OUT as readonly number[]).includes(block);
  if (active === 0) return "flight";
  if (active === 1) return timedOut ? "released" : "got";
  if (active === 2) return "got";
  if (active === 3) return "discarded";
  return "verified";
}

const STYLE: Record<BlockState, { fill: string; stroke: string; text: string; dash?: string }> = {
  flight: { fill: "#d9770614", stroke: "#d97706", text: "#d97706" },
  got: { fill: "#64748b1f", stroke: "#64748b", text: "currentColor" },
  released: { fill: "none", stroke: "#d97706", text: "#d97706", dash: "3 2" },
  discarded: { fill: "none", stroke: "#dc2626", text: "#dc2626", dash: "3 2" },
  verified: { fill: "#0596691f", stroke: "#059669", text: "#059669" },
};

const LEGEND_X = [12, 68, 156, 252, 333] as const;

const LEGEND: readonly [BlockState, string][] = [
  ["flight", "요청 중"],
  ["got", "받음(미승인)"],
  ["released", "풀어서 다시 맡김"],
  ["discarded", "piece째 버림"],
  ["verified", "승인"],
];

const SCENES = [
  {
    label: "보유를 알린 peer에게 나눠 요청",
    summary: "block 16개 → A·B·C (가정)",
    note: "Bitfield와 HAVE는 상대가 어느 piece를 보유하는지 알리는 메시지입니다. A·B·C가 이 메시지로 piece 0 보유를 알렸고, 내가 받고 싶다는 interested 상태이며 세 peer가 모두 요청을 받아 주는 unchoke 상태라고 가정합니다. scheduler가 비어 있는 offset을 나눠 요청합니다. 광고는 후보 조건일 뿐 byte가 맞다는 증거가 아닙니다.",
  },
  {
    label: "B의 요청 3개가 timeout",
    summary: `다시 맡길 구간 ${TIMED_OUT.length} block = ${RETRY_KIB} KiB`,
    note: "B에게 맡긴 block 9–11이 시간 안에 오지 않았다고 가정합니다. Timeout은 byte가 틀렸다는 뜻이 아니라 전송 실패입니다. 미완료 offset 세 개만 풀고, 이미 받은 다른 block은 그대로 둡니다.",
  },
  {
    label: "풀린 offset을 다른 peer에게",
    summary: "block 9–11 → A (가정)",
    note: "풀린 offset을 다른 peer에게 다시 요청해 16개가 모두 piece buffer에 찼습니다. 아직은 받은 byte일 뿐 승인된 조각이 아닙니다. v1 metainfo에는 block별 hash가 없기 때문입니다.",
  },
  {
    label: "조립한 piece의 hash가 다르면",
    summary: `hash 실패로 버린 byte ${PIECE_KIB} KiB`,
    note: "전체 256 KiB의 SHA-1이 metainfo의 기대 hash와 다르면 piece 0을 보유한 것으로 인정할 수 없습니다. 어느 block이 틀렸는지 hash 하나만으로 알 수 없으므로 16개 전부를 버리고 piece를 다시 구성합니다.",
  },
  {
    label: "다시 구성한 piece의 hash가 같으면",
    summary: "piece 0 완료 · 저장 · HAVE",
    note: "다시 받은 16개를 조립한 SHA-1이 기대 hash와 같으면 그때부터 piece 0을 완료로 표시하고 저장한 뒤 HAVE로 알립니다. 다시 받을 때 어느 peer를 고르는지는 이 그림에서 가정하지 않습니다.",
  },
] as const;

const PEERS = ["A", "B", "C"] as const;
const PEER_X = [12, 142, 272] as const;
const BLOCK_W = 22;
const BLOCK_STEP = 24;

function peerX(index: number) {
  return (PEER_X as readonly number[])[index] ?? 0;
}

export default function PieceRetryViz() {
  return (
    <SceneShell
      eyebrow="재시도 경계"
      title="Timeout은 block 몇 개를 다시 맡기고, hash 불일치는 piece 전체를 버립니다"
      description="칸 하나가 piece 0의 16 KiB block입니다. 칸 아래 글자는 그 block을 맡은 peer입니다. 배분과 실패 위치는 설명용 가정입니다."
      ariaLabel="piece 0의 block 요청, timeout 재요청, hash 불일치와 재구성 과정"
      scenes={SCENES}
      render={(active) => {
        const hashBad = active === 3;
        const hashGood = active === 4;
        const hashColor = hashBad ? "#dc2626" : hashGood ? "#059669" : "#94a3b8";
        return (
          <svg viewBox="0 0 400 262" className="mx-auto block w-full max-w-[22rem]" role="img" aria-label="piece 0 block 장부">
            <text x="12" y="16" fontSize="10" fontWeight="700" fill="currentColor">piece 0 · {PIECE_KIB} KiB · block {BLOCKS}개 × {BLOCK_KIB} KiB</text>
            {PEERS.map((peer, index) => {
              const failed = peer === "B" && active === 1;
              return (
                <g key={peer} opacity={active >= 3 ? 0.4 : 1}>
                  <rect x={peerX(index)} y="26" width="116" height="34" rx="8" fill={failed ? "#d9770614" : "none"} stroke={failed ? "#d97706" : "#94a3b8"} strokeWidth="1" />
                  <text x={peerX(index) + 58} y="40" textAnchor="middle" fontSize="10" fontWeight="700" fill={failed ? "#d97706" : "currentColor"}>peer {peer}</text>
                  <text x={peerX(index) + 58} y="53" textAnchor="middle" fontSize="9" fill="currentColor" opacity="0.7">
                    {failed ? "요청 3개 timeout" : "보유 알림·unchoke"}
                  </text>
                </g>
              );
            })}
            {Array.from({ length: BLOCKS }, (_, index) => {
              const block = index + 1;
              const state = stateOf(block, active);
              const style = STYLE[state];
              const x = 12 + index * BLOCK_STEP;
              return (
                <g key={block}>
                  <rect x={x} y="80" width={BLOCK_W} height="28" rx="4" fill={style.fill} stroke={style.stroke} strokeWidth="1" strokeDasharray={style.dash} />
                  <text x={x + BLOCK_W / 2} y="98" textAnchor="middle" fontSize="9" fontWeight="700" fill={style.text}>{block}</text>
                  <text x={x + BLOCK_W / 2} y="122" textAnchor="middle" fontSize="9" fill="currentColor" opacity={active <= 2 ? 0.75 : 0}>
                    {owner(block, active)}
                  </text>
                </g>
              );
            })}
            {LEGEND.map(([state, label], index) => {
              const style = STYLE[state];
              const x = (LEGEND_X as readonly number[])[index] ?? 0;
              return (
                <g key={state}>
                  <rect x={x} y="136" width="10" height="10" rx="2" fill={style.fill} stroke={style.stroke} strokeWidth="1" strokeDasharray={style.dash} />
                  <text x={x + 14} y="145" fontSize="9" fill="currentColor" opacity="0.8">{label}</text>
                </g>
              );
            })}
            <rect x="12" y="160" width="376" height="40" rx="8" fill={hashBad || hashGood ? `${hashColor}14` : "none"} stroke={hashColor} strokeWidth={hashBad || hashGood ? 1.25 : 1} />
            <text x="200" y="176" textAnchor="middle" fontSize="10" fontWeight="700" fill={hashBad || hashGood ? hashColor : "currentColor"}>
              {hashBad ? "SHA-1(piece 0) ≠ pieces[0] → 승인 취소" : hashGood ? "SHA-1(piece 0) = pieces[0] → 완료 · 저장 · HAVE" : "SHA-1(piece 0) 판정"}
            </text>
            <text x="200" y="191" textAnchor="middle" fontSize="9" fill="currentColor" opacity="0.7">
              {active <= 1 ? "16개가 다 차기 전에는 판정 보류" : active === 2 ? "16개가 찼으므로 이제 판정할 수 있음" : hashBad ? "틀린 block을 특정할 수 없음 → 전부 다시" : "이 시점부터만 읽기·업로드 가능"}
            </text>
            <text x="12" y="224" fontSize="9" fill="currentColor" opacity="0.8">운영 기록으로 남길 값</text>
            <text x="12" y="242" fontSize="10" fontWeight={active >= 1 && active <= 2 ? 700 : 500} fill={active >= 1 ? "#d97706" : "currentColor"} opacity={active >= 1 ? 1 : 0.4}>
              timeout으로 다시 맡긴 구간 {active >= 1 ? `${RETRY_KIB} KiB` : "0 KiB"}
            </text>
            <text x="212" y="242" fontSize="10" fontWeight={active === 3 ? 700 : 500} fill={active >= 3 ? "#dc2626" : "currentColor"} opacity={active >= 3 ? 1 : 0.4}>
              hash-failure bytes {active >= 3 ? `${PIECE_KIB} KiB` : "0 KiB"}
            </text>
          </svg>
        );
      }}
    />
  );
}

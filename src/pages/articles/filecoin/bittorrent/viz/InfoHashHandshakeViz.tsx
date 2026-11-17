import SceneShell from "./SceneShell";

/**
 * 본문 대응: #peer-discovery — info_hash는 info dictionary의 bencode byte 전체를 SHA-1한 20 byte이고,
 * 68-byte handshake 안의 20-byte info_hash 칸으로 같은 swarm인지 확인한다.
 * handshake 칸 폭: protocol string + reserved bits = 68 − 20 − 20 = 28 byte, info_hash 20, peer ID 20.
 */
const TOTAL = 68;
const HASH = 20;
const PEER = 20;
const PREFIX = TOTAL - HASH - PEER;
const BAR_X = 12;
const BAR_W = 376;
const PREFIX_W = (PREFIX / TOTAL) * BAR_W;
const HASH_W = (HASH / TOTAL) * BAR_W;
const PEER_W = (PEER / TOTAL) * BAR_W;

const SCENES = [
  {
    label: "info 안의 항목",
    summary: "이름·길이·piece length·piece hash",
    note: "info dictionary에는 파일 이름·길이·piece length·piece hash 목록 같은 정보가 들어 있습니다. 이 글의 예시라면 piece 세 개의 기대 hash가 이 목록에 있습니다.",
  },
  {
    label: "info 전체를 SHA-1",
    summary: "SHA-1(info) = info_hash 20 byte",
    note: "bencode는 metainfo를 byte로 적는 BitTorrent의 encoding입니다. info_hash는 파일 내용만이 아니라 bencode된 info byte 전체의 SHA-1이고, tracker·DHT는 이 값으로 swarm의 peer를 찾습니다.",
  },
  {
    label: "handshake 68 byte",
    summary: `${PREFIX} + ${HASH} + ${PEER} = ${TOTAL} byte`,
    note: "Tracker·DHT가 준 IP:port에 연결하면 handshake를 읽습니다. protocol string과 reserved bits(합쳐 68 − 20 − 20 = 28 byte) 뒤에 20-byte info_hash와 20-byte peer ID가 옵니다.",
  },
  {
    label: "info_hash가 같으면",
    summary: "같은 swarm → block 요청 단계로",
    note: "같은 torrent를 말하는 연결이므로 block 요청 단계로 갑니다. byte가 맞다는 증거는 아니며, 받은 byte는 나중에 piece hash로 따로 검사합니다.",
  },
  {
    label: "info_hash가 다르면",
    summary: "그 연결에 block을 요청하지 않음",
    note: "info_hash가 다르면 그 연결에 block을 요청하지 않습니다. 옆의 peer ID는 로그인 계정이나 법적 신원이 아니라 protocol 수준의 식별 표식입니다.",
  },
] as const;

const INFO_ROWS = ["파일 이름 · 길이", "piece length 256 KiB"] as const;

export default function InfoHashHandshakeViz() {
  return (
    <SceneShell
      eyebrow="info_hash"
      title="info_hash는 info 전체의 hash이고, handshake에서 swarm을 확인하는 칸입니다"
      description="위는 .torrent 안의 중첩 구조, 가운데는 거기서 나온 20-byte 값, 아래는 연결 직후 오가는 68-byte handshake입니다. handshake 칸 폭은 byte 수에 비례합니다."
      note="piece 세 개와 256 KiB는 이 글의 700 KiB 예시를 그대로 씁니다."
      ariaLabel="info dictionary에서 info_hash를 만들고 handshake에서 비교하는 과정"
      scenes={SCENES}
      render={(active) => {
        const compare = active >= 3;
        const match = active === 3;
        const resultColor = match ? "#059669" : "#dc2626";
        return (
          <svg viewBox="0 0 400 284" className="mx-auto block w-full max-w-[20rem]" role="img" aria-label="info_hash 구조와 handshake">
            <defs>
              <marker id="bt-ih-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
                <path d="M0 0L7 3.5L0 7Z" fill="#4f46e5" />
              </marker>
            </defs>
            <rect x="12" y="10" width="376" height="122" rx="10" fill="none" stroke="#94a3b8" strokeWidth="1" />
            <text x="24" y="27" fontSize="10" fontWeight="700" fill="currentColor">.torrent (metainfo)</text>
            <rect x="24" y="36" width="254" height="88" rx="8" fill={active <= 1 ? "#4f46e514" : "none"} stroke="#4f46e5" strokeWidth={active <= 1 ? 1.25 : 1} />
            <text x="34" y="52" fontSize="10" fontWeight="700" fill="#4f46e5">info dictionary</text>
            {INFO_ROWS.map((row, index) => (
              <text key={row} x="34" y={70 + index * 16} fontSize="10" fill="currentColor">{row}</text>
            ))}
            <text x="34" y="110" fontSize="10" fill="currentColor">pieces:</text>
            {[0, 1, 2].map((piece) => (
              <g key={piece}>
                <rect x={78 + piece * 64} y="99" width="58" height="16" rx="4" fill="#d9770614" stroke="#d97706" strokeWidth="1" />
                <text x={107 + piece * 64} y="111" textAnchor="middle" fontSize="9" fontWeight="700" fill="#d97706">hash {piece}</text>
              </g>
            ))}
            <rect x="290" y="36" width="86" height="88" rx="8" fill="none" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="4 3" />
            <text x="333" y="76" textAnchor="middle" fontSize="9" fill="currentColor" opacity="0.6">info 밖의</text>
            <text x="333" y="89" textAnchor="middle" fontSize="9" fill="currentColor" opacity="0.6">항목</text>

            <g opacity={active >= 1 ? 1 : 0.15}>
              <line x1="151" y1="126" x2="151" y2="150" stroke="#4f46e5" strokeWidth="1.25" markerEnd="url(#bt-ih-arrow)" />
              <text x="160" y="143" fontSize="9" fill="#4f46e5">SHA-1(bencode된 info byte 전체)</text>
              <rect x="91" y="154" width="120" height="24" rx="6" fill="#4f46e51a" stroke="#4f46e5" strokeWidth="1.25" />
              <text x="151" y="170" textAnchor="middle" fontSize="10" fontWeight="700" fill="#4f46e5">info_hash · 20 byte</text>
            </g>

            <g opacity={active >= 2 ? 1 : 0.15}>
              <text x={BAR_X} y="200" fontSize="10" fontWeight="700" fill="currentColor">상대가 보낸 handshake · {TOTAL} byte</text>
              <rect x={BAR_X} y="208" width={PREFIX_W} height="30" fill="#94a3b81f" stroke="#94a3b8" strokeWidth="1" />
              <text x={BAR_X + PREFIX_W / 2} y="221" textAnchor="middle" fontSize="9" fill="currentColor">protocol string</text>
              <text x={BAR_X + PREFIX_W / 2} y="233" textAnchor="middle" fontSize="9" fill="currentColor">+ reserved bits · {PREFIX} B</text>
              <rect
                x={BAR_X + PREFIX_W}
                y="208"
                width={HASH_W}
                height="30"
                fill={compare ? `${resultColor}1f` : "#4f46e51a"}
                stroke={compare ? resultColor : "#4f46e5"}
                strokeWidth="1.25"
              />
              <text x={BAR_X + PREFIX_W + HASH_W / 2} y="227" textAnchor="middle" fontSize="9" fontWeight="700" fill={compare ? resultColor : "#4f46e5"}>
                info_hash · {HASH} B
              </text>
              <rect x={BAR_X + PREFIX_W + HASH_W} y="208" width={PEER_W} height="30" fill="#94a3b81f" stroke="#94a3b8" strokeWidth="1" />
              <text x={BAR_X + PREFIX_W + HASH_W + PEER_W / 2} y="221" textAnchor="middle" fontSize="9" fill="currentColor">peer ID · {PEER} B</text>
              <text x={BAR_X + PREFIX_W + HASH_W + PEER_W / 2} y="233" textAnchor="middle" fontSize="9" fill="currentColor" opacity="0.65">식별 표식 · 신원 아님</text>
            </g>

            <g opacity={compare ? 1 : 0}>
              <line x1="211" y1="166" x2={BAR_X + PREFIX_W + HASH_W / 2} y2="206" stroke={resultColor} strokeWidth="1" strokeDasharray="3 3" />
              <text x="232" y="170" fontSize="10" fontWeight="700" fill={resultColor}>{match ? "내 값과 같음" : "내 값과 다름"}</text>
              <rect x={BAR_X} y="250" width={BAR_W} height="26" rx="6" fill={`${resultColor}14`} stroke={resultColor} strokeWidth="1" />
              <text x="200" y="267" textAnchor="middle" fontSize="10" fontWeight="700" fill={resultColor}>
                {match ? "같은 swarm → block 요청 단계로 (byte 검증은 piece hash가 따로)" : "다른 torrent → 이 연결에는 block을 요청하지 않음"}
              </text>
            </g>
          </svg>
        );
      }}
    />
  );
}

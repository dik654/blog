import SceneShell from "./SceneShell";

/**
 * 본문 대응: #wire — packet = masking-iv || masked-header || message.
 * Header는 목적지 node ID 앞 16 byte를 key로 한 AES-CTR로 가립니다(위장).
 * Body는 방향별 16-byte key·12-byte nonce의 AES-128-GCM, IV와 unmasked header는 AAD.
 * WHOAREYOU는 body가 없고, packet 전체는 63~1280 byte입니다.
 * 구역 폭은 byte 크기에 비례하지 않습니다.
 */
const SCENES = [
  {
    label: "packet의 세 구역",
    summary: "iv ‖ header ‖ message",
    note: "Discv5 packet은 masking-iv, masked-header, message 순서로 이어 붙인 bytes입니다. Header 안에는 고정 static-header와 packet 종류마다 다른 authdata가 들어 있습니다. 그림의 칸 폭은 실제 byte 크기와 비례하지 않습니다.",
  },
  {
    label: "header 가리기",
    summary: "key = 목적지 node ID 앞 16B",
    note: "Header는 목적지 node ID의 앞 16 byte를 key로 삼은 AES-CTR로 가립니다. 목적지 node ID를 아는 누구나 같은 key를 계산해 header를 풀 수 있습니다. 규격도 이것을 firewall에서 정적 fingerprint를 덜 드러내기 위한 masking이라고 부르며, 기밀성이나 송신자 인증으로 세면 안 됩니다.",
  },
  {
    label: "body 암호화",
    summary: "AES-128-GCM · 16B key · 12B nonce",
    note: "실제 message body는 방향별 16-byte session key와 12-byte nonce로 AES-128-GCM 암호화합니다. Masking IV와 unmasked header는 AAD(additional authenticated data)입니다. 암호화되지는 않아 보이지만, GCM tag 계산에 함께 들어갑니다.",
  },
  {
    label: "header가 바뀌면",
    summary: "AAD 변경 → tag 검증 실패",
    note: "전송 중에 header가 바뀌면 수신자가 다시 계산한 tag가 붙어 온 tag와 맞지 않아 tag 검증이 실패합니다. 그래서 header는 보이지만 바뀌면 드러나는 영역입니다. 이 보호는 header masking이 아니라 body의 AES-GCM이 맡습니다.",
  },
  {
    label: "WHOAREYOU",
    summary: "message body 없음",
    note: "WHOAREYOU는 예외로 message body가 없습니다. 암호화된 body를 갖는 것은 ordinary packet과 handshake packet뿐입니다.",
  },
  {
    label: "크기 경계",
    summary: "63 B ≤ packet ≤ 1280 B",
    note: "Packet 전체는 63 byte 이상 1280 byte 이하여야 합니다. 1280은 payload만의 몫이 아니라 masking IV, header, authdata, GCM tag까지 합친 상한입니다. Message의 첫 RLP 항목인 request ID는 최대 8 byte이고 response가 그대로 되돌려줘야 합니다.",
  },
] as const;

const INK = "#334155";
const MUTED = "#64748b";
const LINE = "#94a3b8";
const MASK = "#b45309";
const AAD = "#2563eb";
const BODY = "#7c3aed";
const FAIL = "#dc2626";

const Y = 46;
const H = 36;
const SEG = {
  iv: { x: 10, w: 62 },
  sh: { x: 72, w: 72 },
  ad: { x: 144, w: 72 },
  msg: { x: 216, w: 104 },
  tag: { x: 320, w: 30 },
};

export default function PacketLayoutViz() {
  return (
    <SceneShell
      eyebrow="packet 구조"
      title="Header는 누구나 풀 수 있게 가려 두고, body만 session key로 잠급니다"
      description="한 줄이 UDP packet 하나입니다. 칸 폭은 byte 크기에 비례하지 않습니다. 색은 각 구역을 무엇이 다루는지를 나타냅니다."
      ariaLabel="Discv5 packet의 masking-iv, masked-header, message 구역과 각 구역의 보호 방식"
      scenes={SCENES}
      render={(active) => {
        const masked = active === 1;
        const aad = active === 2 || active === 3;
        const encrypted = active === 2 || active === 3;
        const noBody = active === 4;
        const headerStroke = masked ? MASK : aad ? AAD : LINE;
        const headerFill = masked ? "#fef3c7" : aad ? "#dbeafe" : "#f8fafc";
        const ivFill = aad ? "#dbeafe" : "#f8fafc";
        const ivStroke = aad ? AAD : LINE;
        return (
          <svg viewBox="0 0 360 200" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {/* 위쪽 구역 이름 */}
            <text x={SEG.iv.x + SEG.iv.w / 2} y={Y - 22} textAnchor="middle" fontSize={10} fontWeight={700} fill={INK}>masking-iv</text>
            <text x={SEG.sh.x + SEG.sh.w} y={Y - 22} textAnchor="middle" fontSize={10} fontWeight={700} fill={INK}>masked-header</text>
            <text x={SEG.msg.x + (SEG.msg.w + SEG.tag.w) / 2} y={Y - 22} textAnchor="middle" fontSize={10} fontWeight={700} fill={INK}>message</text>
            <line x1={SEG.sh.x + 2} x2={SEG.ad.x + SEG.ad.w - 2} y1={Y - 12} y2={Y - 12} stroke={LINE} strokeWidth={1} />
            <line x1={SEG.msg.x + 2} x2={SEG.tag.x + SEG.tag.w - 2} y1={Y - 12} y2={Y - 12} stroke={LINE} strokeWidth={1} />

            {/* 구역 */}
            <rect x={SEG.iv.x} y={Y} width={SEG.iv.w} height={H} fill={ivFill} stroke={ivStroke} strokeWidth={1} />
            <text x={SEG.iv.x + SEG.iv.w / 2} y={Y + 22} textAnchor="middle" fontSize={10} fill={INK}>IV</text>
            <rect x={SEG.sh.x} y={Y} width={SEG.sh.w} height={H} fill={headerFill} stroke={headerStroke} strokeWidth={1} />
            <text x={SEG.sh.x + SEG.sh.w / 2} y={Y + 22} textAnchor="middle" fontSize={10} fill={INK}>static-header</text>
            <rect x={SEG.ad.x} y={Y} width={SEG.ad.w} height={H} fill={headerFill} stroke={headerStroke} strokeWidth={1} />
            <text x={SEG.ad.x + SEG.ad.w / 2} y={Y + 22} textAnchor="middle" fontSize={10} fill={INK}>authdata</text>
            {noBody ? (
              <>
                <rect x={SEG.msg.x} y={Y} width={SEG.msg.w + SEG.tag.w} height={H} fill="none" stroke={LINE} strokeWidth={1} strokeDasharray="3 3" />
                <text x={SEG.msg.x + (SEG.msg.w + SEG.tag.w) / 2} y={Y + 22} textAnchor="middle" fontSize={10} fill={MUTED}>body 없음</text>
              </>
            ) : (
              <>
                <rect x={SEG.msg.x} y={Y} width={SEG.msg.w} height={H} fill={encrypted ? "#ede9fe" : "#f8fafc"} stroke={encrypted ? BODY : LINE} strokeWidth={1} />
                <text x={SEG.msg.x + SEG.msg.w / 2} y={Y + 22} textAnchor="middle" fontSize={10} fill={INK}>{encrypted ? "암호문" : "body"}</text>
                <rect x={SEG.tag.x} y={Y} width={SEG.tag.w} height={H} fill={encrypted ? "#ede9fe" : "#f8fafc"} stroke={encrypted ? BODY : LINE} strokeWidth={1} />
                <text x={SEG.tag.x + SEG.tag.w / 2} y={Y + 22} textAnchor="middle" fontSize={9} fill={INK}>tag</text>
              </>
            )}

            {/* 아래 장면별 설명 */}
            {active === 0 && (
              <g>
                <text x={180} y={112} textAnchor="middle" fontSize={10.5} fill={INK}>header = static-header + authdata</text>
                <text x={180} y={132} textAnchor="middle" fontSize={10} fill={MUTED}>authdata는 packet 종류마다 내용이 다릅니다</text>
                <text x={180} y={168} textAnchor="middle" fontSize={10} fill={MUTED}>칸 폭은 byte 크기와 비례하지 않습니다</text>
              </g>
            )}
            {active === 1 && (
              <g>
                <rect x={52} y={108} width={256} height={30} rx={8} fill="#ffffff" stroke={MASK} strokeWidth={1} />
                <text x={180} y={127} textAnchor="middle" fontSize={10.5} fontWeight={700} fill={MASK}>key = 목적지 node ID의 앞 16 byte</text>
                {/* masking은 static-header와 authdata 둘 다에 걸리므로 두 칸의 경계(header 가운데)를 가리킵니다. */}
                <line x1={SEG.ad.x} y1={108} x2={SEG.ad.x} y2={Y + H + 3} stroke={MASK} strokeWidth={1} />
                <path d={`M${SEG.ad.x - 5} ${Y + H + 9} L${SEG.ad.x} ${Y + H + 2} L${SEG.ad.x + 5} ${Y + H + 9}`} fill="none" stroke={MASK} strokeWidth={1} />
                <text x={SEG.ad.x + 6} y={98} fontSize={9.5} fill={MASK}>AES-CTR · header 전체</text>
                <text x={180} y={162} textAnchor="middle" fontSize={10} fill={INK}>목적지 node ID를 아는 누구나 같은 key → header를 풂</text>
                <text x={180} y={182} textAnchor="middle" fontSize={10} fontWeight={700} fill={MASK}>위장(masking) · 기밀성·송신자 인증 아님</text>
              </g>
            )}
            {(active === 2 || active === 3) && (
              <g>
                <line x1={SEG.iv.x} x2={SEG.ad.x + SEG.ad.w} y1={Y + H + 10} y2={Y + H + 10} stroke={AAD} strokeWidth={1} />
                <text x={(SEG.iv.x + SEG.ad.x + SEG.ad.w) / 2} y={Y + H + 26} textAnchor="middle" fontSize={10} fontWeight={700} fill={AAD}>AAD · 보이지만 tag 계산에 들어감</text>
                <line x1={SEG.msg.x} x2={SEG.tag.x + SEG.tag.w} y1={Y + H + 10} y2={Y + H + 10} stroke={BODY} strokeWidth={1} />
                <text x={SEG.msg.x + (SEG.msg.w + SEG.tag.w) / 2} y={Y + H + 26} textAnchor="middle" fontSize={10} fontWeight={700} fill={BODY}>AES-128-GCM</text>
                {active === 2 ? (
                  <>
                    <text x={180} y={150} textAnchor="middle" fontSize={10} fill={INK}>방향별 session key 16 B + nonce 12 B</text>
                    <text x={180} y={170} textAnchor="middle" fontSize={10} fill={MUTED}>tag 16 B가 붙어 암호문은 plaintext보다 16 B 김</text>
                  </>
                ) : (
                  <>
                    <rect x={SEG.ad.x + 1.5} y={Y + 1.5} width={SEG.ad.w - 3} height={H - 3} fill="none" stroke={FAIL} strokeWidth={1.25} strokeDasharray="3 2" />
                    <text x={SEG.ad.x + SEG.ad.w / 2} y={Y - 3} textAnchor="middle" fontSize={9} fontWeight={700} fill={FAIL}>바뀜</text>
                    <text x={180} y={150} textAnchor="middle" fontSize={10} fill={INK}>수신자가 다시 계산한 tag ≠ 붙어 온 tag</text>
                    <text x={180} y={172} textAnchor="middle" fontSize={10.5} fontWeight={700} fill={FAIL}>GCM tag 검증 실패</text>
                  </>
                )}
              </g>
            )}
            {active === 4 && (
              <g>
                <text x={180} y={116} textAnchor="middle" fontSize={10.5} fill={INK}>WHOAREYOU: IV와 header만 있음</text>
                <text x={180} y={138} textAnchor="middle" fontSize={10} fill={MUTED}>암호화된 body는 ordinary·handshake packet만 가짐</text>
              </g>
            )}
            {active === 5 && (
              <g>
                <line x1={20} x2={340} y1={140} y2={140} stroke={LINE} strokeWidth={1} />
                <rect x={36} y={132} width={290} height={16} fill="#dcfce7" stroke="#16a34a" strokeWidth={1} />
                <line x1={36} x2={36} y1={126} y2={154} stroke={INK} strokeWidth={1} />
                <line x1={326} x2={326} y1={126} y2={154} stroke={INK} strokeWidth={1} />
                <text x={36} y={170} textAnchor="middle" fontSize={10} fontWeight={700} fill={INK}>63 B</text>
                <text x={326} y={170} textAnchor="middle" fontSize={10} fontWeight={700} fill={INK}>1280 B</text>
                <text x={181} y={144} textAnchor="middle" fontSize={9.5} fill="#166534">packet 전체 길이가 들어가야 할 범위</text>
                <text x={180} y={112} textAnchor="middle" fontSize={10} fill={INK}>IV + header(authdata 포함) + 암호문 + tag 합계</text>
                <text x={180} y={190} textAnchor="middle" fontSize={9.5} fill={MUTED}>눈금은 개략입니다</text>
              </g>
            )}
          </svg>
        );
      }}
    />
  );
}

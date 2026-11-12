import SceneShell from "./SceneShell";

/**
 * 본문 대응: #finish-verify — transport frame = 2-byte big-endian length + ciphertext.
 * u16 상한 65,535(ciphertext wire 상한), rust-libp2p v0.57.1의 cleartext 상한 64,511 = 65,535 − 1,024.
 * (가정) 100,000 bytes write → 64,511 + 35,489 두 frame.
 */
const WIRE_MAX = 2 ** 16 - 1; // 65,535
const EXTRA = 1024;
const FRAME_MAX = WIRE_MAX - EXTRA; // 64,511
const WRITE = 100000; // (가정)
const REST = WRITE - FRAME_MAX; // 35,489
const fmt = (n: number) => n.toLocaleString("en-US");

const SCENES = [
  { label: "frame 하나의 모양", summary: "2 bytes 길이 + ciphertext", note: "transport 단계의 message 하나는 앞 2 bytes에 뒤따르는 ciphertext 길이를 big-endian(큰 자리 byte 먼저)으로 적고, 그 뒤에 ciphertext를 붙입니다. 받는 쪽은 2 bytes를 먼저 읽어 몇 bytes를 더 읽을지 압니다." },
  { label: "2 bytes가 셀 수 있는 최대", summary: `2^16 − 1 = ${fmt(WIRE_MAX)}`, note: `2 bytes는 16 bit라 부호 없는 정수로 0부터 ${fmt(WIRE_MAX)}까지 적을 수 있습니다. 그래서 ciphertext 한 덩어리의 wire 상한이 ${fmt(WIRE_MAX)} bytes입니다.` },
  { label: "cleartext 상한은 더 작음", summary: `${fmt(WIRE_MAX)} − ${fmt(EXTRA)} = ${fmt(FRAME_MAX)}`, note: `rust-libp2p v0.57.1은 암호화 결과가 늘어날 몫으로 ${fmt(EXTRA)} bytes를 남겨 두고 한 frame의 cleartext를 ${fmt(FRAME_MAX)} bytes로 묶습니다. 이 여유는 이 source revision의 구현 선택이며 Noise spec의 보편 상수가 아닙니다.` },
  { label: "큰 write는 나뉨", summary: `${fmt(WRITE)} → ${fmt(FRAME_MAX)} + ${fmt(REST)}`, note: `(가정) application이 ${fmt(WRITE)} bytes를 한 번에 쓰면 첫 frame에 ${fmt(FRAME_MAX)} bytes가 들어가고 남은 ${fmt(REST)} bytes는 다음 frame으로 갑니다. 각 frame은 다시 2 bytes 길이를 앞에 붙입니다.` },
  { label: "검사에 걸리면", summary: "plaintext 없이 연결 종료", note: "길이가 상한을 넘거나, AEAD tag(암호문이 바뀌지 않았는지 확인하는 인증값) 검증에 실패하거나, 읽는 중에 예상하지 못한 EOF가 오면 fail-closed로 connection을 끝내고 plaintext를 상위로 넘기지 않습니다. 길이가 맞아도 tag가 틀리면 마찬가지입니다." },
] as const;

const X0 = 16;
const W = 328;
const LEN_W = 34;
const BODY = W - LEN_W;
const px = (bytes: number) => (bytes / WIRE_MAX) * BODY;

function Frame({ y, bytes, label, faded, bad }: { y: number; bytes: number; label: string; faded?: boolean; bad?: boolean }) {
  const bodyW = px(bytes);
  const body = bad ? "#b91c1c" : faded ? "#94a3b8" : "#2563eb";
  return (
    <g>
      <rect x={X0} y={y} width={LEN_W} height={26} rx={3} fill="#f59e0b" />
      <text x={X0 + LEN_W / 2} y={y + 17} fontSize={11} fontWeight={700} textAnchor="middle" fill="#ffffff">len</text>
      <rect x={X0 + LEN_W + 2} y={y} width={Math.max(bodyW - 2, 4)} height={26} rx={3} fill={body} fillOpacity={0.85} />
      <text x={X0 + LEN_W + 10} y={y + 17} fontSize={11.5} fontWeight={700} fill="#ffffff">{label}</text>
    </g>
  );
}

export default function FrameSplitViz() {
  return (
    <SceneShell
      eyebrow="transport framing"
      title="2-byte 길이가 frame 크기를 묶고, 큰 write는 여러 frame으로 나뉩니다"
      description="주황 칸이 2-byte 길이, 파란 막대가 ciphertext입니다. 막대 길이는 65,535 bytes를 전체 폭으로 둔 비율입니다(길이 칸만 읽기 쉽게 키웠습니다)."
      ariaLabel="Noise transport frame의 길이 prefix와 65,535, 64,511 상한, 큰 write의 분할"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 360 156" className="h-auto w-full" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {active <= 1 ? (
            <g>
              <Frame y={30} bytes={WIRE_MAX} label={active === 0 ? "ciphertext" : `ciphertext ≤ ${fmt(WIRE_MAX)}`} />
              <text x={X0} y={20} fontSize={11.5} fontWeight={700} fill="#b45309">2 bytes</text>
              <text x={X0 + LEN_W + 4} y={20} fontSize={11.5} fill="#64748b">길이 칸이 적은 수만큼 이어짐</text>
              {active === 1 ? (
                <g>
                  {Array.from({ length: 16 }, (_, i) => (
                    <rect key={i} x={X0 + i * 18} y={78} width={15} height={18} rx={2} fill="#fef3c7" stroke="#f59e0b" />
                  ))}
                  {Array.from({ length: 16 }, (_, i) => (
                    <text key={`t${i}`} x={X0 + i * 18 + 7.5} y={91} fontSize={11} textAnchor="middle" fill="#92400e">1</text>
                  ))}
                  <text x={X0} y={116} fontSize={11.5} fill="#64748b">16 bit가 모두 1이면</text>
                  <text x={X0} y={132} fontSize={12.5} fontWeight={700} fill="#2563eb">{`2^16 − 1 = ${fmt(WIRE_MAX)} bytes`}</text>
                </g>
              ) : (
                <text x={X0} y={84} fontSize={11.5} fill="#64748b">길이 칸 = 뒤 ciphertext의 bytes 수 (big-endian)</text>
              )}
            </g>
          ) : null}
          {active === 2 ? (
            <g>
              <text x={X0} y={20} fontSize={11.5} fontWeight={700} fill="#64748b">{`wire 상한 ${fmt(WIRE_MAX)}`}</text>
              <Frame y={28} bytes={WIRE_MAX} label="ciphertext" faded />
              <text x={X0} y={78} fontSize={11.5} fontWeight={700} fill="#2563eb">{`cleartext 상한 ${fmt(FRAME_MAX)}`}</text>
              <rect x={X0 + LEN_W + 2} y={86} width={px(FRAME_MAX) - 2} height={26} rx={3} fill="#2563eb" fillOpacity={0.85} />
              <rect x={X0 + LEN_W + px(FRAME_MAX) + 1} y={86} width={Math.max(px(EXTRA) - 1, 4)} height={26} rx={1} fill="#dc2626" />
              <text x={X0 + W} y={128} fontSize={11.5} fontWeight={700} textAnchor="end" fill="#dc2626">{`여유 ${fmt(EXTRA)} (구현 선택)`}</text>
            </g>
          ) : null}
          {active === 3 ? (
            <g>
              <text x={X0} y={20} fontSize={11.5} fontWeight={700} fill="#64748b">{`(가정) write ${fmt(WRITE)} bytes`}</text>
              <Frame y={28} bytes={FRAME_MAX} label={`frame 1 · ${fmt(FRAME_MAX)}`} />
              <Frame y={66} bytes={REST} label={`frame 2 · ${fmt(REST)}`} />
              <text x={X0} y={120} fontSize={11.5} fill="#64748b">{`${fmt(FRAME_MAX)} + ${fmt(REST)} = ${fmt(WRITE)}`}</text>
              <text x={X0} y={138} fontSize={11} fill="#64748b">막대는 cleartext 양 · ciphertext는 암호화 몫만큼 더 김</text>
            </g>
          ) : null}
          {active === 4 ? (
            <g>
              {[
                { y: 18, text: "길이 > 상한", sub: "oversized frame" },
                { y: 58, text: "AEAD tag 실패", sub: "길이가 맞아도" },
                { y: 98, text: "중간에 EOF", sub: "truncated · unexpected EOF" },
              ].map((r) => (
                <g key={r.text}>
                  <rect x={X0} y={r.y} width={172} height={30} rx={6} fill="none" stroke="#b91c1c" />
                  <text x={X0 + 10} y={r.y + 13} fontSize={11.5} fontWeight={700} fill="#b91c1c">{r.text}</text>
                  <text x={X0 + 10} y={r.y + 25} fontSize={10.5} fill="#64748b">{r.sub}</text>
                  <line x1={X0 + 174} y1={r.y + 15} x2={228} y2={73} stroke="#b91c1c" />
                </g>
              ))}
              <rect x={230} y={52} width={118} height={42} rx={6} fill="#b91c1c" fillOpacity={0.1} stroke="#b91c1c" />
              <text x={289} y={70} fontSize={11.5} fontWeight={700} textAnchor="middle" fill="#b91c1c">connection 종료</text>
              <text x={289} y={86} fontSize={10.5} textAnchor="middle" fill="#64748b">plaintext 전달 없음</text>
            </g>
          ) : null}
        </svg>
      )}
    />
  );
}

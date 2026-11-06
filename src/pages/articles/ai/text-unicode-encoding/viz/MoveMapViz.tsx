import SceneShell, { type ShellScene } from "./SceneShell";
import { NFC_ITEMS, RAW_ITEMS } from "./textCellData";

/**
 * 본문 대응: #case-move — 원문과 합친 글의 위치 대응.
 * 번호: 0→0, [1,3)→1, 3→2, 4→3. 옛 번호 3은 😀, 옛 파일 범위 [4,7)은 B0 80 F0.
 */
const SCENES: readonly ShellScene[] = [
  { label: "가의 이동", summary: "번호 3 → 2", note: "가의 내용은 그대로이고 앞의 항목이 줄어 위치만 당겨집니다. 파일 칸에서는 시작이 4에서 3으로 바뀝니다." },
  { label: "둘이 하나로", summary: "원문 두 항목 → 새 글 한 항목", note: "원문의 두 항목이 새 글의 한 항목에 대응합니다. 모두 한 칸씩 옮기는 규칙으로 일반화할 수 없습니다." },
  { label: "옛 번호 재사용", summary: "3번 → 😀", note: "원문의 번호 3을 새 글에 그대로 쓰면 웃는 그림을 고릅니다." },
  { label: "옛 파일 범위 재사용", summary: "4부터 세 칸 → B0 80 F0", note: "4부터 세 칸을 고르면 가의 중간에서 시작해 웃는 그림의 첫 칸까지 읽습니다. 번호 쪽과는 다른 실패입니다." },
];

const BLUE = "#2563eb";
const RED = "#dc2626";
const SLATE = "#94a3b8";
const ROW_A = 28;
const ROW_B = 118;
const H = 38;

function Box({ x, y, w, text, tone, size = 15 }: { x: number; y: number; w: number; text: string; tone: "none" | "blue" | "red"; size?: number }) {
  const color = tone === "blue" ? BLUE : tone === "red" ? RED : SLATE;
  return (
    <g>
      <rect x={x} y={y} width={w} height={H} rx={3} fill={color} fillOpacity={tone === "none" ? 0.08 : 0.2} stroke={color} strokeWidth={1} />
      <text x={x + w / 2} y={y + H / 2 + 5} textAnchor="middle" fontSize={size} fontWeight={tone === "none" ? 400 : 700} fill="currentColor">
        {text}
      </text>
    </g>
  );
}

const NUM_W = 52;
const NUM_P = 62;
const NUM_X = 20;
const numX = (index: number) => NUM_X + index * NUM_P;
const BYTE_W = 27;
const BYTE_P = 29.5;
const BYTE_X = 8;
const byteX = (index: number) => BYTE_X + index * BYTE_P;

/** 원문 번호 → 새 글 번호 */
const LINKS: readonly (readonly [number, number])[] = [
  [0, 0],
  [1, 1],
  [2, 1],
  [3, 2],
  [4, 3],
];

const RAW_BYTES = RAW_ITEMS.flatMap((item) => item.bytes);
const NFC_BYTES = NFC_ITEMS.flatMap((item) => item.bytes);

function NumberMap({ active }: { active: number }) {
  const rawTone = (index: number) => (active === 0 && index === 3 ? "blue" : active === 1 && (index === 1 || index === 2) ? "blue" : active === 2 && index === 3 ? "red" : "none");
  const nfcTone = (index: number) => (active === 0 && index === 2 ? "blue" : active === 1 && index === 1 ? "blue" : active === 2 && index === 3 ? "red" : "none");
  return (
    <>
      {active !== 2 &&
        LINKS.map(([from, to]) => {
          const hot = active === 0 ? from === 3 : from === 1 || from === 2;
          return <line key={from} x1={numX(from) + NUM_W / 2} y1={ROW_A + H} x2={numX(to) + NUM_W / 2} y2={ROW_B} stroke={hot ? BLUE : SLATE} strokeWidth={hot ? 1.25 : 1} strokeOpacity={hot ? 1 : 0.6} />;
        })}
      {active === 2 && <line x1={numX(3) + NUM_W / 2} y1={ROW_A + H} x2={numX(3) + NUM_W / 2} y2={ROW_B} stroke={RED} strokeWidth={1.25} strokeDasharray="4 3" />}
      {RAW_ITEMS.map((item, index) => (
        <Box key={index} x={numX(index)} y={ROW_A} w={NUM_W} text={`${index}: ${item.glyph.startsWith("◌") ? "´" : item.glyph}`} tone={rawTone(index)} />
      ))}
      {NFC_ITEMS.map((item, index) => (
        <Box key={index} x={numX(index)} y={ROW_B} w={NUM_W} text={`${index}: ${item.glyph}`} tone={nfcTone(index)} />
      ))}
    </>
  );
}

function ByteMap() {
  return (
    <>
      {[4, 5, 6].map((index) => (
        <line key={index} x1={byteX(index) + BYTE_W / 2} y1={ROW_A + H} x2={byteX(index) + BYTE_W / 2} y2={ROW_B} stroke={RED} strokeWidth={1.25} strokeDasharray="4 3" />
      ))}
      {RAW_BYTES.map((hex, index) => (
        <Box key={index} x={byteX(index)} y={ROW_A} w={BYTE_W} text={hex} size={12} tone={index >= 4 && index < 7 ? "blue" : "none"} />
      ))}
      {NFC_BYTES.map((hex, index) => (
        <Box key={index} x={byteX(index)} y={ROW_B} w={BYTE_W} text={hex} size={12} tone={index >= 4 && index < 7 ? "red" : "none"} />
      ))}
    </>
  );
}

export default function MoveMapViz() {
  return (
    <SceneShell
      eyebrow="위치 대응"
      title="앞의 두 항목이 합쳐지면 뒤의 가는 다른 숫자로 옮겨 갑니다"
      description="위 줄이 원문, 아래 줄이 e와 악센트를 합친 비교용 글입니다. 마지막 장면만 파일 칸의 저장 값을 그렸습니다."
      note="빨간 점선은 원문의 숫자를 새 글에 그대로 적용한 잘못된 재사용입니다. ´는 악센트 표시입니다."
      ariaLabel="원문과 비교용 글의 위치 대응과 옛 범위를 재사용했을 때의 실패"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 340 184" className="mx-auto block w-full max-w-[520px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          <text x="332" y="18" textAnchor="end" fontSize="12" fill="currentColor">원문</text>
          <text x="332" y="108" textAnchor="end" fontSize="12" fill="currentColor">비교용 글</text>
          {active === 3 ? <ByteMap /> : <NumberMap active={active} />}
          <text x="170" y="176" textAnchor="middle" fontSize="13" fontWeight="700" fill="currentColor">
            {["가: 3번 → 2번", "e + 악센트 → é", "옛 3번을 새 글에 쓰면 😀", "새 글의 4, 5, 6번 칸 = B0 80 F0"][active]}
          </text>
        </svg>
      )}
    />
  );
}

import SceneShell from "./AlloySceneShell";

/**
 * 본문 대응: #rlp-decoding — decode는 slice를 앞으로 옮기며 객체 하나를 읽고, decode_exact는 남은 바이트가 0인지 확인한다.
 * 입력: d6 | 94 | 보내는 주소 20바이트 | 01 (23바이트), 그리고 뒤에 0x00 한 바이트가 붙은 24바이트 입력.
 * 0xd6 − 0xc0 = 22 → payload 22바이트, 머리 1바이트를 더해 객체는 바이트 0~22.
 */
const W = 360;
const H = 176;
const TOP = 58;
const CELL_H = 30;

type Cell = { key: string; text: string; w: number; role: string };
const CELLS: readonly Cell[] = [
  { key: "h", text: "d6", w: 32, role: "목록" },
  { key: "a", text: "94", w: 32, role: "길이" },
  { key: "addr", text: "b20a…e1d0 · 20바이트", w: 140, role: "주소" },
  { key: "n", text: "01", w: 32, role: "nonce" },
  { key: "x", text: "00", w: 32, role: "덧붙음" },
];
const GAP = 4;
const LEFT = (W - (CELLS.reduce<number>((sum, cell) => sum + cell.w, 0) + GAP * (CELLS.length - 1))) / 2;
const STARTS: readonly number[] = CELLS.map((_, i) => LEFT + CELLS.slice(0, i).reduce<number>((sum, cell) => sum + cell.w + GAP, 0));
const END = (i: number) => STARTS[i] + CELLS[i].w;

const TEXT = "#475569";
const MUTED = "#94a3b8";
const ACCENT = "#2563eb";
const BAD = "#dc2626";
const OK = "#16a34a";

const SCENES = [
  { label: "머리부터 읽기", summary: "d6 → 목록 · payload 22바이트", trailing: false, cursor: 1, read: 1, verdict: "남은 22바이트 ≥ 선언 22바이트 → 계속", color: ACCENT, note: "Header::decode는 첫 바이트 d6만 보고 목록이라는 것과 payload 길이 0xd6 − 0xc0 = 22를 알아냅니다. 남은 입력이 22바이트보다 짧았다면 여기서 InputTooShort로 멈춥니다." },
  { label: "두 필드를 읽으면 끝", summary: "23바이트 입력 · 남은 바이트 0", trailing: false, cursor: 4, read: 4, verdict: "decode_exact 성공 · 남은 바이트 0", color: OK, note: "주소 머리 94와 20바이트, nonce 01을 읽으면 읽는 위치가 23번째 바이트 뒤로 옵니다. 입력이 정확히 이 23바이트였다면 남은 것이 없으므로 decode_exact도 성공합니다." },
  { label: "뒤에 00이 붙은 입력 · decode", summary: "객체 하나 + 남은 1바이트", trailing: true, cursor: 4, read: 4, verdict: "decode는 객체를 돌려주고 00을 남김", color: ACCENT, note: "같은 객체 뒤에 00이 붙은 24바이트를 일반 decode에 주면 객체 하나를 읽고 읽는 위치를 옮길 뿐입니다. 남은 00은 입력 slice에 그대로 남고, decode 자체는 실패하지 않습니다." },
  { label: "같은 입력 · decode_exact", summary: "남은 바이트 1 → 실패", trailing: true, cursor: 4, read: 4, verdict: "UnexpectedLength · 실패", color: BAD, note: "decode_exact는 객체를 읽은 뒤 남은 바이트가 0인지 한 번 더 확인합니다. 00이 남아 있으므로 UnexpectedLength로 실패하고, 올바른 객체 뒤에 붙은 데이터를 성공으로 넘기지 않습니다." },
] as const;

export default function RlpCursorViz() {
  return (
    <SceneShell
      eyebrow="RLP 복원 · 읽는 위치"
      title="decode는 객체 하나를 읽고 멈추고, decode_exact는 그 뒤에 남은 바이트까지 확인합니다"
      description="칸은 입력 바이트, 세모는 지금까지 읽은 위치(입력 slice의 앞)입니다. 앞 절의 CREATE 입력 23바이트를 쓰고, 마지막 00은 일부러 덧붙인 한 바이트입니다."
      ariaLabel="RLP 입력을 읽는 위치가 이동하는 과정과 decode 및 decode_exact의 남은 바이트 처리 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const cursorX = scene.cursor === 1 ? END(0) + GAP / 2 : END(3) + GAP / 2;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            {active === 0 && (
              <>
                <line x1={STARTS[1]} x2={END(3)} y1={TOP - 14} y2={TOP - 14} stroke={ACCENT} strokeWidth={1} />
                <line x1={STARTS[1]} x2={STARTS[1]} y1={TOP - 14} y2={TOP - 8} stroke={ACCENT} strokeWidth={1} />
                <line x1={END(3)} x2={END(3)} y1={TOP - 14} y2={TOP - 8} stroke={ACCENT} strokeWidth={1} />
                <text x={(STARTS[1] + END(3)) / 2} y={TOP - 20} textAnchor="middle" fontSize={10} fontWeight={700} fill={ACCENT}>선언한 payload 22바이트</text>
              </>
            )}
            {active > 0 && (
              <text x={(STARTS[0] + END(3)) / 2} y={TOP - 20} textAnchor="middle" fontSize={10} fontWeight={700} fill={TEXT}>객체 하나 = 바이트 0~22 (23바이트)</text>
            )}

            {CELLS.map((cell, i) => {
              const isTrail = cell.key === "x";
              if (isTrail && !scene.trailing) {
                return (
                  <g key={cell.key}>
                    <rect x={STARTS[i]} y={TOP} width={cell.w} height={CELL_H} rx={3} fill="none" stroke={MUTED} strokeWidth={1} strokeDasharray="2 3" />
                    <text x={STARTS[i] + cell.w / 2} y={TOP + CELL_H + 14} textAnchor="middle" fontSize={9} fill={MUTED}>없음</text>
                  </g>
                );
              }
              const consumed = i < scene.read;
              const color = isTrail ? (active === 3 ? BAD : TEXT) : consumed ? ACCENT : TEXT;
              return (
                <g key={cell.key}>
                  <rect x={STARTS[i]} y={TOP} width={cell.w} height={CELL_H} rx={3} fill={consumed ? ACCENT : "none"} fillOpacity={consumed ? 0.1 : 0} stroke={color} strokeWidth={1} />
                  <text x={STARTS[i] + cell.w / 2} y={TOP + 19} textAnchor="middle" fontSize={cell.w > 60 ? 10 : 12} fontWeight={700} fill={color}>{cell.text}</text>
                  <text x={STARTS[i] + cell.w / 2} y={TOP + CELL_H + 14} textAnchor="middle" fontSize={9} fill={TEXT}>{cell.role}</text>
                </g>
              );
            })}

            <path d={`M ${cursorX} ${TOP - 2} l -5 -8 h 10 z`} fill={TEXT} />
            <text x={cursorX} y={TOP + CELL_H + 30} textAnchor="middle" fontSize={9} fontWeight={700} fill={TEXT}>읽은 위치</text>

            <rect x={20} y={130} width={W - 40} height={30} rx={6} fill="none" stroke={scene.color} strokeWidth={1} />
            <text x={W / 2} y={149} textAnchor="middle" fontSize={11} fontWeight={700} fill={scene.color}>{scene.verdict}</text>
          </svg>
        );
      }}
    />
  );
}

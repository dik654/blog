import SceneShell from "./SceneShell";

/**
 * 본문 대응: #byte-level-tokenization — "안" = UTF-8 EC 95 88.
 * 학습 전에는 base byte-token 3개, 자주 나오면 병합을 거쳐 token 1개.
 * 병합 순서(EC 95가 먼저)는 그림을 위한 가정이다. 드문 script는 여러 byte-token으로 남을 수 있다.
 */
const HIGHLIGHT = [0xec, 0x95, 0x88];
const CELL = 10;
const GX = 22;
const GY = 20;

const SCENES = [
  { label: "출발점: byte 256개", summary: "'안' = EC 95 88 → token 3개", groups: [["EC"], ["95"], ["88"]], note: "왼쪽 16×16 칸이 byte 값 0~255 전체이고, 이것이 처음 alphabet입니다. '안'은 UTF-8에서 EC·95·88 세 byte이므로 학습 전에는 base byte-token 3개로 표현됩니다. 어떤 문자든 이 256칸 안의 byte로 쪼개지므로 UNK가 필요 없습니다." },
  { label: "병합 한 번 (순서는 가정)", summary: "[EC 95] [88] → token 2개", groups: [["EC", "95"], ["88"]], note: "Corpus에 '안'이 자주 나오면 EC 95나 95 88 같은 pair가 병합 대상이 됩니다. 어느 pair가 먼저 붙는지는 corpus에서 센 빈도가 정하며, 여기서는 EC 95가 먼저라고 가정했습니다." },
  { label: "병합 두 번", summary: "[EC 95 88] → token 1개", groups: [["EC", "95", "88"]], note: "이미 붙은 [EC 95]와 88이 다시 병합되면 세 byte가 token 하나, 곧 '안'이 됩니다. '안'이 corpus에 자주 나와 반복해서 병합 대상이 된 경우입니다." },
  { label: "드문 script는 길게 남음", summary: "병합 기회 적음 → token 여러 개", groups: [["EC", "95", "88"]], note: "학습 corpus에 드물게 나오는 script의 문자는 pair가 병합될 기회가 적어 여러 byte-token으로 쪼개진 채 남을 수 있습니다. 아래 줄의 byte 개수와 값은 그림을 위한 가정입니다." },
] as const;

function Token({ x, y, bytes, color }: { x: number; y: number; bytes: readonly string[]; color: string }) {
  const w = bytes.length * 28 + 8;
  return (
    <g>
      <rect x={x} y={y} width={w} height={26} rx={4} fill="#ffffff" stroke={color} strokeWidth={1.25} />
      <text x={x + w / 2} y={y + 17} textAnchor="middle" fontSize={12} fontFamily="ui-monospace, monospace" fill="#0f172a">{bytes.join(" ")}</text>
    </g>
  );
}

export default function ByteMergeViz() {
  return (
    <SceneShell
      eyebrow="Byte-level BPE"
      title="'안'의 세 byte가 병합을 거쳐 token 하나가 됩니다"
      description="왼쪽 격자의 칸 하나가 byte 값 하나(행=앞 hex 자리, 열=뒤 hex 자리)입니다. 오른쪽 상자 하나가 token 하나입니다."
      ariaLabel="한글 안의 UTF-8 byte EC 95 88이 byte-level BPE 병합으로 token 하나가 되는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const groups: readonly (readonly string[])[] = scene.groups;
        const startOf = (i: number) => 212 + groups.slice(0, i).reduce<number>((sum, g) => sum + g.length * 28 + 16, 0);
        return (
          <svg viewBox="0 0 360 204" className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <text x={GX + 8 * CELL} y={GY - 8} textAnchor="middle" fontSize={10} fill="#64748b">byte 0x00 ~ 0xFF (256칸)</text>
            {Array.from({ length: 256 }, (_, b) => {
              const on = HIGHLIGHT.includes(b);
              return <rect key={b} x={GX + (b % 16) * CELL} y={GY + Math.floor(b / 16) * CELL} width={CELL - 1} height={CELL - 1} fill={on ? "#2563eb" : "#e2e8f0"} />;
            })}
            {HIGHLIGHT.map((b) => {
              const cy = GY + Math.floor(b / 16) * CELL + (CELL - 1) / 2;
              return (
                <g key={b}>
                  <line x1={GX + (b % 16) * CELL + CELL - 1} x2={GX + 16 * CELL + 3} y1={cy} y2={cy} stroke="#2563eb" strokeWidth={1} />
                  <text x={GX + 16 * CELL + 5} y={cy + 3} fontSize={9} fill="#1e3a8a" fontFamily="ui-monospace, monospace">{b.toString(16).toUpperCase()}</text>
                </g>
              );
            })}
            <text x={GX + 8 * CELL} y={GY + 16 * CELL + 16} textAnchor="middle" fontSize={10} fill="#64748b">모든 입력이 이 칸들로 표현됨</text>
            <text x={212} y={40} fontSize={11} fill="#334155" fontWeight={700}>&apos;안&apos;의 token</text>
            {groups.map((g, i) => (
              <Token key={g.join("")} x={startOf(i)} y={52} bytes={g} color="#2563eb" />
            ))}
            <text x={212} y={96} fontSize={11} fill="#1e3a8a">token {groups.length}개</text>
            {active === 3 && (
              <g>
                <text x={212} y={124} fontSize={11} fill="#334155" fontWeight={700}>드문 문자 (가정)</text>
                {[0, 1, 2].map((i) => (
                  <Token key={i} x={212 + i * 44} y={134} bytes={["??"]} color="#b45309" />
                ))}
                <text x={212 + 3 * 44} y={152} fontSize={12} fill="#b45309">…</text>
                <text x={212} y={178} fontSize={11} fill="#92400e">병합 없이 여러 개로 남음</text>
              </g>
            )}
          </svg>
        );
      }}
    />
  );
}

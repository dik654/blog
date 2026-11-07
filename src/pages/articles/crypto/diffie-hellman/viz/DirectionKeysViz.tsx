import SceneShell from "./SceneShell";

/**
 * 본문 대응: #kdf-key-schedule — 공유값 2(0x02)에서 Extract로 PRK, Expand에 방향 info를 넣어 두 키.
 * 값은 본문의 실험(SHA-256, 32바이트 0 salt, 길이 32)이며 교육용 인코딩입니다.
 */
const ACCENT = "#2563eb";
const OTHER = "#b45309";
const WARN = "#b91c1c";
const INK = "#64748b";

const SCENES = [
  { label: "공유값은 아직 열쇠가 아닙니다", summary: "Z = 2", note: "공유값 2를 그대로 암호화 키로 넣을 수는 없습니다. 필요한 길이와 형태로 바꾸고 보내는 방향과 용도를 구별해야 합니다." },
  { label: "Extract: 재료를 모읍니다", summary: "salt + 0x02 → PRK", note: "첫 단계는 입력 재료를 모아 PRK를 만듭니다. PRK는 다음 단계의 비밀 입력으로만 쓰는 중간 값입니다. salt는 프로토콜이 정한 보조 입력이며 일반적으로 비밀일 필요는 없습니다. 2는 한 바이트 0x02로 인코딩했습니다." },
  { label: "Expand: 방향마다 갈라집니다", summary: "a0d369b9… ≠ 0e7f6976…", note: "info는 방향·목적·문맥을 담는 용도 정보입니다. 같은 PRK에 방향 이름표가 다른 info를 넣으면 다른 키가, 같은 입력을 다시 넣으면 같은 키가 나옵니다. info의 뒷부분은 두 쪽이 같습니다(가정)." },
  { label: "약한 입력은 그대로 약합니다", summary: "길이 32 ≠ 안전", note: "KDF는 입력의 비밀량을 늘리지 않습니다. 두 키가 32바이트로 달라 보여도 입력 0x02가 약하므로 실전 키로 안전하지 않고, 인증되지 않은 기록에 신원을 주지도 않습니다." },
] as const;

function Box({ x, y, w, title, sub, stroke, on, mono = false }: { x: number; y: number; w: number; title: string; sub?: string; stroke: string; on: boolean; mono?: boolean }) {
  return (
    <g opacity={on ? 1 : 0.28}>
      <rect x={x} y={y} width={w} height={40} rx={8} fill={stroke} fillOpacity={0.08} stroke={stroke} strokeWidth={1} />
      <text x={x + w / 2} y={y + (sub ? 17 : 25)} textAnchor="middle" fontSize={12} fontWeight={700} fill={stroke}>{title}</text>
      {sub && <text x={x + w / 2} y={y + 33} textAnchor="middle" fontSize={mono ? 10.5 : 11} fontFamily={mono ? "monospace" : undefined} fill={INK}>{sub}</text>}
    </g>
  );
}

const Edge = ({ d, on }: { d: string; on: boolean }) => <path d={d} fill="none" stroke="#94a3b8" strokeWidth={1} opacity={on ? 1 : 0.28} />;

export default function DirectionKeysViz() {
  return (
    <SceneShell
      eyebrow="공유값에서 열쇠로"
      title="공유값 하나가 두 단계를 지나 방향별 열쇠로 갈라집니다"
      description="KDF는 공유값에서 용도별 열쇠를 만드는 함수이고 HKDF는 그중 Extract와 Expand 두 단계로 된 방식입니다. 그림의 값은 본문 실험의 교육용 설정입니다(가정)."
      ariaLabel="공유값 2와 salt가 Extract로 PRK가 되고 Expand에서 방향별 두 키로 갈라지는 흐름"
      scenes={SCENES}
      render={(active) => {
        const warn = active === 3;
        return (
          <svg viewBox="0 0 360 292" className="mx-auto h-auto w-full max-w-[430px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <Edge d="M90 48 V62 H180 V74" on={active >= 1} />
            <Edge d="M270 48 V62 H180 V74" on={active >= 1} />
            <Edge d="M180 114 V128" on={active >= 1} />
            <Edge d="M180 168 V180 H92 V192" on={active >= 2} />
            <Edge d="M180 168 V180 H268 V192" on={active >= 2} />
            <Edge d="M92 232 V246" on={active >= 2} />
            <Edge d="M268 232 V246" on={active >= 2} />
            <Box x={10} y={8} w={160} title="공유값 Z = 2" sub="한 바이트 0x02" stroke={warn ? WARN : ACCENT} on />
            <Box x={190} y={8} w={160} title="salt" sub="32바이트 0" stroke={INK} on={active >= 1} />
            <Box x={100} y={74} w={160} title="Extract" sub="재료 모으기" stroke={INK} on={active >= 1} />
            <Box x={100} y={128} w={160} title="PRK" sub="Expand의 비밀 입력" stroke={ACCENT} on={active >= 1} />
            <Box x={8} y={192} w={168} title="Expand · 길이 32" sub="info: Alice-to-Bob|…" stroke={ACCENT} on={active >= 2} />
            <Box x={184} y={192} w={168} title="Expand · 길이 32" sub="info: Bob-to-Alice|…" stroke={OTHER} on={active >= 2} />
            <Box x={8} y={246} w={168} title="Alice-to-Bob 키" sub="a0d369b9…9265e27" mono stroke={warn ? WARN : ACCENT} on={active >= 2} />
            <Box x={184} y={246} w={168} title="Bob-to-Alice 키" sub="0e7f6976…fdc6290" mono stroke={warn ? WARN : OTHER} on={active >= 2} />
          </svg>
        );
      }}
    />
  );
}

import SceneShell from "./SceneShell";

/**
 * 본문 대응: #hardfork "Fork ID는 빠른 호환성 검사입니다".
 * 제네시스 해시에서 시작해 이미 지난 블록 번호 → 시각 경계를 차례로 체크섬에 넣고(같은 값은 한 번),
 * 아직 오지 않은 다음 경계를 따로 보낸다. 일정·헤드·피어 값은 모두 설명용 가정이다.
 */
const W = 360;
const H = 150;
const X0 = 70;
const X1 = 340;
const BLOCK_Y = 46;
const TIME_Y = 112;
const BLOCK_MAX = 350;
const TIME_MAX = 2300;
const bx = (value: number) => X0 + (value / BLOCK_MAX) * (X1 - X0);
const tx = (value: number) => X0 + (value / TIME_MAX) * (X1 - X0);

const ACCENT = "#2563eb";
const NEXT = "#d97706";
const PEER = "#dc2626";
const MUTED = "#94a3b8";
const TEXT = "#64748b";

/** 체크섬에 들어가는 차례: 장면 번호 = 그 값이 들어가는 장면 */
const BLOCK_POINTS = [
  { value: 100, names: "A·B", addedAt: 2 },
  { value: 200, names: "C", addedAt: 3 },
] as const;

const SCENES = [
  { label: "지난 경계와 남은 경계", summary: "헤드: 블록 300 · 시각 1,500", note: "설명용 일정입니다(가정). 블록 100에 업그레이드 A·B, 블록 200에 C, 시각 1,000에 D, 시각 2,000에 E가 예약돼 있고, 노드가 지금까지 따라온 마지막 블록(헤드)은 번호 300·시각 1,500입니다. 헤드보다 앞에 놓인 경계가 이미 지난 경계입니다." },
  { label: "제네시스 해시에서 시작", summary: "h₀ = CRC32(G)", note: "계산은 제네시스 해시 G에서 출발합니다. CRC32는 바이트 열에서 32비트 체크섬을 만드는 함수로, 값을 하나 더 이어 넣으면 결과가 새로 바뀝니다. 제네시스 해시가 다르면 이 첫 값부터 달라집니다." },
  { label: "블록 100은 한 번만", summary: "A·B 두 개지만 100은 한 번", note: "블록 100에는 A와 B 두 업그레이드가 있지만 같은 경계값이므로 체크섬에는 100을 한 번만 이어 넣어 h₁을 얻습니다." },
  { label: "블록 200", summary: "h₁ 뒤에 200 → h₂", note: "두 번째로 지난 블록 경계 200을 이어 넣어 h₂를 얻습니다. 지난 블록 번호 경계는 여기까지입니다." },
  { label: "그다음 시각 경계", summary: "h₂ 뒤에 1,000 → h₃", note: "블록 번호 경계를 모두 넣은 뒤 시각 경계를 넣습니다(EIP-6122의 순서). 시각 1,000은 헤드 시각 1,500보다 앞이므로 이어 넣어 h₃을 얻습니다." },
  { label: "다음 변경 시점", summary: "Fork ID = (h₃, 다음 2,000)", note: "시각 2,000은 아직 오지 않았으므로 체크섬에 넣지 않고 다음 변경 시점으로 따로 보냅니다. 피어에게 알리는 값은 이 두 개입니다." },
  { label: "일정이 다른 피어", summary: "h₃′ ≠ h₃ → 끊을 수 있음", note: "같은 헤드에 있는 피어가 D를 시각 1,200에 예약했다고 해 보겠습니다(가정). 네 번째로 넣는 값이 달라 h₃′가 나옵니다. 일정이 명백히 다르므로 블록 본문을 받기 전에 연결을 끊을 수 있습니다." },
  { label: "같아도 검증은 남음", summary: "같은 Fork ID ≠ 유효한 블록", note: "피어의 일정이 우리와 같으면 Fork ID도 같습니다. 이것은 규칙 일정이 호환된다는 빠른 신호일 뿐, 피어가 정직하거나 보낸 블록이 유효하다는 뜻은 아닙니다. 받은 블록은 다시 전체 검증을 거칩니다." },
] as const;

const OURS = [
  { input: "G", result: "h₀", addedAt: 1 },
  { input: "100", result: "h₁", addedAt: 2 },
  { input: "200", result: "h₂", addedAt: 3 },
  { input: "1,000", result: "h₃", addedAt: 4 },
] as const;

function ChecksumRow({ who, active, peerDiffers, visible }: { who: string; active: number; peerDiffers: boolean; visible: boolean }) {
  return (
    <div className={`grid grid-cols-[3.25rem_repeat(4,minmax(0,1fr))_minmax(0,1.15fr)] gap-1 ${visible ? "" : "invisible"}`} aria-hidden={!visible}>
      <span className="self-center text-[10px] font-bold text-muted-foreground sm:text-xs">{who}</span>
      {OURS.map((slot, index) => {
        const on = active >= slot.addedAt;
        const differs = peerDiffers && index === 3;
        const input = differs ? "1,200" : slot.input;
        const result = differs ? "h₃′" : slot.result;
        return (
          <div
            key={slot.result}
            className={`min-w-0 rounded border px-1 py-1.5 text-center ${on ? (differs ? "border-red-600" : "border-blue-600") : "border-dashed border-border"}`}
          >
            <span className={`block font-mono text-[10px] font-bold leading-4 sm:text-xs ${on ? "" : "text-muted-foreground/50"}`}>{input}</span>
            <span className={`block font-mono text-[10px] leading-4 sm:text-xs ${on ? (differs ? "text-red-700 dark:text-red-400" : "text-blue-700 dark:text-blue-400") : "text-muted-foreground/40"}`}>→ {result}</span>
          </div>
        );
      })}
      <div className={`min-w-0 rounded border px-1 py-1.5 text-center ${active >= 5 ? "border-amber-600" : "border-dashed border-border"}`}>
        <span className={`block text-[9px] leading-4 sm:text-[10px] ${active >= 5 ? "text-muted-foreground" : "text-muted-foreground/40"}`}>다음</span>
        <span className={`block font-mono text-[10px] font-bold leading-4 sm:text-xs ${active >= 5 ? "text-amber-700 dark:text-amber-400" : "text-muted-foreground/40"}`}>2,000</span>
      </div>
    </div>
  );
}

export default function ForkIdChecksumViz() {
  return (
    <SceneShell
      eyebrow="Fork ID · 지난 경계의 체크섬"
      title="Fork ID는 지난 경계를 차례로 체크섬에 넣고, 다음 경계를 따로 붙입니다"
      description="위 두 줄은 블록 번호와 헤더 시각의 경계 일정, 아래 칸은 체크섬에 이어 넣은 값의 순서입니다. 일정과 헤드 위치는 설명용 가정입니다."
      note="일정·헤드·피어 값은 설명용 가정입니다. h₀…h₃은 실제 체크섬 값이 아니라 순서를 나타내는 기호입니다."
      ariaLabel="제네시스 해시에서 시작해 지난 블록 번호와 시각 경계를 체크섬에 넣고 다음 경계를 붙이는 Fork ID 계산"
      scenes={SCENES}
      render={(active) => {
        const timeOn = active >= 4;
        const nextOn = active >= 5;
        const peerScene = active === 6;
        return (
          <div className="min-w-0">
            <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[460px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
              {[
                { y: BLOCK_Y, label: "블록 번호" },
                { y: TIME_Y, label: "헤더 시각" },
              ].map((lane) => (
                <g key={lane.label}>
                  <text x={6} y={lane.y + 4} fontSize={11} fontWeight={700} fill={TEXT}>{lane.label}</text>
                  <line x1={X0} x2={X1} y1={lane.y} y2={lane.y} stroke={MUTED} strokeWidth={1} />
                </g>
              ))}

              {/* 헤드: 블록 300 · 시각 1,500 */}
              <line x1={bx(300)} x2={bx(300)} y1={BLOCK_Y - 22} y2={BLOCK_Y + 8} stroke="#64748b" strokeWidth={1.25} />
              <text x={bx(300)} y={BLOCK_Y - 26} textAnchor="middle" fontSize={10} fontWeight={700} fill="#64748b">헤드 300</text>
              <line x1={tx(1500)} x2={tx(1500)} y1={TIME_Y - 22} y2={TIME_Y + 8} stroke="#64748b" strokeWidth={1.25} />
              <text x={tx(1500)} y={TIME_Y - 26} textAnchor="middle" fontSize={10} fontWeight={700} fill="#64748b">헤드 1,500</text>

              {BLOCK_POINTS.map((point) => {
                const on = active >= point.addedAt;
                return (
                  <g key={point.value}>
                    <circle cx={bx(point.value)} cy={BLOCK_Y} r={6} fill={on ? ACCENT : "none"} stroke={on ? ACCENT : MUTED} strokeWidth={1.25} />
                    <text x={bx(point.value)} y={BLOCK_Y - 11} textAnchor="middle" fontSize={10} fontWeight={700} fill={on ? ACCENT : TEXT}>{point.names}</text>
                    <text x={bx(point.value)} y={BLOCK_Y + 20} textAnchor="middle" fontSize={10} fill={TEXT}>{point.value}</text>
                  </g>
                );
              })}

              <circle cx={tx(1000)} cy={TIME_Y} r={6} fill={timeOn ? ACCENT : "none"} stroke={timeOn ? ACCENT : MUTED} strokeWidth={1.25} />
              <text x={tx(1000)} y={TIME_Y - 11} textAnchor="middle" fontSize={10} fontWeight={700} fill={timeOn ? ACCENT : TEXT}>D</text>
              <text x={tx(1000)} y={TIME_Y + 20} textAnchor="middle" fontSize={10} fill={TEXT}>1,000</text>

              <circle cx={tx(2000)} cy={TIME_Y} r={6} fill="none" stroke={nextOn ? NEXT : MUTED} strokeWidth={1.25} strokeDasharray={nextOn ? undefined : "2 2"} />
              <text x={tx(2000)} y={TIME_Y - 11} textAnchor="middle" fontSize={10} fontWeight={700} fill={nextOn ? NEXT : TEXT}>E</text>
              <text x={tx(2000)} y={TIME_Y + 20} textAnchor="middle" fontSize={10} fill={nextOn ? NEXT : TEXT}>2,000{nextOn ? " 다음" : ""}</text>

              {peerScene && (
                <g>
                  <rect x={tx(1200) - 5} y={TIME_Y - 5} width={10} height={10} fill="none" stroke={PEER} strokeWidth={1.25} />
                  <text x={tx(1200)} y={TIME_Y + 34} textAnchor="middle" fontSize={10} fontWeight={700} fill={PEER}>피어의 D 1,200</text>
                </g>
              )}
            </svg>

            <div className="mt-3 space-y-1.5">
              <ChecksumRow who="우리 노드" active={active} peerDiffers={false} visible />
              <ChecksumRow who="피어" active={active} peerDiffers={peerScene} visible={active >= 6} />
            </div>
          </div>
        );
      }}
    />
  );
}

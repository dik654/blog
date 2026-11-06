import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism — EIP-7773의 Sepolia·메인넷 행을 나눈 뒤 릴리스 고정, 경계 전후 기록,
 * 실제 관측 순서로 네트워크별로 따로 판정한다. 결과를 단정하지 않고 확인할 일만 표시한다(확인일 10월 4일).
 */
const SCENES = [
  { label: "행을 나눕니다", summary: "Sepolia 일정 있음 · 메인넷 날짜 없음", note: "운영자는 먼저 EIP-7773에서 Sepolia와 메인넷 행을 나눕니다. 같은 문서의 일정이라도 두 행은 서로 다른 판단 대상입니다." },
  { label: "시험 조건을 고정합니다", summary: "클라이언트 릴리스 + fork 설정", note: "시험에 사용할 실행·합의 클라이언트 릴리스와 fork 설정을 고정합니다. fork 설정은 새 규칙이 언제부터 적용되는지 정한 값입니다." },
  { label: "경계 앞뒤를 기록합니다", summary: "직전·직후 거래·블록", note: "Sepolia에서 활성화 경계 직전과 직후의 거래·블록을 기록하고 두 클라이언트가 같은 상태와 블록을 받아들이는지 확인합니다." },
  { label: "날짜가 아니라 관측으로 판정합니다", summary: "10월 6일이 지남 ≠ 성공", note: "날짜가 지났다는 이유만으로 성공 판정을 내리지 않습니다. 네 가지를 실제로 확인해야 합니다. 재조직은 이어져 있던 블록 순서가 바뀌는 일입니다." },
  { label: "메인넷은 처음부터 따로 합니다", summary: "10월 4일: 메인넷 증거 없음", note: "메인넷 판단은 이후 메인넷 일정·릴리스·관측을 별도로 가져와 같은 순서로 수행합니다. 10월 4일에는 이 마지막 증거가 아직 없습니다." },
] as const;

const STEPS = ["행 나누기", "조건 고정", "경계 앞뒤", "실제 관측"];
const SEPOLIA = [["10월 6일", "예정"], ["릴리스", "fork 설정"], ["기록", "비교"], ["네 가지", "확인"]];
const MAINNET = [["날짜", "없음"], ["아직", "없음"], ["아직", "없음"], ["아직", "없음"]];
const LANE_X = 56;
const STEP_W = 76;
const CELL_W = 70;
const ROW_Y = [24, 66];
const CELL_H = 36;
const ACCENT = "#2563eb";
const RED = "#dc2626";
const MUTED = "#94a3b8";
const TEXT = "#64748b";

function Chips({ items, y }: { items: readonly string[]; y: number }) {
  const width = 352 / items.length;
  return (
    <>
      {items.map((item, index) => (
        <g key={item}>
          <rect x={4 + index * width} y={y} width={width - 6} height={34} rx={8} fill={ACCENT} fillOpacity={0.1} stroke={ACCENT} strokeWidth={1} />
          <text x={4 + index * width + (width - 6) / 2} y={y + 21} textAnchor="middle" fontSize={11} fontWeight={700} fill={TEXT}>{item}</text>
        </g>
      ))}
    </>
  );
}

export default function EvidenceTraceViz() {
  return (
    <SceneShell
      eyebrow="네트워크별 추적"
      title="같은 순서를 Sepolia와 메인넷이 따로 밟습니다"
      description="실선 칸은 이 순서에서 지금까지 다룬 단계, 점선 칸은 아직 다루지 않았거나 증거가 없는 단계입니다. 칸은 확인할 일이며 결과를 뜻하지 않습니다(확인일 2026-10-04)."
      ariaLabel="Sepolia와 메인넷을 나눠 일정, 시험 조건, 경계, 관측을 확인하는 순서"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 360 206" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {STEPS.map((step, i) => (
            <text key={step} x={LANE_X + i * STEP_W + CELL_W / 2} y={14} textAnchor="middle" fontSize={11} fontWeight={700} fill={TEXT}>{step}</text>
          ))}
          <text x={50} y={ROW_Y[0] + 22} textAnchor="end" fontSize={11} fontWeight={700} fill={TEXT}>Sepolia</text>
          <text x={50} y={ROW_Y[1] + 22} textAnchor="end" fontSize={11} fontWeight={700} fill={TEXT}>메인넷</text>
          {SEPOLIA.map((lines, i) => {
            const current = active === i;
            const reached = active >= i && active < 4;
            return (
              <g key={lines.join()}>
                <rect x={LANE_X + i * STEP_W} y={ROW_Y[0]} width={CELL_W} height={CELL_H} rx={6} fill={current ? ACCENT : "#64748b"} fillOpacity={current ? 0.14 : 0.06} stroke={current ? ACCENT : reached || i === 0 ? TEXT : MUTED} strokeWidth={current ? 1.25 : 1} strokeDasharray={i > 0 && active < i ? "3 3" : undefined} />
                {lines.map((line, row) => (
                  <text key={line} x={LANE_X + i * STEP_W + CELL_W / 2} y={ROW_Y[0] + 15 + row * 13} textAnchor="middle" fontSize={10} fontWeight={current ? 700 : 400} fill={current ? ACCENT : TEXT}>{line}</text>
                ))}
              </g>
            );
          })}
          {MAINNET.map((lines, i) => {
            const focus = active === 4 || (active === 0 && i === 0);
            return (
              <g key={i}>
                <rect x={LANE_X + i * STEP_W} y={ROW_Y[1]} width={CELL_W} height={CELL_H} rx={6} fill="none" stroke={focus ? RED : MUTED} strokeWidth={focus ? 1.25 : 1} strokeDasharray="3 3" />
                {lines.map((line, row) => (
                  <text key={line} x={LANE_X + i * STEP_W + CELL_W / 2} y={ROW_Y[1] + 15 + row * 13} textAnchor="middle" fontSize={10} fontWeight={focus ? 700 : 400} fill={focus ? RED : TEXT}>{line}</text>
                ))}
              </g>
            );
          })}
          <line x1={4} x2={356} y1={112} y2={112} stroke={MUTED} strokeWidth={1} />
          {active === 0 && (
            <>
              <text x={4} y={134} fontSize={12} fontWeight={700} fill={ACCENT}>Sepolia: epoch 353024</text>
              <text x={4} y={153} fontSize={12} fill={TEXT}>timestamp 1791294816 = 2026-10-06 13:53:36 UTC</text>
              <text x={4} y={178} fontSize={12} fontWeight={700} fill={RED}>Hoodi·Mainnet: 활성화 칸 비어 있음</text>
            </>
          )}
          {active === 1 && <Chips items={["실행 클라이언트", "합의 클라이언트", "fork 설정"]} y={134} />}
          {active === 2 && (
            <>
              {["클라이언트 1", "클라이언트 2"].map((name, row) => (
                <g key={name}>
                  <text x={78} y={140 + row * 28} textAnchor="end" fontSize={11} fill={TEXT}>{name}</text>
                  {[0, 1, 2, 3].map((b) => (
                    <rect key={b} x={92 + b * 44 + (b > 1 ? 16 : 0)} y={124 + row * 28} width={36} height={22} rx={4} fill={b > 1 ? ACCENT : "#64748b"} fillOpacity={0.16} stroke={b > 1 ? ACCENT : TEXT} strokeWidth={1} />
                  ))}
                </g>
              ))}
              <line x1={180} x2={180} y1={118} y2={178} stroke={RED} strokeWidth={1.25} strokeDasharray="3 3" />
              <text x={134} y={194} textAnchor="middle" fontSize={11} fill={TEXT}>직전</text>
              <text x={226} y={194} textAnchor="middle" fontSize={11} fontWeight={700} fill={ACCENT}>직후</text>
              <text x={180} y={194} textAnchor="middle" fontSize={10} fontWeight={700} fill={RED}>경계</text>
              <text x={352} y={160} textAnchor="end" fontSize={11} fontWeight={700} fill={TEXT}>같은가?</text>
            </>
          )}
          {active === 3 && (
            <>
              <Chips items={["실제 블록 시각", "fork 적용"]} y={120} />
              <Chips items={["서비스 로그", "재조직·동기화·장애"]} y={162} />
            </>
          )}
          {active === 4 && (
            <>
              <text x={4} y={134} fontSize={12} fontWeight={700} fill={TEXT}>메인넷 일정 → 릴리스 → 관측</text>
              <text x={4} y={153} fontSize={12} fill={TEXT}>Sepolia 칸의 결과를 옮겨 적지 않고 같은 순서로 다시 합니다.</text>
              <text x={4} y={178} fontSize={12} fontWeight={700} fill={RED}>2026-10-04: 이 마지막 증거는 아직 없음</text>
            </>
          )}
        </svg>
      )}
    />
  );
}

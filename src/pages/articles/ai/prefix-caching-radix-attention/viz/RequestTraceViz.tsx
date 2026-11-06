import SceneShell from "./SceneShell";
import { TokenRow, type CellTone } from "./TokenCell";

/**
 * 본문 대응: #request-trace — R2 한 요청의 순서: 비교 → 구간 나눔 → 저장 위치 반환 → 경로 보호와 새 위치 확보 → 새 가지 등록.
 */
const STEPS = ["비교", "나눔", "위치 반환", "보호·새 위치", "등록"] as const;
const R2 = [1, 2, 3, 4, 5, 6, 9, 10] as const;

const SCENES = [
  { label: "1 · 번호 열 비교", summary: "공유 길이 6", note: "같은 재사용 영역의 시작점에서 R1과 R2를 비교합니다. 1부터 6까지 같고 7과 9에서 달라지므로 공유 길이는 6입니다." },
  { label: "2 · 구간 나누기", summary: "8 → 6 + 2", note: "기존 8자리 구간을 공통 6과 R1의 끝 2로 나눕니다. 찾는 구조를 나누었다고 이전 계산 값을 전부 복사할 필요는 없습니다." },
  { label: "3 · 저장 위치 돌려주기", summary: "앞 6의 위치 목록", note: "번호가 아니라 앞 6의 기록이 저장된 위치 목록을 돌려줍니다. 계산 담당자는 이 위치를 참고합니다." },
  { label: "4 · 보호하고 새 자리 확보", summary: "잠금 + 9·10의 새 위치", note: "사용하는 동안 이 경로를 보호해 다른 요청이 덮어쓰지 못하게 하고, 9·10에 해당하는 새 위치를 확보해 계산합니다." },
  { label: "5 · 새 가지 등록", summary: "6 → 7·8 / 9·10", note: "계산이 끝나면 두 위치를 공통 경로 뒤의 새 가지에 등록합니다. 다음 요청 R3는 이 구조에서 같은 앞 6을 찾습니다." },
];

const BLUE = "#2563eb";
const SLATE = "#64748b";
const GREEN = "#15803d";
const AMBER = "#b45309";

function Box({ x, y, w, text, stroke, dashed = false }: { x: number; y: number; w: number; text: string; stroke: string; dashed?: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={30} rx={5} fill="none" stroke={stroke} strokeWidth={1.25} strokeDasharray={dashed ? "4 3" : undefined} />
      <text x={x + w / 2} y={y + 19} textAnchor="middle" fontSize={12} fontWeight={700} fill="currentColor">{text}</text>
    </g>
  );
}

function Structure({ index }: { index: number }) {
  if (index === 0) {
    return (
      <svg viewBox="0 0 320 96" className="h-auto w-full max-w-[460px]" role="img" aria-label="R1의 여덟 자리가 한 구간으로 남은 상태">
        <text x={0} y={52} fontSize={11} fill={SLATE}>시작</text>
        <line x1={28} x2={70} y1={48} y2={48} stroke={SLATE} strokeWidth={1} />
        <Box x={70} y={33} w={190} text="1·2·3·4·5·6·7·8" stroke={SLATE} />
      </svg>
    );
  }
  const locked = index === 3;
  return (
    <svg viewBox="0 0 320 96" className="h-auto w-full max-w-[460px]" role="img" aria-label={`찾는 구조: ${SCENES[index].summary}`}>
      <text x={0} y={52} fontSize={11} fill={SLATE}>시작</text>
      <line x1={28} x2={50} y1={48} y2={48} stroke={SLATE} strokeWidth={1} />
      <Box x={50} y={33} w={118} text="1·2·3·4·5·6" stroke={index >= 2 ? GREEN : SLATE} />
      {locked && <text x={109} y={26} textAnchor="middle" fontSize={11} fontWeight={700} fill={GREEN}>사용 중: 보호</text>}
      {index === 2 && <text x={109} y={26} textAnchor="middle" fontSize={11} fontWeight={700} fill={GREEN}>이 구간의 저장 위치 목록</text>}
      <path d="M168 48L218 24" fill="none" stroke={SLATE} strokeWidth={1} />
      <Box x={218} y={9} w={70} text="7·8" stroke={SLATE} />
      {index >= 3 && (
        <>
          <path d="M168 48L218 72" fill="none" stroke={index === 4 ? BLUE : AMBER} strokeWidth={1} strokeDasharray={index === 3 ? "4 3" : undefined} />
          <Box x={218} y={57} w={70} text="9·10" stroke={index === 4 ? BLUE : AMBER} dashed={index === 3} />
        </>
      )}
    </svg>
  );
}

export default function RequestTraceViz() {
  return (
    <SceneShell
      eyebrow="R2 한 요청의 순서"
      title="R2는 찾고, 나누고, 보호하고, 계산한 뒤 등록합니다"
      description="위는 기록을 찾는 구조, 아래는 R2의 칸입니다. 초록은 재사용, 주황은 새로 계산, 흐린 칸은 아직 다루지 않은 자리입니다. R1의 기록이 남아 있다고 가정합니다."
      ariaLabel="R2 요청이 공유 길이를 찾아 등록까지 가는 다섯 단계"
      scenes={SCENES}
      render={(index) => {
        const cells: CellTone[] = R2.map((_, i) => (i < 6 ? "hit" : index >= 3 ? "calc" : "idle"));
        return (
          <div>
            <ol className="grid grid-cols-5 gap-1 text-center text-[11px] leading-4">
              {STEPS.map((step, i) => (
                <li key={step} className={`rounded-sm border px-0.5 py-1 ${i === index ? "border-primary font-bold text-primary" : "border-border text-muted-foreground"}`}>
                  {step}
                </li>
              ))}
            </ol>
            <div className="mt-3 flex justify-center">
              <Structure index={index} />
            </div>
            <div className="mt-3">
              <TokenRow name="R2" values={R2} tones={cells} />
            </div>
          </div>
        );
      }}
    />
  );
}

import SceneShell from "./SceneShell";

/**
 * 본문 대응: #problem, #boundary의 ProgressiveDetail — layer 하나·token 하나의 KV cache 원소 수.
 * 128×128×2=32,768, 8×128×2=2,048, 512+64=576, 32,768/576≈56.9, 576/(2×128)=2.25.
 * 넓이가 원소 수에 비례하도록 모든 칸을 같은 축척(원소 하나=1.25×1.25)으로 그린다.
 */
const SCENES = [
  { label: "표준 방식", summary: "128 × 128 × 2 = 32,768", note: "head 128개가 head마다 값 128개를 K와 V 두 종류로 저장합니다. 정사각형 두 개를 가득 채우는 양입니다." },
  { label: "MLA", summary: "512 + 64 = 576", note: "모든 head가 공유하는 latent 512개와 위치 전용 64개만 남습니다. 원소 수 기준으로 32,768 ÷ 576 ≈ 56.9배 작습니다. 빈 사각형은 비교용 표준 방식 틀입니다." },
  { label: "GQA 8 group", summary: "2 × 8 × 128 = 2,048", note: "GQA는 head를 묶어 KV를 group 단위로 저장합니다. group 8개는 글의 예시입니다. 각 사각형에 group마다 128개짜리 줄이 8개 있습니다." },
  { label: "MLA를 group으로 환산", summary: "576 ÷ (2 × 128) = 2.25", note: "같은 576개를 K·V 두 칸에 나눠 깔면 높이가 2.25 group입니다. 크기만 같다는 비교이며 latent가 실제로 K와 V로 나뉘어 저장된다는 뜻은 아닙니다." },
] as const;

const U = 1.25;
const SIDE = 128 * U;
const KX = 12;
const VX = 188;
const TOP = 26;

function Square({ x, title }: { x: number; title: string }) {
  return (
    <>
      <text x={x + SIDE / 2} y={TOP - 8} textAnchor="middle" fontSize={12} fill="#64748b">{title}</text>
      <rect x={x} y={TOP} width={SIDE} height={SIDE} fill="none" stroke="#94a3b8" strokeWidth={1} />
    </>
  );
}

export default function CacheCellCountViz() {
  return (
    <SceneShell
      eyebrow="넓이로 세는 캐시"
      title="한 token의 KV cache를 같은 축척으로 놓으면 차이가 넓이로 보입니다"
      description="원소는 캐시에 저장되는 숫자 하나입니다. 넓이가 원소 수에 비례하며 layer 하나, token 하나, DeepSeek-V2(236B) 기준입니다. 실제 byte는 여기에 자료형 크기를 곱합니다."
      ariaLabel="표준 방식, MLA, GQA의 token당 KV cache 원소 수를 넓이로 비교"
      scenes={SCENES}
      render={(active) => {
        const mla = active === 1;
        const gqa = active === 2;
        const strip = active === 3;
        const rowH = 8 * U;
        return (
          <svg viewBox="0 0 360 200" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <Square x={KX} title={mla ? "표준 K 틀" : "K 128×128"} />
            <Square x={VX} title={mla ? "표준 V 틀" : "V 128×128"} />
            {active === 0 && (
              <>
                <rect x={KX} y={TOP} width={SIDE} height={SIDE} fill="#64748b" opacity={0.75} />
                <rect x={VX} y={TOP} width={SIDE} height={SIDE} fill="#64748b" opacity={0.75} />
              </>
            )}
            {mla && (
              <>
                <rect x={KX + 8} y={TOP + SIDE - 45 - 8} width={20} height={40} fill="#2563eb" />
                <rect x={KX + 8} y={TOP + SIDE - 5 - 8} width={20} height={5} fill="#d97706" />
                <text x={KX + 34} y={TOP + SIDE - 28} fontSize={12} fontWeight={700} fill="#2563eb">latent 512</text>
                <text x={KX + 34} y={TOP + SIDE - 8} fontSize={12} fontWeight={700} fill="#d97706">위치 64</text>
              </>
            )}
            {gqa && (
              <>
                <rect x={KX} y={TOP} width={SIDE} height={rowH} fill="#16a34a" />
                <rect x={VX} y={TOP} width={SIDE} height={rowH} fill="#16a34a" />
                <text x={KX + SIDE / 2} y={TOP + rowH + 18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#16a34a">8줄</text>
                <text x={VX + SIDE / 2} y={TOP + rowH + 18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#16a34a">8줄</text>
              </>
            )}
            {strip && (
              <>
                <rect x={KX} y={TOP} width={SIDE} height={2.25 * U} fill="#2563eb" />
                <rect x={VX} y={TOP} width={SIDE} height={2.25 * U} fill="#2563eb" />
                <text x={KX + SIDE / 2} y={TOP + 20} textAnchor="middle" fontSize={12} fontWeight={700} fill="#2563eb">2.25줄</text>
                <text x={VX + SIDE / 2} y={TOP + 20} textAnchor="middle" fontSize={12} fontWeight={700} fill="#2563eb">2.25줄</text>
              </>
            )}
          </svg>
        );
      }}
    />
  );
}

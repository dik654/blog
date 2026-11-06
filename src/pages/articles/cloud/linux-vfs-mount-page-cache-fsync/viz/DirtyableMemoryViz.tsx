import SceneShell from "./SceneShell";

/**
 * 본문 대응: #dirty-pages — 두 비율의 분모. RAM 16 GiB = 16,384 MiB 중 분모는 12,288 MiB(가정), 나머지 4,096 MiB.
 * 선은 본문의 정수화를 따른다: ⌊10×4096/100⌋=409, ⌊20×4096/100⌋=819.
 * 12,288 MiB: 409×768=314,112 page≈1,227 MiB, 819×768=628,992 page≈2,457 MiB.
 * 8,192 MiB(가정: anonymous 4,096 MiB 증가): 409×512=209,408 page=818 MiB, 819×512=419,328 page=1,638 MiB.
 */
const RAM = 16384;
const DIRTY = 1700;
const AXIS_MAX = 3072;

const SCENES = [
  { label: "분모는 RAM 전체가 아닙니다", summary: "16,384 MiB 중 12,288 MiB", dirtyable: 12288, bg: null as number | null, limit: null as number | null, dirty: false, note: "분모는 빈 page에서 커널 예약을 뺀 값에 file LRU(파일 내용을 담은 회수 가능한 page 목록)를 더한 것입니다. 12,288 MiB는 설명용 값이고, 그 안의 세부 비율은 정하지 않았습니다. anonymous page(프로그램이 직접 잡은 메모리)는 분모에 들어가지 않습니다." },
  { label: "두 선은 분모에서 나옵니다", summary: "10% ≈ 1,227 · 20% ≈ 2,457 MiB", dirtyable: 12288, bg: 1227 as number | null, limit: 2457 as number | null, dirty: true, note: "아래 축은 위 띠보다 크게 확대한 눈금입니다. 10% 선에서 flusher가 쓰기 시작하고 20% 선에서 쓰는 프로세스가 멈춥니다. 정수 나눗셈 때문에 정확한 10%·20%보다 조금 낮으며, 이 계산은 바로 아래에서 따라갑니다. (가정) dirty 1,700 MiB는 아직 20% 선 아래입니다." },
  { label: "앱이 메모리를 더 쓰면", summary: "분모 8,192 → 20% ≈ 1,638 MiB", dirtyable: 8192, bg: 818 as number | null, limit: 1638 as number | null, dirty: true, note: "(가정) anonymous page가 4,096 MiB 늘어 그만큼 분모가 줄면 10% 선은 약 818, 20% 선은 약 1,638 MiB가 됩니다. dirty 양은 1,700 MiB로 같은데 이제 20% 선을 넘습니다. 앱이 메모리를 많이 쓰는 서버일수록 같은 양의 dirty page로도 멈춤에 더 빨리 이릅니다." },
] as const;

const LEFT = 10;
const RIGHT = 350;
const SPAN = RIGHT - LEFT;
const ax = (v: number) => LEFT + (v / AXIS_MAX) * SPAN;

export default function DirtyableMemoryViz() {
  return (
    <SceneShell
      eyebrow="두 비율의 분모"
      title="같은 dirty 양도 분모가 작으면 한계선을 넘습니다"
      description="위 띠는 RAM 16 GiB 전체, 아래 축은 dirty page 합계(0~3,072 MiB)입니다."
      ariaLabel="dirty 비율의 분모와 anonymous 메모리 증가에 따른 한계선 이동"
      scenes={SCENES}
      render={(active) => {
        const s = SCENES[active];
        const inW = (s.dirtyable / RAM) * SPAN;
        return (
          <svg viewBox="0 0 360 188" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${s.label}: ${s.summary}`}>
            <text x={LEFT} y={14} fontSize={11} fill="#64748b">RAM 16,384 MiB</text>
            <rect x={LEFT} y={22} width={inW} height={30} rx={3} fill="#2563eb" opacity={0.28} stroke="#2563eb" strokeWidth={1} />
            <rect x={LEFT + inW} y={22} width={SPAN - inW} height={30} rx={3} fill="#64748b" opacity={0.18} stroke="#64748b" strokeWidth={1} />
            <text x={LEFT + inW / 2} y={41} textAnchor="middle" fontSize={12} fontWeight={700} fill="#2563eb">분모 {s.dirtyable.toLocaleString("en-US")}</text>
            <text x={LEFT + inW + (SPAN - inW) / 2} y={41} textAnchor="middle" fontSize={12} fontWeight={700} fill="#64748b">분모 밖 {(RAM - s.dirtyable).toLocaleString("en-US")}</text>
            <text x={RIGHT} y={68} textAnchor="end" fontSize={11} fill="#64748b">분모 밖: anonymous·커널 예약 등</text>

            <text x={LEFT} y={94} fontSize={11} fill="#64748b">dirty 합계(MiB)</text>
            <rect x={LEFT} y={124} width={SPAN} height={18} rx={2} fill="none" stroke="#94a3b8" strokeWidth={1} />
            {s.dirty && <rect x={LEFT} y={124} width={ax(DIRTY) - LEFT} height={18} rx={2} fill="#d97706" opacity={0.55} />}
            {s.dirty && <text x={180} y={160} textAnchor="middle" fontSize={11} fontWeight={700} fill="#b45309">주황 막대: dirty {DIRTY.toLocaleString("en-US")} (가정)</text>}
            {s.bg !== null && (
              <g>
                <line x1={ax(s.bg)} x2={ax(s.bg)} y1={106} y2={148} stroke="#2563eb" strokeWidth={1} strokeDasharray="3 2" />
                <text x={ax(s.bg) - 3} y={116} textAnchor="end" fontSize={11} fontWeight={700} fill="#2563eb">10% {s.bg.toLocaleString("en-US")}</text>
              </g>
            )}
            {s.limit !== null && (
              <g>
                <line x1={ax(s.limit)} x2={ax(s.limit)} y1={106} y2={148} stroke="#dc2626" strokeWidth={1} strokeDasharray="3 2" />
                <text x={ax(s.limit) + 3} y={116} fontSize={11} fontWeight={700} fill="#dc2626">20% {s.limit.toLocaleString("en-US")}</text>
              </g>
            )}
            <text x={LEFT} y={160} fontSize={11} fill="#64748b">0</text>
            <text x={RIGHT} y={160} textAnchor="end" fontSize={11} fill="#64748b">3,072</text>
            {s.limit !== null && (
              <text x={180} y={180} textAnchor="middle" fontSize={12} fontWeight={700} fill={DIRTY > s.limit ? "#dc2626" : "#16a34a"}>
                {DIRTY > s.limit ? "dirty가 20% 선을 넘음: 쓰는 쪽이 멈춤" : "dirty가 20% 선 아래: 쓰는 쪽은 아직 안 멈춤"}
              </text>
            )}
          </svg>
        );
      }}
    />
  );
}

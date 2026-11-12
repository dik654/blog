import SceneShell from "./SceneShell";

/**
 * 본문 대응: #placement — processor cache(CPU, 프로세스마다 복제, 기본 4 GiB)와
 * mm_encoder_tp_mode(weights: 가중치를 나눔 / data: 각 GPU가 encoder 전체를 들고 사진을 나눔).
 * API 서버 2개 → 최대 4 × 2 = 8 GiB. GPU 4장과 사진 P Q R S 네 장은 그림용 가정이다.
 */
const GPUS = [0, 1, 2, 3] as const;
const IMAGES = ["P", "Q", "R", "S"] as const;

const SCENES = [
  {
    label: "CPU의 processor cache",
    summary: "4 GiB × API 서버 2개 = 최대 8 GiB",
    note: "processor cache는 GPU에 가기 전 CPU에서 만든 크기 맞춤·patch 자르기 결과를 남깁니다. 프로세스마다 따로 복제되므로 API 서버가 두 개면 기본값으로 최대 8 GiB입니다. GPU의 encoder cache는 그 뒤 단계의 embedding을 남깁니다.",
  },
  {
    label: "weights 모드 (기본값)",
    summary: "GPU마다 encoder 가중치의 1/4",
    note: "언어 모델처럼 encoder 가중치를 GPU들이 나눠 듭니다. 그래서 사진 한 장을 encode할 때도 네 GPU가 함께 계산합니다.",
  },
  {
    label: "data 모드",
    summary: "GPU마다 encoder 전체 · 사진을 나눔",
    note: "각 GPU가 encoder 전체를 들고 사진 묶음을 나눠 처리합니다. 문서는 TP 8에서 처리량과 첫 토큰까지 걸린 시간(TTFT)이 약 10% 좋아졌다는 측정을 적지만, 모델별 구현이 필요하고 메모리가 조금 늘어납니다.",
  },
] as const;

export default function EncoderPlacementViz() {
  return (
    <SceneShell
      eyebrow="cache와 encoder 배치"
      title="CPU의 전처리 cache와 GPU의 encoder 분할은 따로 정합니다"
      description="위 줄은 CPU의 API 서버 프로세스, 아래 줄은 GPU입니다. GPU 상자 안의 막대는 그 GPU가 든 encoder 가중치의 몫이고, 글자 칩은 그 GPU가 계산에 참여하는 사진입니다."
      note="API 서버 2개와 기본 4 GiB는 본문의 예입니다. GPU 4장과 사진 네 장은 그림용 가정이며, 약 10%는 TP 8에서 문서 작성자가 잰 값입니다. (가정)"
      ariaLabel="processor cache의 프로세스별 복제와 encoder의 weights, data 분할 방식 비교"
      scenes={SCENES}
      render={(active) => {
        const cpuOn = active === 0;
        const dataMode = active === 2;
        return (
          <div className="grid gap-3">
            <div className={`rounded-lg border px-3 py-2 ${cpuOn ? "border-primary" : "border-border"}`}>
              <p className="text-xs font-bold">CPU</p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {[1, 2].map((server) => (
                  <div key={server} className={`rounded border px-2 py-1.5 text-xs leading-5 ${cpuOn ? "border-amber-600 bg-amber-500/10" : "border-border text-muted-foreground"}`}>
                    <span className="block font-semibold">API 서버 {server}</span>
                    <span className="block">processor cache ≤ 4 GiB</span>
                    <span className="block text-muted-foreground">픽셀 조각</span>
                  </div>
                ))}
              </div>
              <p className={`mt-2 text-right font-mono text-xs ${cpuOn ? "font-bold" : "text-muted-foreground"}`}>합계 최대 4 × 2 = 8 GiB</p>
            </div>
            <div className={`rounded-lg border px-3 py-2 ${cpuOn ? "border-border" : "border-primary"}`}>
              <p className="text-xs font-bold">GPU {cpuOn ? "· encoder cache는 embedding을 남김" : dataMode ? "· data 모드" : "· weights 모드"}</p>
              <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {GPUS.map((gpu) => {
                  const share = cpuOn ? 0 : dataMode ? 1 : 0.25;
                  const imgs = cpuOn ? [] : dataMode ? [IMAGES[gpu]] : [...IMAGES];
                  return (
                    <div key={gpu} className="rounded border border-border px-2 py-1.5 text-xs">
                      <span className="block font-semibold">GPU {gpu + 1}</span>
                      <svg viewBox="0 0 100 10" className="mt-1 h-2.5 w-full" aria-hidden="true">
                        <rect x={0.5} y={0.5} width={99} height={9} rx={2} fill="none" stroke="#94a3b8" strokeWidth={1} />
                        {share > 0 ? <rect x={dataMode ? 0.5 : 0.5 + gpu * 24.75} y={0.5} width={99 * share} height={9} rx={2} fill="#0d9488" /> : null}
                      </svg>
                      <span className="mt-1 block font-mono text-muted-foreground">{cpuOn ? "—" : dataMode ? "가중치 전체" : "가중치 1/4"}</span>
                      <span className="mt-1 flex min-h-[1.25rem] flex-wrap gap-1">
                        {imgs.map((img) => (
                          <span key={img} className="rounded border border-amber-600 px-1 font-mono leading-4 text-amber-700 dark:text-amber-400">
                            {img}
                          </span>
                        ))}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}

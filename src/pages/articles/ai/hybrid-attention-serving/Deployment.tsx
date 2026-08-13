const CHECKLIST = [
  [
    "Artifact pinning",
    "model·tokenizer·processor·vision encoder·chat template·quant·drafter의 commit과 hash를 함께 고정",
  ],
  [
    "Runtime qualification",
    "offline 설치 가능한 container·wheel을 반입하고 hybrid attention·tool parser·multimodal path를 각각 검증",
  ],
  [
    "Quality gate",
    "한국어 업무·tool schema·긴 문서 retrieval·image 입력·failure recovery를 내부 평가셋으로 비교",
  ],
  [
    "Capacity gate",
    "대표 prompt 분포에서 p95 latency·KV usage·preemption·OOM 기준으로 replica당 admission 상한 결정",
  ],
  [
    "Security boundary",
    "망분리여도 tool allowlist·human confirmation·audit log·artifact SBOM과 취약점 점검을 유지",
  ],
] as const;

export default function Deployment() {
  return (
    <section id="deployment" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Muse는 local agent bundle, Gemma는 긴 multimodal context를 우선할 때
        출발점이 된다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          24~32GB급 단일 장비에 agentic workload를 넣고 설치 artifact까지 한
          묶음으로 관리하려면 Muse Glimmer가 먼저 검토할 후보입니다. Meta가
          4-bit variant 두 종과 DFlash drafter를 함께 공개했고, 24GB·32GB
          target을 model card에 명시했기 때문입니다. 반면 256k 문서·이미지·video
          frame 입력과 기존 Gemma tooling을 중시한다면 Gemma 4 31B가 더
          자연스럽습니다.
        </p>
        <p>
          이것은 benchmark 순위가 아니라 배포 적합성의 기본값입니다. Muse도 새
          architecture라 runtime 지원 상태를 고정해야 하고, Gemma도 31B weight와
          긴 request가 한 GPU의 동시성을 자동으로 보장하지 않습니다. 같은
          hardware에서 동일한 quantization 수준, thinking budget, prompt set과
          output cap을 맞춘 A/B test가 최종 선택을 결정해야 합니다.
        </p>
      </div>
      <div
        data-viz="airgap-deployment-checklist"
        className="not-prose my-12 overflow-hidden rounded-xl border border-border/70 bg-card"
      >
        <div className="border-b bg-muted/20 px-5 py-5 sm:px-7">
          <p className="text-xs font-bold text-primary">
            Air-gapped deployment
          </p>
          <h3 className="mt-2 text-lg font-bold">
            모델 파일만 반입하지 말고 실행 계약 전체를 고정합니다
          </h3>
        </div>
        <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-5">
          {CHECKLIST.map(([title, description], index) => (
            <article
              key={title}
              className="min-w-0 rounded-xl border bg-background p-4"
            >
              <span className="rounded-md bg-emerald-100 px-2 py-1 font-mono text-xs font-bold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-200">
                {String(index + 1).padStart(2, "0")}
              </span>
              <strong className="mt-4 block text-sm leading-5">{title}</strong>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">
                {description}
              </p>
            </article>
          ))}
        </div>
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>제안서에는 model context와 service capacity를 따로 씁니다</h3>
        <p>
          제안서의 모델 표에는 official maximum context와 지원 modality를 적고,
          capacity 표에는 검증한 runtime build, quantization, GPU memory,
          input/output percentile, replica 수와 SLA를 적습니다. “256k
          model이므로 몇 명 수용”처럼 두 숫자를 바로 연결하면 운영자가 재현할 수
          없고, 향후 runtime upgrade의 효과도 비교할 수 없습니다.
        </p>
        <p>
          따라서 첫 PoC의 산출물은 승자 이름 하나가 아니라 두 모델의 동일 조건
          benchmark ledger여야 합니다. 그 ledger가 있으면 새 quantization이나
          runtime이 들어와도 같은 quality·latency·memory gate를 다시 실행해 교체
          여부를 판단할 수 있습니다.
        </p>
      </div>
    </section>
  );
}

import ContentBoundary from "@/components/articles/content-boundary";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CompressionPipelineLocator } from "./CompressionPipelineLocator";
import CompressionPipelineFlowViz from "./viz/CompressionPipelineFlowViz";
import SynergyViz from "./viz/SynergyViz";

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <CompressionPipelineLocator />
      <h2 className="mb-4 text-2xl font-bold">파이프라인</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          모델 경량화 파이프라인은 기법을 많이 쌓는 절차가 아닙니다. 배포
          기준을 먼저 고정하고, 그 기준을 통과하는 가장 단순한 실행 artifact를
          찾는 비교 실험입니다.
        </p>
        <p>
          아래 그림은 설명용 후보 하나가 기준 고정, 후보 생성, build, 검증,
          승인과 rollback을 지나는 흐름입니다. 왼쪽에서 시작해 가운데 후보의
          상태가 바뀌고, 마지막에는 오른쪽 release pointer가 어떤 digest를
          가리키는지 확인하세요.
        </p>
      </div>
      <CompressionPipelineFlowViz />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          같은 모델도 batch, sequence length, 동시 요청 수와 hardware에 따라
          병목이 달라집니다. Weight bandwidth가 병목이면 양자화가 직접적인
          후보지만, KV cache가 memory를 차지하면 weight-only 4-bit만으로 동시
          요청 수가 크게 늘지 않을 수 있습니다. Dense kernel만 빠른 장치에서는
          불규칙한 가지치기보다 작은 student나 structured shape가 나을 수
          있습니다.
        </p>
        <p>
          따라서 quality, memory, latency, throughput의 통과 조건을 먼저 쓰고
          dense baseline을 같은 환경에서 측정합니다. 그다음{" "}
          <a href="/cs/ai/quantization">양자화</a>,{" "}
          <a href="/cs/ai/pruning">가지치기</a>,{" "}
          <a href="/cs/ai/knowledge-distillation">지식 증류</a> 정본에서 필요한
          기법만 가져옵니다. <a href="/cs/ai/lora-finetuning">LoRA</a>는 학습할
          parameter와 training memory를 줄이는 방법입니다. Merge 뒤 inference
          graph가 같다면 그 자체를 serving compression으로 세지 않습니다.
        </p>
      </div>
      <ContentBoundary article="compression-pipeline" />
      <div
        id="ownership"
        className="not-prose my-8 scroll-mt-20 border-y border-border py-5"
      >
        <p className="text-xs font-bold text-primary">상태 소유권 · 제안 [A]</p>
        <h3 className="mt-2 text-lg font-bold">각 단계가 다음 단계에 넘길 기록</h3>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
          아래 표는 특정 회사의 측정 결과가 아니라, 실험을 재현하고 rollback할
          수 있도록 두는 최소 계약입니다. 같은 필드를 여러 실행기가 덮어쓰지
          않도록 authoritative writer를 하나씩 둡니다.
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[1080px] border-collapse text-left text-xs leading-5">
            <thead className="border-y border-border text-muted-foreground">
              <tr>
                <th className="px-3 py-2 font-semibold">상태</th>
                <th className="px-3 py-2 font-semibold">권위 원장</th>
                <th className="px-3 py-2 font-semibold">쓰는 주체</th>
                <th className="px-3 py-2 font-semibold">읽는 주체</th>
                <th className="px-3 py-2 font-semibold">수렴시키는 주체</th>
                <th className="px-3 py-2 font-semibold">실패 판단</th>
                <th className="px-3 py-2 font-semibold">복구 증거</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["release spec", "버전 관리된 명세", "서비스·플랫폼 책임자", "후보 생성·검증 단계", "파이프라인 실행기", "기준·slice·단위가 없음", "직전 승인 명세와 diff"],
                ["recipe + input digest", "실험 기록 저장소", "압축 실행기", "build 실행기", "실험 orchestrator", "입력과 설정을 재현할 수 없음", "같은 digest로 재실행"],
                ["artifact digest", "artifact registry", "build 실행기", "benchmark·release gate", "registry 검증 단계", "대상 runtime에서 load 실패", "registry의 불변 digest"],
                ["benchmark receipt", "결과 저장소", "검증 실행기", "release gate", "gate 실행기", "필수 guardrail 하나라도 실패", "원시 지표와 반복 실행"],
                ["release pointer", "배포 Git·release registry", "승인된 CD 경로", "serving runtime", "GitOps·배포 controller", "canary 실패 또는 digest 불일치", "이전 pointer와 readiness"],
              ].map((row) => (
                <tr key={row[0]} className="border-b border-border/70">
                  <th className="px-3 py-3 font-mono font-semibold">{row[0]}</th>
                  {row.slice(1).map((cell) => (
                    <td key={cell} className="px-3 py-3 text-muted-foreground">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="not-prose my-8 border-y border-border py-5">
        <p className="text-xs font-bold text-primary">설명용 실행 기록 · 제안 [A]</p>
        <h3 className="mt-2 text-lg font-bold">같은 기준을 끝까지 전달합니다</h3>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
          아래 YAML은 특정 도구의 실제 스키마가 아닙니다. 기준을 읽은 실행기가
          후보를 만들고, 검증 기록을 남긴 뒤, 승인된 digest만 release pointer에
          기록하는 최소 계약을 보여 주는 의사 설정입니다.
        </p>
        <pre className="mt-4 max-w-full overflow-x-auto border border-border bg-muted/20 p-4 font-mono text-xs font-normal leading-6 text-foreground"><code>{`# 모든 후보가 공유할 배포 기준을 먼저 고정합니다.
release_spec:
  quality_loss_max: 0.5
  memory_gb_max: 7
  p95_ms_max: 9

# 입력과 변환 설정을 digest로 묶어 같은 후보를 다시 만들 수 있게 합니다.
candidate:
  parent_digest: sha256:baseline
  recipe_digest: sha256:quant-prune
  workload_digest: sha256:fixture-v1

# build와 benchmark가 만든 불변 기록을 release gate가 읽습니다.
result:
  artifact_digest: sha256:artifact-ab
  receipt_digest: sha256:receipt-ab
  gate: passed

# gate와 canary를 통과한 뒤에만 서비스가 읽는 pointer를 바꿉니다.
release_pointer: sha256:artifact-ab
rollback_pointer: sha256:baseline`}</code></pre>
      </div>
      <ExplainedFormula
        question="여러 평균 점수를 하나로 더하지 않고 후보가 모든 필수 SLA를 통과했는지 어떻게 표현할까요?"
        idea={
          <>
            각 guardrail을 만족하면 1, 아니면 0인 indicator를 곱합니다. 하나라도
            실패하면 전체 feasibility가 0이 되어 다른 축의 큰 이득으로 필수
            조건을 상쇄하지 못합니다.
          </>
        }
        formula={String.raw`\begin{aligned}
I_k(a)&=\mathbf1[g_k(a)\le b_k],\\
F(a)&=\prod_{k=1}^{K}I_k(a),\\
a^*&=\arg\min_{a:F(a)=1}C_{\mathrm{ops}}(a).
\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}
I_k(a)&=\underbrace{\mathbf1[g_k(a)\le b_k],}_{\text{guardrail k 통과면 1}}\\
F(a)&=\underbrace{\prod_{k=1}^{K}I_k(a),}_{\text{전부 통과해야 1}}\\
a^*&=\underbrace{\arg\min_{a:F(a)=1}C_{\mathrm{ops}}(a).}_{\text{통과 후보 중 최소 운영비}}
\end{aligned}`}
        operations={[
          { expression: String.raw`\mathbf1[g_k(a)\le b_k],`, annotation: ["quality loss·peak memory·p95 같은 측정값","g_k가 budget b_k 이하면 1, 넘으면 0입니다."] },
          { expression: String.raw`\prod_{k=1}^{K}I_k(a),`, annotation: ["K개 indicator를 곱한 feasibility입니다.","safety slice 하나만 기준을 넘어도 F=0이라","평균 quality가 좋아도 상쇄하지 못합니다"] },
          { expression: String.raw`\arg\min_{a:F(a)=1}C_{\mathrm{ops}}(a).`, annotation: ["F=1인 통과 후보 사이에서만 비교합니다.","stage 수가 적고 runtime support가 안정적인","쪽이 운영 비용 C_ops가 낮아 먼저 뽑힙니다"] },
        ]}
        terms={[
          {
            symbol: "a",
            name: "artifact candidate",
            description:
              "Baseline 또는 compression stage 조합으로 만든 실행 artifact입니다.",
          },
          {
            symbol: "g_k",
            name: "measured guardrail",
            description:
              "Quality loss·peak memory·p95 latency·error rate처럼 방향을 맞춘 측정값입니다.",
          },
          {
            symbol: "b_k",
            name: "budget",
            description: "해당 guardrail이 넘지 않아야 하는 최대 허용값입니다.",
          },
          {
            symbol: "F",
            name: "feasibility",
            description:
              "모든 필수 조건을 통과하면 1, 하나라도 실패하면 0입니다.",
          },
          {
            symbol: "C_ops",
            name: "operational cost",
            description:
              "통과 후보 사이에서 비교할 복잡도·비용·유지보수 부담입니다.",
          },
        ]}
        assumptions={[
          "각 metric의 방향과 단위·slice·confidence rule을 사전에 고정합니다.",
          "Soft tradeoff가 가능한 선호도와 반드시 지켜야 하는 hard guardrail을 구분합니다.",
          "여러 통과 후보가 있으면 가장 높은 압축률이 아니라 운영 목적에 맞는 cost와 Pareto 축으로 선택합니다.",
        ]}
        interpretation="평균 quality가 좋아도 safety slice가 기준을 넘으면 F=0입니다. 목표를 통과한 후보 중에서는 stage가 적고 runtime support가 안정적인 artifact를 우선할 수 있습니다."
      />
      <p className="not-prose mt-6 text-sm leading-6 text-muted-foreground">
        이 식은 후보를 고르기 전에 탈락 조건을 분리합니다. 다음 그림에서는 각
        기법이 실제로 어떤 artifact 항을 바꾸는지 먼저 확인합니다.
      </p>
      <div className="not-prose my-8">
        <SynergyViz />
      </div>
    </section>
  );
}

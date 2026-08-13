import ContentBoundary from "@/components/articles/content-boundary";
import AttentionPatternViz from "./viz/AttentionPatternViz";
import ContextViz from "./viz/ContextViz";

const COMPARISON = [
  [
    "비교 역할",
    "현재 운영 기준선",
    "작은 KV shape 후보",
    "긴 multimodal context 후보",
  ],
  ["구성 출처", "프로젝트 배포 config", "공식 text config", "공식 text config"],
  ["Text layers", "64", "52", "60"],
  [
    "Attention",
    "배포 config 기준 hybrid",
    "Local×3 + Global 반복",
    "Local×5 + Global 반복",
  ],
  ["Local window", "배포 config에 따름", "2,048 tokens", "1,024 tokens"],
  ["공식 context", "배포 설정에 따름", "131,072", "262,144"],
  [
    "Q / KV heads",
    "Q — / KV 4",
    "Q 32 / KV 2",
    "Q 32 / Local KV 16 · Global KV 4",
  ],
  ["head_dim", "256", "128", "Local 256 · Global 512"],
  [
    "Multimodal",
    "배포 artifact에 따름",
    "text + image",
    "text + image + video frame",
  ],
] as const;

const MODEL_COLUMNS = [
  { name: "Qwen 27B 배포본", index: 1 },
  { name: "Muse Glimmer 30B", index: 2 },
  { name: "Gemma 4 31B IT", index: 3 },
] as const;

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        30B급 모델의 동시성은 parameter 수보다 KV cache의 모양에서 먼저 갈립니다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Qwen 27B 배포본, Muse Glimmer 30B, Gemma 4 31B는 크기가 비슷하지만
          같은 GPU에서 보관할 수 있는 KV token 수는 크게 달랐습니다. 처음에는
          quantization이나 sliding-window 비율이 원인처럼 보일 수 있으나, 이번
          실측에서 가장 먼저 차이를 만든 값은 layer 수, KV head 수, head
          dimension이었습니다.
        </p>
        <p>
          이 글은 그 결과만 표로 남기지 않고 계산의 바닥부터 다시 올라갑니다.
          먼저 decode가 왜 K와 V를 저장하는지, MHA·GQA·MQA가 무엇을 공유하는지
          살펴본 뒤 토큰당 KV byte를 계산합니다. 그 다음 sliding-window의 이론적
          절감과 vLLM allocator가 실제로 반영한 절감을 분리하고, 마지막으로
          startup log와 load test에서 수용량을 검산합니다.
        </p>
        <p>
          결론부터 말하면 Muse의 큰 KV capacity는 weight quantization보다{" "}
          <strong>KV head 2개와 head_dim 128</strong>에서 먼저 설명됩니다.
          Gemma는 local window가 더 짧지만 local KV head가 16개이고, 이번 vLLM
          실행에서는 오래된 local block을 회수한 이점이 관측되지 않았습니다.
          따라서 모델 config에서 계산한 이론값과 특정 runtime build가 실제로
          잡은 memory를 같은 사실처럼 쓰지 않는 것이 이 글의 핵심입니다.
        </p>
        <ContentBoundary article="hybrid-attention-serving" />
      </div>
      <div className="not-prose my-8">
        <ContextViz />
      </div>
      <div
        data-viz="model-config-comparison"
        className="not-prose my-8 overflow-hidden rounded-xl border border-border/70 bg-card"
      >
        <div className="hidden md:block">
          <table className="w-full table-fixed border-collapse text-left text-xs lg:text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="w-[18%] border-b px-3 py-3 font-semibold lg:px-4">
                  비교 축
                </th>
                <th className="border-b px-3 py-3 font-semibold lg:px-4">
                  Qwen 27B 배포본
                </th>
                <th className="border-b px-3 py-3 font-semibold lg:px-4">
                  Muse Glimmer 30B
                </th>
                <th className="border-b px-3 py-3 font-semibold lg:px-4">
                  Gemma 4 31B IT
                </th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON.map(([label, qwen, muse, gemma]) => (
                <tr key={label} className="border-b last:border-b-0">
                  <th className="px-3 py-3 align-top font-semibold leading-5 text-muted-foreground lg:px-4">
                    {label}
                  </th>
                  <td className="break-words px-3 py-3 align-top leading-5 lg:px-4">
                    {qwen}
                  </td>
                  <td className="break-words px-3 py-3 align-top leading-5 lg:px-4">
                    {muse}
                  </td>
                  <td className="break-words px-3 py-3 align-top leading-5 lg:px-4">
                    {gemma}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="grid gap-px bg-border md:hidden">
          {MODEL_COLUMNS.map((model) => (
            <article key={model.name} className="min-w-0 bg-card p-5">
              <h3 className="text-sm font-bold">{model.name}</h3>
              <dl className="mt-4 space-y-3">
                {COMPARISON.map((row) => (
                  <div
                    key={row[0]}
                    className="grid min-w-0 grid-cols-[96px_minmax(0,1fr)] gap-3 text-xs leading-5"
                  >
                    <dt className="font-semibold text-muted-foreground">
                      {row[0]}
                    </dt>
                    <dd className="min-w-0 break-words">{row[model.index]}</dd>
                  </div>
                ))}
              </dl>
            </article>
          ))}
        </div>
      </div>
      <AttentionPatternViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          이 표에서 local/global 비율보다 먼저 볼 열은 KV heads와
          head_dim입니다. Muse는 52개 text layer 전체에서 KV head 2개와 head_dim
          128을 사용하므로 기본 cache shape가 매우 작습니다. Gemma는 local
          layer에 KV head 16개와 head_dim 256을 사용하고 global layer는 별도
          shape를 가지므로, local window를 회수하지 않는 runtime에서는 예상보다
          큰 cache가 잡힐 수 있습니다. 다음 절에서는 이 차이를 식으로
          계산합니다.
        </p>
      </div>
    </section>
  );
}

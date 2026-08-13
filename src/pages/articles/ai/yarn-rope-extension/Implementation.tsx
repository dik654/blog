const ropeConfig = {
  rope_scaling: {
    rope_type: "yarn",
    factor: 4.0,
    original_max_position_embeddings: 32768,
  },
};

const vllmCommand = [
  "vllm serve Qwen/Qwen3-32B \\",
  "  --rope-scaling '{\"rope_type\":\"yarn\",\"factor\":4.0,\"original_max_position_embeddings\":32768}' \\",
  "  --max-model-len 131072",
].join("\n");

const llamaCommand = [
  "llama-server -m model.gguf \\",
  "  --rope-scaling yarn \\",
  "  --rope-scale 4 \\",
  "  --yarn-orig-ctx 32768 \\",
  "  --ctx-size 131072",
].join("\n");

const checks = [
  ["원래 길이", "논문 숫자가 아니라 checkpoint가 실제 학습된 context를 쓴다."],
  ["Factor", "target length ÷ original length와 config factor가 일치하는지 확인한다."],
  ["중복 적용", "Model config에 YaRN이 이미 있으면 CLI override를 다시 넣지 않는다."],
  ["메모리", "max_model_len을 늘린 뒤 KV cache capacity와 concurrency를 다시 계산한다."],
  ["품질", "최대 길이 실행, long-context task, 짧은 prompt regression을 따로 측정한다."],
];

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="not-prose my-4 overflow-x-auto rounded-xl border bg-zinc-950 p-4 text-sm leading-6 text-zinc-100">
      <code>{children}</code>
    </pre>
  );
}

export default function Implementation() {
  return (
    <section id="implementation" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        구현에서는 model config를 먼저 읽고 필요한 값만 override한다
      </h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          YaRN 설정의 필수 정보는 scaling 방식, factor와 원래 context length다.
          다만 field 이름은 라이브러리 버전에 따라 달라졌다. 현재 Transformers는
          <code>rope_parameters</code>를 공식 config 항목으로 설명하며, 기존
          <code>rope_scaling</code> 형식도 호환을 위해 표준화한다. 배포할 때는
          model repository가 안내하는 형식과 설치한 library 버전을 함께
          확인해야 한다.
        </p>

        <h3>Qwen3 문서의 static YaRN 예시</h3>
        <p>
          Qwen3-32B model card는 32,768을 원래 context로 두고 factor 4로
          131,072까지 확장하는 다음 설정을 안내한다. 이것은 Qwen3-32B에 대한
          예시이며 다른 model에 그대로 복사할 기본값은 아니다.
        </p>
      </div>

      <CodeBlock>{JSON.stringify(ropeConfig, null, 2)}</CodeBlock>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Qwen 문서는 여러 open-source framework가 static YaRN을 구현한다고
          명시한다. Static scaling은 짧은 입력에도 같은 factor를 쓰므로, 대부분의
          요청이 짧다면 불필요한 품질 저하가 없는지 비교해야 한다.
        </p>

        <h3>vLLM</h3>
        <p>
          Model config에 설정을 저장하지 않을 때는 CLI의 실제 option 이름인
          <code>--rope-scaling</code>과 <code>--max-model-len</code>을 함께
          지정할 수 있다. 최신 vLLM의 Python 예제는
          <code>hf_overrides</code> 안의 <code>rope_parameters</code>를 사용한다.
        </p>
      </div>

      <CodeBlock>{vllmCommand}</CodeBlock>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>llama.cpp</h3>
        <p>
          llama.cpp는 <code>--rope-scaling yarn</code>,
          <code>--rope-scale</code>, <code>--yarn-orig-ctx</code>를 제공한다.
          정상 배포에서는 올바른 YaRN metadata가 들어 있는 GGUF를 사용하는 편이
          안전하며, CLI override는 model metadata와 충돌하지 않는지 log로
          확인해야 한다.
        </p>
      </div>

      <CodeBlock>{llamaCommand}</CodeBlock>

      <figure data-viz="yarn-deployment-checklist" className="not-prose my-9 overflow-hidden rounded-xl border border-border/75 bg-card">
        <figcaption className="border-b bg-muted/50 px-4 py-3 text-sm font-semibold sm:px-6">
          배포 전 확인할 항목
        </figcaption>
        <div className="divide-y">
          {checks.map(([title, body]) => (
            <div
              key={title}
              className="grid gap-1 px-4 py-4 sm:grid-cols-[8rem_1fr] sm:gap-4 sm:px-6"
            >
              <p className="font-semibold">{title}</p>
              <p className="text-sm leading-6 text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </figure>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>성공 조건은 “서버가 떴다”가 아니다</h3>
        <p>
          먼저 original context 안에서 baseline과 결과를 비교하고, 목표 길이의
          여러 위치에 needle을 배치해 retrieval을 측정한다. 그다음 여러 문서의
          근거를 결합하는 task와 실제 workload를 평가한다. 마지막으로 GPU
          memory, time to first token과 동시 처리량을 기록해야 위치 확장과 serving
          capacity를 혼동하지 않을 수 있다.
        </p>

        <h3>원문과 구현 문서는 따로 확인한다</h3>
        <ul>
          <li><a href="https://arxiv.org/abs/2104.09864" target="_blank" rel="noreferrer">RoFormer: RoPE 원 논문</a></li>
          <li><a href="https://arxiv.org/abs/2306.15595" target="_blank" rel="noreferrer">Position Interpolation 원 논문</a></li>
          <li><a href="https://arxiv.org/abs/2309.00071" target="_blank" rel="noreferrer">YaRN 원 논문</a></li>
          <li><a href="https://huggingface.co/docs/transformers/internal/rope_utils" target="_blank" rel="noreferrer">Transformers RoPE parameters 공식 문서</a></li>
        </ul>
      </div>
    </section>
  );
}

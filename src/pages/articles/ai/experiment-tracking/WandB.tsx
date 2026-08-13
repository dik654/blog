import ExplainedFormula from "@/components/ui/explained-formula";
import WandBFlowViz from "./viz/WandBFlowViz";

export default function WandB() {
  return (
    <section id="wandb" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">W&amp;B에서는 chart보다 먼저 metric의 시간축과 artifact version을 고정합니다</h2>
      <div className="prose max-w-none prose-neutral dark:prose-invert">
        <p>
          <code>wandb.init</code>으로 만든 run에는 spec digest·attempt ID·resolved config와 input artifact versions를 기록합니다. 사람이 읽는
          name과 group은 탐색을 돕는 metadata로 사용하고, 재현 경로는 immutable run ID와 artifact version을 기준으로 삼습니다. Dataset,
          split, checkpoint와 prediction을 artifact로 연결하면 input을 사용한 run과 output을 만든 run을 양방향으로 찾을 수 있습니다.
        </p>
        <p>
          Learning curve를 비교할 때 가장 흔한 오류는 x축이 다른 run을 같은 step처럼 겹치는 것입니다. <code>wandb.log</code> 호출 횟수는
          micro-batch iteration·optimizer update·processed token·epoch 중 어느 것도 자동으로 보장하지 않습니다. 실제 비교 단위를 별도
          field로 log하고 <code>define_metric</code>의 step metric으로 연결합니다.
        </p>
      </div>

      <ExplainedFormula
        question="Batch size와 gradient accumulation이 다른 두 run의 learning curve를 어떤 좌표에서 비교해야 할까요?"
        idea={<>각 metric observation에 optimizer update·seen sample/token·wall time을 함께 저장합니다. 필요한 progress coordinate를 선택해 같은 자원 지점끼리 비교합니다.</>}
        formula={String.raw`r_k=(u_k,n_k,t_k,m_k),\qquad p_k=\frac{n_k}{N_{\mathrm{budget}}}`}
        terms={[
          { symbol: "u_k", name: "optimizer update", description: "Gradient accumulation이 끝나 실제 parameter가 바뀐 누적 횟수입니다." },
          { symbol: "n_k", name: "processed units", description: "지금까지 처리한 valid samples 또는 tokens의 누적 수입니다." },
          { symbol: "t_k", name: "wall-clock time", description: "Run 시작 또는 training 시작부터 지난 실제 시간입니다." },
          { symbol: "m_k", name: "metric observation", description: "해당 좌표에서 측정한 loss·quality·system metric입니다." },
          { symbol: "p_k", name: "normalized progress", description: "사전에 정한 전체 sample/token budget 중 처리한 비율입니다." },
        ]}
        assumptions={[
          "Update·sample·token 중 task에 맞는 비교 clock을 사전에 고정합니다.",
          "Validation metric은 같은 immutable evaluation artifact와 reducer에서 계산합니다.",
          "Wall time 비교에는 hardware·world size·precision·logging overhead를 함께 기록합니다.",
        ]}
        interpretation="한 run이 update 1,000에서 1M token, 다른 run이 4M token을 봤다면 update 축의 같은 위치가 같은 data budget을 뜻하지 않습니다."
      />

      <div className="not-prose my-8"><WandBFlowViz /></div>

      <div className="prose max-w-none prose-neutral dark:prose-invert">
        <p>
          <code>latest</code>·<code>candidate</code>·<code>approved</code> 같은 alias는 움직이는 pointer이고 <code>v17</code> 같은 artifact version은
          고정 reference입니다. 사람이 보는 dashboard에는 alias가 편하지만 evaluation report와 deployment receipt에는 그 순간 alias가
          가리킨 immutable version과 digest를 resolve해 저장해야 합니다. 나중에 alias가 v18로 옮겨져도 과거 report의 v17은 바뀌지
          않아야 합니다.
        </p>
      </div>

      <ExplainedFormula
        question="움직이는 alias를 사용하면서도 과거 배포를 정확히 재현하려면 무엇을 저장해야 할까요?"
        idea={<>Alias 변경은 별도의 versioned event로 남기고, 모든 승인·배포 receipt에는 resolve된 immutable version을 함께 고정합니다.</>}
        formula={String.raw`\operatorname{resolve}(\mathrm{alias},t)=v_j,\qquad \operatorname{receipt}_t=(\mathrm{alias},v_j,H(a_j),\operatorname{approver},t)`}
        terms={[
          { symbol: "alias", name: "mutable named reference", description: "latest·candidate·champion처럼 다른 version으로 재할당할 수 있는 이름입니다." },
          { symbol: "v_j", name: "immutable artifact version", description: "특정 artifact bytes와 metadata를 가리키는 변경되지 않는 version입니다." },
          { symbol: "t", name: "resolution time", description: "Alias가 어느 version을 가리켰는지 확인한 시각 또는 registry revision입니다." },
          { symbol: "receipt", name: "promotion receipt", description: "Alias·resolved version·digest·승인자·시각을 묶은 감사 기록입니다." },
        ]}
        assumptions={[
          "Alias 변경 권한과 protected alias 정책을 team role에 맞게 제한합니다.",
          "Deployment는 시작 시 resolve한 version을 pin하고 request 도중 alias를 다시 읽지 않습니다.",
          "Rollback도 과거 alias 이름이 아니라 검증된 immutable version으로 수행합니다.",
        ]}
        interpretation="오늘 candidate가 v17이고 내일 v18로 옮겨져도 오늘의 report는 v17과 digest를 계속 가리킵니다. Alias만 저장하면 과거 결과가 조용히 다른 model을 뜻하게 됩니다."
      />

      <div id="standard-wandb-tracking" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">공식 문서 · W&amp;B metric logging과 artifact alias</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          W&amp;B 문서는 <code>wandb.log</code>의 기본 step과 <code>define_metric</code>으로 custom x-axis를 연결하는 방법, artifact version에
          unique version과 mutable alias를 붙이는 방식을 설명합니다. 이 글은 현재 API semantics를 구현 기준으로 사용하지만, 자동 logging이
          data rights·split correctness·재현성에 필요한 모든 field를 알아서 수집한다는 뜻으로 확대하지 않습니다.
        </p>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm font-medium">
          <a className="text-primary hover:underline" href="https://docs.wandb.ai/guides/track/log/" target="_blank" rel="noreferrer">Metric logging</a>
          <a className="text-primary hover:underline" href="https://docs.wandb.ai/models/registry/aliases" target="_blank" rel="noreferrer">Artifact aliases</a>
        </div>
      </div>

      <div className="prose max-w-none prose-neutral dark:prose-invert">
        <p>
          Secret·raw personal data·unredacted prompt와 대규모 media를 무분별하게 log하지 않도록 key allowlist, redaction, retention과 access
          policy를 둡니다. Sweep도 search space·sampler·pruner revision과 COMPLETE/PRUNED/FAIL history를 artifact로 남기되, 알고리즘 선택과
          outer evaluation은 하이퍼파라미터 튜닝 글의 계약을 따릅니다.
        </p>
      </div>
    </section>
  );
}

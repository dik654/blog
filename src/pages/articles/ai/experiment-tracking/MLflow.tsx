import ExplainedFormula from "@/components/ui/explained-formula";
import MLflowArchViz from "./viz/MLflowArchViz";

export default function MLflow() {
  return (
    <section id="mlflow" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">MLflow에서는 metadata database와 artifact object를 분리하되, 둘의 수명은 함께 보장합니다</h2>
      <div className="prose max-w-none prose-neutral dark:prose-invert">
        <p>
          Tracking server는 run ID·parameter·metric·tag·artifact URI 같은 metadata를 backend store에 기록하고, model weight·prediction·report
          같은 큰 파일은 artifact store에 둡니다. 두 store는 크기·query pattern·backup 방식이 다르기 때문에 분리하는 편이 자연스럽지만,
          metadata만 남고 object가 삭제되거나 object는 있는데 producer run이 사라지면 lineage는 깨집니다.
        </p>
        <p>
          Self-hosting에서는 database migration·backup·restore와 object versioning·retention·encryption·access role을 각각 설계한 뒤
          referential-integrity job으로 연결합니다. Tracking server가 artifact를 proxy하는지 client가 object store에 직접 접근하는지도
          credential 경계에 영향을 줍니다. Autologging은 편리한 collector일 뿐 이 운영 설계를 대신하지 않습니다.
        </p>
      </div>

      <div className="not-prose my-8"><MLflowArchViz /></div>

      <ExplainedFormula
        question="Backend metadata가 가리키는 artifact가 실제로 재생 가능한지 어떤 조건으로 검사할까요?"
        idea={<>각 필수 output reference에 대해 object가 존재하고, 읽을 권한이 있으며, 내려받은 bytes와 schema가 기록된 값과 같은지 검사합니다.</>}
        formula={String.raw`\operatorname{replayable}(r)=\bigwedge_{a\in A_{\mathrm{required}}(r)}\left[\operatorname{exists}(\operatorname{uri}_a)\land H(\operatorname{load}(\operatorname{uri}_a))=d_a\land \operatorname{schemaOK}(a)\right]`}
        terms={[
          { symbol: "r", name: "run metadata record", description: "Backend store에 남은 execution attempt와 artifact references입니다." },
          { symbol: "A_required", name: "required artifacts", description: "재생과 승인에 반드시 필요한 config·checkpoint·prediction·report 집합입니다." },
          { symbol: "exists and load", name: "availability check", description: "현재 service identity로 object가 실제 존재하고 읽히는지 확인합니다." },
          { symbol: "schemaOK", name: "semantic validation", description: "Shape·row IDs·signature·format version이 소비자 계약과 맞는지 검사합니다." },
        ]}
        assumptions={[
          "Temporary network failure와 영구 삭제를 구분하는 retry·alert 정책을 둡니다.",
          "Backend와 artifact backup이 같은 recovery point 또는 검증 가능한 mapping을 가집니다.",
          "Required artifact 집합은 task·lifecycle stage별로 versioning합니다.",
        ]}
        interpretation="Run page가 열리는 것만으로 replayable하지 않습니다. Checkpoint URI가 404이거나 bytes digest가 바뀌거나 signature가 맞지 않으면 해당 run은 비교·승인에서 제외합니다."
      />

      <div className="prose max-w-none prose-neutral dark:prose-invert">
        <p>
          Model Registry에는 source run, immutable model version, input/output signature, evaluation report, validation status와 approval event를
          연결합니다. 현재 MLflow는 고정된 Model Stages를 deprecated하고 version tags·aliases와 분리된 environment를 사용하는 방향을
          안내합니다. 따라서 예전의 Staging→Production 표만 그대로 설명하지 않고, mutable alias와 access-controlled environment를
          구분해야 합니다.
        </p>
        <p>
          Serving이 registry alias를 읽더라도 deployment receipt에는 resolve된 model version·artifact digest·container/config revision과
          endpoint rollout ID를 남깁니다. Registry의 champion alias와 실제 production traffic이 다른 version을 사용한다면 drift를 alert해야
          하며, rollback은 이전의 immutable version과 serving config를 함께 복원합니다.
        </p>
      </div>

      <div id="paper-mlflow-lifecycle" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">프로젝트 논문 · Accelerating the Machine Learning Lifecycle with MLflow</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          MLflow 초기 논문은 서로 다른 ML library와 deployment 환경에서 experiment tracking·reproducible projects·model packaging을 공통
          interface로 다루려는 문제와 MLflow의 초기 component 설계를 설명했습니다. 현재 backend store·registry·alias API의 세부 동작은
          이후 크게 변했으므로 논문은 설계 배경으로, 현재 공식 문서는 versioned 구현 기준으로 나눠 읽습니다.
        </p>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm font-medium">
          <a className="text-primary hover:underline" href="https://people.eecs.berkeley.edu/~alig/papers/mlflow.pdf" target="_blank" rel="noreferrer">논문 PDF</a>
          <a className="text-primary hover:underline" href="https://mlflow.org/docs/latest/self-hosting/architecture/overview/" target="_blank" rel="noreferrer">현재 architecture 문서</a>
          <a className="text-primary hover:underline" href="https://mlflow.org/docs/latest/ml/model-registry/workflow/" target="_blank" rel="noreferrer">현재 registry workflow</a>
        </div>
      </div>
    </section>
  );
}

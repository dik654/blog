import ContentBoundary from "@/components/articles/content-boundary";
import ExplainedFormula from "@/components/ui/explained-formula";
import ExperimentChaosViz from "./viz/ExperimentChaosViz";

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">실험 추적은 그래프를 예쁘게 그리는 일이 아니라, 한 결과가 어디서 왔는지 다시 계산할 수 있게 만드는 일입니다</h2>
      <div className="prose max-w-none prose-neutral dark:prose-invert">
        <p>
          “validation loss 0.213”만 저장하면 그 숫자를 만든 data, split, code, config와 checkpoint를 알 수 없습니다. Dashboard는 결과를
          보여 주는 화면일 뿐이고, 추적의 실제 단위는 <strong>변경되지 않는 input snapshot → execution attempt → output artifact →
          evaluation report</strong>로 이어지는 provenance입니다. 어느 output에서든 producer run과 모든 input으로 거슬러 올라갈 수 있어야
          하며, 같은 input에서 다시 실행할 명령도 남아야 합니다.
        </p>
        <p>
          먼저 “같은 실험”과 “같은 실행”을 나눕니다. 같은 model·data·config를 여러 seed로 실행한 것은 같은 experiment family의 다른
          attempts이고, worker 장애 뒤 retry한 실행도 원 attempt를 덮어쓰지 않습니다. 사람이 붙인 run name은 검색용 label일 뿐 identity가
          아닙니다. Training pipeline 글이 소유한 run contract와 provenance를 가져오고, 여기서는 tracker 안에서 identity·artifact·storage와
          reproduction 판정을 어떻게 보존하는지 다룹니다.
        </p>
      </div>

      <ExplainedFormula
        question="두 실행이 같은 조건의 반복인지, 서로 다른 실험인지 어떻게 기계적으로 구분할까요?"
        idea={<>실행 전에 모든 input reference와 resolved config를 정렬해 digest를 만들고, 실제 attempt에는 seed·retry·worker identity를 별도로 붙입니다.</>}
        formula={String.raw`d_{\mathrm{spec}}=H(c\Vert d\Vert s\Vert g\Vert e\Vert k),\qquad \operatorname{attemptID}=(d_{\mathrm{spec}},\operatorname{seed},\operatorname{retry},\operatorname{worker})`}
        terms={[
          { symbol: "H", name: "content digest", description: "정규화된 bytes가 같을 때 같은 값을 내는 cryptographic hash 함수입니다." },
          { symbol: "c,d,s", name: "code · data · split", description: "Code revision/diff, immutable data version과 row/group/time split manifest입니다." },
          { symbol: "g,e,k", name: "config · environment · command", description: "Default가 모두 채워진 config, dependency/image/hardware와 실제 entry command입니다." },
          { symbol: "attemptID", name: "execution attempt identity", description: "같은 spec의 seed 반복과 retry까지 서로 덮어쓰지 않게 하는 실행 식별자입니다." },
        ]}
        assumptions={[
          "Directory 이름이 아니라 content digest 또는 immutable version을 사용합니다.",
          "Secret 값은 저장하지 않되 secret version·provider·policy 같은 재현에 필요한 비민감 metadata를 기록합니다.",
          "External API·mutable table은 response snapshot 또는 as-of/version identifier가 없으면 같은 spec으로 보지 않습니다.",
        ]}
        interpretation="Config 한 필드가 default에서 명시값으로 달라지면 spec digest가 달라지고, 같은 spec을 seed 1·2로 실행하면 digest는 같지만 attempt ID는 다릅니다."
      />

      <div className="not-prose my-8"><ExperimentChaosViz /></div>

      <div className="prose max-w-none prose-neutral dark:prose-invert">
        <p>
          Run 시작 시에는 raw YAML만 저장하지 않고 inheritance·environment override·CLI flag가 모두 적용된 <em>resolved config</em>를
          snapshot으로 남깁니다. 종료 시에는 checkpoint, OOF/test prediction, metric numerator·denominator, error slice report와 logs를
          output artifact로 연결합니다. 실패 run도 exit code·last step·stderr·partial artifact를 보존해야 성공한 결과만 남는 survivorship
          bias와 같은 장애의 반복을 막을 수 있습니다.
        </p>
      </div>

      <ExplainedFormula
        question="Artifact URI가 남아 있으면 provenance가 보존됐다고 볼 수 있을까요?"
        idea={<>Location은 바뀌거나 같은 경로가 덮어써질 수 있습니다. URI와 함께 content digest·schema·size·producer를 저장하고 다시 읽을 때 bytes를 검증합니다.</>}
        formula={String.raw`\operatorname{artifactRef}(a)=(\operatorname{uri}_a,H(\operatorname{bytes}_a),\operatorname{schema}_a,\operatorname{size}_a,\operatorname{producerRun}_a)`}
        terms={[
          { symbol: "uri", name: "storage location", description: "Object store나 file store에서 artifact를 읽을 위치입니다." },
          { symbol: "H(bytes)", name: "content checksum", description: "다운로드한 실제 bytes가 producer가 기록한 내용과 같은지 확인합니다." },
          { symbol: "schema", name: "semantic contract", description: "Prediction의 row ID·class order·dtype처럼 bytes를 해석하는 규약과 version입니다." },
          { symbol: "producerRun", name: "producer edge", description: "이 artifact를 만든 immutable execution attempt입니다." },
        ]}
        assumptions={[
          "Multipart upload·serialization이 달라지는 경우 logical digest와 physical object digest의 범위를 구분합니다.",
          "Artifact retention·access policy가 metadata retention보다 짧아져 dangling reference가 생기지 않게 합니다.",
          "Schema가 같다는 선언만 믿지 않고 row count·ID uniqueness·shape fixture를 함께 검사합니다.",
        ]}
        interpretation="s3://bucket/model/latest.pt만 저장하면 같은 경로가 내일 다른 bytes를 가리킬 수 있습니다. Digest와 producer run이 있어야 과거 report가 사용한 정확한 model을 찾습니다."
      />

      <div className="prose max-w-none prose-neutral dark:prose-invert">
        <p>
          W&amp;B와 MLflow는 이 계약을 구현할 수 있는 도구이지 계약 자체는 아닙니다. 다음 두 섹션에서는 같은 tool-neutral schema를 각
          제품의 run·artifact·tracking store·registry에 매핑합니다. Sweep 탐색 알고리즘과 pruning은 하이퍼파라미터 튜닝 글이 소유하고,
          이 글에서는 그 trial history가 빠짐없이 남는지만 확인합니다.
        </p>
      </div>
      <ContentBoundary article="experiment-tracking" />
    </section>
  );
}

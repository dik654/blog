import ExplainedFormula from "@/components/ui/explained-formula";
import ExternalDataViz from "./viz/ExternalDataViz";

export default function ExternalData() {
  return (
    <section id="external-data" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">외부 데이터는 양보다 provenance와 독립성이 중요합니다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          FaceForensics++, DFDC, Celeb-DF 같은 benchmark는 manipulation, actor,
          recording과 compression 구성이 다릅니다. 단순히 합치면 같은 source
          video의 파생본이나 identity가 split을 넘을 수 있으므로 dataset ID,
          source clip, person, generator, codec과 license를 manifest로 관리합니다.
        </p>
        <p>
          DFDC처럼 참여자가 likeness manipulation에 동의한 dataset은 provenance의
          좋은 기준을 보여줍니다. 자체 수집·합성 데이터도 명시적인 consent와 이용
          범위, 삭제 정책을 갖춰야 하며 공개 인물 영상을 임의로 수집해 조작하는
          방식을 기본 recipe로 두지 않습니다.
        </p>
      </div>
      <ExplainedFormula
        question="Generator·codec·resolution coverage가 많아 보인다는 말을 재현 가능한 표로 어떻게 바꿀까?"
        idea={<>각 source-independent clip을 하나의 coverage cell에 세고 train·validation·OOD test를 분리합니다. Frame 수가 아니라 독립 source 수를 세어 긴 video 하나가 coverage를 부풀리지 않게 합니다.</>}
        formula={String.raw`\begin{aligned}
z_i^{g,c,r,s}&=I(g_i=g,\ c_i=c,\ r_i=r),\\
N_{g,c,r}^{(s)}&=\sum_{i:\,\operatorname{split}_i=s}z_i^{g,c,r,s}.
\end{aligned}`}
        terms={[
          { symbol: "g,c,r", name: "coverage axes", description: "Generator family, codec·bitrate condition, resolution bin입니다." },
          { symbol: "s", name: "split", description: "Training, selection validation 또는 untouched OOD test를 구분합니다." },
          { symbol: "N", name: "independent source count", description: "해당 cell에 속하는 source-independent clip 또는 identity group의 개수입니다." },
          { symbol: "zᵢ", name: "cell membership", description: "Source i의 generator·codec·resolution metadata가 현재 cell과 일치하면 1입니다." },
          { symbol: "I(·)", name: "membership indicator", description: "Sample metadata가 해당 cell 조건을 모두 만족하면 1입니다." },
        ]}
        assumptions={["한 source의 여러 frame·crop·re-encode를 독립 sample처럼 중복 계산하지 않습니다.", "Unknown generator나 codec은 unknown category로 보존하며 추정값을 사실처럼 채우지 않습니다.", "Demographic·capture-condition coverage는 consent와 적정성 범위 안에서 별도 축·slice로 검토합니다."]}
        interpretation="빈 cell은 data limitation을 드러냅니다. Test의 unseen generator cell을 채우기 위해 같은 source를 training에 넣으면 coverage는 늘지만 일반화 질문은 사라집니다."
      />
      <div className="not-prose my-8"><ExternalDataViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Coverage matrix에서 빈 영역을 찾습니다</h3>
        <p>
          Generator family × codec × resolution × demographic·capture condition을
          matrix로 만들고 train과 evaluation coverage를 구분합니다. 빈 cell을
          채우더라도 evaluation generator와 source identity를 training에
          섞지 않아야 unseen-manipulation 성능을 측정할 수 있습니다.
        </p>
        <h3>Label review도 out-of-fold evidence로 진행합니다</h3>
        <p>
          Duplicate detection, decode failure와 face-track coverage를 먼저
          점검하고, model–label disagreement는 검수 우선순위를 정하는 신호로만
          사용합니다. Model prediction과 다르다는 이유만으로 label을 자동 변경하면
          기존 model bias를 dataset에 다시 주입할 수 있습니다.
        </p>
      </div>
      <div id="paper-dfdc" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">논문 읽기 · DFDC dataset</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">Dolhansky 등은 참여자가 촬영과 likeness manipulation에 동의한 대규모 face-swap video dataset과 challenge를 구축했습니다. 규모뿐 아니라 consent·capture·manipulation provenance가 중요한 contribution이며, DFDC-only 결과를 모든 실제 조작의 진위 증명으로 확대하면 안 됩니다.</p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://arxiv.org/abs/2006.07397" target="_blank" rel="noreferrer">Dataset 구성·consent·challenge 분석 보기</a>
      </div>
    </section>
  );
}

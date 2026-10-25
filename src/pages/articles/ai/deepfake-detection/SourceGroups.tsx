import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import SourceGroupViz from "./viz/SourceGroupViz";

export default function SourceGroups() {
  return (
    <section id="source-groups" data-teach-level="3" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">같은 원본의 파생본을 한 split에 둡니다</h2>
      <SourceGroupViz />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          파일 단위 무작위 분리는 <code>frame120-crop.png</code>를 train에 두고 같은 frame을
          압축한 <code>frame120-social.jpg</code>를 test에 둘 수 있습니다. Detector는 조작
          방식보다 사람의 얼굴·배경·센서 무늬를 기억해도 좋은 점수를 받을 수 있습니다.
          그래서 파일을 나누기 전에 각 파일을 원본 영상과 등장 인물의 group key로
          되돌립니다.
        </p>
        <p>
          이 글의 단순한 한 사람 사례에서는 <code>(source clip, identity)</code> 쌍이면
          충분합니다. 여러 사람이 나오거나 source 얼굴과 target 얼굴이 다른 조작에서는
          source·target identity 집합, capture session, 원본 쌍까지 group에 포함해야 합니다.
          Group 정의는 데이터가 실제로 공유하는 증거보다 좁아서는 안 됩니다.
        </p>
      </div>
      <ExplainedFormula
        question="같은 원본 증거가 train과 test에 함께 남지 않았는지 어떻게 검사할까?"
        idea={<>각 파일을 원본 group으로 되돌린 뒤 split별 group 집합을 만듭니다. 교집합이 비었을 때만 source-independent split을 통과합니다.</>}
        formula={String.raw`g_i=(s_i,p_i),\qquad G_{\rm train}\cap G_{\rm test}=\varnothing`}
        annotatedFormula={String.raw`\begin{aligned}
g_i&=\underbrace{(s_i,p_i)}_{\text{파일 i의 원본 영상과 등장 인물}},\\
O&=\underbrace{G_{\rm train}\cap G_{\rm test}}_{\text{양쪽이 공유한 원본 group}},\\
\operatorname{pass}&=\underbrace{\mathbf 1[|O|=0]}_{\text{공유 group이 없을 때만 통과}}.
\end{aligned}`}
        operations={[
          { expression: String.raw`(s_i,p_i)`, annotation: ["frame·crop·재인코딩 파일을 원본 영상과 인물로 되돌림", "이 사례의 두 파생본은 모두 (clip-042, person-C)"] },
          { expression: String.raw`G_{\rm train}\cap G_{\rm test}`, annotation: ["train과 test의 group key를 교차", "수정 전에는 group 042-C 한 개가 겹쳐 |O|=1"] },
          { expression: String.raw`|O|=0`, annotation: ["group 042-C 전체를 test로 옮긴 뒤 다시 계산", "Gtrain={(017,A)}, Gtest={(042,C),(108,D)}라서 교집합 0"] },
        ]}
        terms={[
          { symbol: "sᵢ", name: "원본 영상 식별자", description: "frame·crop·codec 변환이 시작되기 전 원본 clip을 가리킵니다." },
          { symbol: "pᵢ", name: "등장 인물 식별자", description: "파일 i에 나타난 인물 또는 조작의 source·target identity 집합입니다." },
          { symbol: "O", name: "겹친 원본 묶음", description: "train과 test가 함께 가진 source·identity group입니다." },
        ]}
        assumptions={[
          "모든 파생본이 원본 영상과 등장 인물로 되돌아갈 lineage를 보존합니다.",
          "Metadata가 빠진 파일은 perceptual fingerprint와 수동 확인으로 near-duplicate를 찾습니다.",
          "Source group 분리와 generator holdout은 다른 검사이므로 manifest에서 별도 축으로 기록합니다.",
        ]}
        interpretation="수정 전에는 clip-042의 crop과 JPEG가 양쪽에 있어 |O|=1입니다. 모든 파생본을 test로 옮기면 교집합은 0이 됩니다. 이 결과는 원본 누수를 막았다는 뜻이지 새 generator를 가렸다는 뜻은 아닙니다."
      />
      <div id="paper-faceforensics" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">논문 읽기 · FaceForensics++</p>
        <CitationBlock
          type="paper"
          citeKey={1}
          source="Rössler et al. — FaceForensics++"
          href="https://openaccess.thecvf.com/content_ICCV_2019/html/Rossler_FaceForensics_Learning_to_Detect_Manipulated_Facial_Images_ICCV_2019_paper.html"
        >
          <p className="text-sm leading-6 text-muted-foreground">
            이 연구는 Face2Face·FaceSwap·DeepFakes·NeuralTextures와 여러 압축 조건을 공통
            벤치마크에서 비교합니다. 여기서 가져오는 근거는 조작 방법과 압축 조건을
            명시한 평가가 필요하다는 점입니다. 이 벤치마크 결과를 이후 모든 생성기와
            실제 유통 경로의 보장으로 넓히지 않습니다.
          </p>
        </CitationBlock>
      </div>
    </section>
  );
}

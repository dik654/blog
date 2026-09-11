import { CodeViewButton } from "@/components/code";
import type { CodeRef } from "@/components/code/types";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import { codeRefs } from "./codeRefs";
import DetectorViz from "./viz/DetectorViz";

export default function Detector({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="detector" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">프롬프트가 이미지 표현 자체를 바꿉니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          검출기는 이미지와 프롬프트를 각각 인코딩한 뒤, 이미지 토큰이 프롬프트 토큰을 cross-attention으로
          참조하게 만듭니다. 이 단계를 거치면 같은 사진이라도 무엇을 찾느냐에 따라 다른 특징이 강조된 표현이
          나옵니다. 그 위에서 학습된 질의들이 후보 영역을 뽑습니다.
        </p>

        <p className="leading-7">
          이미지와 텍스트는 같은 시각 인코더 계열을 공유합니다. 검출기와 추적기가 하나의 backbone을 함께 쓰므로
          영상에서 두 경로가 같은 특징 위에서 동작합니다. 프롬프트 인코딩만 분리돼 있고, 그 결과가 융합 단계에서
          이미지 쪽으로 주입됩니다.
        </p>

        <p className="leading-7">
          후보를 뽑는 부분은 질의 기반 검출기 구조입니다. 학습된 객체 질의가 조건부 이미지 표현에 cross-attention
          하고, 레이어마다 이 질의가 "이 개념과 맞는가"라는 이진 점수와 상자 보정값을 내놓습니다. 마스크는 별도
          head가 질의별로 만듭니다.
        </p>
      </div>

      <DetectorViz />

      <div className="not-prose mt-6 flex flex-wrap items-center gap-2">
        <CodeViewButton onClick={() => onCodeRef("fusion-encoder", codeRefs["fusion-encoder"])} />
        <span className="text-xs text-muted-foreground">이미지 토큰을 프롬프트에 조건 짓는 융합 인코더</span>
      </div>

      <AlgorithmBlock
        title="명사구 하나로 이미지 한 장을 처리하는 경로"
        input={["이미지", "짧은 명사구 또는 예시 상자", "학습된 객체 질의 집합"]}
        steps={[
          { code: "img_tok = image_encoder(image)", note: "프롬프트를 모르는 상태의 이미지 토큰입니다" },
          { code: "p_tok = text_encoder(np) 또는 exemplar_encoder(box, label)", note: "프롬프트 종류에 따라 다른 인코더를 씁니다" },
          { code: "cond = fusion_encoder(img_tok, prompt=p_tok)", note: "이미지 토큰이 프롬프트를 참조해 조건부 표현이 됩니다" },
          { code: "q, presence = decoder(queries, cond)", note: "질의는 후보를, 별도 토큰은 존재 여부를 담당합니다" },
          { code: "score_i = sigmoid(q_i) × sigmoid(presence)", note: "두 판단을 곱해 최종 점수를 만듭니다" },
          { code: "mask_i = mask_head(q_i, cond)", note: "살아남은 질의마다 마스크를 만듭니다" },
        ]}
        output="명사구에 해당하는 인스턴스들의 마스크와 점수 (없으면 빈 집합)"
      />

      <h3 id="exemplar-prompt" className="mt-10 mb-3 scroll-mt-24 text-xl font-semibold">
        예시 상자는 개념을 좁히는 신호입니다
      </h3>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-7">
          이름만으로 원하는 범위를 정확히 말하기 어려울 때가 있습니다. 사진 안의 물체 하나를 상자로 지목하면
          모델이 그 상자의 시각 특징을 프롬프트 토큰으로 받아들여 찾을 개념을 좁힙니다. 반대로 "이런 건 빼라"는
          부정 예시로도 줄 수 있습니다.
        </p>

        <p className="leading-7">
          인코딩 방식은 세 조각을 합치는 것입니다. 상자의 위치를 나타내는 임베딩, 긍정인지 부정인지를 나타내는
          라벨 임베딩, 그리고 그 영역에서 모아 낸 시각 특징입니다. 셋을 이어 붙여 작은 transformer에 통과시킨
          결과가 프롬프트 토큰이 됩니다.
        </p>

        <p className="leading-7">
          여기서 혼동하기 쉬운 점이 하나 있습니다. 예시 상자는 "그 안을 분할하라"는 지시가 아닙니다. 개념을
          정의하는 참고 자료이고, 출력은 여전히 사진 전체에서 같은 개념에 해당하는 모든 인스턴스입니다. 특정
          인스턴스 하나만 다루고 싶으면 그건 별도의 지목 경로입니다.
        </p>
      </div>

      <div className="mt-6">
        <ProgressiveDetail
          title="질의 기반 검출기를 왜 골랐나요"
          preview="후보 수를 미리 정하지 않고 질의 개수만큼 병렬로 뽑을 수 있어, 같은 개념이 몇 개든 한 번의 전방 계산으로 처리됩니다."
        >
          <p className="leading-7">
            영역 제안을 먼저 만들고 걸러 내는 방식은 단계마다 임계값과 후처리가 붙습니다. 학습된 질의가 직접
            후보를 내놓으면 중복 제거 규칙을 손으로 넣지 않아도 질의들끼리 역할을 나눠 갖게 학습됩니다.
          </p>
          <p className="leading-7">
            대신 질의 수가 상한이 됩니다. 한 사진에 같은 개념의 개체가 질의 수보다 많으면 전부 잡아내지 못합니다.
            군중이나 반복 패턴이 많은 장면이 이 구조에서 어려운 이유입니다.
          </p>
          <p className="leading-7">
            학습에는 정렬 손실과 보조 감독을 함께 씁니다. 어떤 질의가 어떤 정답에 대응하는지를 매칭으로 정하고,
            레이어마다 같은 감독을 반복해 깊은 디코더가 초반부터 유용한 후보를 내도록 유도합니다.
          </p>
        </ProgressiveDetail>
      </div>
    </section>
  );
}

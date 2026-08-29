import { Link } from "react-router-dom";
import TermBreakdown from "@/components/articles/term-breakdown";

export default function CompressionTaxonomy() {
  return (
    <section id="compression-taxonomy" className="scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">
        Model compression은 lever가 다르고, pruning은 다시 지우는 단위가 다릅니다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          Model 크기를 줄이는 방법은 하나가 아닙니다. Numeric precision을 낮추는
          quantization, teacher 지식을 더 작은 student가 다시 배우는
          distillation, 그리고 기존 parameter 자체를 지우는 pruning이 서로
          다른 lever로 나란히 존재합니다. 이 글은 그중 pruning, 그것도 개별
          weight가 아니라 연결된 단위를 지우는 쪽을 다룹니다.
        </p>
        <p>
          Parameter pruning은 이 세 lever 중 pruning 하나를 가리키는 이름이고,
          그 안에서 다시 무엇을 지우느냐로 갈립니다. 개별 weight를 자유롭게
          골라 지우는 쪽은{" "}
          <Link to="/ai/unstructured-pruning#overview">unstructured pruning</Link>
          이 다루고, channel·head·layer·expert처럼 연결된 dimension을 통째로
          지우는 쪽이 structured pruning, 곧 이 글입니다.
        </p>
        <p>
          10B parameter 모델에서 개별 weight 90%를 지우면 저장 공간은 크게
          줄어도 weight matrix의 shape 자체는 그대로 남습니다. 반면 channel을
          25% 지우면 다음 layer로 넘어가는 dense matmul의 크기 자체가
          줄어듭니다. 같은 90%·25%라는 숫자가 왜 다른 종류의 이득으로
          이어지는지는 아래 절에서 각각 확인합니다.
        </p>
      </div>
      <TermBreakdown
        title="Model compression의 세 lever"
        description="같은 목표(더 작은 model)를 서로 다른 축에서 이룹니다."
        items={[
          {
            term: "Quantization",
            description: "Weight·activation의 numeric precision을 낮춥니다.",
            example: (
              <Link to="/ai/quantization#affine-map">
                affine uniform quantizer로 실수를 integer code로 바꿉니다
              </Link>
            ),
            boundary: "Parameter 개수와 shape는 그대로 두고 표현 bit만 줄입니다.",
          },
          {
            term: "Distillation",
            description: "더 작은 student가 teacher 출력을 다시 학습합니다.",
            example: (
              <Link to="/ai/knowledge-distillation#overview">
                teacher logit·feature를 student가 흉내 냅니다
              </Link>
            ),
            boundary: "기존 weight를 지우지 않고 별도 model을 새로 학습합니다.",
          },
          {
            term: "Pruning (이 taxonomy)",
            description: "기존 model의 parameter·connection 자체를 지웁니다.",
            example: "개별 weight(unstructured) 또는 연결 단위(structured)를 지웁니다.",
            boundary:
              "지우는 단위에 따라 저장만 줄어드는지, 실제 연산량도 줄어드는지가 갈립니다.",
          },
        ]}
      />
    </section>
  );
}

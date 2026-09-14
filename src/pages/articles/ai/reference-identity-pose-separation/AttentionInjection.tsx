import { Link } from "react-router-dom";
import { CitationBlock } from "@/components/ui/citation";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import ScheduleViz from "./viz/ScheduleViz";

export default function AttentionInjection() {
  return (
    <section id="attention-injection" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">정체성을 잠재가 아니라 어텐션으로 넣습니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          다른 경로가 있습니다. 참조 얼굴에서 정체성 벡터만 뽑아 어텐션 계산에 끼워 넣는 방식입니다. 참조 픽셀 자체는 생성에 들어가지 않고 샘플링은 빈 잠재에서 완전한 노이즈로
          시작합니다.
        </p>

        <p className="leading-7">
          이 차이가 실제로 중요합니다. 픽셀이 남아 있었다면 인종과 성별과 나이가 함께 끌려옵니다. 벡터만 넣으면 그렇지 않아서 한 인구통계의 참조에서 다른 인구통계의 인물이 나올 수
          있습니다. 골격은 따라오는데 표현은 프롬프트가 정합니다.
        </p>

        <p className="leading-7">
          그런데 이 방식에도 자기 편향이 있습니다. 정면 얼굴 임베딩으로 학습됐기 때문에 매 프레임 정면 얼굴을
          밀어 넣습니다. 자세를 별도로 강제해도 머리만 정면으로 돌아옵니다.
        </p>
      </div>

      <ScheduleViz />

      <h3 id="schedule-start" className="mt-10 mb-3 scroll-mt-24 text-xl font-semibold">
        여기서 한 번 잘못 접을 뻔했습니다
      </h3>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-7">
          정체성을 초반 구간에만 걸어 봤습니다. 앞부분에서 인물을 정하고 뒷부분은 자유롭게 두면 방향이 풀릴
          것 같았습니다. 결과는 그대로였고, 저는 "이 방식은 여러 각도에 쓸 수 없다"고 결론을 적었습니다.
        </p>

        <p className="leading-7">
          그건 성급했고 시험한 방향도 틀렸습니다. 확산 모델에서 구조와 방향이 정해지는 것이 바로 그 초반
          구간입니다. 방향이 박히는 구간에만 정체성을 켜 놓고 왜 방향이 박히냐고 물은 셈입니다. 반대쪽 손잡이는
          건드리지도 않았습니다.
        </p>

        <p className="leading-7">
          반대쪽을 돌리자 바로 풀렸습니다. 자세로 방향이 잡힌 뒤에 정체성을 얹으니 머리가 돕니다. 전 구간
          적용에서 22.2도였던 측면 회전이 0.3 지점부터 켜면 62.7도, 0.5 지점부터 켜면 71.9도가 됩니다.
        </p>

        <p className="leading-7">
          다만 늦게 켤수록 정체성은 약해집니다. 0.5 지점에서는 회전이 71.9도인데 정체성이 0.100으로 무너집니다. 그래서 이 손잡이만으로는 답이 아니고 세기를 낮추는 쪽이 두 지표
          모두에서 더 좋았습니다.
        </p>
      </div>

      <div className="mt-6">
        <ProgressiveDetail
          title="세기를 낮추는 것과 늦게 켜는 것 중 무엇이 낫습니까"
          preview="실측에서는 세기를 낮춰 전 구간에 거는 쪽이 두 지표 모두에서 이겼습니다. 더 돌아가면서 정체성도 더 남습니다."
        >
          <p className="leading-7">
            전 구간 적용에서 세기를 1.3에서 0.7로 낮추면 회전이 22.2도에서 49.4도로 늘고 정체성이 0.399에서
            0.464로 올라갑니다. 한쪽을 얻고 다른 쪽을 잃는 관계가 아니라 둘 다 좋아집니다.
          </p>
          <p className="leading-7">
            늦게 켜는 쪽은 0.3 지점에서 회전 62.7도에 정체성 0.376입니다. 회전은 더 크지만 정체성이 조금 낮습니다. 0.5 지점은 회전이 가장 크지만 정체성이 쓸 수 없는
            수준입니다.
          </p>
          <p className="leading-7">
            둘을 함께 쓰는 조합도 가능합니다. 다만 이 회차에서는 세기를 낮춘 전 구간 적용만으로 네 각도가 전부
            성립해서 더 복잡하게 가지 않았습니다. 손잡이를 늘리면 각각의 기여를 다시 격리해야 합니다.
          </p>
        </ProgressiveDetail>
      </div>

      <CitationBlock
        source="프로젝트 실측 — 정체성 주입 세기와 적용 구간 (2026-09-11, RTX 4090 48GB)"
        citeKey={2}
        href="https://github.com/dik654/blog"
      >
        측면 뷰에서 세기 1.3 전 구간이 회전 22.2도·정체성 0.399, 0.3 지점부터가 62.7도·0.376, 0.5 지점부터가
        71.9도·0.100, 세기 0.7 전 구간이 49.4도·0.464였습니다. 초반에만 거는 설정으로는 방향이 풀리지 않았고,
        구조와 방향이 초반에 정해진다는 점에서 시험 방향 자체가 틀렸습니다.
      </CitationBlock>

      <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
        <p className="leading-7">
          어텐션 주입 자체의 구현과 참조 이미지를 문맥에 이어 붙이는 다른 접근은{" "}
          <Link to="/cs/ai/in-context-lora">In-Context LoRA</Link>가 다룹니다. 이 절은 그 주입을 언제 켜고 끄는지가
          방향에 미치는 영향만 다뤘습니다.
        </p>
      </div>
    </section>
  );
}

import { Link } from "react-router-dom";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import DistillFamilyViz from "./viz/DistillFamilyViz";

const FAMILY = [
  { name: "ViT-S", params: "21M", note: "가장 작은 배포용" },
  { name: "ViT-S+", params: "29M", note: "S와 B 사이를 메우는 변형" },
  { name: "ViT-B", params: "86M", note: "일반적인 기준점" },
  { name: "ViT-L", params: "0.3B", note: "품질 우선 배포" },
  { name: "ViT-H+", params: "0.8B", note: "7B 다음으로 큰 선택지" },
];

export default function PostHoc() {
  return (
    <section id="post-hoc" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">해상도와 크기는 학습을 다시 하지 않고 넓힙니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          100만 스텝짜리 사전학습을 해상도마다, 모델 크기마다 다시 돌릴 수는 없습니다. 그래서 큰 모델을 한 번만
          제대로 학습해 두고, 그 뒤에 짧은 적응 단계와 증류로 해상도·크기·텍스트 정렬을 붙입니다. 여기서도 관계
          구조를 붙잡는 장치가 함께 들어갑니다.
        </p>

        <p className="leading-7">
          해상도 적응은 1만 스텝입니다. 넓은 크롭을 512와 768 중에서, 좁은 크롭을 112·168·224·336 중에서 섞어
          넣어 여러 입력 크기를 한 단계 안에서 보게 합니다. 이 단계에서 기준 역할은 가장 큰 7B 모델이 맡아,
          해상도가 바뀌는 동안 패치 관계가 흐트러지지 않게 붙잡습니다.
        </p>

        <p className="leading-7">
          위치 정보 설계가 이 적응을 가능하게 합니다. 패치 좌표를 [-1, 1] 상자 안의 값으로 정규화해 두 패치의
          상대 위치로 attention에 편향을 주고, 학습 중에는 그 상자를 0.5배에서 2배 사이로 무작위로 늘렸다 줄입니다.
          입력 크기가 달라져도 좌표 규칙이 깨지지 않는 이유입니다.
        </p>

        <p className="leading-7">
          작은 모델은 증류로 만듭니다. 7B를 teacher로 두고 학생 모델을 100만 스텝 학습한 뒤 25만 스텝 동안 학습률을
          낮춰 마무리합니다. 공개된 계열은 다음과 같고, 자원이 더 제한된 환경을 위한 ConvNeXt 계열도 함께
          제공됩니다.
        </p>
      </div>

      <div className="not-prose my-6 overflow-x-auto">
        <table className="w-full min-w-[520px] border border-border text-sm">
          <thead>
            <tr className="bg-muted/50">
              {["모델", "파라미터", "자리"].map((h) => (
                <th key={h} className="border border-border px-3 py-2 text-left font-semibold">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {FAMILY.map((row) => (
              <tr key={row.name}>
                <td className="border border-border px-3 py-2 font-medium">{row.name}</td>
                <td className="border border-border px-3 py-2">{row.params}</td>
                <td className="border border-border px-3 py-2 text-muted-foreground">{row.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <DistillFamilyViz />

      <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
        <p className="leading-7">
          증류 모델이 7B와 같은 표현을 준다는 뜻은 아닙니다. 학생은 teacher의 출력을 따라가도록 학습된 별도
          모델이고, 어느 과제에서 얼마나 따라잡는지는 과제마다 다릅니다. 크기와 품질의 교환은{" "}
          <Link to="/cs/ai/image-backbone-scaling#budget-comparison">백본 예산 비교</Link>의 기준으로 각자 재야 합니다.
        </p>
      </div>

      <div className="mt-6">
        <ProgressiveDetail
          title="텍스트 정렬은 왜 사후 단계로 두나요"
          preview="이미지만으로 학습한 백본을 얼린 채 별도 텍스트 인코더를 맞추는 방식입니다. 자기지도 학습 목표 안에 텍스트가 들어가지 않습니다."
        >
          <p className="leading-7">
            이미지와 문장을 같은 공간에 맞추려면 짝지어진 데이터가 필요합니다. 그 데이터를 사전학습에 넣으면 더 이상
            순수한 자기지도 학습이 아니고, 짝 데이터의 편향이 표현 전체에 들어갑니다. 그래서 이미지만으로 학습을
            끝낸 뒤 별도 단계에서 텍스트 쪽을 붙입니다.
          </p>
          <p className="leading-7">
            결과적으로 텍스트 정렬 성능은 백본 자체의 성질이 아니라 그 사후 단계에 쓴 데이터와 목표에 달려 있습니다.
            같은 backbone이라도 정렬 단계가 다르면 검색 성능이 달라집니다. 공통 embedding 공간이 검색을 어떻게
            정하는지는 <Link to="/cs/ai/multimodal-retrieval-and-visual-grounding">멀티모달 검색</Link> 쪽 주제입니다.
          </p>
        </ProgressiveDetail>
      </div>
    </section>
  );
}

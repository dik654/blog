import { Link } from "react-router-dom";
import { CitationBlock } from "@/components/ui/citation";
import DistillViz from "./viz/DistillViz";

export default function DistillationBottleneck() {
  return (
    <section id="distillation-bottleneck" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">어휘가 천장이라던 진단이 사실은 가중치 문제였습니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          성별 둘, 나이 셋, 얼굴형 셋, 이목구비 넷을 조합해 일흔두 개 묘사를 만들고 한 모델에서 각각 하나씩
          생성했습니다. 채택된 인물은 열여덟 명이었고, 2211쌍 중 215쌍이 임계를 넘었습니다.
        </p>

        <p className="leading-7">
          중요한 것은 분해입니다. 성별과 나이를 고정하고 묘사만으로 열두 명을 구분하려 한 경우에 쌍 평균이
          임계값 바로 앞이었고 셋 중 하나가 같은 사람이었습니다. 얼굴형과 이목구비 서술어가 거의 아무것도
          만들지 못한 것입니다.
        </p>

        <p className="leading-7">
          그래서 "일흔두 개 묘사가 실질적으로 여섯 개"라고 적었습니다. 전체 평균이 낮아 보이는 것은 묘사가
          효과가 있어서가 아니라 성별과 나이가 구간을 갈라놓았기 때문이라는 진단이었습니다.
        </p>

        <p className="leading-7">
          그 측정은 증류된 모델에서 한 것이었습니다. 여덟 단계로 압축된 가중치를 안내 계수 1.0으로 돌린
          것이고, 두 방향의 선행 연구가 이것이 다양성에 불리한 조합이라고 말합니다. 안내를 제안한 논문이
          그 연산을 모드 커버리지와 표본 충실도를 맞바꾸는 장치로 정의했고, 소수 단계 증류 쪽에서는 모드
          붕괴가 풀어야 할 장벽으로 다뤄집니다.
        </p>
      </div>

      <DistillViz />

      <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
        <p className="leading-7">
          같은 일흔두 개 묘사, 같은 시드, 같은 임계값으로 비증류 가중치에서 다시 돌렸습니다. 채택된 인물이
          열여덟에서 예순하나가 됐고, 충돌이 2211쌍 중 215쌍에서 2145쌍 중 8쌍으로 줄었습니다. 다양성
          지표도 28.5에서 51.2로 올라갔습니다.
        </p>

        <p className="leading-7">
          결정적인 것은 다시 분해했을 때입니다. 성별과 나이를 고정한 여섯 구간에서 충돌률이 27에서 38퍼센트
          사이였던 것이 0에서 7퍼센트로 떨어집니다. 남성 세 구간에서는 충돌이 아예 0입니다. 열두 개 묘사가
          열두 명을 만듭니다.
        </p>

        <p className="leading-7">
          얼굴형과 이목구비 묘사는 원래 잘 통했습니다. 증류가 그것을 눌러버리고 있었을 뿐입니다. 제가 내린
          "어휘가 천장"이라는 진단은 측정 도구가 아니라 측정 대상이 고장나 있어서 나온 것이었습니다.
        </p>

        <p className="leading-7">
          탐지 실패의 성격도 함께 바뀝니다. 증류 모델에서는 실패 다섯 건 중 넷이 한 문구에 몰려 있어 "특정
          묘사가 조용히 버려진다"고 적었는데, 비증류에서는 여섯 건이 네 문구에 고르게 흩어집니다. 그 뭉침은
          프롬프트의 성질이 아니라 모델의 성질이었습니다.
        </p>
      </div>

      <CitationBlock
        source="프로젝트 실측 — 증류 대 비증류 가중치 (2026-09-11, RTX 4090 48GB)"
        citeKey={3}
        href="https://github.com/dik654/blog"
      >
        같은 일흔두 개 묘사·같은 시드·임계값 0.40에서 증류 가중치가 67건 탐지·18명 채택·2211쌍 중 215쌍
        충돌·다양성 28.5, 비증류가 66건 탐지·61명 채택·2145쌍 중 8쌍 충돌·다양성 51.2였습니다. 성별과 나이를
        고정한 구간별 충돌률은 증류 27~38%에서 비증류 0~7%로 떨어졌고 남성 세 구간은 0이었습니다. 대가는
        생성 시간 네 배입니다.
      </CitationBlock>

      <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
        <p className="leading-7">
          같은 파이프라인을 훨씬 큰 규모로 돌린 공개 연구가 비교 기준을 줍니다. 비증류 가중치로 14,889개를
          생성해 6,641명을 남겼으니 보존율이 44.6퍼센트입니다. 증류 가중치를 쓴 제 보존율은 26.9퍼센트로 그보다
          낮고, 비증류로 바꾼 뒤에는 그 범위에 들어옵니다.
        </p>

        <p className="leading-7">
          안내 계수도 같은 방향으로 작용합니다. 비증류에서 계수를 2.5와 4.0으로 나눠 보면 채택 인물이 열여섯과
          열넷으로, 낮은 쪽이 낫습니다. 증류 제거가 세 배를 만들고 계수 조정이 거기서 14퍼센트를 더합니다.
          인용한 연구가 신원 다양성을 위해 계수를 1.7에서 2.5 사이에서 뽑은 것도 같은 방향입니다.
        </p>

        <p className="leading-7">
          인용의 범위는 좁게 적습니다. 안내를 다룬 논문은 정체성 다양성을 직접 측정하지 않았고 맞바꿈의
          존재만 보였습니다. 증류 쪽 논문도 분포 정합 계열을 대상으로 해서 여기서 측정한 가중치와 같은 증류
          방식이 아닙니다. 두 문헌은 방향을 지지할 뿐 이 회차의 수치를 뒷받침하지 않습니다.
        </p>

        <p className="leading-7">
          안내 계수가 무엇을 맞바꾸는지는{" "}
          <Link to="/ai/latent-diffusion-guidance#guidance">잠재 확산과 안내</Link>가 소유합니다. 이 절은 그
          맞바꿈이 정체성 다양성에서 얼마나 큰지를 실측으로 다뤘습니다.
        </p>
      </div>
    </section>
  );
}

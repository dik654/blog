import CNNPipelineViz from './viz/CNNPipelineViz';
import FCLimitViz from './viz/FCLimitViz';
import OverviewDetailViz from './viz/OverviewDetailViz';
import M from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">CNN 개요</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>합성곱 신경망(Convolutional Neural Network, CNN)</strong> — 이미지 인식 분야에 혁명을 가져온 딥러닝 아키텍처<br />
          2012년 AlexNet이 ImageNet 대회에서 압도적 성능을 기록하며 딥러닝 시대를 개막<br />
          이후 컴퓨터 비전의 핵심 도구로 자리잡음
        </p>

        <h3>왜 전결합층(FC)만으로는 부족한가?</h3>
        <p>
          <strong>전결합층(FC, Fully Connected)</strong>이란?<br />
          입력의 <strong>모든 뉴런</strong>이 다음 층의 <strong>모든 뉴런</strong>과 연결되는 가장 기본적인 신경망 구조<br />
          각 연결마다 고유한 가중치(weight)가 존재 → 입력 크기에 비례하여 파라미터 수가 폭발적으로 증가
        </p>
        <p>
          28×28 흑백 이미지 = 784개 픽셀, 224×224 컬러 이미지 = <strong>150,528개</strong> 입력<br />
          FC 128 뉴런이면 784×128 = <strong>100,352개</strong> 파라미터 (28×28만으로도)<br />
          2D 이미지를 1D로 펼치는 순간 <strong>공간적 구조(인접 픽셀 관계)</strong>가 완전히 소실됨
        </p>
      </div>
      <div className="not-prose mt-4 mb-8">
        <FCLimitViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>CNN의 핵심 아이디어</h3>
        <ul>
          <li><strong>지역 연결(Local Connectivity)</strong> — 각 뉴런이 입력의 작은 영역(수용야)만 봄</li>
          <li><strong>가중치 공유(Weight Sharing)</strong> — 동일한 필터를 전체 이미지에 적용, 파라미터 대폭 감소</li>
          <li><strong>평행 이동 불변성(Translation Invariance)</strong> — 객체가 어디 있든 동일하게 감지</li>
        </ul>
        <p>
          이 세 가지 원리로 CNN은 전결합망 대비 파라미터 수를 수백~수천 배 감소<br />
          이미지의 공간 패턴을 효과적으로 학습 가능
        </p>
      </div>
      <div className="not-prose mt-8">
        <CNNPipelineViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">FC vs CNN 파라미터 비교</h3>
        <M display>{'\\begin{aligned} \\mathrm{FC} &: \\quad 150{,}528\\times128 = 19{,}267{,}584 \\\\ \\mathrm{CNN} &: \\quad \\underbrace{3^2\\times3\\times32}_{\\text{공유 커널}} + \\underbrace{32}_{\\text{편향}} = 896 \\end{aligned}'}</M>
        <FormulaNote
          meaning="같은 224×224 RGB 입력을 처리한다고 가정해도 FC는 모든 입력과 출력 뉴런 사이에 서로 다른 가중치를 두지만, CNN은 하나의 3×3 필터를 모든 위치에서 재사용한다. 그래서 이 비교의 큰 차이는 지역 연결과 가중치 공유에서 나온다. 숫자는 입력 크기·출력 뉴런·채널 수를 고정한 예시다."
          symbols={[
            ['150{,}528', '224×224×3 픽셀을 일렬로 펼친 FC 입력 수'],
            ['128', 'FC 출력 뉴런 수'],
            ['3^2\\times3\\times32', '3×3 RGB 필터 32개의 가중치 수'],
            ['32', '출력 채널마다 하나씩 더하는 편향 수'],
          ]}
        />
      </div>
      <div className="not-prose my-6">
        <OverviewDetailViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          요약 1: CNN은 <strong>지역성·가중치 공유·계층 구조</strong>로 이미지 구조를 보존.<br />
          요약 2: FC 대비 <strong>수천~수만 배 파라미터 감소</strong> — 학습 가능한 범위 극적 확대.<br />
          요약 3: "<strong>해상도↓ + 채널수↑</strong>" 패턴이 표준 — 추상화 수준 상승의 직접 구현.
        </p>
      </div>
    </section>
  );
}

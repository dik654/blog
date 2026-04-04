import CNNPipelineViz from './viz/CNNPipelineViz';
import FCLimitViz from './viz/FCLimitViz';

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
    </section>
  );
}

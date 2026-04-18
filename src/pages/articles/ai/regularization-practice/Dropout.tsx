import DropoutViz from './viz/DropoutViz';

export default function Dropout() {
  return (
    <section id="dropout" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Dropout & Spatial Dropout</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>Dropout</strong>(Srivastava et al., 2014) — 학습 시 매 반복(iteration)마다 각 뉴런을 독립적으로 확률 p로 비활성화<br />
          비활성화된 뉴런의 출력은 0 — 역전파에서도 gradient가 흐르지 않음<br />
          효과: 특정 뉴런 조합에 과하게 의존하는 <strong>co-adaptation</strong>을 방지
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">앙상블 해석</h3>
        <p>
          n개의 뉴런에서 dropout → 2ⁿ개의 서브네트워크가 존재<br />
          매 미니배치마다 다른 서브네트워크로 학습 → 사실상 <strong>앙상블</strong><br />
          추론 시에는 모든 뉴런을 켜고 가중 평균 — 단일 모델로 앙상블 효과
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">Inverted Dropout</h3>
        <p>
          기본 Dropout: 학습 시 뉴런 끄기 + 추론 시 출력을 (1-p)로 스케일 다운<br />
          <strong>Inverted Dropout</strong>: 학습 시 활성 뉴런 출력을 1/(1-p)로 스케일 업 + 추론 시 아무 처리 없음<br />
          현대 프레임워크(PyTorch, TensorFlow)는 전부 Inverted Dropout 사용 — 추론 코드를 수정할 필요가 없어 실전에 유리
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">적절한 p 값</h3>
        <p>
          FC(Fully Connected) layer: p = 0.5 (원논문 추천, 가장 널리 사용)<br />
          Convolutional layer: p = 0.1~0.3 (파라미터가 공유되므로 오버피팅 위험이 FC보다 낮음)<br />
          Transformer: p = 0.1 (Attention + FFN 모두. BERT, GPT 등 대부분 이 값 사용)
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">Spatial Dropout</h3>
        <p>
          CNN에서 일반 Dropout의 문제 — 인접 픽셀은 강하게 상관되므로 개별 뉴런을 꺼도 주변 뉴런이 정보를 보충<br />
          <strong>Spatial Dropout</strong>(Tompson et al., 2015) — 채널(feature map) 단위로 통째로 끄기<br />
          채널 하나가 꺼지면 해당 특징(예: 수직 에지)이 완전히 사라짐 → 다른 채널에 의존하도록 강제<br />
          1D Spatial Dropout도 존재 — NLP에서 임베딩 차원 단위로 드롭 (시퀀스 전체에 걸쳐 동일한 차원을 끔)
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">DropConnect, DropBlock</h3>
        <p>
          <strong>DropConnect</strong> — 뉴런이 아니라 <strong>가중치(연결)</strong>를 무작위로 0으로 설정. Dropout의 일반화<br />
          <strong>DropBlock</strong>(Ghiasi et al., 2018) — 특징맵에서 정사각형 블록 단위로 드롭. Spatial Dropout보다 더 강한 정규화
        </p>
        <p>
          실전 팁: Dropout은 <strong>학습 시에만</strong> 활성화 — model.train() vs model.eval() 전환을 잊으면 추론 성능이 크게 떨어짐
        </p>
      </div>
      <div className="not-prose my-8">
        <DropoutViz />
      </div>
    </section>
  );
}

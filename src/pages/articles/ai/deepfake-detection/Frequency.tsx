import FrequencyViz from './viz/FrequencyViz';

export default function Frequency() {
  return (
    <section id="frequency" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">주파수 분석: FFT 기반 아티팩트</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          딥페이크 탐지의 강력한 보조 수단 — <strong>주파수 도메인 분석</strong><br />
          사람 눈에는 보이지 않지만, 생성 모델이 남기는 통계적 흔적이 주파수 영역에 존재한다
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">FFT와 주파수 스펙트럼</h3>
        <p>
          <strong>FFT</strong>(Fast Fourier Transform) — 공간 도메인 이미지를 주파수 도메인으로 변환<br />
          변환 결과의 magnitude(크기) — 각 주파수 성분의 에너지를 표현<br />
          저주파: 이미지의 부드러운 영역(배경, 피부 톤)<br />
          고주파: 경계선, 질감, 미세한 디테일 — 딥페이크 아티팩트가 숨어 있는 영역
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">실제 vs 딥페이크 주파수 차이</h3>
        <p>
          자연 이미지는 <strong>1/f 법칙</strong>을 따른다 — 주파수가 높아질수록 에너지가 자연스럽게 감쇠<br />
          GAN 기반 딥페이크 — 업샘플링(transposed conv) 과정에서 <strong>체커보드 패턴</strong> 발생<br />
          이 패턴은 주파수 스펙트럼에서 특정 대역의 비정상적 피크로 나타난다<br />
          Diffusion 기반 — 체커보드는 없지만, 특정 주파수 대역의 에너지 분포가 자연 이미지와 다름
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">주파수 피처 결합 전략</h3>
        <p>
          RGB만 입력하면 공간 정보만 활용 — 미세한 주파수 패턴을 놓칠 수 있다<br />
          <strong>채널 결합</strong>: RGB(3ch) + FFT magnitude(3ch) = 6채널 입력<br />
          <strong>듀얼 브랜치</strong>: RGB 인코더 + FFT 인코더를 병렬로 → 피처 레벨에서 결합<br />
          <strong>어텐션 퓨전</strong>: 주파수 피처로 공간 피처의 어텐션 가중치를 조절<br />
          실험적으로 주파수 채널 추가만으로 AUC 2~5% 향상이 보고됨
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">한계와 보완</h3>
        <p>
          <strong>JPEG 압축</strong>이 고주파 정보를 파괴 — SNS 업로드 시 압축으로 아티팩트 소실<br />
          최신 생성 모델은 주파수 일관성까지 학습 — GAN 초기의 명확한 패턴이 점차 사라짐<br />
          보완: <strong>DCT</strong>(Discrete Cosine Transform), <strong>Wavelet</strong> 등 다중 스케일 분석<br />
          결론: 주파수는 강력한 보조 피처이지만 단독으로는 부족 — RGB 모델과 앙상블이 필수
        </p>
      </div>
      <div className="not-prose my-8">
        <FrequencyViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          요약 1: GAN의 업샘플링 아티팩트가 주파수 스펙트럼에 명확히 드러난다<br />
          요약 2: RGB + FFT 듀얼 입력으로 AUC 2~5% 향상 가능<br />
          요약 3: JPEG 압축 환경에서는 주파수 단독 분석의 효과가 감소 — 앙상블 필수
        </p>
      </div>
    </section>
  );
}

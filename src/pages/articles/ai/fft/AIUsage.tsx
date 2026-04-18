import Math from '@/components/ui/math';
import FFTAIViz from './viz/FFTAIViz';

export default function AIUsage() {
  return (
    <section id="ai-usage" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">AI에서의 FFT 활용</h2>
      <FFTAIViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>① 스펙트로그램 — 오디오/음성 모델의 입력</h3>
        <p>
          음성 인식(Whisper, Wav2Vec), 음악 생성(MusicGen), 화자 식별 — 모두 원시 파형이 아닌
          <strong>스펙트로그램</strong>을 입력으로 사용<br />
          스펙트로그램 생성 과정:
        </p>
        <p>
          <strong>STFT (Short-Time Fourier Transform)</strong> — 긴 오디오를 짧은 프레임(20~40ms)으로 잘라
          각 프레임에 FFT 적용<br />
          결과: 시간 × 주파수 2D 행렬 — 이미지처럼 CNN이나 Transformer로 처리 가능
        </p>
        <p>
          <strong>Mel-spectrogram</strong> — STFT 결과에 Mel 필터뱅크를 적용<br />
          인간 청각은 저주파에서 민감하고 고주파에서 둔감 — Mel 스케일이 이 비선형성을 반영<br />
          Whisper는 80-bin Mel-spectrogram을 30초 단위로 잘라
          <Math>{'80 \\times 3000'}</Math> 크기의 텐서를 인코더에 입력
        </p>

        <h3>② 주파수 영역 합성곱 — 큰 커널의 가속</h3>
        <p>
          합성곱 정리(Convolution Theorem):
          <Math display>{'f * g = \\mathcal{F}^{-1}\\!\\big[\\mathcal{F}(f) \\cdot \\mathcal{F}(g)\\big]'}</Math>
          시간/공간 영역의 합성곱 → 주파수 영역의 점별 곱셈(pointwise multiplication)으로 대체
        </p>
        <p>
          공간 영역 합성곱의 복잡도: <Math>{'O(N \\cdot K)'}</Math> (N: 입력 크기, K: 커널 크기)<br />
          FFT 기반: <Math>{'O(N \\log N)'}</Math> — 커널이 클수록(K &gt; ~64) FFT 합성곱이 유리<br />
          3×3 같은 작은 커널에서는 직접 합성곱이 더 빠르므로 일반 CNN에서는 FFT를 잘 안 쓴다<br />
          전역 필터(global filter) 네트워크, 오디오 U-Net 등 큰 커널을 쓰는 아키텍처에서 효과적
        </p>

        <h3>③ 효율적 어텐션 메커니즘</h3>
        <p>
          표준 Self-Attention — <Math>{'O(N^2)'}</Math>, 긴 시퀀스에서 병목<br />
          <strong>FNet (Google, 2021)</strong> — Self-Attention을 FFT로 대체<br />
          토큰 차원에 1D FFT를 적용하여 전역 혼합(global mixing)을 달성<br />
          정확도: BERT의 92~97% 수준 유지, 학습 속도 80% 향상
        </p>
        <p>
          <strong>Hyena, MEGA</strong> 등 서브-쿼드래틱 어텐션 모델들도 FFT 기반 긴 합성곱(long convolution)을 활용<br />
          시퀀스 길이 N에 대해 <Math>{'O(N \\log N)'}</Math>으로 전역 문맥을 포착
        </p>

        <h3>④ 신호 전처리: 노이즈 제거와 특징 추출</h3>
        <p>
          센서 데이터, 심전도(ECG), 진동 데이터 — FFT로 주파수 분석 후 불필요한 대역을 제거<br />
          고주파 노이즈 차단(low-pass filter): FFT → 고주파 성분 0으로 설정 → 역FFT<br />
          주파수 영역 특징(파워 스펙트럼, 지배 주파수 등)을 ML 모델의 입력 피처로 사용
        </p>

        <h3>⑤ Diffusion 모델의 주파수 분석</h3>
        <p>
          이미지 diffusion 과정에서 노이즈는 고주파 성분부터 제거된다<br />
          초기 denoising 단계: 저주파(윤곽)를 먼저 복원<br />
          후기 단계: 고주파(세부 텍스처)를 복원<br />
          이 관찰을 활용한 주파수 인지 스케줄링(frequency-aware scheduling)이 연구되고 있다
        </p>

        <h3>ZK에서의 변형: NTT</h3>
        <p>
          블록체인 영역에서 FFT의 변형인 <strong>NTT (Number Theoretic Transform)</strong>가 핵심적으로 사용된다<br />
          FFT가 복소수 단위근 <Math>{'e^{2\\pi i/N}'}</Math>을 쓰는 반면,
          NTT는 유한체(finite field) <Math>{'\\mathbb{F}_p'}</Math> 위의 단위근 <Math>{'\\omega'}</Math>를 사용<br />
          ZK-SNARK(Groth16, PLONK 등)에서 다항식 곱셈과 평가를 <Math>{'O(N \\log N)'}</Math>에 처리
        </p>
      </div>
    </section>
  );
}

import ApplicationsViz from './viz/ApplicationsViz';
import AEAppsViz from './viz/AEAppsViz';

export default function Applications() {
  return (
    <section id="applications" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">활용 사례</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        이미지 노이즈 제거, 이상 탐지(복원 오차 급증), 데이터 압축, 흑백→컬러 복원.
      </p>
      <ApplicationsViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">활용 사례 + 현대 모델</h3>
      </div>
      <div className="not-prose mt-4 mb-6">
        <AEAppsViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          요약 1: 오토인코더는 <strong>압축·복원·이상탐지</strong>의 범용 도구 — 라벨 없이 활용 가능.<br />
          요약 2: <strong>Stable Diffusion·MAE·BERT</strong> 등 현대 AI의 핵심 구조에 내장.<br />
          요약 3: 목적에 맞게 <strong>Vanilla/Denoising/VAE/VQ-VAE</strong> 중 선택.
        </p>
      </div>
    </section>
  );
}

import GANArchViz from './viz/GANArchViz';

const VARIANTS = [
  {
    name: 'DCGAN', year: '2015', color: '#6366f1',
    desc: 'CNN 기반 GAN — BatchNorm, Strided Conv, LeakyReLU 등 아키텍처 가이드라인으로 안정적 학습의 기반 확립',
  },
  {
    name: 'StyleGAN', year: '2019', color: '#10b981',
    desc: 'NVIDIA의 스타일 기반 생성기 — Mapping Network + AdaIN으로 스타일 계층별 제어, Progressive Growing으로 1024x1024 고해상도 얼굴 생성',
  },
  {
    name: 'CycleGAN', year: '2017', color: '#f59e0b',
    desc: '비쌍 데이터로 도메인 변환 학습 — Cycle Consistency Loss(A→B→A = A)로 의미 보존 보장. 사진↔그림, 말↔얼룩말 변환 등',
  },
  {
    name: 'Pix2Pix', year: '2017', color: '#ef4444',
    desc: '조건부 GAN으로 쌍(pair) 이미지 변환 학습 — U-Net Generator + PatchGAN Discriminator 구조',
  },
  {
    name: 'Conditional GAN', year: '2014', color: '#a855f7',
    desc: 'G와 D 모두에 조건 정보(클래스 라벨, 텍스트 등) 추가 — 원하는 속성의 이미지를 지정하여 생성 가능',
  },
];

export default function Variants() {
  return (
    <section id="variants" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">주요 GAN 변형</h2>
      <div className="not-prose mb-8"><GANArchViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          GAN의 기본 아이디어 위에 다양한 아키텍처와 학습 기법이 발전<br />
          아래는 가장 영향력 있는 변형들
        </p>
      </div>
      <div className="not-prose mt-6 space-y-3">
        {VARIANTS.map((v) => (
          <div key={v.name} className="rounded-lg border p-4"
            style={{ borderColor: v.color + '30', background: v.color + '06' }}>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="font-bold text-sm" style={{ color: v.color }}>{v.name}</span>
              <span className="text-[10px] text-muted-foreground font-mono">{v.year}</span>
            </div>
            <p className="text-sm text-foreground/70 leading-relaxed">{v.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

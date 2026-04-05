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

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">GAN 계보 타임라인</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// GAN 연구 역사 (2014~2023)
//
// 2014 - GAN (Goodfellow et al.)
//        원조 논문, Fully Connected 구조
//
// 2014 - Conditional GAN (Mirza & Osindero)
//        클래스 조건부 생성 가능
//
// 2015 - DCGAN (Radford et al.)
//        CNN 기반 안정 학습 가이드라인
//        - Strided Conv (pooling 대신)
//        - BatchNorm 사용
//        - LeakyReLU (D), ReLU (G)
//
// 2016 - InfoGAN (Chen et al.)
//        정보 이론 기반 잠재 변수 해석
//
// 2017 - WGAN / WGAN-GP (Arjovsky, Gulrajani)
//        Wasserstein 거리로 안정성 혁명
//
// 2017 - Pix2Pix (Isola et al.)
//        Paired image-to-image translation
//        U-Net + PatchGAN
//
// 2017 - CycleGAN (Zhu et al.)
//        Unpaired translation
//        Cycle consistency loss
//
// 2017 - Progressive GAN (Karras et al.)
//        점진적 해상도 증가 (4x4 → 1024x1024)
//
// 2018 - BigGAN (Brock et al.)
//        대규모 ImageNet 생성, TPU 학습
//
// 2019 - StyleGAN (Karras et al.)
//        Mapping Network + AdaIN
//        계층적 스타일 제어
//
// 2020 - StyleGAN2 (Karras et al.)
//        Demodulation, path length regularization
//
// 2021 - StyleGAN3 (Karras et al.)
//        Alias-free, rotation-equivariant
//
// 2022 - StyleGAN-XL (Sauer et al.)
//        대규모 class-conditional 생성`}
        </pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">GAN vs Diffusion Models</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 2022년 이후 Diffusion이 주류가 된 이유
//
// ┌──────────────┬────────────┬──────────────┐
// │  측면        │    GAN     │  Diffusion   │
// ├──────────────┼────────────┼──────────────┤
// │ 학습 안정성  │ 불안정     │ 안정적       │
// │ 샘플 품질    │ 선명       │ 매우 선명    │
// │ 다양성       │ mode collapse│ 높음        │
// │ 생성 속도    │ 1 step (빠름)│ 수십~수백   │
// │ 학습 목적    │ adversarial│ denoising    │
// │ 수학 배경    │ game theory│ SDE / score  │
// │ 해석성       │ 낮음       │ 중간         │
// └──────────────┴────────────┴──────────────┘
//
// GAN이 여전히 유리한 경우:
//   - 실시간 생성 필요 (1 forward pass)
//   - 임베디드/모바일 환경
//   - Style transfer, face editing
//   - 데이터 증강
//
// Diffusion이 유리한 경우:
//   - 고품질 이미지 생성 (DALL-E, Stable Diffusion)
//   - 조건부 생성 (텍스트→이미지)
//   - 다양성 중요한 태스크
//   - 편집 / 인페인팅

// 최근 트렌드 (2023~):
//   - Consistency Models (1-step diffusion)
//   - Rectified Flow (straight path)
//   - DiT (Diffusion Transformer)
//   - Video generation (Sora, Runway)
//
// 하이브리드:
//   - GAN + Diffusion 조합
//   - VAE + GAN (VQ-GAN, VQ-VAE)
//   - GAN loss를 diffusion에 추가 (품질 개선)`}
        </pre>
        <p className="leading-7">
          요약 1: GAN 계보는 <strong>DCGAN→WGAN→StyleGAN</strong>으로 안정성·품질 순차 개선.<br />
          요약 2: 2022년 이후 <strong>Diffusion이 주류</strong> — 안정성·다양성에서 우위.<br />
          요약 3: 실시간 생성·엣지 환경에서는 GAN이 여전히 경쟁력 보유.
        </p>
      </div>
    </section>
  );
}

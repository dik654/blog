import { useMemo, useState } from 'react';
import { ArrowDown, ArrowRight, Gauge, Image, ScanSearch } from 'lucide-react';

const factors = [1, 2, 4, 8, 16, 32] as const;
type Factor = typeof factors[number];

const factorNotes: Record<Factor, {
  regime: string;
  verdict: string;
  detail: string;
  evidence: string;
  tone: string;
}> = {
  1: {
    regime: 'Pixel diffusion',
    verdict: '복원 손실 없음 · denoiser 비용 최대',
    detail: 'Perceptual compression을 전혀 분리하지 않아 diffusion network가 모든 pixel detail과 semantic variation을 함께 처리한다.',
    evidence: 'f=1은 autoencoder가 없는 identity 기준이라 first-stage R-FID를 따로 측정하지 않는다.',
    tone: 'bg-blue-600',
  },
  2: {
    regime: '약한 압축',
    verdict: '세부 보존 · 학습은 여전히 느림',
    detail: 'Grid는 조금 줄지만 semantic compression 부담이 diffusion에 많이 남는다. 논문의 LDM-1/2는 수렴이 느렸다.',
    evidence: 'Table 8 VQ f=2 예: R-FID 0.16 · PSNR 30.85',
    tone: 'bg-blue-500',
  },
  4: {
    regime: '균형 구간',
    verdict: '세부 보존과 계산 절감의 좋은 절충',
    detail: '논문은 LDM-4를 여러 task의 강한 설정으로 사용했다. 이 숫자를 모든 데이터와 architecture의 영구 최적값으로 일반화하지 않는다.',
    evidence: 'Table 8 VQ f=4 예: R-FID 0.58 · PSNR 27.43',
    tone: 'bg-emerald-600',
  },
  8: {
    regime: '균형 구간',
    verdict: '더 작은 grid · text-to-image에도 사용',
    detail: 'LDM-8도 좋은 generation 결과를 냈지만 first-stage reconstruction과 downstream 요구 정밀도를 함께 봐야 한다.',
    evidence: 'Table 8 VQ f=8 예: R-FID 1.14 · PSNR 23.07',
    tone: 'bg-emerald-500',
  },
  16: {
    regime: '강한 압축',
    verdict: '계산은 작음 · 정보 상한이 낮아짐',
    detail: 'Denoiser가 보지 못하는 세부는 reverse sampling으로 복구할 수 없다. Decoder가 그럴듯하게 채우는 것과 원 pixel을 보존하는 것은 다르다.',
    evidence: 'Table 8 VQ f=16 예: R-FID 5.15 · PSNR 20.83',
    tone: 'bg-amber-500',
  },
  32: {
    regime: '과한 압축',
    verdict: '아주 작은 grid · fidelity 정체',
    detail: '논문의 compression sweep에서 과한 perceptual compression은 reconstruction bottleneck을 만들고 generation quality 개선을 제한했다.',
    evidence: 'Table 8 f=32: VQ R-FID 31.83 · PSNR 17.45 / KL 변형 R-FID 2.04 · PSNR 22.27',
    tone: 'bg-amber-600',
  },
};

export function CompressionTradeoffLab() {
  const [factor, setFactor] = useState<Factor>(4);
  const selected = factorNotes[factor];
  const side = 256 / factor;
  const positions = side * side;
  const reduction = factor * factor;
  const gridSize = factor <= 2 ? 8 : factor <= 8 ? 6 : 4;

  const cells = useMemo(
    () => Array.from({ length: gridSize * gridSize }, (_, index) => index),
    [gridSize],
  );

  return (
    <figure data-ldm-compression-lab className="not-prose my-8 border-y border-border">
      <header className="grid gap-4 py-4 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-end">
        <div>
          <p className="text-xs font-semibold text-muted-foreground">Compression sweep · 256×256 교육용 입력</p>
          <p className="mt-1 text-sm font-bold">공간 downsampling f가 latent 위치 수와 정보 상한을 함께 바꾼다</p>
        </div>
        <div className="grid grid-cols-6 gap-1" role="tablist" aria-label="Latent downsampling factor">
          {factors.map((value) => (
            <button
              key={value}
              type="button"
              role="tab"
              aria-selected={factor === value}
              onClick={() => setFactor(value)}
              className={`min-h-10 rounded-md border px-1 font-mono text-xs font-bold ${factor === value ? 'border-foreground bg-foreground text-background' : 'border-border hover:bg-muted'}`}
            >
              f={value}
            </button>
          ))}
        </div>
      </header>
      <div className="grid gap-px border border-border bg-border lg:grid-cols-[minmax(0,1fr)_3rem_minmax(0,1fr)]">
        <div className="min-w-0 bg-background p-4 sm:p-5">
          <div className="flex items-center gap-2">
            <Image className="size-4 text-muted-foreground" aria-hidden="true" />
            <p className="text-xs font-semibold text-muted-foreground">Pixel image</p>
          </div>
          <p className="mt-3 font-mono text-2xl font-black">256 × 256</p>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">65,536 spatial positions</p>
        </div>
        <div className="flex min-h-12 items-center justify-center bg-background text-muted-foreground">
          <ArrowDown className="size-4 lg:hidden" aria-hidden="true" />
          <ArrowRight className="hidden size-4 lg:block" aria-hidden="true" />
        </div>
        <div className="min-w-0 bg-background p-4 sm:p-5">
          <div className="flex items-center gap-2">
            <ScanSearch className="size-4 text-muted-foreground" aria-hidden="true" />
            <p className="text-xs font-semibold text-muted-foreground">Latent grid · E(x)</p>
          </div>
          <div className="mt-3 flex items-end justify-between gap-4">
            <div>
              <p className="font-mono text-2xl font-black">{side} × {side}</p>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{positions.toLocaleString()} positions · {reduction}× fewer</p>
            </div>
            <div
              className="grid size-16 shrink-0 gap-px border border-border bg-border p-px"
              style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}
              aria-hidden="true"
            >
              {cells.map((cell) => <span key={cell} className={`${selected.tone} opacity-70`} />)}
            </div>
          </div>
        </div>
      </div>
      <div className="grid gap-4 py-5 lg:grid-cols-[12rem_minmax(0,1fr)]">
        <div>
          <p className="text-xs font-semibold text-muted-foreground">{selected.regime}</p>
          <p className="mt-2 text-sm font-black leading-relaxed">{selected.verdict}</p>
          <p className="mt-3 text-xs font-semibold leading-relaxed text-foreground">{selected.evidence}</p>
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">{selected.detail}</p>
      </div>
      <figcaption className="pb-5 text-xs leading-relaxed text-muted-foreground">
        <strong className="text-foreground">핵심.</strong> f를 키우면 denoiser의 spatial work는 줄지만 encoder가 버린 세부는 diffusion이 볼 수 없다. 논문은 f=4~8 부근을 좋은 절충으로 관측했지, 압축률이 클수록 항상 좋다고 주장하지 않았다.
      </figcaption>
    </figure>
  );
}

export function LdmEvidenceReceipt() {
  return (
    <figure data-ldm-evidence className="not-prose my-8 border-y border-border">
      <header className="flex items-center gap-3 py-4">
        <Gauge className="size-4 text-muted-foreground" aria-hidden="true" />
        <div>
          <p className="text-xs font-semibold text-muted-foreground">Paper receipt · inpainting comparison</p>
          <p className="mt-1 text-sm font-bold">Pixel baseline과 latent variants 사이에서 보고된 효율·FID 변화</p>
        </div>
      </header>
      <div className="grid gap-px border border-border bg-border sm:grid-cols-2">
        <div className="min-w-0 bg-background p-5">
          <p className="text-xs font-semibold text-muted-foreground">Training · sampling throughput</p>
          <p className="mt-3 font-mono text-3xl font-black">≥ 2.7×</p>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">Pixel-space LDM-1과 latent LDM-4 variants 사이의 Table 6 비교에서 저자들이 요약한 차이.</p>
        </div>
        <div className="min-w-0 bg-background p-5">
          <p className="text-xs font-semibold text-muted-foreground">FID improvement factor</p>
          <p className="mt-3 font-mono text-3xl font-black">≥ 1.6×</p>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">같은 inpainting 실험 장부에서 보고한 생성 품질 개선. 낮은 FID가 좋다.</p>
        </div>
      </div>
      <figcaption className="py-5 text-xs leading-relaxed text-muted-foreground">
        이 배수는 LDM이라는 아이디어의 보편적 hardware speedup이 아니다. 논문의 특정 architecture, 해상도, task와 측정 setup에서 pixel baseline과 latent variants를 비교한 source-scoped evidence다.
      </figcaption>
    </figure>
  );
}

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import VQVAEViz from './viz/VQVAEViz';

const VARIANTS = [
  {
    name: 'Beta-VAE', color: '#6366f1',
    desc: 'KL 항에 가중치 beta를 곱하여 잠재 요인 분리(disentanglement) 제어 — beta > 1이면 각 잠재 차원이 독립 요인을 포착',
  },
  {
    name: 'VQ-VAE', color: '#10b981',
    desc: '연속 잠재 공간 대신 이산 코드북 사용 — 각 잠재 벡터를 가장 가까운 코드워드에 매핑하여 음성 합성(WaveNet) 등에 효과적',
  },
  {
    name: 'CVAE', color: '#f59e0b',
    desc: '조건부 VAE — 레이블 y를 인코더/디코더에 추가 입력으로 제공하여 특정 클래스 샘플만 생성 가능',
  },
  {
    name: 'VAE-GAN', color: '#8b5cf6',
    desc: 'VAE 디코더를 GAN 생성자로 사용 + 판별자 추가 — 재구성 품질과 생성 다양성 동시 개선',
  },
];

export default function Applications() {
  const [active, setActive] = useState<string | null>(null);
  const sel = VARIANTS.find(v => v.name === active);

  return (
    <section id="applications" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">응용과 변형 모델</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          VAE — 이미지 생성, 이상 탐지, 표현 학습 등 다양한 영역에 활용<br />
          잠재 공간의 연속성 덕분에 <strong>보간(interpolation, 두 점 사이의 부드러운 전환)</strong>이 가능<br />
          재구성 오차를 이상치 점수로 활용 가능
        </p>
      </div>
      <div className="not-prose rounded-xl border border-border bg-card p-5 space-y-3">
        <p className="text-xs font-mono text-foreground/50">VAE 변형 모델 비교</p>
        {VARIANTS.map(v => (
          <motion.button key={v.name} whileHover={{ x: 3 }}
            onClick={() => setActive(active === v.name ? null : v.name)}
            className="w-full flex items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-all"
            style={{
              borderColor: active === v.name ? v.color : v.color + '30',
              background: active === v.name ? v.color + '14' : v.color + '06',
            }}>
            <span className="font-mono text-xs font-bold" style={{ color: v.color }}>{v.name}</span>
          </motion.button>
        ))}
        <AnimatePresence mode="wait">
          {sel && (
            <motion.div key={sel.name} initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
              className="rounded-lg border p-3 text-sm text-foreground/80"
              style={{ borderColor: sel.color + '30', background: sel.color + '08' }}>
              {sel.desc}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">VQ-VAE와 현대 모델</h3>
        <div className="not-prose"><VQVAEViz /></div>
        <p className="leading-7">
          요약 1: <strong>VQ-VAE</strong>는 이산 codebook으로 blurry 문제 해결 — DALL-E 기반.<br />
          요약 2: <strong>Stable Diffusion의 VAE</strong>가 이미지를 latent로 8배 압축 — 실용화 핵심.<br />
          요약 3: VAE는 <strong>음성·단백질·분자·추천</strong> 등 광범위한 도메인에서 활용.
        </p>
      </div>
    </section>
  );
}

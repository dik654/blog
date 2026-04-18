import { motion } from 'framer-motion';
import StepViz, { type StepDef } from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

const COLORS = {
  eff: '#3b82f6',
  cnx: '#10b981',
  vit: '#8b5cf6',
  arrow: '#94a3b8',
};

const STEPS: StepDef[] = [
  {
    label: 'EfficientNet — Compound Scaling',
    body: '깊이(depth)·너비(width)·해상도(resolution) 세 축을 동시에 스케일링.\nφ 하나로 α^φ, β^φ, γ^φ 결정 — 수동 튜닝 없이 B0→B7 자동 생성.\nImageNet Top-1 84.4% (B7), 파라미터 대비 효율 최고.',
  },
  {
    label: 'ConvNeXt — Modernized CNN',
    body: '순수 CNN에 Transformer 설계 기법 이식: 7×7 depthwise conv, LayerNorm, GELU.\nSwin Transformer와 동등 성능, 학습/추론 모두 단순한 구조.\nImageNet Top-1 87.8% (ConvNeXt-XL) — 대규모 데이터에서도 ViT에 필적.',
  },
  {
    label: 'ViT — Patch-based Attention',
    body: '이미지를 16×16 패치로 나눠 시퀀스 입력. 위치 임베딩 + 멀티헤드 셀프 어텐션.\n대규모 데이터(ImageNet-21K 이상)에서 CNN 압도. 소규모 데이터에선 과적합 위험.\nDeiT: 지식 증류로 소규모 데이터 해결. Swin: 윈도우 어텐션으로 고해상도 적합.',
  },
  {
    label: '데이터 규모별 백본 선택 기준',
    body: '데이터 < 5K: EfficientNet-B3/B4 (pretrained 의존도 높음, 작은 모델이 유리).\n5K~50K: ConvNeXt-Base 또는 EfficientNet-B5 (중간 규모, CNN 안정적).\n50K+: ViT-Base/Large (데이터 충분 시 attention의 전역 수용야가 빛남).\ntimm.create_model("효율넷명", pretrained=True) 한 줄로 로드.',
  },
];

export default function BackboneComparisonViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full h-auto" style={{ maxWidth: 640 }}>
          <text x={240} y={18} textAnchor="middle" fontSize={13} fontWeight={700} fill="var(--foreground)">
            백본 아키텍처 비교
          </text>

          {/* 3개 백본 카드 */}
          {[
            { x: 10, label: 'EfficientNet', sub: 'Compound Scaling', color: COLORS.eff, idx: 0 },
            { x: 170, label: 'ConvNeXt', sub: 'Modern CNN', color: COLORS.cnx, idx: 1 },
            { x: 330, label: 'ViT', sub: 'Patch Attention', color: COLORS.vit, idx: 2 },
          ].map((b) => (
            <motion.g
              key={b.label}
              initial={{ opacity: 0.3 }}
              animate={{ opacity: step === b.idx || step === 3 ? 1 : 0.3 }}
              transition={sp}
            >
              <ModuleBox x={b.x} y={34} w={140} h={52} label={b.label} sub={b.sub} color={b.color} />
            </motion.g>
          ))}

          {/* Step 0: EfficientNet compound scaling 시각화 */}
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: step === 0 ? 1 : 0 }}
            transition={sp}
          >
            {['Depth α^φ', 'Width β^φ', 'Resolution γ^φ'].map((t, i) => (
              <g key={t}>
                <ActionBox x={30 + i * 140} y={100} w={120} h={34} label={t} color={COLORS.eff} />
              </g>
            ))}
            <text x={240} y={155} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
              φ=1 → B0 | φ=2 → B1 | ... | φ=7 → B7
            </text>
            <DataBox x={170} y={165} w={140} h={28} label="α·β²·γ² ≈ 2 (FLOPS 제약)" color={COLORS.eff} />
          </motion.g>

          {/* Step 1: ConvNeXt modernization */}
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: step === 1 ? 1 : 0 }}
            transition={sp}
          >
            {[
              { label: '7×7 DWConv', sub: 'Swin 참고' },
              { label: 'LayerNorm', sub: 'BN 대체' },
              { label: 'GELU', sub: 'ReLU 대체' },
              { label: 'Inverted Bottle', sub: '4× 확장' },
            ].map((m, i) => (
              <g key={m.label}>
                <ActionBox x={10 + i * 118} y={100} w={108} h={38} label={m.label} sub={m.sub} color={COLORS.cnx} />
              </g>
            ))}
            <text x={240} y={158} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
              ResNet에 4가지 현대화 적용 → Swin Transformer와 동등 성능
            </text>
            <DataBox x={165} y={168} w={150} h={28} label="Top-1: 87.8% (ConvNeXt-XL)" color={COLORS.cnx} />
          </motion.g>

          {/* Step 2: ViT patch mechanism */}
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: step === 2 ? 1 : 0 }}
            transition={sp}
          >
            {/* 이미지 → 패치 → 시퀀스 */}
            <rect x={20} y={100} width={50} height={50} rx={4} fill={COLORS.vit} fillOpacity={0.1} stroke={COLORS.vit} strokeWidth={1} />
            {/* 4x4 그리드 */}
            {[0, 1, 2, 3].map((r) =>
              [0, 1, 2, 3].map((c) => (
                <rect key={`${r}-${c}`} x={22 + c * 12} y={102 + r * 12} width={10} height={10} rx={1}
                  fill={COLORS.vit} fillOpacity={0.15 + (r + c) * 0.05} stroke={COLORS.vit} strokeWidth={0.4} />
              ))
            )}
            <text x={45} y={164} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">16×16 패치</text>

            <polygon points="80,125 92,120 92,130" fill={COLORS.arrow} />

            {/* 패치 시퀀스 */}
            {Array.from({ length: 8 }, (_, i) => (
              <rect key={i} x={100 + i * 22} y={112} width={18} height={26} rx={3}
                fill={COLORS.vit} fillOpacity={0.1 + i * 0.04} stroke={COLORS.vit} strokeWidth={0.6} />
            ))}
            <text x={188} y={152} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">+ 위치 임베딩</text>

            <polygon points="285,125 297,120 297,130" fill={COLORS.arrow} />

            <ActionBox x={305} y={107} w={80} h={36} label="Self-Attn" sub="멀티헤드" color={COLORS.vit} />
            <polygon points="390,125 402,120 402,130" fill={COLORS.arrow} />
            <DataBox x={408} y={110} w={60} h={28} label="[CLS]" color={COLORS.vit} />
            <text x={438} y={152} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">분류 토큰</text>

            <text x={240} y={188} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
              ImageNet-21K pretrain 시 Top-1: 88.6% (ViT-L)
            </text>
          </motion.g>

          {/* Step 3: 선택 기준표 */}
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: step === 3 ? 1 : 0 }}
            transition={sp}
          >
            {/* 테이블 헤더 */}
            <rect x={40} y={92} width={400} height={24} rx={4} fill="var(--muted)" fillOpacity={0.3} />
            <text x={130} y={108} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">데이터 규모</text>
            <text x={270} y={108} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">추천 백본</text>
            <text x={390} y={108} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">이유</text>

            {[
              { data: '< 5K', model: 'EfficientNet-B3/B4', why: 'Pretrained 의존', color: COLORS.eff },
              { data: '5K ~ 50K', model: 'ConvNeXt-Base', why: 'CNN 안정성', color: COLORS.cnx },
              { data: '50K+', model: 'ViT-Base/Large', why: '전역 수용야', color: COLORS.vit },
            ].map((row, i) => (
              <g key={row.data}>
                <rect x={40} y={118 + i * 28} width={400} height={26} rx={3}
                  fill={row.color} fillOpacity={0.06} stroke={row.color} strokeWidth={0.5} />
                <text x={130} y={135 + i * 28} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">{row.data}</text>
                <text x={270} y={135 + i * 28} textAnchor="middle" fontSize={10} fontWeight={600} fill={row.color}>{row.model}</text>
                <text x={390} y={135 + i * 28} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">{row.why}</text>
              </g>
            ))}

            <text x={240} y={210} textAnchor="middle" fontSize={9} fontFamily="monospace" fill="var(--muted-foreground)">
              timm.create_model("convnext_base", pretrained=True, num_classes=N)
            </text>
          </motion.g>
        </svg>
      )}
    </StepViz>
  );
}

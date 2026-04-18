import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, StatusBox } from '@/components/viz/boxes';
import { STEPS, C } from './PracticeVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

export default function PracticeViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Step 0: timm 라이브러리 */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <ModuleBox x={170} y={15} w={140} h={42} label="timm" sub="900+ 사전학습 모델" color={C.timm} />
              {/* 3줄 코드 */}
              <motion.g initial={{ y: 5, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
                <rect x={50} y={75} width={380} height={28} rx={6} fill="var(--card)" stroke={C.timm} strokeWidth={0.5} />
                <text x={60} y={93} fontSize={9} fontFamily="monospace" fill={C.timm}>
                  model = timm.create_model("vit_base_patch16_224", pretrained=True)
                </text>
              </motion.g>
              <motion.g initial={{ y: 5, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
                <rect x={50} y={110} width={380} height={28} rx={6} fill="var(--card)" stroke={C.data} strokeWidth={0.5} />
                <text x={60} y={128} fontSize={9} fontFamily="monospace" fill={C.data}>
                  transform = timm.data.resolve_data_config(model.pretrained_cfg)
                </text>
              </motion.g>
              <motion.g initial={{ y: 5, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
                <rect x={50} y={145} width={380} height={28} rx={6} fill="var(--card)" stroke={C.finetune} strokeWidth={0.5} />
                <text x={60} y={163} fontSize={9} fontFamily="monospace" fill={C.finetune}>
                  output = model(transform(image).unsqueeze(0))
                </text>
              </motion.g>
              <text x={240} y={200} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                모델 생성 → 데이터 변환 → 추론을 3줄로 완료
              </text>
            </motion.g>
          )}

          {/* Step 1: 모델 선택 가이드 */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={22} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.model}>모델 선택 가이드</text>
              {[
                { label: 'swin_large_384', acc: '87.3%', flops: '47.0 GFLOPs', tag: '정확도', color: '#ef4444', w: 0.95 },
                { label: 'vit_base_224', acc: '84.5%', flops: '17.6 GFLOPs', tag: '균형', color: C.model, w: 0.75 },
                { label: 'deit_small_distilled', acc: '81.2%', flops: '4.6 GFLOPs', tag: '메모리 절약', color: '#10b981', w: 0.55 },
                { label: 'vit_small_224', acc: '79.4%', flops: '4.6 GFLOPs', tag: '속도', color: '#6366f1', w: 0.45 },
              ].map((m, i) => (
                <motion.g key={m.label} initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 + i * 0.1 }}>
                  {/* 모델 이름 */}
                  <text x={20} y={52 + i * 46} fontSize={9} fontWeight={600} fill={m.color}>{m.label}</text>
                  {/* 정확도 바 */}
                  <rect x={20} y={56 + i * 46} width={350} height={10} rx={5} fill="var(--border)" opacity={0.2} />
                  <motion.rect x={20} y={56 + i * 46} width={350 * m.w} height={10} rx={5} fill={m.color} opacity={0.7}
                    initial={{ width: 0 }} animate={{ width: 350 * m.w }} transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }} />
                  {/* 수치 */}
                  <text x={380} y={52 + i * 46} fontSize={9} fontWeight={600} fill={m.color}>{m.acc}</text>
                  <text x={380} y={65 + i * 46} fontSize={7} fill="var(--muted-foreground)">{m.flops}</text>
                  {/* 태그 */}
                  <rect x={435} y={46 + i * 46} width={38} height={18} rx={9} fill={m.color + '15'} stroke={m.color} strokeWidth={0.5} />
                  <text x={454} y={58 + i * 46} textAnchor="middle" fontSize={7} fill={m.color}>{m.tag}</text>
                </motion.g>
              ))}
            </motion.g>
          )}

          {/* Step 2: Fine-tuning 전략 */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={22} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.finetune}>Fine-tuning 핵심 전략</text>
              {[
                { title: '학습률', desc: 'ViT: 1e-5~5e-5', comp: 'CNN: 1e-3~1e-4', icon: '▼' },
                { title: 'Layer-wise LR', desc: '깊은 층 = 높은 LR', comp: 'decay=0.65', icon: '↗' },
                { title: 'Warmup', desc: '5-10% 선형 증가', comp: '→ 코사인 감쇠', icon: '⟋' },
                { title: '해상도', desc: '224 → 384 fine-tune', comp: 'pos embed 보간', icon: '⊞' },
              ].map((s, i) => (
                <motion.g key={s.title} initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 + i * 0.1 }}>
                  <rect x={20 + (i % 2) * 230} y={35 + Math.floor(i / 2) * 90} width={215} height={78} rx={8}
                    fill="var(--card)" stroke={C.finetune} strokeWidth={0.5} />
                  {/* 아이콘 */}
                  <circle cx={40 + (i % 2) * 230} cy={55 + Math.floor(i / 2) * 90} r={12}
                    fill={C.finetune + '15'} stroke={C.finetune} strokeWidth={0.5} />
                  <text x={40 + (i % 2) * 230} y={59 + Math.floor(i / 2) * 90} textAnchor="middle"
                    fontSize={10} fill={C.finetune}>{s.icon}</text>
                  {/* 텍스트 */}
                  <text x={60 + (i % 2) * 230} y={55 + Math.floor(i / 2) * 90} fontSize={10}
                    fontWeight={600} fill={C.finetune}>{s.title}</text>
                  <text x={60 + (i % 2) * 230} y={73 + Math.floor(i / 2) * 90} fontSize={8}
                    fill="var(--muted-foreground)">{s.desc}</text>
                  <text x={60 + (i % 2) * 230} y={88 + Math.floor(i / 2) * 90} fontSize={8}
                    fill="var(--muted-foreground)">{s.comp}</text>
                </motion.g>
              ))}
            </motion.g>
          )}

          {/* Step 3: 대회 활용 전략 */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={22} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.tip}>대회 활용 전략</text>
              {/* 앙상블 */}
              <motion.g initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
                <ModuleBox x={20} y={35} w={85} h={42} label="ConvNeXt" sub="CNN 편향" color={C.timm} />
                <text x={120} y={60} textAnchor="middle" fontSize={14} fill="var(--foreground)">+</text>
                <ModuleBox x={135} y={35} w={85} h={42} label="Swin" sub="ViT 유연성" color={C.tip} />
                <line x1={225} y1={56} x2={255} y2={56} stroke={C.tip} strokeWidth={1.2} markerEnd="url(#arrPr2)" />
                <defs><marker id="arrPr2" viewBox="0 0 10 10" refX={8} refY={5} markerWidth={5} markerHeight={5} orient="auto">
                  <path d="M0,0 L10,5 L0,10 Z" fill={C.tip} /></marker></defs>
                <DataBox x={260} y={40} w={100} h={32} label="앙상블" sub="상호 보완" color={C.tip} outlined />
              </motion.g>
              {/* TTA */}
              <motion.g initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
                <rect x={20} y={95} width={340} height={40} rx={8} fill="var(--card)" stroke={C.model} strokeWidth={0.5} />
                <text x={35} y={112} fontSize={9} fontWeight={600} fill={C.model}>TTA</text>
                <text x={35} y={126} fontSize={8} fill="var(--muted-foreground)">수평 반전 + 멀티크롭</text>
                <StatusBox x={200} y={97} w={150} h={35} label="ViT TTA 효과" sub="+0.5~1.0%" color={C.model} progress={0.8} />
              </motion.g>
              {/* Progressive Resizing */}
              <motion.g initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
                <rect x={20} y={150} width={340} height={40} rx={8} fill="var(--card)" stroke={C.finetune} strokeWidth={0.5} />
                <text x={35} y={168} fontSize={9} fontWeight={600} fill={C.finetune}>Progressive Resizing</text>
                {[224, 288, 384].map((res, i) => (
                  <g key={res}>
                    <rect x={170 + i * 60} y={155} width={48} height={28} rx={6}
                      fill={C.finetune + `${15 + i * 10}`} stroke={C.finetune} strokeWidth={0.5} />
                    <text x={194 + i * 60} y={173} textAnchor="middle" fontSize={9} fill={C.finetune}>{res}</text>
                    {i < 2 && <text x={224 + i * 60} y={173} fontSize={10} fill={C.finetune}>→</text>}
                  </g>
                ))}
              </motion.g>
              {/* 핵심 */}
              <rect x={380} y={95} width={90} height={95} rx={8} fill={C.tip + '08'} stroke={C.tip} strokeWidth={0.5} />
              <text x={425} y={118} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.tip}>핵심</text>
              <text x={425} y={136} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">CNN + ViT</text>
              <text x={425} y={152} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">서로 다른</text>
              <text x={425} y={168} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">편향으로</text>
              <text x={425} y={184} textAnchor="middle" fontSize={8} fill={C.tip} fontWeight={600}>상호 보완</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}

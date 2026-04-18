import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, ActionBox, DataBox, StatusBox } from '@/components/viz/boxes';

const d = 0.07;
const P = '#6366f1', G = '#10b981', W = '#f59e0b', B = '#3b82f6', R = '#ef4444';

const STEPS = [
  {
    label: '1. 전체 워크플로우: 데이터 → 학습 → 병합 → 배포',
    body: '4단계 파이프라인: 데이터 준비(가장 중요) → trl/peft로 학습 → 어댑터를 원본에 병합 → 추론 서빙\n각 단계에서 검증 필수 — 특히 데이터 품질과 학습 loss 수렴 확인',
  },
  {
    label: '2. 핵심 하이퍼파라미터 가이드',
    body: 'rank(r): 8~64, 태스크 복잡도에 비례 / alpha(a): r과 같거나 2배\ndropout: 0.05~0.1 (오버피팅 방지) / target_modules: 모든 linear 또는 q,v만\n학습률: 1e-4~3e-4 (full FT보다 높게) / epochs: 1~3 (과적합 주의)',
  },
  {
    label: '3. 학습 코드 구조 (trl + peft)',
    body: 'SFTTrainer(trl): 데이터 포맷팅 + 학습 루프 통합\nLoraConfig(peft): 어댑터 설정 (r, alpha, target_modules)\nBitsAndBytesConfig: 4비트 양자화 설정 (QLoRA)',
  },
  {
    label: '4. 병합 & 평가 & 배포',
    body: 'merge_and_unload(): LoRA 어댑터를 원본 가중치에 병합\n평가: 도메인 벤치마크 + 사람 평가 (자동 지표만으로 불충분)\n배포: vLLM, TGI, Ollama 등 추론 서버에 직접 로드',
  },
];

export default function PracticeWorkflowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <g>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">
                LoRA Fine-tuning 워크플로우
              </text>
              {/* 4 stages horizontal */}
              <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: d }}>
                <ModuleBox x={10} y={30} w={100} h={50} label="1. 데이터 준비" sub="가장 중요한 단계" color={B} />
              </motion.g>
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: d * 1.5 }}>
                <line x1={110} y1={55} x2={125} y2={55} stroke="var(--border)" strokeWidth={1} />
                <polygon points="122,50 122,60 130,55" fill="var(--muted-foreground)" />
              </motion.g>
              <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: d * 2 }}>
                <ModuleBox x={130} y={30} w={100} h={50} label="2. 학습" sub="trl + peft" color={P} />
              </motion.g>
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: d * 2.5 }}>
                <line x1={230} y1={55} x2={245} y2={55} stroke="var(--border)" strokeWidth={1} />
                <polygon points="242,50 242,60 250,55" fill="var(--muted-foreground)" />
              </motion.g>
              <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: d * 3 }}>
                <ModuleBox x={250} y={30} w={100} h={50} label="3. 병합" sub="merge_and_unload" color={G} />
              </motion.g>
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: d * 3.5 }}>
                <line x1={350} y1={55} x2={365} y2={55} stroke="var(--border)" strokeWidth={1} />
                <polygon points="362,50 362,60 370,55" fill="var(--muted-foreground)" />
              </motion.g>
              <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: d * 4 }}>
                <ModuleBox x={370} y={30} w={100} h={50} label="4. 배포" sub="vLLM / TGI" color={W} />
              </motion.g>

              {/* Detail per stage */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: d * 5 }}>
                <rect x={10} y={95} width={100} height={50} rx={4} fill={`${B}08`} stroke={B} strokeWidth={0.3} />
                <text x={60} y={110} textAnchor="middle" fontSize={7.5} fill={B}>JSON/JSONL</text>
                <text x={60} y={122} textAnchor="middle" fontSize={7.5} fill={B}>포맷 변환</text>
                <text x={60} y={134} textAnchor="middle" fontSize={7.5} fill={B}>품질 검증</text>
              </motion.g>
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: d * 5.5 }}>
                <rect x={130} y={95} width={100} height={50} rx={4} fill={`${P}08`} stroke={P} strokeWidth={0.3} />
                <text x={180} y={110} textAnchor="middle" fontSize={7.5} fill={P}>LoraConfig</text>
                <text x={180} y={122} textAnchor="middle" fontSize={7.5} fill={P}>BitsAndBytes</text>
                <text x={180} y={134} textAnchor="middle" fontSize={7.5} fill={P}>SFTTrainer</text>
              </motion.g>
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: d * 6 }}>
                <rect x={250} y={95} width={100} height={50} rx={4} fill={`${G}08`} stroke={G} strokeWidth={0.3} />
                <text x={300} y={110} textAnchor="middle" fontSize={7.5} fill={G}>adapter 로드</text>
                <text x={300} y={122} textAnchor="middle" fontSize={7.5} fill={G}>가중치 합산</text>
                <text x={300} y={134} textAnchor="middle" fontSize={7.5} fill={G}>safetensors 저장</text>
              </motion.g>
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: d * 6.5 }}>
                <rect x={370} y={95} width={100} height={50} rx={4} fill={`${W}08`} stroke={W} strokeWidth={0.3} />
                <text x={420} y={110} textAnchor="middle" fontSize={7.5} fill={W}>모델 로드</text>
                <text x={420} y={122} textAnchor="middle" fontSize={7.5} fill={W}>벤치마크 평가</text>
                <text x={420} y={134} textAnchor="middle" fontSize={7.5} fill={W}>API 서빙</text>
              </motion.g>

              {/* Time estimate */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: d * 7 }}>
                <rect x={80} y={158} width={320} height={30} rx={8} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
                <text x={240} y={172} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                  7B 모델 기준: 데이터 준비 2-3일 / 학습 2-4시간(A100) / 병합+배포 30분
                </text>
                <text x={240} y={184} textAnchor="middle" fontSize={8} fontWeight={600} fill={G}>
                  데이터 품질에 가장 많은 시간 투자가 ROI 최고
                </text>
              </motion.g>
            </g>
          )}
          {step === 1 && (
            <g>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">
                하이퍼파라미터 가이드
              </text>
              {/* Table-like layout */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: d }}>
                {/* Header */}
                <rect x={20} y={28} width={440} height={18} rx={4} fill="var(--card)" stroke="var(--border)" strokeWidth={0.3} />
                <text x={80} y={40} textAnchor="middle" fontSize={8} fontWeight={600} fill="var(--foreground)">파라미터</text>
                <text x={180} y={40} textAnchor="middle" fontSize={8} fontWeight={600} fill="var(--foreground)">추천 범위</text>
                <text x={310} y={40} textAnchor="middle" fontSize={8} fontWeight={600} fill="var(--foreground)">기본값</text>
                <text x={410} y={40} textAnchor="middle" fontSize={8} fontWeight={600} fill="var(--foreground)">설명</text>
              </motion.g>

              {[
                { param: 'r (rank)', range: '8 ~ 64', def: '16', desc: '저랭크 차원 수', color: P },
                { param: 'lora_alpha', range: 'r ~ 2r', def: '32', desc: '스케일링 계수', color: P },
                { param: 'lora_dropout', range: '0.0 ~ 0.1', def: '0.05', desc: '오버피팅 방지', color: B },
                { param: 'target_modules', range: 'q,v ~ all linear', def: 'all', desc: '적용 레이어', color: B },
                { param: 'learning_rate', range: '1e-4 ~ 3e-4', def: '2e-4', desc: 'Full FT보다 높게', color: G },
                { param: 'num_epochs', range: '1 ~ 3', def: '1', desc: '과적합 주의', color: W },
                { param: 'batch_size', range: '2 ~ 8', def: '4', desc: 'VRAM에 맞춤', color: W },
                { param: 'max_seq_length', range: '512 ~ 4096', def: '2048', desc: '데이터 길이에 맞춤', color: R },
              ].map((row, i) => (
                <motion.g key={row.param} initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: d * (i + 2) }}>
                  <rect x={20} y={48 + i * 18} width={440} height={17} rx={2}
                    fill={i % 2 === 0 ? `${row.color}06` : 'transparent'} />
                  <text x={80} y={60 + i * 18} textAnchor="middle" fontSize={7.5} fontWeight={600} fill={row.color}>
                    {row.param}
                  </text>
                  <text x={180} y={60 + i * 18} textAnchor="middle" fontSize={7.5} fill="var(--foreground)">{row.range}</text>
                  <text x={310} y={60 + i * 18} textAnchor="middle" fontSize={7.5} fontWeight={600} fill="var(--foreground)">{row.def}</text>
                  <text x={410} y={60 + i * 18} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">{row.desc}</text>
                </motion.g>
              ))}
            </g>
          )}
          {step === 2 && (
            <g>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">
                학습 코드 구조
              </text>
              {/* Three config blocks */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: d }}>
                <rect x={20} y={30} width={140} height={80} rx={6} fill="var(--card)" stroke={B} strokeWidth={0.5} />
                <rect x={20} y={30} width={140} height={5} rx={3} fill={B} opacity={0.7} />
                <text x={90} y={50} textAnchor="middle" fontSize={9} fontWeight={600} fill={B}>BitsAndBytesConfig</text>
                <text x={30} y={66} fontSize={7.5} fontFamily="monospace" fill="var(--muted-foreground)">load_in_4bit=True</text>
                <text x={30} y={78} fontSize={7.5} fontFamily="monospace" fill="var(--muted-foreground)">bnb_4bit_type="nf4"</text>
                <text x={30} y={90} fontSize={7.5} fontFamily="monospace" fill="var(--muted-foreground)">compute_dtype=bf16</text>
                <text x={30} y={102} fontSize={7.5} fontFamily="monospace" fill="var(--muted-foreground)">double_quant=True</text>
              </motion.g>

              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: d * 2 }}>
                <rect x={170} y={30} width={140} height={80} rx={6} fill="var(--card)" stroke={P} strokeWidth={0.5} />
                <rect x={170} y={30} width={140} height={5} rx={3} fill={P} opacity={0.7} />
                <text x={240} y={50} textAnchor="middle" fontSize={9} fontWeight={600} fill={P}>LoraConfig</text>
                <text x={180} y={66} fontSize={7.5} fontFamily="monospace" fill="var(--muted-foreground)">r=16</text>
                <text x={180} y={78} fontSize={7.5} fontFamily="monospace" fill="var(--muted-foreground)">lora_alpha=32</text>
                <text x={180} y={90} fontSize={7.5} fontFamily="monospace" fill="var(--muted-foreground)">lora_dropout=0.05</text>
                <text x={180} y={102} fontSize={7.5} fontFamily="monospace" fill="var(--muted-foreground)">target: all linear</text>
              </motion.g>

              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: d * 3 }}>
                <rect x={320} y={30} width={140} height={80} rx={6} fill="var(--card)" stroke={G} strokeWidth={0.5} />
                <rect x={320} y={30} width={140} height={5} rx={3} fill={G} opacity={0.7} />
                <text x={390} y={50} textAnchor="middle" fontSize={9} fontWeight={600} fill={G}>TrainingArgs</text>
                <text x={330} y={66} fontSize={7.5} fontFamily="monospace" fill="var(--muted-foreground)">lr=2e-4</text>
                <text x={330} y={78} fontSize={7.5} fontFamily="monospace" fill="var(--muted-foreground)">epochs=1</text>
                <text x={330} y={90} fontSize={7.5} fontFamily="monospace" fill="var(--muted-foreground)">batch_size=4</text>
                <text x={330} y={102} fontSize={7.5} fontFamily="monospace" fill="var(--muted-foreground)">bf16=True</text>
              </motion.g>

              {/* Arrows to SFTTrainer */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: d * 4 }}>
                <line x1={90} y1={110} x2={90} y2={126} stroke={B} strokeWidth={0.5} />
                <line x1={240} y1={110} x2={240} y2={126} stroke={P} strokeWidth={0.5} />
                <line x1={390} y1={110} x2={390} y2={126} stroke={G} strokeWidth={0.5} />
                <line x1={90} y1={126} x2={390} y2={126} stroke="var(--border)" strokeWidth={0.5} />
                <line x1={240} y1={126} x2={240} y2={138} stroke="var(--border)" strokeWidth={1} />
                <polygon points="235,135 245,135 240,142" fill="var(--muted-foreground)" />
              </motion.g>

              {/* SFTTrainer */}
              <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: d * 5 }}>
                <rect x={140} y={142} width={200} height={46} rx={8} fill={`${W}10`} stroke={W} strokeWidth={0.8} />
                <text x={240} y={162} textAnchor="middle" fontSize={11} fontWeight={700} fill={W}>SFTTrainer</text>
                <text x={240} y={178} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                  model + dataset + config → trainer.train()
                </text>
              </motion.g>
            </g>
          )}
          {step === 3 && (
            <g>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">
                병합 & 평가 & 배포
              </text>
              {/* Merge flow */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: d }}>
                <rect x={20} y={34} width={100} height={40} rx={5} fill="#64748b10" stroke="var(--border)" strokeWidth={0.5} />
                <text x={70} y={52} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--foreground)">Base Model</text>
                <text x={70} y={66} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">4-bit</text>
              </motion.g>
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: d * 1.5 }}>
                <text x={130} y={56} fontSize={12} fontWeight={700} fill={P}>+</text>
              </motion.g>
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: d * 2 }}>
                <rect x={140} y={34} width={100} height={40} rx={5} fill={`${P}12`} stroke={P} strokeWidth={0.5} />
                <text x={190} y={52} textAnchor="middle" fontSize={9} fontWeight={600} fill={P}>LoRA Adapter</text>
                <text x={190} y={66} textAnchor="middle" fontSize={7} fill={P}>~20MB</text>
              </motion.g>
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: d * 2.5 }}>
                <line x1={240} y1={54} x2={270} y2={54} stroke={G} strokeWidth={1.5} />
                <polygon points="267,49 267,59 275,54" fill={G} />
              </motion.g>
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: d * 3 }}>
                <rect x={280} y={34} width={170} height={40} rx={5} fill={`${G}12`} stroke={G} strokeWidth={0.8} />
                <text x={365} y={52} textAnchor="middle" fontSize={9} fontWeight={600} fill={G}>merge_and_unload()</text>
                <text x={365} y={66} textAnchor="middle" fontSize={7} fill={G}>W' = W + (a/r)BA → safetensors</text>
              </motion.g>

              {/* Evaluation */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: d * 4 }}>
                <rect x={20} y={86} width={210} height={60} rx={6} fill="var(--card)" stroke={W} strokeWidth={0.5} />
                <text x={125} y={102} textAnchor="middle" fontSize={9} fontWeight={600} fill={W}>평가 방법</text>
                <text x={30} y={118} fontSize={8} fill="var(--muted-foreground)">&#x2022; 도메인 벤치마크 (자동 점수)</text>
                <text x={30} y={132} fontSize={8} fill="var(--muted-foreground)">&#x2022; 사람 평가 (A/B 테스트)</text>
                <text x={30} y={144} fontSize={8} fill={W}>&#x2022; GPT-4 judge (비용 효율적)</text>
              </motion.g>

              {/* Deployment */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: d * 5 }}>
                <rect x={250} y={86} width={210} height={60} rx={6} fill="var(--card)" stroke={B} strokeWidth={0.5} />
                <text x={355} y={102} textAnchor="middle" fontSize={9} fontWeight={600} fill={B}>배포 옵션</text>
                <DataBox x={260} y={108} w={55} h={24} label="vLLM" sub="고속 배치" color={B} />
                <DataBox x={322} y={108} w={55} h={24} label="TGI" sub="HF 공식" color={P} />
                <DataBox x={384} y={108} w={55} h={24} label="Ollama" sub="로컬 추론" color={G} />
              </motion.g>

              {/* Cost summary */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: d * 6 }}>
                <rect x={60} y={158} width={360} height={30} rx={8} fill={`${G}08`} stroke={G} strokeWidth={0.5} />
                <text x={240} y={172} textAnchor="middle" fontSize={8} fill="var(--foreground)">
                  7B QLoRA 전체 비용: A100 1장 x 2시간 = ~$4
                </text>
                <text x={240} y={184} textAnchor="middle" fontSize={8} fontWeight={600} fill={G}>
                  병합 후 원본과 동일한 추론 속도 — 추가 비용 없음
                </text>
              </motion.g>
            </g>
          )}
        </svg>
      )}
    </StepViz>
  );
}

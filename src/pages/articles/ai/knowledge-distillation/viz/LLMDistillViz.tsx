import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, StatusBox } from '@/components/viz/boxes';
import { STEPS, C } from './LLMDistillVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

function TowerBlock({ x, y, layers, color, label, w = 38 }: {
  x: number; y: number; layers: number; color: string; label: string; w?: number;
}) {
  const layerH = 8;
  const gap = 2;
  return (
    <g>
      {Array.from({ length: layers }).map((_, i) => (
        <rect key={i}
          x={x} y={y + i * (layerH + gap)}
          width={w} height={layerH} rx={2}
          fill={color} opacity={0.3 + (i / layers) * 0.5} />
      ))}
      <text x={x + w / 2} y={y + layers * (layerH + gap) + 10}
        textAnchor="middle" fontSize={8} fontWeight={600} fill={color}>{label}</text>
    </g>
  );
}

export default function LLMDistillViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 210" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* DistilBERT comparison */}
          {step <= 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {/* BERT tower: 12 layers */}
              <TowerBlock x={30} y={15} layers={12} color={C.bert} label="BERT-base" />
              <text x={49} y={140} textAnchor="middle" fontSize={7} fill={C.muted}>12 layers</text>
              <text x={49} y={150} textAnchor="middle" fontSize={7} fill={C.muted}>110M params</text>

              {/* Arrow */}
              <line x1={80} y1={75} x2={110} y2={75}
                stroke={C.distil} strokeWidth={1} markerEnd="url(#kd-llm-arr)" />
              <text x={95} y={68} textAnchor="middle" fontSize={7} fill={C.distil}>증류</text>

              {/* DistilBERT tower: 6 layers */}
              <TowerBlock x={120} y={45} layers={6} color={C.distil} label="DistilBERT" />
              <text x={139} y={120} textAnchor="middle" fontSize={7} fill={C.muted}>6 layers</text>
              <text x={139} y={130} textAnchor="middle" fontSize={7} fill={C.muted}>66M params</text>
            </motion.g>
          )}

          {/* Layer initialization detail */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={sp}>
              <rect x={200} y={15} width={160} height={80} rx={6}
                fill={`${C.distil}08`} stroke={C.distil} strokeWidth={0.8} />
              <text x={280} y={32} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.distil}>
                레이어 초기화 전략
              </text>
              {/* mapping lines */}
              {[0, 2, 4, 6, 8, 10].map((t, i) => (
                <g key={i}>
                  <text x={215} y={48 + i * 10} fontSize={7} fill={C.bert}>T-{t}</text>
                  <line x1={235} y1={45 + i * 10} x2={270} y2={45 + i * 10}
                    stroke={C.distil} strokeWidth={0.5} markerEnd="url(#kd-llm-arr2)" />
                  <text x={278} y={48 + i * 10} fontSize={7} fill={C.distil}>S-{i}</text>
                </g>
              ))}
              <text x={330} y={60} fontSize={7} fill={C.muted}>짝수 레이어</text>
              <text x={330} y={72} fontSize={7} fill={C.muted}>→ Student 초기화</text>
            </motion.g>
          )}

          {/* Performance badge */}
          {step <= 1 && (
            <StatusBox x={200} y={110} w={120} h={48} label="97% 성능 유지"
              sub="40% 크기, 60% 빠름" color={C.distil} progress={0.97} />
          )}

          {/* TinyLlama */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <TowerBlock x={30} y={20} layers={8} color={C.tiny} label="TinyLlama" w={42} />
              <text x={51} y={115} textAnchor="middle" fontSize={7} fill={C.muted}>1.1B params</text>

              {/* Data volume */}
              <rect x={110} y={20} width={140} height={70} rx={6}
                fill={`${C.tiny}08`} stroke={C.tiny} strokeWidth={0.8} />
              <text x={180} y={38} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.tiny}>
                대규모 데이터 학습
              </text>
              <text x={180} y={53} textAnchor="middle" fontSize={8} fill={C.muted}>
                3 Trillion 토큰
              </text>
              <text x={180} y={66} textAnchor="middle" fontSize={7.5} fill={C.muted}>
                Llama-2 아키텍처 축소판
              </text>
              <text x={180} y={80} textAnchor="middle" fontSize={7} fill={C.tiny}>
                "작은 모델 + 많은 데이터" 전략
              </text>

              <StatusBox x={280} y={30} w={120} h={48} label="7B 모델 대비"
                sub="경쟁력 있는 성능" color={C.tiny} progress={0.85} />
            </motion.g>
          )}

          {/* Data distillation */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <ModuleBox x={10} y={20} w={90} h={50} label="GPT-4" sub="Teacher API" color={C.data} />

              {/* Generated data */}
              <line x1={100} y1={45} x2={140} y2={45}
                stroke={C.data} strokeWidth={1} markerEnd="url(#kd-data-arr)" />
              {[0, 1, 2, 3].map(i => (
                <rect key={i} x={150} y={15 + i * 18} width={80} height={14} rx={3}
                  fill={`${C.data}12`} stroke={C.data} strokeWidth={0.5} />
              ))}
              {[0, 1, 2, 3].map(i => (
                <text key={`t-${i}`} x={190} y={25 + i * 18}
                  textAnchor="middle" fontSize={7} fill={C.data}>
                  {['질문-답변', '요약 데이터', '코드 생성', '추론 체인'][i]}
                </text>
              ))}
              <text x={190} y={92} textAnchor="middle" fontSize={7.5} fontWeight={600} fill={C.data}>
                합성 데이터
              </text>

              {/* Arrow to student */}
              <line x1={230} y1={50} x2={270} y2={50}
                stroke={C.distil} strokeWidth={1} markerEnd="url(#kd-llm-arr)" />

              <ModuleBox x={280} y={25} w={90} h={50} label="Student" sub="Alpaca, Vicuna" color={C.distil} />

              <text x={325} y={95} textAnchor="middle" fontSize={7.5} fill={C.muted}>
                Teacher의 출력 데이터로 학습
              </text>
              <text x={325} y={107} textAnchor="middle" fontSize={7.5} fill={C.muted}>
                = 간접 지식 증류
              </text>
            </motion.g>
          )}

          {/* Comparison */}
          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {/* Direct distillation */}
              <rect x={20} y={15} width={200} height={80} rx={8}
                fill={`${C.bert}06`} stroke={C.bert} strokeWidth={0.8} />
              <text x={120} y={32} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.bert}>
                직접 증류
              </text>
              <ModuleBox x={30} y={40} w={70} h={38} label="Teacher" sub="모델 접근 필요" color={C.bert} />
              <line x1={100} y1={59} x2={130} y2={59}
                stroke={C.bert} strokeWidth={0.8} markerEnd="url(#kd-llm-arr3)" />
              <ModuleBox x={135} y={40} w={70} h={38} label="Student" sub="logit 학습" color={C.distil} />

              {/* Indirect distillation */}
              <rect x={240} y={15} width={220} height={80} rx={8}
                fill={`${C.data}06`} stroke={C.data} strokeWidth={0.8} />
              <text x={350} y={32} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.data}>
                간접 증류 (데이터)
              </text>
              <ModuleBox x={250} y={40} w={70} h={38} label="Teacher" sub="API만 필요" color={C.data} />
              <DataBox x={330} y={44} w={50} h={28} label="데이터" sub="합성" color={C.data} />
              <line x1={380} y1={58} x2={400} y2={58}
                stroke={C.distil} strokeWidth={0.8} markerEnd="url(#kd-llm-arr3)" />
              <ModuleBox x={405} y={40} w={50} h={38} label="Student" sub="" color={C.distil} />

              {/* 현대 트렌드 */}
              <rect x={120} y={115} width={240} height={40} rx={6}
                fill={`${C.api}08`} stroke={C.api} strokeWidth={0.8} strokeDasharray="4 3" />
              <text x={240} y={133} textAnchor="middle" fontSize={8.5} fontWeight={600} fill={C.api}>
                현대 LLM: 간접 증류가 주류
              </text>
              <text x={240} y={147} textAnchor="middle" fontSize={7.5} fill={C.muted}>
                모델 가중치 없이 API 호출만으로 증류 가능
              </text>
            </motion.g>
          )}

          <defs>
            <marker id="kd-llm-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 Z" fill={C.distil} />
            </marker>
            <marker id="kd-llm-arr2" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
              <path d="M0,0 L5,2.5 L0,5 Z" fill={C.distil} />
            </marker>
            <marker id="kd-llm-arr3" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
              <path d="M0,0 L5,2.5 L0,5 Z" fill={C.bert} />
            </marker>
            <marker id="kd-data-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 Z" fill={C.data} />
            </marker>
          </defs>
        </svg>
      )}
    </StepViz>
  );
}

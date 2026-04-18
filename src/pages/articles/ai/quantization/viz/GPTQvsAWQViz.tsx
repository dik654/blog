import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, AlertBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.4 };

const STEPS = [
  {
    label: '1. LLM 양자화의 특수한 도전',
    body: 'LLM은 수십~수백 레이어 × 수십억 파라미터 → 전통 PTQ 적용 시 오차 누적이 치명적\nINT4(16단계)로는 일반 PTQ가 불가능 → 레이어별 보정이 필수\nGPTQ: Hessian(2차 미분) 기반으로 양자화 오차를 다른 가중치로 보상\nAWQ: 활성값 관찰로 "중요한 채널"을 찾아 보호\n두 기법 모두 학습 없이(PTQ) 수 시간 내 완료',
  },
  {
    label: '2. GPTQ: Hessian 기반 최적 양자화',
    body: 'OBQ(Optimal Brain Quantization)의 LLM 확장판\n각 가중치를 양자화할 때, 양자화 오차를 아직 안 된 가중치에 분산:\nδ = (w − quant(w)) / H⁻¹[i,i]  →  나머지 가중치 -= H⁻¹[i,:] × δ\nH = X^T X (Hessian의 대각 근사, calibration 데이터로 계산)\n순서 트릭: 128개 열을 블록으로 묶어 처리 → GPU 병렬화로 빠름',
  },
  {
    label: '3. AWQ: 활성값 인식 가중치 양자화',
    body: '핵심 관찰: 가중치의 1%가 활성값 크기를 결정 → 이 채널만 보호하면 충분\n방법: 중요 채널의 가중치에 scale factor s를 곱해 양자화 오전 감소\nw_q = quant(w × s) / s  →  s가 크면 양자화 격자가 촘촘해짐\n최적 s: calibration 데이터의 활성값 크기에 비례 (α승)\nGPTQ보다 간단, 속도 빠름, 비슷한 정확도',
  },
  {
    label: '4. GGUF: llama.cpp 생태계',
    body: 'GGUF(GPT-Generated Unified Format): CPU + 소량 GPU 추론용 포맷\n특징: 메타데이터 내장, 혼합 양자화(레이어별 다른 비트), mmap 지원\n양자화 레벨: Q2_K ~ Q8_0 (2~8비트, K=k-quant 혼합 방식)\nQ4_K_M: 주요 레이어 4비트 + attention 6비트 → 최적 품질/크기 비율\n활용: Ollama, LM Studio 등 로컬 추론 도구의 표준 포맷',
  },
  {
    label: '5. GPTQ vs AWQ vs GGUF 비교',
    body: 'GPTQ: GPU 추론 특화, 최고 정확도, 양자화 시간 길음 (수 시간)\nAWQ: GPU 추론 특화, GPTQ와 비슷한 정확도, 양자화 빠름\nGGUF: CPU/GPU 혼합, 로컬 추론 표준, 유연한 혼합 양자화\nvLLM 서빙: GPTQ·AWQ 직접 지원 → 대회에서 바로 사용 가능\n실전 선택: GPU 서빙 = AWQ (속도), CPU 로컬 = GGUF Q4_K_M',
  },
];

export default function GPTQvsAWQViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={15} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">
                LLM 양자화: 왜 일반 PTQ로는 부족한가
              </text>

              {/* 레이어 누적 오차 */}
              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0.1 }}>
                {[0, 1, 2, 3, 4].map(i => (
                  <g key={i}>
                    <rect x={30 + i * 85} y={30} width={75} height={35} rx={5}
                      fill={`${['#3b82f6', '#6366f1', '#8b5cf6', '#f59e0b', '#ef4444'][i]}12`}
                      stroke={['#3b82f6', '#6366f1', '#8b5cf6', '#f59e0b', '#ef4444'][i]}
                      strokeWidth={0.8} />
                    <text x={67 + i * 85} y={45} textAnchor="middle" fontSize={8} fill={['#3b82f6', '#6366f1', '#8b5cf6', '#f59e0b', '#ef4444'][i]}>
                      Layer {i + 1}
                    </text>
                    <text x={67 + i * 85} y={58} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
                      오차 {(0.3 * (i + 1)).toFixed(1)}%
                    </text>
                    {i < 4 && <text x={108 + i * 85} y={50} fontSize={9} fill="var(--muted-foreground)">→</text>}
                  </g>
                ))}
                <text x={460} y={50} fontSize={8} fill="var(--muted-foreground)">...</text>
              </motion.g>

              {/* 오차 누적 그래프 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.3 }}>
                <text x={50} y={82} fontSize={8} fill="var(--muted-foreground)">오차</text>
                <line x1={70} y1={85} x2={430} y2={85} stroke="var(--border)" strokeWidth={0.5} />
                <line x1={70} y1={85} x2={70} y2={145} stroke="var(--border)" strokeWidth={0.5} />
                {/* 일반 PTQ 급격한 곡선 */}
                <path d="M70,142 Q150,140 200,135 Q280,120 350,95 Q400,85 430,70"
                  fill="none" stroke="#ef4444" strokeWidth={1.5} />
                <text x={435} y={72} fontSize={7} fill="#ef4444">일반 PTQ</text>
                {/* GPTQ/AWQ 완만한 곡선 */}
                <path d="M70,142 Q150,141 200,140 Q280,138 350,135 Q400,132 430,130"
                  fill="none" stroke="#10b981" strokeWidth={1.5} />
                <text x={435} y={132} fontSize={7} fill="#10b981">GPTQ/AWQ</text>
                <text x={250} y={160} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">레이어 수 →</text>
              </motion.g>

              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.45 }}>
                <rect x={60} y={168} width={360} height={22} rx={5} fill="#6366f112" stroke="#6366f1" strokeWidth={1} />
                <text x={240} y={183} textAnchor="middle" fontSize={9} fill="#6366f1">
                  GPTQ/AWQ: 레이어별 보정으로 오차 누적을 억제
                </text>
              </motion.g>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={15} textAnchor="middle" fontSize={10} fontWeight={700} fill="#6366f1">
                GPTQ: 양자화 오차를 나머지 가중치로 보상
              </text>

              {/* 가중치 행렬 */}
              <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ ...sp, delay: 0.1 }}>
                <text x={40} y={35} fontSize={9} fontWeight={600} fill="var(--foreground)">가중치 행렬 (한 레이어)</text>
                {[0, 1, 2, 3, 4, 5].map(c => (
                  <g key={c}>
                    <rect x={30 + c * 38} y={40} width={35} height={25} rx={3}
                      fill={c < 2 ? '#10b98118' : c < 3 ? '#f59e0b25' : '#3b82f610'}
                      stroke={c < 2 ? '#10b981' : c < 3 ? '#f59e0b' : '#3b82f6'} strokeWidth={0.8} />
                    <text x={47 + c * 38} y={56} textAnchor="middle" fontSize={7}
                      fill={c < 2 ? '#10b981' : c < 3 ? '#f59e0b' : '#3b82f6'}>
                      {c < 2 ? 'done' : c < 3 ? 'now' : 'todo'}
                    </text>
                  </g>
                ))}
              </motion.g>

              {/* GPTQ 수식 */}
              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0.2 }}>
                <rect x={20} y={75} width={440} height={28} rx={5} fill="#f59e0b12" stroke="#f59e0b" strokeWidth={1} />
                <text x={240} y={93} textAnchor="middle" fontSize={9} fontFamily="monospace" fill="#f59e0b">
                  δ = (w − quant(w)) / H⁻¹[i,i]   →   w_rest -= H⁻¹[i,:] × δ
                </text>
              </motion.g>

              {/* 보상 과정 시각화 */}
              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0.35 }}>
                <rect x={30} y={115} width={80} height={28} rx={5} fill="#f59e0b18" stroke="#f59e0b" strokeWidth={1} />
                <text x={70} y={133} textAnchor="middle" fontSize={9} fill="#f59e0b">w[i] 양자화</text>
                <line x1={115} y1={129} x2={150} y2={129} stroke="#ef4444" strokeWidth={1} />
                <text x={132} y={123} fontSize={7} fill="#ef4444">오차</text>
                <rect x={155} y={115} width={90} height={28} rx={5} fill="#ef444412" stroke="#ef4444" strokeWidth={1} />
                <text x={200} y={133} textAnchor="middle" fontSize={9} fill="#ef4444">δ 계산</text>
                <line x1={250} y1={129} x2={285} y2={129} stroke="#10b981" strokeWidth={1} />
                <text x={267} y={123} fontSize={7} fill="#10b981">분산</text>
                <rect x={290} y={115} width={120} height={28} rx={5} fill="#10b98112" stroke="#10b981" strokeWidth={1} />
                <text x={350} y={133} textAnchor="middle" fontSize={9} fill="#10b981">나머지 w 보정</text>
              </motion.g>

              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.5 }}>
                <text x={240} y={162} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                  H = X^T X (Hessian 대각 근사) — calibration 데이터 128개로 계산
                </text>
                <rect x={60} y={170} width={360} height={22} rx={5} fill="#6366f112" stroke="#6366f1" strokeWidth={1} />
                <text x={240} y={185} textAnchor="middle" fontSize={9} fill="#6366f1">
                  128열 블록 처리 → GPU 병렬화 → 7B 모델 4비트 양자화 ~4시간
                </text>
              </motion.g>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={15} textAnchor="middle" fontSize={10} fontWeight={700} fill="#10b981">
                AWQ: 중요한 채널을 보호
              </text>

              {/* 활성값 크기 시각화 */}
              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0.1 }}>
                <text x={30} y={35} fontSize={9} fontWeight={600} fill="var(--foreground)">활성값(activation) 크기별 채널</text>
                {[
                  { h: 15, color: '#3b82f6', label: '보통' },
                  { h: 12, color: '#3b82f6', label: '' },
                  { h: 55, color: '#ef4444', label: '중요!' },
                  { h: 10, color: '#3b82f6', label: '' },
                  { h: 48, color: '#ef4444', label: '중요!' },
                  { h: 18, color: '#3b82f6', label: '' },
                  { h: 8, color: '#3b82f6', label: '' },
                  { h: 14, color: '#3b82f6', label: '' },
                ].map((ch, i) => (
                  <g key={i}>
                    <rect x={30 + i * 30} y={95 - ch.h} width={24} height={ch.h} rx={2}
                      fill={`${ch.color}25`} stroke={ch.color} strokeWidth={0.8} />
                    {ch.label && <text x={42 + i * 30} y={90 - ch.h} textAnchor="middle" fontSize={7} fill={ch.color}>{ch.label}</text>}
                  </g>
                ))}
                <line x1={28} y1={97} x2={275} y2={97} stroke="var(--border)" strokeWidth={0.5} />
                <text x={150} y={110} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                  1%의 채널이 출력의 대부분을 결정
                </text>
              </motion.g>

              {/* AWQ 보호 수식 */}
              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0.25 }}>
                <rect x={290} y={30} width={175} height={75} rx={6} fill="#10b98110" stroke="#10b981" strokeWidth={1} />
                <text x={377} y={48} textAnchor="middle" fontSize={9} fontWeight={600} fill="#10b981">AWQ 보호 방식</text>
                <text x={377} y={65} textAnchor="middle" fontSize={8} fontFamily="monospace" fill="#10b981">
                  w_q = quant(w × s) / s
                </text>
                <text x={377} y={80} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                  s ↑ → 양자화 격자 촘촘
                </text>
                <text x={377} y={95} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                  → 중요 채널 오차 감소
                </text>
              </motion.g>

              {/* 비교 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.4 }}>
                <rect x={30} y={125} width={200} height={28} rx={5} fill="#6366f112" stroke="#6366f1" strokeWidth={0.8} />
                <text x={130} y={140} textAnchor="middle" fontSize={8} fill="#6366f1">GPTQ: Hessian 역행렬 필요</text>
                <text x={130} y={150} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">정확하지만 느림</text>

                <rect x={250} y={125} width={200} height={28} rx={5} fill="#10b98112" stroke="#10b981" strokeWidth={0.8} />
                <text x={350} y={140} textAnchor="middle" fontSize={8} fill="#10b981">AWQ: scale factor만 계산</text>
                <text x={350} y={150} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">간단하고 빠름</text>
              </motion.g>

              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.5 }}>
                <text x={240} y={175} textAnchor="middle" fontSize={9} fill="#f59e0b">
                  최적 s = activation_magnitude^α (α ≈ 0.5, grid search로 결정)
                </text>
                <text x={240} y={190} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                  7B INT4 양자화: GPTQ ~4시간, AWQ ~30분
                </text>
              </motion.g>
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={15} textAnchor="middle" fontSize={10} fontWeight={700} fill="#8b5cf6">
                GGUF: CPU + GPU 혼합 추론 포맷
              </text>

              {/* GGUF 구조 */}
              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0.1 }}>
                <rect x={20} y={28} width={440} height={32} rx={6} fill="#8b5cf610" stroke="#8b5cf6" strokeWidth={1} />
                <rect x={20} y={28} width={80} height={32} rx={6} fill="#8b5cf620" />
                <text x={60} y={48} textAnchor="middle" fontSize={9} fill="#8b5cf6" fontWeight={600}>Header</text>
                <rect x={105} y={28} width={100} height={32} fill="#3b82f610" />
                <text x={155} y={48} textAnchor="middle" fontSize={9} fill="#3b82f6">메타데이터</text>
                <rect x={210} y={28} width={245} height={32} fill="#10b98110" />
                <text x={332} y={48} textAnchor="middle" fontSize={9} fill="#10b981">텐서 데이터 (혼합 양자화)</text>
              </motion.g>

              {/* 양자화 레벨 */}
              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0.2 }}>
                <text x={30} y={78} fontSize={9} fontWeight={600} fill="var(--foreground)">양자화 레벨:</text>
                {[
                  { name: 'Q2_K', bits: '2~3b', size: '2.7G', quality: '낮음', color: '#ef4444' },
                  { name: 'Q4_K_M', bits: '4~6b', size: '4.1G', quality: '양호', color: '#10b981' },
                  { name: 'Q5_K_M', bits: '5~6b', size: '4.8G', quality: '우수', color: '#3b82f6' },
                  { name: 'Q8_0', bits: '8b', size: '7.2G', quality: '최고', color: '#6366f1' },
                ].map((q, i) => (
                  <g key={q.name}>
                    <rect x={20 + i * 115} y={83} width={108} height={42} rx={5}
                      fill={`${q.color}10`} stroke={q.color} strokeWidth={0.8} />
                    <text x={74 + i * 115} y={97} textAnchor="middle" fontSize={9} fontWeight={600} fill={q.color}>{q.name}</text>
                    <text x={74 + i * 115} y={110} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
                      {q.bits} | {q.size} | {q.quality}
                    </text>
                    <text x={74 + i * 115} y={121} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">(7B 기준)</text>
                  </g>
                ))}
              </motion.g>

              {/* 혼합 양자화 설명 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.4 }}>
                <rect x={30} y={133} width={420} height={24} rx={5} fill="#f59e0b12" stroke="#f59e0b" strokeWidth={1} />
                <text x={240} y={149} textAnchor="middle" fontSize={9} fill="#f59e0b">
                  K-quant 혼합: attention 레이어 = 높은 비트, FFN = 낮은 비트
                </text>

                <text x={240} y={175} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                  활용: Ollama, LM Studio, llama.cpp 등 로컬 추론 표준
                </text>
                <text x={240} y={190} textAnchor="middle" fontSize={8} fill="#10b981">
                  Q4_K_M이 품질/크기 최적 균형 → 가장 많이 사용
                </text>
              </motion.g>
            </motion.g>
          )}

          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={15} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">
                GPTQ vs AWQ vs GGUF 비교
              </text>

              {/* 비교 테이블 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.1 }}>
                {/* 헤더 */}
                <rect x={15} y={25} width={90} height={20} rx={3} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
                <text x={60} y={39} textAnchor="middle" fontSize={8} fontWeight={600} fill="var(--muted-foreground)">항목</text>
                <rect x={110} y={25} width={115} height={20} rx={3} fill="#6366f110" stroke="#6366f1" strokeWidth={0.5} />
                <text x={167} y={39} textAnchor="middle" fontSize={8} fontWeight={600} fill="#6366f1">GPTQ</text>
                <rect x={230} y={25} width={115} height={20} rx={3} fill="#10b98110" stroke="#10b981" strokeWidth={0.5} />
                <text x={287} y={39} textAnchor="middle" fontSize={8} fontWeight={600} fill="#10b981">AWQ</text>
                <rect x={350} y={25} width={115} height={20} rx={3} fill="#8b5cf610" stroke="#8b5cf6" strokeWidth={0.5} />
                <text x={407} y={39} textAnchor="middle" fontSize={8} fontWeight={600} fill="#8b5cf6">GGUF</text>
              </motion.g>

              {[
                { item: '원리', gptq: 'Hessian 보상', awq: '채널 보호', gguf: '혼합 양자화' },
                { item: '양자화 시간', gptq: '~4h (7B)', awq: '~30min', gguf: '~10min' },
                { item: '추론 대상', gptq: 'GPU', awq: 'GPU', gguf: 'CPU+GPU' },
                { item: '정확도 (4bit)', gptq: '★★★★☆', awq: '★★★★☆', gguf: '★★★☆☆' },
                { item: 'vLLM 지원', gptq: '○', awq: '○', gguf: '×' },
                { item: '대표 도구', gptq: 'AutoGPTQ', awq: 'AutoAWQ', gguf: 'llama.cpp' },
              ].map((row, i) => (
                <motion.g key={row.item} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ ...sp, delay: 0.15 + i * 0.06 }}>
                  <rect x={15} y={48 + i * 20} width={90} height={18} rx={2} fill="var(--card)" stroke="var(--border)" strokeWidth={0.3} />
                  <text x={60} y={60 + i * 20} textAnchor="middle" fontSize={7.5} fill="var(--foreground)">{row.item}</text>
                  <rect x={110} y={48 + i * 20} width={115} height={18} rx={2} fill="var(--card)" stroke="var(--border)" strokeWidth={0.3} />
                  <text x={167} y={60 + i * 20} textAnchor="middle" fontSize={7.5} fill="#6366f1">{row.gptq}</text>
                  <rect x={230} y={48 + i * 20} width={115} height={18} rx={2} fill="var(--card)" stroke="var(--border)" strokeWidth={0.3} />
                  <text x={287} y={60 + i * 20} textAnchor="middle" fontSize={7.5} fill="#10b981">{row.awq}</text>
                  <rect x={350} y={48 + i * 20} width={115} height={18} rx={2} fill="var(--card)" stroke="var(--border)" strokeWidth={0.3} />
                  <text x={407} y={60 + i * 20} textAnchor="middle" fontSize={7.5} fill="#8b5cf6">{row.gguf}</text>
                </motion.g>
              ))}

              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.55 }}>
                <rect x={40} y={172} width={400} height={22} rx={5} fill="#10b98112" stroke="#10b981" strokeWidth={1.2} />
                <text x={240} y={187} textAnchor="middle" fontSize={9} fontWeight={600} fill="#10b981">
                  실전: GPU 서빙 = AWQ (빠름) / CPU 로컬 = GGUF Q4_K_M
                </text>
              </motion.g>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}

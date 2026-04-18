import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.4 };

const STEPS = [
  {
    label: '1. VRAM 예산별 최적 정밀도 선택',
    body: '모델 크기 = 파라미터 수 × 바이트/파라미터\nFP16: 파라미터 × 2B / INT8: × 1B / INT4: × 0.5B\n추론 시 KV-cache + 활성값 오버헤드 ~20~30% 추가\n1.2B 모델 기준: FP16=2.4GB → INT4=0.6GB + KV=0.3GB ≈ 0.9GB',
  },
  {
    label: '2. 1.2B 모델 양자화 시나리오',
    body: 'FP16: 2.4GB (기본)\nINT8(PTQ): 1.2GB (50% 절감, perplexity +0.1)\nINT4(GPTQ): 0.6GB (75% 절감, perplexity +0.3)\nINT4(AWQ): 0.6GB (75% 절감, perplexity +0.2)\n→ VRAM 22.4GB 제약에서 INT4 = batch size를 4배 이상 키울 수 있음',
  },
  {
    label: '3. vLLM에서의 양자화 모델 서빙',
    body: 'vLLM: PagedAttention 기반 LLM 추론 엔진, GPTQ/AWQ 네이티브 지원\n사용법: --quantization awq 또는 --quantization gptq 플래그\nPagedAttention + INT4 조합: KV-cache를 페이지 단위로 관리\n→ 같은 VRAM에서 동시 요청 수(batch) 최대 4~8배 향상\n대회 서빙: vLLM + AWQ INT4가 가장 실용적 조합',
  },
  {
    label: '4. Perplexity vs 메모리 vs 속도 트레이드오프',
    body: 'INT8: perplexity +0.05~0.2, 메모리 50%, 속도 1.5~2× (INT8 matmul)\nINT4 GPTQ: ppl +0.2~0.5, 메모리 25%, 속도 2~3× (dequant 오버헤드)\nINT4 AWQ: ppl +0.1~0.4, 메모리 25%, 속도 2.5~3.5× (퓨전 커널)\n핵심: 4비트에서도 perplexity 증가는 0.5 미만 → 실용적으로 허용 범위\n대회 관건: throughput (토큰/초) 최대화가 점수에 직결',
  },
];

export default function VRAMBudgetViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={15} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">
                모델 크기 = 파라미터 수 × 바이트/파라미터
              </text>

              {/* VRAM 바 차트 */}
              {[
                { label: 'FP32', bytes: 4, mem: '4.8 GB', w: 400, color: '#ef4444' },
                { label: 'FP16', bytes: 2, mem: '2.4 GB', w: 200, color: '#f59e0b' },
                { label: 'INT8', bytes: 1, mem: '1.2 GB', w: 100, color: '#3b82f6' },
                { label: 'INT4', bytes: 0.5, mem: '0.6 GB', w: 50, color: '#10b981' },
              ].map((p, i) => (
                <motion.g key={p.label} initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ ...sp, delay: i * 0.1 }}>
                  <text x={15} y={42 + i * 38} fontSize={10} fontWeight={600} fill={p.color}>{p.label}</text>
                  <rect x={60} y={30 + i * 38} width={p.w} height={22} rx={4}
                    fill={`${p.color}20`} stroke={p.color} strokeWidth={1} />
                  <text x={65 + p.w} y={45 + i * 38} fontSize={9} fill="var(--muted-foreground)">
                    {p.bytes}B/param → {p.mem}
                  </text>
                </motion.g>
              ))}

              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.5 }}>
                <text x={240} y={185} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                  1.2B 모델 기준 | 추론 시 KV-cache 오버헤드 +20~30% 추가
                </text>
              </motion.g>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={15} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">
                1.2B 모델: VRAM 22.4GB 예산에서의 전략
              </text>

              {/* VRAM 게이지 */}
              <rect x={30} y={28} width={420} height={16} rx={8} fill="var(--border)" opacity={0.3} />
              <rect x={30} y={28} width={420} height={16} rx={8} fill="#ef444415" stroke="#ef4444" strokeWidth={0.5} />
              <text x={240} y={40} textAnchor="middle" fontSize={8} fill="#ef4444">VRAM 22.4 GB</text>

              {/* 시나리오별 */}
              {[
                { label: 'FP16', model: 2.4, kv: 0.7, batch: '~8', ppl: '+0.0', color: '#f59e0b' },
                { label: 'INT8 PTQ', model: 1.2, kv: 0.7, batch: '~16', ppl: '+0.1', color: '#3b82f6' },
                { label: 'INT4 GPTQ', model: 0.6, kv: 0.7, batch: '~32', ppl: '+0.3', color: '#6366f1' },
                { label: 'INT4 AWQ', model: 0.6, kv: 0.7, batch: '~32', ppl: '+0.2', color: '#10b981' },
              ].map((s, i) => {
                const total = s.model + s.kv;
                const barW = (total / 22.4) * 380;
                return (
                  <motion.g key={s.label} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ ...sp, delay: 0.1 + i * 0.1 }}>
                    <text x={15} y={70 + i * 34} fontSize={9} fontWeight={600} fill={s.color}>{s.label}</text>
                    {/* 모델 */}
                    <rect x={90} y={58 + i * 34} width={(s.model / 22.4) * 380} height={16} rx={3}
                      fill={`${s.color}30`} stroke={s.color} strokeWidth={0.5} />
                    {/* KV cache */}
                    <rect x={90 + (s.model / 22.4) * 380} y={58 + i * 34} width={(s.kv / 22.4) * 380} height={16} rx={3}
                      fill={`${s.color}15`} stroke={s.color} strokeWidth={0.5} strokeDasharray="2 2" />
                    <text x={95 + barW} y={70 + i * 34} fontSize={7} fill="var(--muted-foreground)">
                      {total.toFixed(1)}GB | batch {s.batch} | ppl{s.ppl}
                    </text>
                  </motion.g>
                );
              })}

              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.55 }}>
                <rect x={50} y={178} width={380} height={18} rx={4} fill="#10b98112" />
                <text x={240} y={190} textAnchor="middle" fontSize={8} fill="#10b981">
                  INT4 AWQ: 같은 VRAM에서 batch 4배 → throughput 4배 향상
                </text>
              </motion.g>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={15} textAnchor="middle" fontSize={10} fontWeight={700} fill="#6366f1">
                vLLM + 양자화 모델 서빙
              </text>

              {/* vLLM 아키텍처 */}
              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0.1 }}>
                <rect x={20} y={28} width={440} height={75} rx={8} fill="#6366f108" stroke="#6366f1" strokeWidth={1} />
                <text x={240} y={45} textAnchor="middle" fontSize={10} fontWeight={600} fill="#6366f1">vLLM Engine</text>

                {/* 내부 모듈 */}
                <rect x={35} y={52} width={100} height={26} rx={5} fill="#3b82f618" stroke="#3b82f6" strokeWidth={0.8} />
                <text x={85} y={69} textAnchor="middle" fontSize={8} fill="#3b82f6">PagedAttention</text>

                <rect x={145} y={52} width={95} height={26} rx={5} fill="#10b98118" stroke="#10b981" strokeWidth={0.8} />
                <text x={192} y={69} textAnchor="middle" fontSize={8} fill="#10b981">AWQ/GPTQ</text>

                <rect x={250} y={52} width={95} height={26} rx={5} fill="#f59e0b18" stroke="#f59e0b" strokeWidth={0.8} />
                <text x={297} y={69} textAnchor="middle" fontSize={8} fill="#f59e0b">Batch 스케줄러</text>

                <rect x={355} y={52} width={95} height={26} rx={5} fill="#8b5cf618" stroke="#8b5cf6" strokeWidth={0.8} />
                <text x={402} y={69} textAnchor="middle" fontSize={8} fill="#8b5cf6">CUDA Kernel</text>

                <text x={240} y={95} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                  KV-cache를 페이지 단위 관리 + INT4 양자화 = VRAM 효율 극대화
                </text>
              </motion.g>

              {/* 커맨드 */}
              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0.3 }}>
                <rect x={20} y={112} width={440} height={38} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
                <text x={30} y={128} fontSize={8} fill="#10b981" fontFamily="monospace">$</text>
                <text x={40} y={128} fontSize={8} fill="var(--foreground)" fontFamily="monospace">
                  vllm serve model_awq --quantization awq
                </text>
                <text x={40} y={142} fontSize={8} fill="var(--foreground)" fontFamily="monospace">
                  vllm serve model_gptq --quantization gptq --dtype float16
                </text>
              </motion.g>

              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.45 }}>
                <rect x={50} y={160} width={380} height={32} rx={5} fill="#10b98112" stroke="#10b981" strokeWidth={1} />
                <text x={240} y={175} textAnchor="middle" fontSize={9} fill="#10b981" fontWeight={600}>
                  PagedAttention + INT4 = 동시 요청 수 4~8배 ↑
                </text>
                <text x={240} y={188} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                  대회 서빙: vLLM + AWQ INT4가 가장 실용적
                </text>
              </motion.g>
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={15} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">
                트레이드오프: Perplexity vs 메모리 vs 속도
              </text>

              {/* 3축 비교 */}
              {[
                { label: 'FP16 기준', ppl: 0, mem: 100, speed: 1.0, color: '#f59e0b' },
                { label: 'INT8 PTQ', ppl: 0.1, mem: 50, speed: 1.8, color: '#3b82f6' },
                { label: 'INT4 GPTQ', ppl: 0.35, mem: 25, speed: 2.5, color: '#6366f1' },
                { label: 'INT4 AWQ', ppl: 0.25, mem: 25, speed: 3.0, color: '#10b981' },
              ].map((item, i) => (
                <motion.g key={item.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ ...sp, delay: i * 0.1 }}>
                  <rect x={20} y={28 + i * 38} width={440} height={32} rx={6}
                    fill={`${item.color}08`} stroke={item.color} strokeWidth={0.6} />
                  <text x={30} y={48 + i * 38} fontSize={9} fontWeight={600} fill={item.color}>{item.label}</text>

                  {/* Perplexity bar */}
                  <text x={120} y={40 + i * 38} fontSize={7} fill="var(--muted-foreground)">ppl</text>
                  <rect x={140} y={41 + i * 38} width={Math.max(4, item.ppl * 160)} height={10} rx={2}
                    fill={item.ppl > 0.3 ? '#ef444440' : item.ppl > 0.1 ? '#f59e0b40' : '#10b98140'} />
                  <text x={145 + item.ppl * 160} y={50 + i * 38} fontSize={7} fill="var(--muted-foreground)">+{item.ppl}</text>

                  {/* Memory bar */}
                  <text x={230} y={40 + i * 38} fontSize={7} fill="var(--muted-foreground)">mem</text>
                  <rect x={250} y={41 + i * 38} width={item.mem * 0.8} height={10} rx={2} fill={`${item.color}30`} />
                  <text x={255 + item.mem * 0.8} y={50 + i * 38} fontSize={7} fill="var(--muted-foreground)">{item.mem}%</text>

                  {/* Speed */}
                  <text x={360} y={40 + i * 38} fontSize={7} fill="var(--muted-foreground)">속도</text>
                  <rect x={380} y={41 + i * 38} width={item.speed * 25} height={10} rx={2} fill={`${item.color}30`} />
                  <text x={385 + item.speed * 25} y={50 + i * 38} fontSize={7} fill="var(--muted-foreground)">{item.speed}×</text>
                </motion.g>
              ))}

              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.5 }}>
                <rect x={50} y={182} width={380} height={16} rx={4} fill="#10b98112" />
                <text x={240} y={193} textAnchor="middle" fontSize={8} fill="#10b981">
                  AWQ INT4: ppl +0.25 수준에서 메모리 75% 절감 + 속도 3배 — 최적 균형
                </text>
              </motion.g>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}

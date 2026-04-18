import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const B = '#3b82f6', G = '#10b981', W = '#f59e0b', P = '#6366f1', E = '#ef4444';

/* ── 작은 화살표 ── */
function Arrow({ x1, y1, x2, y2, color, delay = 0 }: {
  x1: number; y1: number; x2: number; y2: number; color: string; delay?: number;
}) {
  const id = `ha-${x1}-${y1}-${x2}-${y2}`;
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay }}>
      <defs>
        <marker id={id} viewBox="0 0 6 6" refX={5} refY={3} markerWidth={5} markerHeight={5} orient="auto-start-reverse">
          <polygon points="0,0 6,3 0,6" fill={color} />
        </marker>
      </defs>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} markerEnd={`url(#${id})`} />
    </motion.g>
  );
}

/* ── 라운드 박스 ── */
function Box({ x, y, w, h, label, sub, color, delay = 0 }: {
  x: number; y: number; w: number; h: number; label: string; sub?: string; color: string; delay?: number;
}) {
  return (
    <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay }}>
      <rect x={x} y={y} width={w} height={h} rx={6} fill="var(--card)" stroke={color} strokeWidth={1} />
      <text x={x + w / 2} y={y + (sub ? h / 2 - 2 : h / 2 + 4)} textAnchor="middle"
        fontSize={9} fontWeight={600} fill={color}>{label}</text>
      {sub && <text x={x + w / 2} y={y + h / 2 + 10} textAnchor="middle"
        fontSize={7.5} fill="var(--muted-foreground)">{sub}</text>}
    </motion.g>
  );
}

/* ── 뱃지 (pill) ── */
function Badge({ x, y, label, color, delay = 0 }: {
  x: number; y: number; label: string; color: string; delay?: number;
}) {
  const w = label.length * 5.5 + 14;
  return (
    <motion.g initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ ...sp, delay }}>
      <rect x={x} y={y} width={w} height={18} rx={9} fill={`${color}18`} stroke={color} strokeWidth={0.7} />
      <text x={x + w / 2} y={y + 12.5} textAnchor="middle" fontSize={8} fontWeight={600} fill={color}>{label}</text>
    </motion.g>
  );
}

const STEPS = [
  { label: '1. Prompt 생성', body: '실제 사용자 쿼리를 샘플링하고 도메인 다양성 확보\nred-teaming prompts도 포함하여 안전성 테스트' },
  { label: '2. Response 생성 & Human Labeling', body: 'SFT 모델로 프롬프트당 K개(4~9) 응답 생성\n어노테이터가 품질 기준으로 순위 매김 → pairwise 비교' },
  { label: '3. Preference Dataset 구축', body: '(prompt, chosen, rejected) 형태로 10K~100K pairs 수집\nHelpfulness·Harmlessness·Honesty 3가지 기준' },
  { label: '4. 품질 관리 & 비용', body: '어노테이터 교육 수주, Inter-annotator agreement 측정\nOpenAI 기준 라벨당 $50, 40명 팀 → 수십만 달러' },
  { label: '5. 대체 접근: RLAIF', body: 'GPT-4 judge, Constitutional AI self-critique\n인간 비용 1/1000 수준, 품질은 인간 수준 근접' },
];

export default function HumanPrefDetailViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 135" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Step 0: Prompt 생성 파이프라인 */}
          {step === 0 && (
            <g>
              {/* 사용자 쿼리 소스 */}
              <Box x={10} y={8} w={100} h={34} label="사용자 쿼리 풀" sub="실제 대화 로그" color={B} delay={0} />
              <Arrow x1={112} y1={25} x2={140} y2={25} color={B} delay={0.1} />

              {/* 도메인 다양화 */}
              <Box x={144} y={8} w={90} h={34} label="도메인 샘플링" sub="코딩·수학·창작" color={P} delay={0.15} />
              <Arrow x1={236} y1={25} x2={264} y2={25} color={P} delay={0.2} />

              {/* Red-teaming */}
              <Box x={268} y={8} w={95} h={34} label="Red-teaming 추가" sub="안전성 테스트용" color={E} delay={0.25} />
              <Arrow x1={365} y1={25} x2={393} y2={25} color={G} delay={0.3} />

              {/* 최종 프롬프트 세트 */}
              <Box x={397} y={8} w={72} h={34} label="Prompt Set" color={G} delay={0.35} />

              {/* 하단: SFT 응답 생성 흐름 */}
              <Arrow x1={433} y1={44} x2={433} y2={58} color={G} delay={0.4} />
              <Box x={350} y={60} w={120} h={34} label="SFT 모델 추론" sub="프롬프트당 K개 (4~9)" color={W} delay={0.45} />

              {/* 응답 예시 */}
              <Arrow x1={348} y1={77} x2={318} y2={77} color={W} delay={0.5} />
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.55 }}>
                <rect x={10} y={58} width={306} height={68} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
                <text x={20} y={74} fontSize={8} fontWeight={600} fill="var(--foreground)">Temperature / top-p 다양화 → 다양한 품질</text>
                {/* K개 응답 뱃지 */}
                {['응답 A', '응답 B', '응답 C', '응답 D'].map((t, i) => (
                  <g key={i}>
                    <rect x={20 + i * 72} y={84} width={62} height={18} rx={4}
                      fill={i === 0 ? `${G}20` : i === 3 ? `${E}20` : `${B}12`}
                      stroke={i === 0 ? G : i === 3 ? E : B} strokeWidth={0.6} />
                    <text x={20 + i * 72 + 31} y={96} textAnchor="middle"
                      fontSize={8} fill={i === 0 ? G : i === 3 ? E : B}>{t}</text>
                  </g>
                ))}
                <text x={20} y={118} fontSize={7.5} fill="var(--muted-foreground)">고품질(A) ~ 저품질(D) 다양한 스펙트럼 확보</text>
              </motion.g>
            </g>
          )}

          {/* Step 1: Human Labeling */}
          {step === 1 && (
            <g>
              {/* K개 응답 → 비교 */}
              <Box x={10} y={6} w={90} h={30} label="K개 응답 제시" sub="어노테이터에게" color={B} delay={0} />
              <Arrow x1={102} y1={21} x2={125} y2={21} color={B} delay={0.1} />

              {/* Pairwise 비교 카드 */}
              <motion.g initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ ...sp, delay: 0.15 }}>
                <rect x={128} y={4} width={140} height={34} rx={6} fill="var(--card)" stroke={P} strokeWidth={1} />
                <text x={198} y={17} textAnchor="middle" fontSize={9} fontWeight={700} fill={P}>Pairwise 비교</text>
                <text x={198} y={30} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">"A vs B — 어느 것이 나은가?"</text>
              </motion.g>

              <Arrow x1={270} y1={21} x2={298} y2={21} color={P} delay={0.2} />
              <Box x={300} y={6} w={80} h={30} label="순위 결정" sub="w > l 쌍 생성" color={G} delay={0.25} />

              {/* 라벨링 기준 — 3H */}
              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0.35 }}>
                <rect x={10} y={50} width={460} height={76} rx={8} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
                <text x={24} y={68} fontSize={9} fontWeight={700} fill={W}>라벨링 기준 (Anthropic 3H)</text>
              </motion.g>

              {/* 3H 뱃지 */}
              <motion.g initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ ...sp, delay: 0.4 }}>
                <rect x={24} y={78} width={130} height={36} rx={6} fill={`${G}12`} stroke={G} strokeWidth={0.7} />
                <text x={89} y={93} textAnchor="middle" fontSize={9} fontWeight={600} fill={G}>Helpfulness</text>
                <text x={89} y={106} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">유용성</text>
              </motion.g>
              <motion.g initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ ...sp, delay: 0.45 }}>
                <rect x={170} y={78} width={130} height={36} rx={6} fill={`${B}12`} stroke={B} strokeWidth={0.7} />
                <text x={235} y={93} textAnchor="middle" fontSize={9} fontWeight={600} fill={B}>Harmlessness</text>
                <text x={235} y={106} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">무해성</text>
              </motion.g>
              <motion.g initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ ...sp, delay: 0.5 }}>
                <rect x={316} y={78} width={130} height={36} rx={6} fill={`${P}12`} stroke={P} strokeWidth={0.7} />
                <text x={381} y={93} textAnchor="middle" fontSize={9} fontWeight={600} fill={P}>Honesty</text>
                <text x={381} y={106} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">솔직함</text>
              </motion.g>

              {/* 충돌 시 지침 */}
              <motion.text x={400} y={68} fontSize={7.5} fill={W} textAnchor="end"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.55 }}>
                충돌 시 해결 지침 제공
              </motion.text>
            </g>
          )}

          {/* Step 2: Preference Dataset */}
          {step === 2 && (
            <g>
              {/* 데이터 형태 헤더 */}
              <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0 }}>
                <rect x={10} y={4} width={460} height={30} rx={6} fill="var(--card)" stroke={B} strokeWidth={0.7} />
                <text x={240} y={23} textAnchor="middle" fontSize={10} fontWeight={700} fill={B}>
                  ( prompt , chosen , rejected )  ×  10K~100K pairs
                </text>
              </motion.g>

              {/* 예시 카드 */}
              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0.15 }}>
                <rect x={10} y={44} width={460} height={82} rx={8} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
                {/* prompt */}
                <rect x={22} y={52} width={58} height={20} rx={4} fill={`${B}15`} stroke={B} strokeWidth={0.6} />
                <text x={51} y={66} textAnchor="middle" fontSize={8} fontWeight={600} fill={B}>prompt</text>
                <text x={90} y={66} fontSize={8} fill="var(--muted-foreground)">"Python 코드 도와줘"</text>

                {/* chosen */}
                <rect x={22} y={78} width={58} height={20} rx={4} fill={`${G}15`} stroke={G} strokeWidth={0.6} />
                <text x={51} y={92} textAnchor="middle" fontSize={8} fontWeight={600} fill={G}>chosen</text>
                <text x={90} y={92} fontSize={8} fill={G}>"다음과 같이 작성하시면..."</text>
                <text x={290} y={92} fontSize={7.5} fill="var(--muted-foreground)">(상세한 설명)</text>

                {/* rejected */}
                <rect x={22} y={104} width={58} height={20} rx={4} fill={`${E}15`} stroke={E} strokeWidth={0.6} />
                <text x={51} y={118} textAnchor="middle" fontSize={8} fontWeight={600} fill={E}>rejected</text>
                <text x={90} y={118} fontSize={8} fill={E}>"ㅇㅋ"</text>
                <text x={130} y={118} fontSize={7.5} fill="var(--muted-foreground)">(무성의)</text>
              </motion.g>

              {/* 화살표 → BT 모델 */}
              <Arrow x1={368} y1={118} x2={420} y2={118} color={W} delay={0.3} />
              <motion.text x={448} y={122} textAnchor="middle" fontSize={8} fontWeight={600} fill={W}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.35 }}>
                BT 학습
              </motion.text>
            </g>
          )}

          {/* Step 3: 품질 관리 & 비용 */}
          {step === 3 && (
            <g>
              {/* 품질 관리 영역 */}
              <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0 }}>
                <rect x={10} y={4} width={225} height={122} rx={8} fill="var(--card)" stroke={P} strokeWidth={0.7} />
                <rect x={10} y={4} width={225} height={22} rx={8} fill={`${P}15`} />
                <rect x={10} y={20} width={225} height={6} fill="var(--card)" />
                <text x={122} y={18} textAnchor="middle" fontSize={9} fontWeight={700} fill={P}>품질 관리</text>
              </motion.g>
              <Badge x={22} y={34} label="어노테이터 교육 (수주)" color={P} delay={0.1} />
              <Badge x={22} y={58} label="Inter-annotator 일치도" color={P} delay={0.15} />
              <Badge x={22} y={82} label="주기적 calibration" color={P} delay={0.2} />
              <Badge x={22} y={104} label="전문가 review" color={P} delay={0.25} />

              {/* 비용 영역 */}
              <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0.15 }}>
                <rect x={248} y={4} width={222} height={122} rx={8} fill="var(--card)" stroke={E} strokeWidth={0.7} strokeDasharray="4 3" />
                <rect x={248} y={4} width={222} height={22} rx={8} fill={`${E}12`} />
                <rect x={248} y={20} width={222} height={6} fill="var(--card)" />
                <text x={359} y={18} textAnchor="middle" fontSize={9} fontWeight={700} fill={E}>비용 (RLHF 최대 병목)</text>
              </motion.g>

              {/* 비용 바 차트 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.3 }}>
                <text x={262} y={46} fontSize={8} fill="var(--muted-foreground)">라벨당</text>
                <rect x={300} y={36} width={120} height={14} rx={3} fill={`${E}20`} />
                <text x={365} y={47} textAnchor="middle" fontSize={9} fontWeight={700} fill={E}>~$50</text>
              </motion.g>
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.35 }}>
                <text x={262} y={68} fontSize={8} fill="var(--muted-foreground)">팀 규모</text>
                <rect x={300} y={58} width={90} height={14} rx={3} fill={`${W}20`} />
                <text x={348} y={69} textAnchor="middle" fontSize={9} fontWeight={600} fill={W}>40명</text>
              </motion.g>
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.4 }}>
                <text x={262} y={90} fontSize={8} fill="var(--muted-foreground)">기간</text>
                <rect x={300} y={80} width={70} height={14} rx={3} fill={`${W}20`} />
                <text x={338} y={91} textAnchor="middle" fontSize={9} fontWeight={600} fill={W}>수개월</text>
              </motion.g>
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.45 }}>
                <text x={262} y={115} fontSize={8} fill="var(--muted-foreground)">총 비용</text>
                <rect x={300} y={103} width={155} height={16} rx={4} fill={`${E}15`} stroke={E} strokeWidth={0.7} />
                <text x={380} y={115} textAnchor="middle" fontSize={10} fontWeight={700} fill={E}>수십만 달러</text>
              </motion.g>
            </g>
          )}

          {/* Step 4: RLAIF 대체 접근 */}
          {step === 4 && (
            <g>
              {/* 인간 라벨링 (왼쪽) */}
              <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ ...sp, delay: 0 }}>
                <rect x={10} y={10} width={120} height={50} rx={8} fill="var(--card)" stroke={E} strokeWidth={1} strokeDasharray="4 3" />
                <text x={70} y={30} textAnchor="middle" fontSize={9} fontWeight={700} fill={E}>인간 라벨링</text>
                <text x={70} y={44} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">비용 높음, 느림</text>
              </motion.g>

              {/* VS */}
              <motion.text x={155} y={40} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--muted-foreground)"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.1 }}>
                →
              </motion.text>

              {/* RLAIF (오른쪽) */}
              <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ ...sp, delay: 0.15 }}>
                <rect x={172} y={4} width={296} height={125} rx={8} fill="var(--card)" stroke={G} strokeWidth={0.7} />
                <text x={320} y={20} textAnchor="middle" fontSize={10} fontWeight={700} fill={G}>대체 접근법</text>
              </motion.g>

              {/* RLAIF 카드 */}
              <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0.25 }}>
                <rect x={184} y={30} width={130} height={42} rx={6} fill={`${P}10`} stroke={P} strokeWidth={0.7} />
                <text x={249} y={46} textAnchor="middle" fontSize={9} fontWeight={600} fill={P}>RLAIF</text>
                <text x={249} y={58} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">GPT-4가 judge 역할</text>
                <text x={249} y={68} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">일관성 높음</text>
              </motion.g>

              {/* Constitutional AI 카드 */}
              <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0.3 }}>
                <rect x={326} y={30} width={130} height={42} rx={6} fill={`${B}10`} stroke={B} strokeWidth={0.7} />
                <text x={391} y={46} textAnchor="middle" fontSize={9} fontWeight={600} fill={B}>Constitutional AI</text>
                <text x={391} y={58} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">원칙 기반 self-critique</text>
                <text x={391} y={68} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">자동 평가</text>
              </motion.g>

              {/* 비용 비교 바 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.4 }}>
                <text x={194} y={92} fontSize={8} fill="var(--muted-foreground)">비용</text>
                <rect x={224} y={82} width={230} height={14} rx={3} fill="var(--border)" opacity={0.3} />
                <rect x={224} y={82} width={18} height={14} rx={3} fill={G} />
                <text x={250} y={93} fontSize={8} fontWeight={700} fill={G}>1/1000</text>
                <text x={310} y={93} fontSize={7.5} fill="var(--muted-foreground)">인간 대비</text>
              </motion.g>

              {/* 품질 비교 바 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.45 }}>
                <text x={194} y={112} fontSize={8} fill="var(--muted-foreground)">품질</text>
                <rect x={224} y={102} width={230} height={14} rx={3} fill="var(--border)" opacity={0.3} />
                <rect x={224} y={102} width={210} height={14} rx={3} fill={`${G}40`} />
                <text x={340} y={113} textAnchor="middle" fontSize={8} fontWeight={600} fill={G}>인간 수준 근접</text>
              </motion.g>

              {/* 인간 비용 라인 마커 */}
              <motion.line x1={454} y1={80} x2={454} y2={120} stroke={E} strokeWidth={0.7} strokeDasharray="2 2"
                initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} transition={{ ...sp, delay: 0.5 }} />
              <motion.text x={454} y={78} textAnchor="middle" fontSize={7} fill={E}
                initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} transition={{ ...sp, delay: 0.5 }}>
                인간
              </motion.text>
            </g>
          )}
        </svg>
      )}
    </StepViz>
  );
}

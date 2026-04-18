import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import type { StepDef } from '@/components/ui/step-viz';
import { ModuleBox, ActionBox, AlertBox, DataBox } from '@/components/viz/boxes';

const steps: StepDef[] = [
  {
    label: '왜 순서가 중요한가',
    body: '각 기법은 모델의 서로 다른 속성을 변경한다. 잘못된 순서는 이전 단계의 결과를 무효화하거나, 오차를 증폭시킨다.',
  },
  {
    label: '정석 순서: 프루닝 → 증류 → 양자화',
    body: '프루닝(구조 축소) → 증류(정확도 회복) → 양자화(비트 감소). 각 단계가 다음 단계의 입력을 최적화한다.',
  },
  {
    label: '역순서가 실패하는 이유: 양자화 → 프루닝',
    body: '양자화된 가중치에서 magnitude 기반 프루닝이 무의미. INT4 가중치의 크기 비교가 FP16과 다른 분포 → 잘못된 뉴런을 제거.',
  },
  {
    label: '역순서가 실패하는 이유: 양자화 → 증류',
    body: '양자화된 Teacher의 soft label이 이미 정보 손실. INT4 Teacher의 확률 분포가 부정확 → Student가 잘못된 지식을 학습.',
  },
  {
    label: '증류 생략 가능한 경우',
    body: '프루닝 비율이 낮거나(10% 이하), 양자화가 INT8 수준이면 정확도 하락이 허용 범위. 대회에서는 시간 대비 효과를 판단.',
  },
  {
    label: '각 단계의 의존성 정리',
    body: '프루닝: 원본 FP16 가중치의 magnitude 필요. 증류: 프루닝된 Student + 원본 Teacher. 양자화: 최종 가중치에 보정 데이터 적용.',
  },
];

function Visual({ step }: { step: number }) {
  return (
    <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      {step === 0 && (
        <g>
          <text x={240} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="var(--foreground)">
            순서에 따른 결과 차이
          </text>
          {/* 정순 */}
          <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <rect x={20} y={36} width={440} height={38} rx={6} fill="#10b981" fillOpacity={0.06}
              stroke="#10b981" strokeWidth={1} />
            <text x={30} y={50} fontSize={9} fontWeight={700} fill="#10b981">정석</text>
            <text x={80} y={50} fontSize={9} fill="var(--foreground)">프루닝 → 증류 → 양자화</text>
            <text x={80} y={64} fontSize={8} fill="var(--muted-foreground)">PPL 12.7 | 0.42GB | 135 tok/s</text>
            <text x={400} y={58} textAnchor="middle" fontSize={10} fontWeight={700} fill="#10b981">최적</text>
          </motion.g>
          {/* 역순 1 */}
          <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            <rect x={20} y={84} width={440} height={38} rx={6} fill="#ef4444" fillOpacity={0.06}
              stroke="#ef4444" strokeWidth={1} strokeDasharray="4 3" />
            <text x={30} y={98} fontSize={9} fontWeight={700} fill="#ef4444">역순</text>
            <text x={80} y={98} fontSize={9} fill="var(--foreground)">양자화 → 프루닝 → 증류</text>
            <text x={80} y={112} fontSize={8} fill="var(--muted-foreground)">PPL 15.3 | 0.42GB | 130 tok/s</text>
            <text x={400} y={106} textAnchor="middle" fontSize={10} fontWeight={700} fill="#ef4444">정확도 ↓</text>
          </motion.g>
          {/* 역순 2 */}
          <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
            <rect x={20} y={132} width={440} height={38} rx={6} fill="#f59e0b" fillOpacity={0.06}
              stroke="#f59e0b" strokeWidth={1} strokeDasharray="4 3" />
            <text x={30} y={146} fontSize={9} fontWeight={700} fill="#f59e0b">혼합</text>
            <text x={80} y={146} fontSize={9} fill="var(--foreground)">증류 → 양자화 → 프루닝</text>
            <text x={80} y={160} fontSize={8} fill="var(--muted-foreground)">PPL 14.1 | 0.45GB | 125 tok/s</text>
            <text x={400} y={154} textAnchor="middle" fontSize={10} fontWeight={700} fill="#f59e0b">비효율</text>
          </motion.g>
          <text x={240} y={195} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
            같은 기법 조합이라도 순서에 따라 PPL(낮을수록 좋음)이 20% 이상 차이
          </text>
        </g>
      )}

      {step === 1 && (
        <g>
          <text x={240} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#10b981">
            정석 파이프라인 흐름
          </text>
          {/* Stage 1 */}
          <motion.g initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
            <ActionBox x={15} y={38} w={110} h={55} label="1. 프루닝" sub="구조 축소" color="#10b981" />
            <text x={70} y={108} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
              FP16 magnitude
            </text>
            <text x={70} y={120} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
              기반 판단
            </text>
          </motion.g>
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}>
            <line x1={125} y1={65} x2={155} y2={65} stroke="var(--border)" strokeWidth={1.5} />
            <polygon points="153,61 161,65 153,69" fill="var(--muted-foreground)" />
            <text x={140} y={56} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">840M</text>
          </motion.g>
          {/* Stage 2 */}
          <motion.g initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}>
            <ActionBox x={161} y={38} w={110} h={55} label="2. 증류" sub="정확도 회복" color="#3b82f6" />
            <text x={216} y={108} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
              Teacher 7.8B의
            </text>
            <text x={216} y={120} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
              soft label 활용
            </text>
          </motion.g>
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
            <line x1={271} y1={65} x2={301} y2={65} stroke="var(--border)" strokeWidth={1.5} />
            <polygon points="299,61 307,65 299,69" fill="var(--muted-foreground)" />
            <text x={286} y={56} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">840M</text>
          </motion.g>
          {/* Stage 3 */}
          <motion.g initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }}>
            <ActionBox x={307} y={38} w={110} h={55} label="3. 양자화" sub="비트 감소" color="#ef4444" />
            <text x={362} y={108} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
              GPTQ 보정으로
            </text>
            <text x={362} y={120} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
              INT4 변환
            </text>
          </motion.g>
          {/* 핵심 원칙 */}
          <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
            <rect x={40} y={142} width={400} height={36} rx={6} fill="#8b5cf6" fillOpacity={0.06}
              stroke="#8b5cf6" strokeWidth={0.8} />
            <text x={240} y={158} textAnchor="middle" fontSize={9} fontWeight={600} fill="#8b5cf6">
              원칙: 비가역적 변환(양자화)은 마지막에 — 정보 손실을 최소화
            </text>
            <text x={240} y={171} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
              프루닝/증류는 FP16 정밀도에서 수행해야 정확한 기울기·분포 판단 가능
            </text>
          </motion.g>
        </g>
      )}

      {step === 2 && (
        <g>
          <text x={240} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#ef4444">
            실패 사례: 양자화 → 프루닝
          </text>
          {/* INT4 가중치 분포 */}
          <text x={120} y={42} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--foreground)">
            INT4 가중치 분포
          </text>
          {/* 양자화된 이산적 분포 — 막대 그래프 */}
          {[-7,-6,-5,-4,-3,-2,-1,0,1,2,3,4,5,6,7].map((v, i) => {
            const h = Math.max(4, Math.abs(Math.round(60 * Math.exp(-v*v/18))));
            return (
              <motion.rect key={i} x={40 + i * 12} y={130 - h} width={8} height={h} rx={1}
                fill="#ef4444" fillOpacity={0.5}
                initial={{ height: 0, y: 130 }} animate={{ height: h, y: 130 - h }}
                transition={{ delay: i * 0.03 }} />
            );
          })}
          <text x={120} y={145} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
            16개 이산값 → magnitude 비교 무의미
          </text>
          {/* 문제 설명 */}
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
            <AlertBox x={260} y={45} w={200} h={48} label="문제: 동점 다수 발생" sub="같은 INT4 값 = 어떤 뉴런을 제거?" color="#ef4444" />
          </motion.g>
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
            <AlertBox x={260} y={105} w={200} h={48} label="결과: 무작위 제거와 유사" sub="중요 뉴런이 남는다는 보장 없음" color="#f59e0b" />
          </motion.g>
          <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
            <rect x={40} y={168} width={400} height={28} rx={6} fill="#ef4444" fillOpacity={0.06}
              stroke="#ef4444" strokeWidth={0.8} />
            <text x={240} y={186} textAnchor="middle" fontSize={9} fill="#ef4444">
              FP16에서는 0.0012 vs 0.0015 구분 가능 → INT4에서는 둘 다 0으로 양자화
            </text>
          </motion.g>
        </g>
      )}

      {step === 3 && (
        <g>
          <text x={240} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#f59e0b">
            실패 사례: 양자화 → 증류
          </text>
          {/* Teacher (INT4) */}
          <ModuleBox x={30} y={40} w={130} h={50} label="Teacher (INT4)" sub="이미 정보 손실" color="#ef4444" />
          {/* 화살표 */}
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            <line x1={160} y1={65} x2={200} y2={65} stroke="#ef4444" strokeWidth={1.5} strokeDasharray="4 2" />
            <polygon points="198,61 206,65 198,69" fill="#ef4444" />
          </motion.g>
          {/* 손상된 soft label */}
          <motion.g initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}>
            <rect x={206} y={38} width={100} height={54} rx={6} fill="#f59e0b" fillOpacity={0.08}
              stroke="#f59e0b" strokeWidth={1} strokeDasharray="3 2" />
            <text x={256} y={58} textAnchor="middle" fontSize={9} fontWeight={600} fill="#f59e0b">부정확한</text>
            <text x={256} y={72} textAnchor="middle" fontSize={9} fontWeight={600} fill="#f59e0b">Soft Labels</text>
            <text x={256} y={84} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">양자화 오차 포함</text>
          </motion.g>
          {/* Student */}
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
            <line x1={306} y1={65} x2={340} y2={65} stroke="#f59e0b" strokeWidth={1.5} />
            <polygon points="338,61 346,65 338,69" fill="#f59e0b" />
          </motion.g>
          <ModuleBox x={346} y={40} w={120} h={50} label="Student" sub="잘못된 지식 학습" color="#71717a" />
          {/* 비교 */}
          <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
            <rect x={30} y={110} width={200} height={44} rx={6} fill="#10b981" fillOpacity={0.06}
              stroke="#10b981" strokeWidth={0.8} />
            <text x={130} y={126} textAnchor="middle" fontSize={9} fontWeight={600} fill="#10b981">정석: FP16 Teacher</text>
            <text x={130} y={142} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
              [0.05, 0.10, 0.70, 0.15] — 세밀한 분포
            </text>
          </motion.g>
          <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
            <rect x={250} y={110} width={210} height={44} rx={6} fill="#ef4444" fillOpacity={0.06}
              stroke="#ef4444" strokeWidth={0.8} strokeDasharray="4 3" />
            <text x={355} y={126} textAnchor="middle" fontSize={9} fontWeight={600} fill="#ef4444">역순: INT4 Teacher</text>
            <text x={355} y={142} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
              [0.06, 0.06, 0.75, 0.13] — 양자화 노이즈
            </text>
          </motion.g>
          <text x={240} y={180} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
            dark knowledge(클래스 간 유사도)가 양자화 오차에 묻힘 → Student 학습 품질 저하
          </text>
        </g>
      )}

      {step === 4 && (
        <g>
          <text x={240} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#3b82f6">
            증류 생략 판단 기준
          </text>
          {/* 판단 트리 */}
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
            <DataBox x={170} y={34} w={140} h={32} label="프루닝 비율?" sub="" color="#6366f1" outlined />
          </motion.g>
          {/* 10% 이하 */}
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            <line x1={200} y1={66} x2={110} y2={88} stroke="#10b981" strokeWidth={1} />
            <text x={140} y={80} fontSize={8} fill="#10b981">≤10%</text>
            <rect x={40} y={88} width={140} height={36} rx={6} fill="#10b981" fillOpacity={0.08}
              stroke="#10b981" strokeWidth={0.8} />
            <text x={110} y={104} textAnchor="middle" fontSize={9} fontWeight={600} fill="#10b981">증류 생략 가능</text>
            <text x={110} y={116} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">정확도 하락 1~2% 이내</text>
          </motion.g>
          {/* 30% 이상 */}
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
            <line x1={280} y1={66} x2={370} y2={88} stroke="#ef4444" strokeWidth={1} />
            <text x={340} y={80} fontSize={8} fill="#ef4444">≥30%</text>
            <rect x={300} y={88} width={140} height={36} rx={6} fill="#ef4444" fillOpacity={0.08}
              stroke="#ef4444" strokeWidth={0.8} />
            <text x={370} y={104} textAnchor="middle" fontSize={9} fontWeight={600} fill="#ef4444">증류 필수</text>
            <text x={370} y={116} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">정확도 하락 5~10%+</text>
          </motion.g>
          {/* 양자화 수준 */}
          <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
            <DataBox x={170} y={140} w={140} h={32} label="양자화 수준?" sub="" color="#6366f1" outlined />
          </motion.g>
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
            <line x1={200} y1={172} x2={110} y2={190} stroke="#10b981" strokeWidth={1} />
            <text x={140} y={184} fontSize={8} fill="#10b981">INT8</text>
            <text x={110} y={203} textAnchor="middle" fontSize={8} fill="#10b981">생략 가능</text>
          </motion.g>
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
            <line x1={280} y1={172} x2={370} y2={190} stroke="#ef4444" strokeWidth={1} />
            <text x={340} y={184} fontSize={8} fill="#ef4444">INT4</text>
            <text x={370} y={203} textAnchor="middle" fontSize={8} fill="#ef4444">증류 권장</text>
          </motion.g>
        </g>
      )}

      {step === 5 && (
        <g>
          <text x={240} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#8b5cf6">
            단계별 의존성 맵
          </text>
          {/* 3 columns */}
          {[
            {
              label: '프루닝', color: '#10b981', y: 36,
              needs: 'FP16 가중치 magnitude',
              produces: '축소된 모델 구조',
              warning: '원본 정밀도 필수',
            },
            {
              label: '증류', color: '#3b82f6', y: 100,
              needs: 'FP16 Teacher + 프루닝된 Student',
              produces: '정확도 회복된 Student',
              warning: 'Teacher는 반드시 FP16',
            },
            {
              label: '양자화', color: '#ef4444', y: 164,
              needs: '최종 FP16 가중치 + 보정 데이터',
              produces: 'INT4/INT8 가중치',
              warning: '비가역적 — 마지막에 적용',
            },
          ].map((s, i) => (
            <motion.g key={s.label} initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.15 }}>
              {/* 왼쪽 라벨 */}
              <rect x={15} y={s.y} width={60} height={42} rx={6} fill={s.color} fillOpacity={0.12}
                stroke={s.color} strokeWidth={1} />
              <text x={45} y={s.y + 18} textAnchor="middle" fontSize={10} fontWeight={700} fill={s.color}>
                {s.label}
              </text>
              <text x={45} y={s.y + 32} textAnchor="middle" fontSize={7} fill={s.color}>
                Stage {i + 1}
              </text>
              {/* 입력 */}
              <text x={90} y={s.y + 12} fontSize={8} fontWeight={600} fill="var(--foreground)">입력:</text>
              <text x={115} y={s.y + 12} fontSize={8} fill="var(--muted-foreground)">{s.needs}</text>
              {/* 출력 */}
              <text x={90} y={s.y + 26} fontSize={8} fontWeight={600} fill="var(--foreground)">출력:</text>
              <text x={115} y={s.y + 26} fontSize={8} fill="var(--muted-foreground)">{s.produces}</text>
              {/* 주의 */}
              <text x={90} y={s.y + 40} fontSize={7} fill={s.color}>
                ⚠ {s.warning}
              </text>
            </motion.g>
          ))}
        </g>
      )}
    </svg>
  );
}

export default function OrderViz() {
  return (
    <StepViz steps={steps}>
      {(step) => <Visual step={step} />}
    </StepViz>
  );
}

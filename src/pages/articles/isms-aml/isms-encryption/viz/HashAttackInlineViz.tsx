import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, StatusBox, AlertBox } from '@/components/viz/boxes';

const C = {
  danger: '#ef4444',
  warn: '#f59e0b',
  safe: '#10b981',
  salt: '#6366f1',
};

const STEPS = [
  {
    label: '레인보우 테이블 공격 — 미리 계산한 해시로 즉시 역추적',
    body: '공격자가 "123456→e10adc..." 등 수억 개의 (평문, 해시) 쌍을 미리 저장. DB에서 탈취한 해시를 테이블에서 조회하면 원본 비밀번호를 즉시 복원.',
  },
  {
    label: '솔트(salt)로 레인보우 테이블 무력화',
    body: '각 비밀번호마다 고유 랜덤 값(솔트)을 붙인 뒤 해싱. 같은 "123456"도 솔트가 다르면 해시 결과가 완전히 다름. 미리 계산한 테이블이 무용지물.',
  },
  {
    label: '솔트만으로는 부족 — 빠른 해시 + GPU 브루트포스',
    body: 'MD5는 GPU 1장으로 초당 수십억 해시 계산. 솔트가 있어도 특정 계정을 타깃으로 무차별 대입하면 수 분 내에 흔한 비밀번호를 찾아냄. 느린 해시 함수(bcrypt/Argon2) 필요.',
  },
];

function Arrow({ x1, y1, x2, y2, color }: {
  x1: number; y1: number; x2: number; y2: number; color: string;
}) {
  return (
    <line x1={x1} y1={y1} x2={x2} y2={y2}
      stroke={color} strokeWidth={1} markerEnd="url(#ha-inline-arrow)" />
  );
}

export default function HashAttackInlineViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 210" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="ha-inline-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {/* Step 0: 레인보우 테이블 공격 */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">레인보우 테이블 공격 흐름</text>

              {/* 사전 계산 테이블 */}
              <ModuleBox x={15} y={28} w={160} h={52} label="레인보우 테이블" sub="수억 개 (평문, 해시) 쌍" color={C.danger} />

              {/* 테이블 내용 예시 */}
              <rect x={190} y={28} width={140} height={52} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
              <text x={260} y={44} textAnchor="middle" fontSize={8} fontWeight={600} fill="var(--foreground)">조회 테이블</text>
              <text x={260} y={57} textAnchor="middle" fontSize={7} fill={C.danger}>123456 → e10adc...</text>
              <text x={260} y={68} textAnchor="middle" fontSize={7} fill={C.danger}>password → 5f4dcc...</text>
              <text x={260} y={79} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">... 수억 개</text>

              {/* 구분선 */}
              <line x1={15} y1={92} x2={465} y2={92} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              {/* 공격 흐름 */}
              <text x={240} y={110} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.danger}>공격 흐름</text>

              <AlertBox x={15} y={118} w={80} h={36} label="DB 유출" sub="해시값 탈취" color={C.danger} />
              <Arrow x1={95} y1={136} x2={118} y2={136} color={C.danger} />

              <DataBox x={120} y={122} w={100} h={28} label="e10adc3949ba..." color={C.danger} />
              <Arrow x1={220} y1={136} x2={243} y2={136} color={C.danger} />

              <ActionBox x={245} y={118} w={100} h={36} label="테이블 조회" sub="O(1) 시간" color={C.danger} />
              <Arrow x1={345} y1={136} x2={368} y2={136} color={C.danger} />

              <AlertBox x={370} y={118} w={95} h={36} label="원본: 123456" sub="즉시 복원!" color={C.danger} />

              {/* 흐르는 점 */}
              <motion.circle r={3} fill={C.danger} opacity={0.5}
                initial={{ cx: 55 }} animate={{ cx: 417 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} cy={136} />

              {/* 경고 */}
              <rect x={80} y={172} width={320} height={28} rx={6} fill="#ef444412" stroke={C.danger} strokeWidth={1} />
              <text x={240} y={188} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.danger}>솔트 없는 MD5/SHA-1 → 해시값만으로 원본 즉시 복원</text>
            </motion.g>
          )}

          {/* Step 1: 솔트 방어 */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">솔트(salt)로 레인보우 테이블 무력화</text>

              {/* 솔트 없는 경우 */}
              <text x={130} y={38} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.danger}>솔트 없음</text>

              <DataBox x={15} y={44} w={85} h={24} label="123456" color={C.danger} />
              <Arrow x1={100} y1={56} x2={118} y2={56} color={C.danger} />
              <text x={150} y={60} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">MD5</text>
              <Arrow x1={165} y1={56} x2={183} y2={56} color={C.danger} />
              <DataBox x={185} y={44} w={90} h={24} label="e10adc..." color={C.danger} />

              {/* 같은 입력 = 같은 해시 */}
              <DataBox x={15} y={74} w={85} h={24} label="123456" color={C.danger} />
              <Arrow x1={100} y1={86} x2={118} y2={86} color={C.danger} />
              <text x={150} y={90} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">MD5</text>
              <Arrow x1={165} y1={86} x2={183} y2={86} color={C.danger} />
              <DataBox x={185} y={74} w={90} h={24} label="e10adc..." color={C.danger} />

              <text x={310} y={66} fontSize={8} fontWeight={600} fill={C.danger}>동일 입력 → 동일 해시</text>
              <text x={310} y={80} fontSize={8} fill={C.danger}>테이블 조회 가능</text>

              {/* 구분선 */}
              <line x1={15} y1={106} x2={465} y2={106} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              {/* 솔트 있는 경우 */}
              <text x={130} y={126} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.safe}>솔트 추가</text>

              <DataBox x={15} y={132} w={65} h={24} label="123456" color={C.salt} />
              <text x={87} y={147} textAnchor="middle" fontSize={10} fill={C.salt}>+</text>
              <DataBox x={95} y={132} w={65} h={24} label="x7kQ9..." color={C.salt} />
              <Arrow x1={160} y1={144} x2={178} y2={144} color={C.safe} />
              <DataBox x={180} y={132} w={90} h={24} label="a3f7b2..." color={C.safe} />

              <DataBox x={15} y={162} w={65} h={24} label="123456" color={C.salt} />
              <text x={87} y={177} textAnchor="middle" fontSize={10} fill={C.salt}>+</text>
              <DataBox x={95} y={162} w={65} h={24} label="mR2pL..." color={C.salt} />
              <Arrow x1={160} y1={174} x2={178} y2={174} color={C.safe} />
              <DataBox x={180} y={162} w={90} h={24} label="9d1e8c..." color={C.safe} />

              <text x={310} y={148} fontSize={8} fontWeight={600} fill={C.safe}>같은 비밀번호, 다른 솔트</text>
              <text x={310} y={162} fontSize={8} fill={C.safe}>→ 완전히 다른 해시</text>

              <rect x={290} y={172} width={170} height={24} rx={6} fill="#10b98112" stroke={C.safe} strokeWidth={1} />
              <text x={375} y={188} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.safe}>미리 계산한 테이블 무용지물</text>
            </motion.g>
          )}

          {/* Step 2: 솔트의 한계 */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">솔트만으로는 부족한 이유</text>

              {/* GPU 브루트포스 */}
              <ModuleBox x={15} y={28} w={130} h={50} label="GPU (RTX 4090)" sub="초당 수십억 MD5 해시" color={C.danger} />

              {/* 타깃 공격 */}
              <Arrow x1={145} y1={53} x2={168} y2={53} color={C.danger} />
              <ActionBox x={170} y={30} w={120} h={46} label="타깃 브루트포스" sub="솔트 알고 있으면 시도" color={C.danger} />

              {/* 시도 과정 */}
              <Arrow x1={290} y1={53} x2={308} y2={53} color={C.danger} />
              <rect x={310} y={30} width={155} height={46} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
              <text x={387} y={47} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.danger}>MD5(salt + "123456")</text>
              <text x={387} y={59} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.danger}>MD5(salt + "password")</text>
              <text x={387} y={71} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">... 수 분 내 일치</text>

              {/* 구분선 */}
              <line x1={15} y1={90} x2={465} y2={90} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              {/* 속도 비교 */}
              <text x={240} y={110} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">해시 속도 비교 (1회 연산)</text>

              <text x={14} y={132} fontSize={8} fill={C.danger}>MD5</text>
              <rect x={45} y={124} width={400} height={12} rx={6} fill={C.danger} opacity={0.4} />
              <text x={450} y={134} fontSize={8} fill={C.danger}>수 ns</text>

              <text x={14} y={155} fontSize={8} fill={C.warn}>SHA-256</text>
              <rect x={60} y={147} width={300} height={12} rx={6} fill={C.warn} opacity={0.4} />
              <text x={365} y={157} fontSize={8} fill={C.warn}>수 ns</text>

              <text x={14} y={178} fontSize={8} fill={C.safe}>bcrypt</text>
              <rect x={52} y={170} width={8} height={12} rx={6} fill={C.safe} opacity={0.6} />
              <text x={66} y={180} fontSize={8} fill={C.safe}>~250ms</text>

              {/* 결론 */}
              <rect x={60} y={190} width={360} height={20} rx={6} fill="#10b98112" stroke={C.safe} strokeWidth={1} />
              <text x={240} y={204} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.safe}>느린 해시 함수(bcrypt/Argon2)로 브루트포스 비용을 수백 년으로</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}

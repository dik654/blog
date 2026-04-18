import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, StatusBox, AlertBox } from '@/components/viz/boxes';

const C = {
  weak: '#ef4444',
  strong: '#10b981',
  bcrypt: '#6366f1',
  argon: '#0ea5e9',
};

const STEPS = [
  {
    label: 'MD5/SHA-1 취약점 — 빠른 속도가 적',
    body: 'MD5: GPU 1장으로 초당 수십억 해시. 레인보우 테이블(미리 계산한 평문→해시 매핑)로 즉시 역추적. 솔트 추가해도 브루트포스 속도 여전히 빠름. SHA-1: 2017년 충돌 시연(SHAttered). 둘 다 사용 중단 원칙.',
  },
  {
    label: 'bcrypt — 의도적으로 느린 적응형 해시',
    body: 'cost factor 1 올리면 연산 2배. 권장 12 이상(~250ms/회). 솔트 자동 포함: $2b$12$+솔트(22자)+해시(31자). Eksblowfish 키 스케줄 반복 → GPU 병렬화 효과 제한. 개발자가 솔트 관리 불필요.',
  },
  {
    label: 'Argon2id — 메모리 하드 + 시간 비용 + 병렬 제어',
    body: 'scrypt: CPU+메모리 동시 증가 → GPU/ASIC 공격 효율 급감. Argon2: PHC 2015 우승. Argon2id(하이브리드) 권장. 파라미터 3개: time cost, memory cost(19MB), parallelism. 서버 사양에 맞게 최적 조절.',
  },
  {
    label: 'MD5→bcrypt 마이그레이션 + 로그인 실패 제한',
    body: '점진 전환: 로그인 시 MD5 검증 → 성공 시 bcrypt로 재해싱. 미로그인 계정은 재설정 강제. 이중해시(bcrypt(MD5(pw)))로 일괄 전환 가능하나 엔트로피 제한. 실패 5회 잠금 + CAPTCHA + rate limiting.',
  },
];

function Arrow({ x1, y1, x2, y2, color }: {
  x1: number; y1: number; x2: number; y2: number; color: string;
}) {
  return (
    <line x1={x1} y1={y1} x2={x2} y2={y2}
      stroke={color} strokeWidth={1} markerEnd="url(#ph-arrow)" />
  );
}

export default function PasswordHashingViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="ph-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {/* Step 0: MD5/SHA-1 취약점 */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">MD5/SHA-1이 위험한 이유</text>

              {/* 속도 문제 */}
              <AlertBox x={15} y={28} w={140} h={45} label="빠른 속도 = 위험" sub="MD5: 초당 수십억 해시/GPU" color={C.weak} />
              <Arrow x1={155} y1={50} x2={173} y2={50} color={C.weak} />

              {/* 레인보우 테이블 */}
              <AlertBox x={175} y={28} w={140} h={45} label="레인보우 테이블" sub="평문→해시 미리 계산" color={C.weak} />
              <Arrow x1={315} y1={50} x2={333} y2={50} color={C.weak} />

              {/* 충돌 */}
              <AlertBox x={335} y={28} w={130} h={45} label="충돌 취약점" sub="SHA-1: 2017 SHAttered" color={C.weak} />

              {/* 공격 흐름 */}
              <line x1={15} y1={88} x2={465} y2={88} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />
              <text x={240} y={105} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">공격 흐름</text>

              <DataBox x={20} y={112} w={90} h={26} label="DB 유출" color={C.weak} />
              <Arrow x1={110} y1={125} x2={133} y2={125} color={C.weak} />
              <ActionBox x={135} y={110} w={100} h={30} label="해시값 획득" sub="md5(password)" color={C.weak} />
              <Arrow x1={235} y1={125} x2={258} y2={125} color={C.weak} />
              <ActionBox x={260} y={110} w={100} h={30} label="레인보우 조회" sub="즉시 역추적" color={C.weak} />
              <Arrow x1={360} y1={125} x2={383} y2={125} color={C.weak} />
              <AlertBox x={385} y={110} w={80} h={30} label="원문 복원" color={C.weak} />

              {/* 흐르는 점 */}
              <motion.circle r={3} fill={C.weak} opacity={0.5}
                initial={{ cx: 65 }} animate={{ cx: 425 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} cy={125} />

              {/* 솔트 방어 한계 */}
              <text x={240} y={165} textAnchor="middle" fontSize={9} fill={C.weak} fontWeight={600}>솔트 추가해도 빠른 해시 → 브루트포스 속도 여전히 빠름</text>

              <rect x={140} y={178} width={200} height={24} rx={6} fill="#ef444412" stroke={C.weak} strokeWidth={1} />
              <text x={240} y={194} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.weak}>둘 다 사용 중단 원칙</text>
            </motion.g>
          )}

          {/* Step 1: bcrypt */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">bcrypt: 의도적으로 느린 해시</text>

              {/* cost factor 시각화 */}
              <ModuleBox x={15} y={28} w={140} h={48} label="cost factor" sub="1 올리면 연산 2배" color={C.bcrypt} />

              {/* 시간 막대 */}
              <text x={175} y={38} fontSize={8} fill="var(--muted-foreground)">cost=10</text>
              <rect x={215} y={30} width={40} height={12} rx={3} fill={C.bcrypt} opacity={0.3} />
              <text x={260} y={39} fontSize={8} fill="var(--muted-foreground)">~65ms</text>

              <text x={175} y={55} fontSize={8} fill="var(--muted-foreground)">cost=12</text>
              <rect x={215} y={47} width={80} height={12} rx={3} fill={C.bcrypt} opacity={0.5} />
              <text x={300} y={56} fontSize={8} fill={C.bcrypt} fontWeight={600}>~250ms (권장)</text>

              <text x={175} y={72} fontSize={8} fill="var(--muted-foreground)">cost=14</text>
              <rect x={215} y={64} width={160} height={12} rx={3} fill={C.bcrypt} opacity={0.7} />
              <text x={380} y={73} fontSize={8} fill="var(--muted-foreground)">~1s</text>

              <line x1={15} y1={88} x2={465} y2={88} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              {/* 출력 형식 */}
              <text x={240} y={105} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">bcrypt 출력 형식 (솔트 자동 포함)</text>

              <rect x={40} y={112} width={400} height={30} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
              <text x={80} y={131} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.bcrypt}>$2b$</text>
              <text x={115} y={131} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.strong}>12</text>
              <text x={135} y={131} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">$</text>
              <text x={210} y={131} textAnchor="middle" fontSize={10} fill={C.bcrypt}>솔트 (22자)</text>
              <text x={340} y={131} textAnchor="middle" fontSize={10} fill={C.strong}>해시 (31자)</text>

              <text x={80} y={155} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">알고리즘</text>
              <text x={115} y={155} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">비용</text>
              <text x={210} y={155} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">랜덤 솔트</text>
              <text x={340} y={155} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">결과 해시값</text>

              {/* Eksblowfish */}
              <StatusBox x={120} y={168} w={240} h={34} label="Eksblowfish 키 스케줄" sub="순차적 → GPU 병렬화 효과 제한" color={C.bcrypt} />
            </motion.g>
          )}

          {/* Step 2: Argon2 */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">Argon2id: 메모리 하드 해시</text>

              {/* GPU 공격 vs 메모리 하드 */}
              <AlertBox x={15} y={28} w={200} h={42} label="GPU: 수천 코어 병렬" sub="코어당 메모리 제한 → 효율 급감" color={C.weak} />
              <Arrow x1={215} y1={49} x2={238} y2={49} color={C.strong} />
              <StatusBox x={240} y={28} w={220} h={42} label="메모리 하드 함수" sub="대량 RAM 요구 → GPU/ASIC 무력화" color={C.strong} />

              <line x1={15} y1={82} x2={465} y2={82} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              {/* Argon2 변형 */}
              <text x={240} y={98} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">Argon2 변형 3가지</text>

              <DataBox x={20} y={106} w={130} h={28} label="Argon2d" sub="GPU 저항 강" color={C.argon} />
              <DataBox x={175} y={106} w={130} h={28} label="Argon2i" sub="사이드채널 강" color={C.argon} />
              <ModuleBox x={340} y={102} w={130} h={36} label="Argon2id" sub="하이브리드 (권장)" color={C.strong} />

              {/* 파라미터 */}
              <line x1={15} y1={150} x2={465} y2={150} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />
              <text x={240} y={166} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.argon}>Argon2 파라미터 (독립 조절 가능)</text>

              <ActionBox x={20} y={175} w={130} h={34} label="time cost" sub="반복 횟수: 2회" color={C.argon} />
              <ActionBox x={170} y={175} w={140} h={34} label="memory cost" sub="메모리: 19MB" color={C.argon} />
              <ActionBox x={330} y={175} w={130} h={34} label="parallelism" sub="스레드 수: 1" color={C.argon} />

              <text x={240} y={218} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">OWASP 권장: Argon2id, 메모리 19MB, 반복 2회, 병렬 1</text>
            </motion.g>
          )}

          {/* Step 3: 마이그레이션 + 실패 제한 */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">MD5→bcrypt 점진 전환 + 방어층</text>

              {/* 전환 흐름 */}
              <ActionBox x={10} y={28} w={85} h={38} label="로그인 시도" sub="평문 비밀번호" color={C.bcrypt} />
              <Arrow x1={95} y1={47} x2={108} y2={47} color={C.bcrypt} />

              <ActionBox x={110} y={28} w={85} h={38} label="MD5 검증" sub="기존 해시 비교" color={C.weak} />
              <Arrow x1={195} y1={47} x2={208} y2={47} color={C.strong} />

              <StatusBox x={210} y={28} w={75} h={38} label="일치!" sub="인증 성공" color={C.strong} />
              <Arrow x1={285} y1={47} x2={298} y2={47} color={C.bcrypt} />

              <ActionBox x={300} y={28} w={85} h={38} label="bcrypt 재해싱" sub="DB 해시 교체" color={C.bcrypt} />
              <Arrow x1={385} y1={47} x2={398} y2={47} color={C.strong} />

              <StatusBox x={400} y={28} w={70} h={38} label="전환 완료" color={C.strong} />

              <motion.circle r={3} fill={C.bcrypt} opacity={0.5}
                initial={{ cx: 52 }} animate={{ cx: 435 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} cy={47} />

              {/* 미로그인 계정 */}
              <text x={240} y={82} textAnchor="middle" fontSize={8} fill={C.weak}>미로그인 계정 → 비밀번호 재설정 강제</text>

              <line x1={15} y1={92} x2={465} y2={92} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              {/* 방어층 */}
              <text x={240} y={110} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">다층 방어: 온라인 + 오프라인</text>

              <ActionBox x={15} y={118} w={100} h={38} label="3회 실패" sub="CAPTCHA 노출" color={C.bcrypt} />
              <Arrow x1={115} y1={137} x2={133} y2={137} color={C.bcrypt} />

              <ActionBox x={135} y={118} w={100} h={38} label="5회 실패" sub="계정 잠금" color={C.weak} />
              <Arrow x1={235} y1={137} x2={253} y2={137} color={C.weak} />

              <ActionBox x={255} y={118} w={100} h={38} label="Rate Limiting" sub="IP 기반 속도 제한" color={C.bcrypt} />
              <Arrow x1={355} y1={137} x2={373} y2={137} color={C.strong} />

              <StatusBox x={375} y={118} w={95} h={38} label="느린 해시" sub="bcrypt/Argon2" color={C.strong} />

              <rect x={60} y={170} width={360} height={28} rx={6} fill="#10b98112" stroke={C.strong} strokeWidth={1} />
              <text x={240} y={188} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.strong}>해시 느림 + 실패 제한 = 온라인/오프라인 모두 방어</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}

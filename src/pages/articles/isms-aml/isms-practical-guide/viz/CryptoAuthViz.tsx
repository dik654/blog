import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, StatusBox, AlertBox } from '@/components/viz/boxes';

const C = {
  input: '#6366f1',
  action: '#f59e0b',
  store: '#10b981',
  fail: '#ef4444',
  pass: '#22c55e',
};

const STEPS = [
  { label: 'BEFORE: bcrypt 해싱', body: 'bcrypt는 비밀번호 해싱에 최적화된 알고리즘. 하지만 국정원 검증 목록에 없어 ISMS 심사에서 결함.' },
  { label: 'AFTER: SHA-256 + Salt', body: '국가 검증 기준에 부합하는 SHA-256으로 교체. 사용자별 고유 Salt를 생성하여 레인보우 테이블 공격 방지.' },
  { label: '2차인증 추가', body: '관리자 페이지에 아이디/비밀번호(1차) + 본인인증(2차) 체계 구축. 세션에 second_auth 플래그 기록.' },
  { label: '장기 미접속 처리', body: 'last_login 기준 6개월 경과 시 계정복구 페이지로 이동. 본인인증 후 비밀번호 재설정.' },
];

/* ── 화살표 유틸 ── */
function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return (
    <line x1={x1} y1={y1} x2={x2} y2={y2}
      stroke={color} strokeWidth={1} markerEnd="url(#ca-arrow)" />
  );
}

export default function CryptoAuthViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 210" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="ca-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {/* ── Step 0: BEFORE bcrypt ── */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* 메인 흐름 */}
              <ModuleBox x={15} y={15} w={100} h={48} label="비밀번호 입력" sub="사용자 평문 PW" color={C.input} />
              <Arrow x1={115} y1={39} x2={148} y2={39} color={C.action} />

              <ActionBox x={150} y={18} w={110} h={42} label="bcrypt hash" sub="cost factor=12" color={C.action} />
              <Arrow x1={260} y1={39} x2={293} y2={39} color={C.store} />

              <DataBox x={296} y={22} w={100} h={34} label="해시값 저장" color={C.store} />

              {/* 결함 표시 */}
              <AlertBox x={130} y={90} w={220} h={55} label="심사 결함" sub="국정원 검증 목록에 bcrypt 없음" color={C.fail} />

              <text x={240} y={168} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">bcrypt &#8594; 비밀번호 전용, salt 자동 생성, 느린 해시</text>
              <text x={240} y={183} textAnchor="middle" fontSize={9} fill={C.fail}>KISA 검증 알고리즘 목록: SHA-256, ARIA, SEED ...</text>
              <text x={240} y={198} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.fail}>기술적 우수성 ≠ 심사 통과</text>
            </motion.g>
          )}

          {/* ── Step 1: AFTER SHA-256+Salt ── */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ModuleBox x={5} y={15} w={90} h={48} label="비밀번호 입력" sub="사용자 평문 PW" color={C.input} />
              <Arrow x1={95} y1={39} x2={115} y2={39} color={C.action} />

              <ActionBox x={118} y={18} w={95} h={42} label="Salt 생성" sub="사용자별 고유 랜덤" color={C.action} />
              <Arrow x1={213} y1={39} x2={233} y2={39} color={C.action} />

              <ActionBox x={236} y={18} w={95} h={42} label="SHA-256 hash" sub="SHA-256(PW+Salt)" color={C.action} />
              <Arrow x1={331} y1={39} x2={351} y2={39} color={C.store} />

              <DataBox x={354} y={18} w={110} h={38} label="Salt + Hash 저장" color={C.store} />

              <StatusBox x={170} y={80} w={140} h={50} label="심사 통과" sub="국정원 검증 목록 부합" color={C.pass} progress={1} />

              {/* 마이그레이션 */}
              <rect x={15} y={145} width={450} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />
              <text x={240} y={163} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--muted-foreground)">마이그레이션 전략</text>
              <DataBox x={15} y={170} w={130} h={28} label="신규: 즉시 적용" color={C.pass} />
              <DataBox x={165} y={170} w={150} h={28} label="기존: 로그인 시 재해싱" color={C.action} />
              <DataBox x={335} y={170} w={130} h={28} label="미접속: PW 재설정" color={C.fail} />
            </motion.g>
          )}

          {/* ── Step 2: 2차인증 ── */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* AFTER 흐름 (상단) */}
              <text x={240} y={15} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.pass}>AFTER: 2단계 인증</text>

              <ModuleBox x={5} y={25} w={100} h={48} label="1차 로그인" sub="ID + PW 확인" color={C.input} />
              <Arrow x1={105} y1={49} x2={125} y2={49} color={C.action} />

              <ActionBox x={128} y={28} w={100} h={42} label="본인인증 모달" sub="SMS 인증번호" color={C.action} />
              <Arrow x1={228} y1={49} x2={248} y2={49} color={C.store} />

              <ModuleBox x={251} y={25} w={100} h={48} label="세션 생성" sub="second_auth: true" color={C.store} />
              <Arrow x1={351} y1={49} x2={371} y2={49} color={C.pass} />

              <DataBox x={374} y={32} w={95} h={34} label="관리자 페이지" color={C.pass} />

              {/* BEFORE 비교 (하단) */}
              <rect x={15} y={95} width={450} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              <AlertBox x={100} y={105} w={280} h={48} label="BEFORE: ID/PW만으로 관리자 접속 가능" sub="계정 탈취 시 즉시 민감 데이터 노출" color={C.fail} />

              {/* 서버 체크 설명 */}
              <rect x={40} y={170} width={400} height={30} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
              <text x={240} y={189} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                모든 관리 API: 서버에서 세션의 second_auth 값 확인 → 프록시 변조 우회 불가
              </text>
            </motion.g>
          )}

          {/* ── Step 3: 장기 미접속 ── */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <DataBox x={20} y={20} w={100} h={34} label="last_login" color={C.input} />
              <Arrow x1={120} y1={37} x2={145} y2={37} color={C.action} />

              <ActionBox x={148} y={16} w={130} h={42} label="6개월 경과 체크" sub="현재일 - last_login > 180일" color={C.action} />

              {/* 분기 */}
              <Arrow x1={278} y1={25} x2={330} y2={25} color={C.pass} />
              <Arrow x1={278} y1={50} x2={330} y2={50} color={C.fail} />

              <text x={300} y={22} fontSize={8} fill={C.pass}>N</text>
              <text x={300} y={56} fontSize={8} fill={C.fail}>Y</text>

              <StatusBox x={333} y={2} w={130} h={48} label="정상 접속" sub="로그인 허용" color={C.pass} progress={1} />
              <AlertBox x={333} y={58} w={130} h={48} label="계정복구 페이지" sub="본인인증 → PW 재설정" color={C.fail} />

              {/* 관리자 추가 정책 */}
              <rect x={15} y={125} width={450} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />
              <text x={240} y={145} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--muted-foreground)">관리자 추가 정책</text>

              <DataBox x={30} y={155} w={120} h={30} label="90일 PW 변경 강제" color={C.action} />
              <DataBox x={170} y={155} w={140} h={30} label="직전 3개 PW 재사용 금지" color={C.action} />
              <DataBox x={330} y={155} w={130} h={30} label="6개월 미접속 잠금" color={C.fail} />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}

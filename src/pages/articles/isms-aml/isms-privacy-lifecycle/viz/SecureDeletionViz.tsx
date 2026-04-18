import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, StatusBox, AlertBox } from '@/components/viz/boxes';

const C = {
  overwrite: '#6366f1',
  crypto: '#0ea5e9',
  physical: '#ef4444',
  safe: '#10b981',
};

const STEPS = [
  {
    label: '전자적 파기 3가지 — 덮어쓰기 / 키 폐기 / 초기화',
    body: '덮어쓰기: 데이터 위치에 0/1/랜덤 반복 기록(DoD 3회, Gutmann 35회, NIST Clear/Purge/Destroy). 키 폐기(Crypto Erase): 암호화 후 키만 파기, 클라우드에서 실용적. 초기화: 매체 전체 포맷+덮어쓰기.',
  },
  {
    label: 'SSD vs HDD — 덮어쓰기의 한계',
    body: 'HDD: 소프트웨어 덮어쓰기 유효 + 디가우징(자기장 소거) 가능. SSD: 웨어 레벨링+오버 프로비저닝 때문에 정확한 위치 덮어쓰기 불가 → Secure Erase 명령 또는 Crypto Erase 필요. 디가우징은 SSD에 무효.',
  },
  {
    label: 'DB 레코드 파기 — DELETE만으로는 부족',
    body: 'DELETE 후 디스크에 잔존 데이터가 남아 포렌식 복구 가능. 방법 1: DELETE + VACUUM FULL(빈 공간 덮어쓰기). 방법 2: 컬럼 암호화 후 키 폐기(Crypto Erase). 방법 3: 비식별화(가명처리, 총계처리).',
  },
  {
    label: '블록체인 특수성 — 온체인 삭제 불가의 해법',
    body: '온체인 데이터는 불변(Immutable) → 삭제 불가. 해법: 개인정보는 오프체인 DB에만 저장, 온체인에는 해시·지갑주소만 기록. 파기 시 "지갑주소 ↔ 실명" 매핑만 삭제하면 연결고리 절단.',
  },
];

function Arrow({ x1, y1, x2, y2, color, dashed }: {
  x1: number; y1: number; x2: number; y2: number; color: string; dashed?: boolean;
}) {
  return (
    <line x1={x1} y1={y1} x2={x2} y2={y2}
      stroke={color} strokeWidth={1} markerEnd="url(#sd-arrow)"
      strokeDasharray={dashed ? '3 2' : undefined} />
  );
}

export default function SecureDeletionViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="sd-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {/* Step 0: 전자적 파기 3가지 */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">전자적 파기 3가지 방법</text>

              {/* 덮어쓰기 */}
              <ModuleBox x={15} y={28} w={140} h={50} label="덮어쓰기" sub="Overwriting" color={C.overwrite} />
              <DataBox x={25} y={86} w={120} h={24} label="DoD: 3회" color={C.overwrite} />
              <DataBox x={25} y={116} w={120} h={24} label="Gutmann: 35회" color={C.overwrite} />
              <DataBox x={25} y={146} w={120} h={24} label="NIST: 매체별 단계" color={C.overwrite} />

              {/* 키 폐기 */}
              <ModuleBox x={170} y={28} w={140} h={50} label="키 폐기" sub="Crypto Erase" color={C.crypto} />
              <DataBox x={180} y={86} w={120} h={24} label="데이터 암호화 유지" color={C.crypto} />
              <DataBox x={180} y={116} w={120} h={24} label="복호화 키만 파기" color={C.crypto} />
              <DataBox x={180} y={146} w={120} h={24} label="클라우드 최적" color={C.crypto} />

              {/* 초기화 */}
              <ModuleBox x={325} y={28} w={140} h={50} label="초기화" sub="Format + Overwrite" color={C.physical} />
              <DataBox x={335} y={86} w={120} h={24} label="매체 전체 포맷" color={C.physical} />
              <DataBox x={335} y={116} w={120} h={24} label="폐기 예정 디스크" color={C.physical} />
              <DataBox x={335} y={146} w={120} h={24} label="복구 가능성: 최소" color={C.physical} />

              {/* 덮어쓰기 애니메이션 — 데이터가 사라지는 효과 */}
              <motion.rect x={55} y={32} width={60} height={6} rx={3} fill={C.overwrite} opacity={0.3}
                initial={{ scaleX: 1 }} animate={{ scaleX: 0 }}
                transition={{ duration: 1.5, repeat: Infinity, repeatType: 'reverse' }} />
            </motion.g>
          )}

          {/* Step 1: SSD vs HDD */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">SSD vs HDD 파기 방법 차이</text>

              {/* HDD 영역 */}
              <ModuleBox x={15} y={30} w={210} h={45} label="HDD (자기 디스크)" sub="순차적 물리 위치 접근 가능" color={C.overwrite} />

              <StatusBox x={25} y={85} w={90} h={38} label="덮어쓰기" sub="소프트웨어 유효" color={C.safe} />
              <StatusBox x={125} y={85} w={90} h={38} label="디가우징" sub="자기장 소거" color={C.safe} />

              {/* SSD 영역 */}
              <ModuleBox x={255} y={30} w={210} h={45} label="SSD (플래시 메모리)" sub="웨어 레벨링 + 오버 프로비저닝" color={C.physical} />

              <AlertBox x={265} y={85} w={90} h={38} label="덮어쓰기" sub="위치 특정 불가" color={C.physical} />
              <AlertBox x={365} y={85} w={90} h={38} label="디가우징" sub="자기 아님 → 무효" color={C.physical} />

              {/* X 표시 */}
              <text x={310} y={100} textAnchor="middle" fontSize={14} fontWeight={700} fill={C.physical}>X</text>
              <text x={410} y={100} textAnchor="middle" fontSize={14} fontWeight={700} fill={C.physical}>X</text>

              <line x1={15} y1={138} x2={465} y2={138} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              <text x={240} y={155} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.safe}>SSD 안전 파기 방법</text>
              <ActionBox x={100} y={162} w={130} h={34} label="Secure Erase" sub="제조사 명령" color={C.safe} />
              <ActionBox x={250} y={162} w={130} h={34} label="Crypto Erase" sub="암호화 키 폐기" color={C.crypto} />

              <Arrow x1={360} y1={100} x2={315} y2={162} color={C.safe} dashed />
              <Arrow x1={360} y1={100} x2={315} y2={162} color={C.safe} dashed />
            </motion.g>
          )}

          {/* Step 2: DB 레코드 파기 */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">DB 레코드 파기 방법</text>

              {/* 문제 상황 */}
              <AlertBox x={140} y={25} w={200} h={32} label="DELETE만으로는 복구 가능" sub="디스크에 잔존 데이터 → 포렌식 복원" color={C.physical} />

              <line x1={15} y1={68} x2={465} y2={68} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              {/* 방법 1 */}
              <ActionBox x={10} y={78} w={140} h={44} label="DELETE + VACUUM" sub="빈 공간 덮어쓰기" color={C.overwrite} />
              <text x={80} y={135} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">PG: VACUUM FULL</text>
              <text x={80} y={147} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">MySQL: OPTIMIZE TABLE</text>

              {/* 방법 2 */}
              <ActionBox x={170} y={78} w={140} h={44} label="Crypto Erase" sub="컬럼 암호화 + 키 폐기" color={C.crypto} />
              <text x={240} y={135} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">데이터 잔존하나</text>
              <text x={240} y={147} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">복호화 불가 = 파기</text>

              {/* 방법 3 */}
              <ActionBox x={330} y={78} w={140} h={44} label="비식별화" sub="가명·총계·삭제 처리" color={C.safe} />
              <text x={400} y={135} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">통계·연구 목적</text>
              <text x={400} y={147} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">재식별 불가 시 인정</text>

              {/* 결론 */}
              <rect x={100} y={165} width={280} height={28} rx={6} fill="#10b98112" stroke={C.safe} strokeWidth={1} />
              <text x={240} y={183} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.safe}>클라우드 환경에서는 Crypto Erase가 가장 실용적</text>
            </motion.g>
          )}

          {/* Step 3: 블록체인 특수성 */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">블록체인: 온체인 삭제 불가의 해법</text>

              {/* 온체인 영역 */}
              <ModuleBox x={15} y={30} w={200} h={50} label="온체인 (블록체인)" sub="불변성 — 삭제 불가" color={C.physical} />
              <DataBox x={30} y={90} w={80} h={24} label="지갑주소" color={C.physical} />
              <DataBox x={120} y={90} w={80} h={24} label="TX 해시" color={C.physical} />

              {/* 매핑 연결 */}
              <line x1={160} y1={120} x2={320} y2={120} stroke={C.physical} strokeWidth={1.5} strokeDasharray="4 3" />
              <text x={240} y={116} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.physical}>매핑</text>

              {/* 오프체인 영역 */}
              <ModuleBox x={265} y={30} w={200} h={50} label="오프체인 (DB)" sub="삭제 가능" color={C.safe} />
              <DataBox x={280} y={90} w={80} h={24} label="성명" color={C.safe} />
              <DataBox x={370} y={90} w={80} h={24} label="계좌번호" color={C.safe} />

              {/* 파기: 매핑 절단 */}
              <line x1={15} y1={140} x2={465} y2={140} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />
              <text x={240} y={158} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.crypto}>파기 방법: 매핑(연결고리) 절단</text>

              <ActionBox x={80} y={165} w={150} h={38} label="오프체인 매핑 삭제" sub="지갑주소 ↔ 실명 삭제" color={C.crypto} />
              <Arrow x1={230} y1={184} x2={258} y2={184} color={C.safe} />
              <StatusBox x={260} y={165} w={150} h={38} label="결과: 식별 불가" sub="지갑주소만으로 개인 특정 불가" color={C.safe} />

              {/* 절단 X 애니메이션 */}
              <motion.line x1={220} y1={114} x2={260} y2={126} stroke={C.physical} strokeWidth={2.5}
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }} />
              <motion.line x1={260} y1={114} x2={220} y2={126} stroke={C.physical} strokeWidth={2.5}
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }} />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}

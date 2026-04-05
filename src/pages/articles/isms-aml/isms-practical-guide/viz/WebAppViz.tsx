import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, StatusBox, AlertBox } from '@/components/viz/boxes';

const C = {
  red: '#ef4444',
  green: '#22c55e',
  blue: '#3b82f6',
  amber: '#f59e0b',
  purple: '#8b5cf6',
};

const STEPS = [
  {
    label: 'nginx 정보 노출 → 차단',
    body: 'HTTP 응답 헤더와 에러 페이지에서 서버 버전이 노출되면, 공격자가 해당 버전의 CVE를 검색하여 타겟 공격이 가능하다.\nserver_tokens off + 커스텀 에러 페이지로 정보 차단.',
  },
  {
    label: '순차 ID → UUID 전환',
    body: '순차 정수 ID는 1부터 올리며 전수 조회가 가능하다(열거 공격).\nUUID(128비트 랜덤)로 전환하면 예측이 불가능해진다.',
  },
  {
    label: '시크릿 하드코딩 제거',
    body: '소스코드에 평문 비밀번호가 있으면 Git 접근 권한자 전원이 운영 DB에 접근 가능.\nSecrets Manager → Python 로더 → 환경변수 주입 체계로 전환.',
  },
  {
    label: '출금 2차 승인 + 프록시 방어',
    body: '1차 승인만으로는 내부자 공모·계정 탈취 시 자산 유출 위험.\n2차 본인인증 + 서버사이드 세션 검증으로 프록시 우회를 차단한다.',
  },
];

/* ── 화살표 유틸 ── */
function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  const dx = x2 - x1, dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  const ux = dx / len, uy = dy / len;
  const ax = x2 - ux * 4, ay = y2 - uy * 4;
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} />
      <polygon
        points={`${x2},${y2} ${ax - uy * 3},${ay + ux * 3} ${ax + uy * 3},${ay - ux * 3}`}
        fill={color}
      />
    </g>
  );
}

export default function WebAppViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* BEFORE */}
              <text x={120} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.red}>BEFORE</text>
              <ModuleBox x={75} y={24} w={90} h={40} label="nginx" sub="v1.18.0" color={C.blue} />
              <Arrow x1={165} y1={44} x2={195} y2={44} color={C.red} />
              <AlertBox x={200} y={22} w={130} h={44} label="Server: nginx/1.18.0" sub="버전 노출!" color={C.red} />
              {/* 에러 페이지 */}
              <AlertBox x={200} y={80} w={130} h={40} label="기본 404 페이지" sub="경로·버전 노출" color={C.red} />
              <Arrow x1={165} y1={64} x2={200} y2={95} color={C.red} />

              {/* AFTER */}
              <text x={120} y={140} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.green}>AFTER</text>
              <ModuleBox x={30} y={148} w={80} h={40} label="nginx" color={C.blue} />
              <Arrow x1={110} y1={168} x2={135} y2={168} color={C.green} />
              <StatusBox x={138} y={148} w={110} h={44} label="server_tokens off" sub="버전 제거" color={C.green} progress={1} />
              <Arrow x1={248} y1={170} x2={275} y2={170} color={C.green} />
              <DataBox x={278} y={155} w={100} h={30} label="Server: nginx" sub="버전 숨김" color={C.green} />
              <StatusBox x={278} y={192} w={100} h={28} label="커스텀 404" sub="정보 차단" color={C.green} progress={1} />
              <Arrow x1={248} y1={178} x2={278} y2={202} color={C.green} />
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* BEFORE */}
              <text x={120} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.red}>BEFORE</text>
              <DataBox x={20} y={28} w={90} h={28} label="/users/1" color={C.red} />
              <DataBox x={120} y={28} w={90} h={28} label="/users/2" color={C.red} />
              <DataBox x={220} y={28} w={90} h={28} label="/users/3" color={C.red} />
              <text x={325} y={40} fontSize={9} fill={C.red}>...</text>
              <AlertBox x={340} y={24} w={120} h={36} label="열거 공격 가능" sub="1,2,3... 순차 추측" color={C.red} />

              {/* 화살표 (순차) */}
              <Arrow x1={110} y1={42} x2={120} y2={42} color={C.red} />
              <Arrow x1={210} y1={42} x2={220} y2={42} color={C.red} />

              {/* AFTER */}
              <text x={120} y={100} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.green}>AFTER</text>
              <DataBox x={40} y={112} w={200} h={32} label="/users/550e8400-e29b-..." color={C.green} />
              <Arrow x1={240} y1={128} x2={280} y2={128} color={C.green} />
              <StatusBox x={285} y={108} w={120} h={44} label="예측 불가" sub="128비트 랜덤 UUID" color={C.green} progress={1} />

              {/* DB 내부 설명 */}
              <rect x={40} y={160} width={365} height={44} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
              <text x={52} y={178} fontSize={9} fontWeight={600} fill={C.blue}>DB 내부</text>
              <text x={52} y={193} fontSize={8} fill="var(--muted-foreground)">순차 PK 유지 (성능) + uuid 컬럼 추가 (외부용)</text>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* BEFORE */}
              <text x={120} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.red}>BEFORE</text>
              <ModuleBox x={30} y={26} w={140} h={52} label="application.properties" color={C.amber} />
              <AlertBox x={38} y={54} w={124} h={22} label="db.password=plain123" color={C.red} />
              <Arrow x1={170} y1={50} x2={200} y2={50} color={C.red} />
              <AlertBox x={205} y={28} w={130} h={46} label="소스코드에 평문" sub="Git에 시크릿 노출" color={C.red} />

              {/* AFTER */}
              <text x={120} y={106} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.green}>AFTER</text>
              <ModuleBox x={10} y={116} w={110} h={42} label="AWS Secrets Mgr" color={C.purple} />
              <Arrow x1={120} y1={137} x2={140} y2={137} color={C.green} />
              <ActionBox x={142} y={120} w={90} h={36} label="Python 스크립트" sub="시크릿 조회" color={C.blue} />
              <Arrow x1={232} y1={137} x2={252} y2={137} color={C.green} />
              <DataBox x={255} y={122} w={80} h={30} label="환경변수 주입" color={C.green} />
              <Arrow x1={335} y1={137} x2={350} y2={137} color={C.green} />

              <ModuleBox x={296} y={164} w={160} h={50} label="application.properties" color={C.amber} />
              <StatusBox x={304} y={190} w={144} h={22} label="${DB_PASSWORD}" color={C.green} progress={1} />
              <Arrow x1={380} y1={152} x2={380} y2={164} color={C.green} />
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* BEFORE */}
              <text x={100} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.red}>BEFORE</text>
              <ActionBox x={30} y={24} w={80} h={34} label="1차 승인만" color={C.amber} />
              <Arrow x1={110} y1={41} x2={140} y2={41} color={C.red} />
              <AlertBox x={145} y={22} w={130} h={38} label="프록시 우회 가능" sub="Burp Suite로 변조" color={C.red} />

              {/* AFTER */}
              <text x={100} y={82} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.green}>AFTER</text>
              <ActionBox x={10} y={92} w={80} h={34} label="1차 승인" sub="담당자 검토" color={C.blue} />
              <Arrow x1={90} y1={109} x2={105} y2={109} color={C.green} />
              <ActionBox x={108} y={92} w={90} h={34} label="2차 본인인증" sub="교차 담당자" color={C.purple} />
              <Arrow x1={198} y1={109} x2={215} y2={109} color={C.green} />
              <DataBox x={218} y={96} w={110} h={28} label="세션: second_auth" color={C.green} />
              <Arrow x1={328} y1={110} x2={342} y2={110} color={C.green} />

              {/* 서버사이드 검증 */}
              <StatusBox x={200} y={142} w={260} h={50} label="서버사이드 세션 체크" sub="클라이언트 조작 무의미 — 세션에 2차 승인 기록 없으면 거부" color={C.green} progress={1} />
              <Arrow x1={290} y1={124} x2={330} y2={142} color={C.green} />

              {/* 프록시 차단 표시 */}
              <AlertBox x={350} y={22} w={110} h={38} label="프록시 변조" sub="서버에서 거부" color={C.red} />
              <line x1={350} y1={22} x2={460} y2={60} stroke={C.red} strokeWidth={1.5} />
              <line x1={460} y1={22} x2={350} y2={60} stroke={C.red} strokeWidth={1.5} />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}

import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, AlertBox } from '@/components/viz/boxes';

const C = {
  policy: '#6366f1',
  nginx: '#10b981',
  uuid: '#f59e0b',
  secret: '#ef4444',
};

const STEPS = [
  { label: '비밀번호 정책과 관리자 보안', body: '8자+ 복합문자, 90일 주기 변경, 5세대 재사용 금지. 관리자 페이지 2차 인증(OTP) 필수. 중복 로그인 차단.' },
  { label: 'UUID + Secrets Manager', body: '외부 노출 ID는 UUID v4(122비트 랜덤). 열거공격 방지. 시크릿은 Secrets Manager에서 런타임 주입. 디스크 기록 금지.' },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} markerEnd="url(#dsp-arrow)" />;
}

export default function DbSecurityPolicyViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="dsp-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">비밀번호 정책 + 관리자 보안</text>

              {/* Password policy */}
              <rect x={20} y={30} width={220} height={65} rx={6} fill={`${C.policy}08`} stroke={C.policy} strokeWidth={0.6} />
              <text x={30} y={48} fontSize={9} fontWeight={600} fill={C.policy}>비밀번호 정책</text>
              <text x={30} y={62} fontSize={8} fill="var(--muted-foreground)">8자+ (대소문자+숫자+특수문자)</text>
              <text x={30} y={74} fontSize={8} fill="var(--muted-foreground)">90일 주기 강제 변경</text>
              <text x={30} y={86} fontSize={8} fill="var(--muted-foreground)">5세대 재사용 금지</text>

              {/* Admin panel */}
              <rect x={260} y={30} width={200} height={65} rx={6} fill={`${C.nginx}08`} stroke={C.nginx} strokeWidth={0.6} />
              <text x={270} y={48} fontSize={9} fontWeight={600} fill={C.nginx}>관리자 페이지 보안</text>
              <text x={270} y={62} fontSize={8} fill="var(--muted-foreground)">2차 인증(OTP) 필수</text>
              <text x={270} y={74} fontSize={8} fill="var(--muted-foreground)">중복 로그인 차단</text>
              <text x={270} y={86} fontSize={8} fill="var(--muted-foreground)">세션 하이재킹 방지</text>

              {/* Additional */}
              <DataBox x={20} y={112} w={220} h={28} label="6개월 미접속 → 자동 잠금" color={C.policy} />
              <DataBox x={260} y={112} w={200} h={28} label="server_tokens off (버전 숨김)" color={C.nginx} />

              <text x={240} y={165} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">기본 에러 페이지 커스텀 교체(서버 정보 유출 방지)</text>
              <text x={240} y={182} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">API 토큰은 URL 파라미터 금지 → HTTP 헤더/암호화 쿠키만</text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">UUID + Secrets Manager</text>

              {/* UUID */}
              <ModuleBox x={20} y={32} w={200} h={45} label="외부 ID: UUID v4" sub="122비트 랜덤 값" color={C.uuid} />
              <text x={120} y={92} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">다음 ID 추측 불가 → 열거공격 차단</text>

              <ActionBox x={25} y={105} w={85} h={30} label="내부: 순차 ID" sub="인덱싱 성능" color={C.uuid} />
              <Arrow x1={110} y1={120} x2={128} y2={120} color={C.uuid} />
              <ActionBox x={130} y={105} w={85} h={30} label="외부: UUID" sub="API 응답" color={C.uuid} />

              {/* Secrets Manager */}
              <ModuleBox x={260} y={32} w={200} h={45} label="Secrets Manager" sub="시크릿 외부 주입" color={C.secret} />

              <Arrow x1={360} y1={77} x2={360} y2={98} color={C.secret} />

              <rect x={260} y={100} width={200} height={48} rx={6} fill={`${C.secret}08`} stroke={C.secret} strokeWidth={0.6} />
              <text x={270} y={116} fontSize={8} fill="var(--muted-foreground)">런타임에 메모리 로드만</text>
              <text x={270} y={130} fontSize={8} fill="var(--muted-foreground)">디스크 기록 금지</text>
              <text x={270} y={142} fontSize={8} fill="var(--muted-foreground)">자동 교체(rotation) + 감사 로그</text>

              <text x={240} y={175} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">하드코딩 금지: Git 유출, 로그 노출, 배포 침해 시 키 함께 탈취</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}

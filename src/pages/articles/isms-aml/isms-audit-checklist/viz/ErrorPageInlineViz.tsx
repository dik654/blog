import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, ActionBox, AlertBox, DataBox } from '@/components/viz/boxes';

const C = {
  web: '#6366f1',
  ok: '#10b981',
  warn: '#f59e0b',
  fail: '#ef4444',
};

const STEPS = [
  { label: '에러 페이지 + 정보 노출', body: '심사원이 존재하지 않는 URL을 입력. 스택트레이스, 서버 버전, 내부 경로가 노출되면 결함.' },
  { label: '응답 헤더 점검', body: 'curl -I 로 Server, X-Powered-By 헤더 확인. 버전 정보 노출은 공격 표면 확대.' },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} markerEnd="url(#epi-arrow)" />;
}

export default function ErrorPageInlineViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="epi-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">에러 페이지 정보 노출 점검</text>

              <ActionBox x={15} y={28} w={130} h={40} label="심사원 접속" sub="/asdfjkl123 입력" color={C.web} />
              <Arrow x1={145} y1={48} x2={168} y2={38} color={C.ok} />
              <Arrow x1={145} y1={48} x2={168} y2={62} color={C.fail} />

              <ModuleBox x={170} y={20} w={130} h={32} label="커스텀 404 페이지" sub="양호: 정보 미노출" color={C.ok} />

              <AlertBox x={170} y={58} w={130} h={32} label="기본 에러 페이지" sub="정보 노출 가능" color={C.fail} />

              {/* 노출 금지 항목 */}
              <Arrow x1={300} y1={74} x2={320} y2={74} color={C.fail} />

              <AlertBox x={322} y={25} w={145} h={28} label="Stack Trace 노출" sub="" color={C.fail} />
              <AlertBox x={322} y={58} w={145} h={28} label="nginx/1.18.0 버전" sub="" color={C.fail} />
              <AlertBox x={322} y={91} w={145} h={28} label="내부 경로 노출" sub="" color={C.fail} />

              <rect x={30} y={132} width={420} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              <DataBox x={60} y={142} w={170} h={30} label="server_tokens off; (nginx)" color={C.ok} />
              <DataBox x={250} y={142} w={170} h={30} label="ServerTokens Prod (Apache)" color={C.ok} />

              <text x={240} y={192} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">DB 에러 메시지 "MySQL Error 1045" 노출도 결함</text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">HTTP 응답 헤더 점검</text>

              <ActionBox x={30} y={30} w={130} h={40} label="curl -I 실행" sub="응답 헤더 확인" color={C.web} />
              <Arrow x1={160} y1={50} x2={185} y2={40} color={C.ok} />
              <Arrow x1={160} y1={50} x2={185} y2={65} color={C.fail} />

              <ModuleBox x={188} y={24} w={140} h={30} label="Server: nginx" sub="버전 미노출 = 양호" color={C.ok} />
              <AlertBox x={188} y={58} w={140} h={30} label="Server: nginx/1.18.0" sub="버전 노출 = 결함" color={C.fail} />

              {/* 추가 헤더 */}
              <Arrow x1={328} y1={73} x2={350} y2={73} color={C.fail} />
              <AlertBox x={352} y={30} w={115} h={28} label="X-Powered-By" sub="" color={C.fail} />
              <AlertBox x={352} y={62} w={115} h={28} label="X-AspNet-Version" sub="" color={C.fail} />

              <rect x={30} y={108} width={420} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              <text x={240} y={128} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--foreground)">프레임워크/버전 정보 → 알려진 취약점 공격 표면</text>

              <DataBox x={30} y={140} w={200} h={32} label="nginx: server_tokens off" color={C.ok} />
              <DataBox x={250} y={140} w={200} h={32} label="Express: app.disable('x-powered-by')" color={C.ok} />

              <text x={240} y={192} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">모든 불필요 헤더 제거 후 curl -I 재확인 증적 캡처</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}

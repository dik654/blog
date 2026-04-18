import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox } from '@/components/viz/boxes';

const C = { blue: '#3b82f6', red: '#ef4444', green: '#22c55e', amber: '#f59e0b', purple: '#8b5cf6' };

const STEPS = [
  {
    label: 'UTM: 올인원 보안 장비',
    body: '방화벽 + IPS + VPN + 안티바이러스 + URL 필터 + 안티스팸을 하나에 통합. 중소규모 조직에서 개별 장비 대체. 기능 전부 활성화 시 성능 저하 가능.',
  },
  {
    label: 'UTM vs NGFW: 포트 기반 vs 앱 레벨',
    body: 'UTM은 포트+URL 필터, NGFW는 DPI로 앱 자체를 식별(포트 443이지만 토렌트 차단 가능). 최신 UTM도 DPI 포함하여 경계가 흐려지는 중.',
  },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1.2} markerEnd="url(#si-un-arrow)" />;
}

export default function UtmNgfwInline() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="si-un-arrow" viewBox="0 0 10 10" refX={8} refY={5} markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ModuleBox x={160} y={5} w={160} h={30} label="UTM (통합위협관리)" sub="올인원" color={C.blue} />
              <Arrow x1={200} y1={37} x2={60} y2={55} color={C.blue} />
              <Arrow x1={220} y1={37} x2={160} y2={55} color={C.blue} />
              <Arrow x1={240} y1={37} x2={260} y2={55} color={C.blue} />
              <Arrow x1={260} y1={37} x2={360} y2={55} color={C.blue} />
              <Arrow x1={280} y1={37} x2={440} y2={55} color={C.blue} />

              <DataBox x={10} y={56} w={80} h={26} label="방화벽" sub="IP/포트" color={C.amber} />
              <DataBox x={100} y={56} w={80} h={26} label="IPS 모듈" sub="시그니처" color={C.red} />
              <DataBox x={210} y={56} w={80} h={26} label="VPN GW" sub="IPSec/SSL" color={C.green} />
              <DataBox x={310} y={56} w={80} h={26} label="안티바이러스" sub="악성코드" color={C.purple} />
              <DataBox x={400} y={56} w={70} h={26} label="URL 필터" sub="유해 차단" color={C.blue} />

              <rect x={60} y={100} width={360} height={30} rx={5} fill="var(--card)" stroke={C.amber} strokeWidth={0.6} />
              <text x={240} y={118} textAnchor="middle" fontSize={9} fill="var(--foreground)">개별 장비를 따로 구매·운영하기 어려운 중소규모 조직에 적합</text>

              <text x={240} y={155} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">모든 기능 활성화 시 성능 저하 가능 → 우선순위 설정 필요</text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ModuleBox x={30} y={10} w={170} h={34} label="UTM" sub="중소규모 / 포트+URL 필터" color={C.blue} />
              <ModuleBox x={280} y={10} w={170} h={34} label="NGFW (차세대 방화벽)" sub="중대규모 / DPI 앱 식별" color={C.green} />

              {/* comparison lines */}
              <Arrow x1={115} y1={46} x2={115} y2={65} color={C.blue} />
              <Arrow x1={365} y1={46} x2={365} y2={65} color={C.green} />

              <rect x={30} y={67} width={170} height={36} rx={5} fill="var(--card)" stroke={C.blue} strokeWidth={0.6} />
              <text x={115} y={82} textAnchor="middle" fontSize={9} fill="var(--foreground)">포트 443 열면</text>
              <text x={115} y={96} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">내부 앱 구분 제한적</text>

              <rect x={280} y={67} width={170} height={36} rx={5} fill="var(--card)" stroke={C.green} strokeWidth={0.6} />
              <text x={365} y={82} textAnchor="middle" fontSize={9} fill="var(--foreground)">포트 443이지만</text>
              <text x={365} y={96} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">토렌트 트래픽은 차단</text>

              {/* convergence */}
              <Arrow x1={200} y1={105} x2={240} y2={125} color={C.blue} />
              <Arrow x1={280} y1={105} x2={240} y2={125} color={C.green} />
              <ActionBox x={140} y={125} w={200} h={28} label="경계가 흐려지는 추세" sub="최신 UTM도 DPI 포함" color={C.amber} />

              <text x={240} y={178} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">실무에서 두 용어가 혼용되기도 한다</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}

import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, AlertBox } from '@/components/viz/boxes';

const STEPS = [
  { label: 'Hardware — Intel SGX2 CPU + 16GB RAM + NVMe SSD + 100Mbps' },
  { label: 'Software — Ubuntu 20.04+ / Kernel 5.11+ / SGX PSW 2.17+ / Docker' },
  { label: '배포 — docker run + sgx_enclave 디바이스 + RPC 엔드포인트 환경변수' },
  { label: '모니터링 + 스테이킹 — health endpoint + 1000 PHA 최소 + slashing 위험' },
];

const HW = [
  { k: 'CPU', v: 'Intel SGX2 (Ice Lake/Sapphire Rapids+)', c: '#6366f1' },
  { k: 'RAM', v: '16GB+ (EPC 요구량)', c: '#10b981' },
  { k: 'Storage', v: '500GB+ NVMe', c: '#f59e0b' },
  { k: 'Network', v: '100Mbps+', c: '#0ea5e9' },
];

const SW = [
  { k: 'OS', v: 'Ubuntu 20.04+', c: '#6366f1' },
  { k: 'Kernel', v: '5.11+ (DCAP support)', c: '#10b981' },
  { k: 'SGX PSW', v: '2.17+', c: '#f59e0b' },
  { k: 'Docker', v: 'containerized 배포', c: '#0ea5e9' },
];

const DOCKER_FLAGS = [
  { f: '--device /dev/sgx_enclave', sub: 'EPC 페이지 매핑', c: '#6366f1' },
  { f: '--device /dev/sgx_provision', sub: 'PCK certificate', c: '#10b981' },
  { f: '-v /opt/phala/data:/data', sub: 'persistent storage', c: '#f59e0b' },
  { f: '-e NODE_RPC_WS=...', sub: 'Substrate endpoint', c: '#0ea5e9' },
];

const SLASH = [
  { name: 'Uptime <90%', sub: 'SLA 미달', c: '#ef4444' },
  { name: 'Attest 만료', sub: '갱신 무시', c: '#ef4444' },
  { name: 'Double-sign', sub: 'incorrect egress', c: '#ef4444' },
  { name: 'Cluster 위반', sub: '규칙 무시', c: '#ef4444' },
];

export default function WorkerSpecsViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (<g>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#6366f1">
              Hardware 요구사항
            </text>
            {HW.map((h, i) => (
              <motion.g key={i}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}>
                <rect x={40} y={42 + i * 38} width={440} height={30} rx={5}
                  fill={`${h.c}10`} stroke={`${h.c}40`} strokeWidth={0.8} />
                <text x={60} y={61 + i * 38} fontSize={10.5} fontWeight={700} fill={h.c}>{h.k}</text>
                <text x={150} y={61 + i * 38} fontSize={10.5} fill="var(--foreground)">{h.v}</text>
              </motion.g>
            ))}
            <text x={260} y={210} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
              SGX1 → SGX2 차이: EPC 동적 확장(EDMM), 1TB까지 가능
            </text>
          </g>)}
          {step === 1 && (<g>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#10b981">
              Software 스택
            </text>
            {SW.map((h, i) => (
              <motion.g key={i}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}>
                <rect x={40} y={42 + i * 38} width={440} height={30} rx={5}
                  fill={`${h.c}10`} stroke={`${h.c}40`} strokeWidth={0.8} />
                <text x={60} y={61 + i * 38} fontSize={10.5} fontWeight={700} fill={h.c}>{h.k}</text>
                <text x={150} y={61 + i * 38} fontSize={10.5} fill="var(--foreground)">{h.v}</text>
              </motion.g>
            ))}
          </g>)}
          {step === 2 && (<g>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#0ea5e9">
              docker run -d --name phala-worker
            </text>
            {DOCKER_FLAGS.map((d, i) => (
              <motion.g key={i}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}>
                <rect x={30} y={42 + i * 36} width={460} height={28} rx={4}
                  fill={`${d.c}10`} stroke={`${d.c}40`} strokeWidth={0.8} />
                <text x={45} y={60 + i * 36} fontSize={10} fontWeight={700} fill={d.c}
                  style={{ fontFamily: 'monospace' }}>{d.f}</text>
                <text x={300} y={60 + i * 36} fontSize={9} fill="var(--muted-foreground)">{d.sub}</text>
              </motion.g>
            ))}
            <text x={260} y={205} textAnchor="middle" fontSize={9.5} fill="var(--muted-foreground)">
              마지막 인자: phala/pruntime:latest 이미지 태그
            </text>
          </g>)}
          {step === 3 && (<g>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#ef4444">
              스테이킹 + Slashing
            </text>
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <DataBox x={50} y={40} w={180} h={36}
                label="최소 1000 PHA" sub="2주 unbonding" color="#10b981" outlined />
              <DataBox x={290} y={40} w={180} h={36}
                label="Delegator 18% commission" sub="간접 참여" color="#0ea5e9" outlined />
            </motion.g>
            {SLASH.map((s, i) => (
              <motion.g key={i}
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + i * 0.1 }}>
                <AlertBox x={20 + (i % 2) * 245} y={95 + Math.floor(i / 2) * 60}
                  w={235} h={50} label={s.name} sub={s.sub} color={s.c} />
              </motion.g>
            ))}
          </g>)}
        </svg>
      )}
    </StepViz>
  );
}

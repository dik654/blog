import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, ActionBox, DataBox } from '@/components/viz/boxes';

const STEPS = [
  { label: '1. oasis rofl init my-oracle --tee sgx', body: '템플릿 프로젝트 생성.\nCargo.toml + src/main.rs scaffold.' },
  { label: '2. Cargo 의존성 — runtime-sdk + rofl-utils', body: 'oasis-runtime-sdk, oasis-rofl-utils, tokio, reqwest.\n비동기 + HTTP client 포함.' },
  { label: '3. handle_query 작성', body: '#[rofl_app(id="...")] async fn handle_query(...).\nHTTP 호출, JSON 파싱, cbor 결과 반환.' },
  { label: '4. oasis rofl build / deploy', body: 'build --tee sgx → SGX enclave binary.\ndeploy --paratime sapphire — Registry 등록.' },
];

const PHASES = [
  { name: 'init',   color: '#6366f1' },
  { name: 'deps',   color: '#10b981' },
  { name: 'code',   color: '#f59e0b' },
  { name: 'deploy', color: '#a855f7' },
];

export default function RoflDevViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {PHASES.map((p, i) => {
            const x = 30 + i * 110;
            const active = step === i;
            const done = step > i;
            return (
              <g key={p.name}>
                <motion.g animate={{ opacity: active ? 1 : done ? 0.6 : 0.3 }}>
                  <ActionBox x={x} y={20} w={100} h={36} label={p.name} color={p.color} />
                </motion.g>
                {i < PHASES.length - 1 && (
                  <motion.line x1={x + 100} y1={38} x2={x + 110} y2={38}
                    stroke={done ? p.color : 'var(--border)'} strokeWidth={1.2}
                    initial={{ pathLength: 0 }} animate={{ pathLength: done || active ? 1 : 0 }} />
                )}
              </g>
            );
          })}

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <DataBox x={140} y={90} w={200} h={32}
                label="oasis rofl init my-oracle" color="#6366f1" outlined />
              <ModuleBox x={100} y={140} w={120} h={50}
                label="Cargo.toml" color="#6366f1" />
              <ModuleBox x={250} y={140} w={120} h={50}
                label="src/main.rs" color="#6366f1" />
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <DataBox x={20}  y={100} w={140} h={26} label="oasis-runtime-sdk" color="#10b981" outlined />
              <DataBox x={170} y={100} w={140} h={26} label="oasis-rofl-utils"   color="#10b981" outlined />
              <DataBox x={320} y={100} w={140} h={26} label="tokio"              color="#10b981" outlined />
              <DataBox x={170} y={140} w={140} h={26} label="reqwest"            color="#10b981" outlined />
              <text x={240} y={195} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                async runtime + HTTP client 표준 조합
              </text>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ModuleBox x={20} y={90} w={440} h={120} label="src/main.rs" color="#f59e0b" />
              <text x={35} y={120} fontSize={10} fontFamily="monospace" fill="#f59e0b">
                #[rofl_app(id = "my-oracle-v1")]
              </text>
              <text x={35} y={140} fontSize={10} fontFamily="monospace" fill="var(--foreground)">
                async fn handle_query(ctx, query) {'{'}
              </text>
              <text x={50} y={160} fontSize={10} fontFamily="monospace" fill="var(--foreground)">
                let url = format!("...");
              </text>
              <text x={50} y={178} fontSize={10} fontFamily="monospace" fill="var(--foreground)">
                let resp = reqwest::get(&url).await?;
              </text>
              <text x={50} y={196} fontSize={10} fontFamily="monospace" fill="var(--foreground)">
                Ok(cbor::to_vec(&resp.price))
              </text>
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <DataBox x={30} y={100} w={180} h={32}
                label="oasis rofl build --tee sgx" color="#a855f7" outlined />
              <DataBox x={250} y={100} w={210} h={32}
                label="oasis rofl deploy --paratime sapphire" color="#a855f7" outlined />
              <ModuleBox x={150} y={150} w={180} h={42}
                label="Registry 등록" sub="contract 가 호출 가능" color="#10b981" />
            </motion.g>
          )}

          <text x={240} y={232} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
            ROFL 앱 개발 4단계 — TEE 안에서 외부 자원 접근
          </text>
        </svg>
      )}
    </StepViz>
  );
}

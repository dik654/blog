import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, StatusBox, AlertBox } from '@/components/viz/boxes';

const STEPS = [
  { label: '1. 시드 고정 — 랜덤 요소 통제',
    body: 'torch, numpy, random, CUDA 4곳의 시드를 동일하게 고정해야 결과가 일치한다' },
  { label: '2. 환경 기록 — 라이브러리 버전 스냅샷',
    body: 'pip freeze / conda export로 전체 의존성을 기록, 새 환경에서 동일하게 설치' },
  { label: '3. 코드 버전 — git commit 연결',
    body: '실험 시점의 git commit hash를 기록하면 어떤 코드로 학습했는지 추적 가능' },
  { label: '4. Docker — 완전한 환경 캡슐화',
    body: 'OS, CUDA, 라이브러리를 통째로 이미지화. "내 컴에선 되는데?"를 원천 제거' },
  { label: '5. 재현성 체크리스트',
    body: '시드 + 환경 + 코드 + 데이터 + 하드웨어 5가지를 모두 기록해야 완전한 재현' },
];

export default function ReproducibilityViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Step 0: 시드 고정 */}
          {step === 0 && (
            <g>
              <ModuleBox x={160} y={5} w={160} h={38} label="set_seed(42)" sub="4곳 동시 고정" color="#6366f1" />
              {[
                { lib: 'torch', fn: 'torch.manual_seed(42)', c: '#ef4444', x: 20 },
                { lib: 'numpy', fn: 'np.random.seed(42)', c: '#3b82f6', x: 140 },
                { lib: 'random', fn: 'random.seed(42)', c: '#10b981', x: 260 },
                { lib: 'CUDA', fn: 'torch.cuda.manual_seed_all(42)', c: '#f59e0b', x: 365 },
              ].map((s, i) => (
                <motion.g key={i} initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.12 }}>
                  <rect x={s.x} y={60} width={105} height={48} rx={6}
                    fill={`${s.c}08`} stroke={s.c} strokeWidth={0.8} />
                  <text x={s.x + 52} y={78} textAnchor="middle"
                    fontSize={9} fontWeight={700} fill={s.c}>{s.lib}</text>
                  <text x={s.x + 52} y={98} textAnchor="middle"
                    fontSize={7} fill="var(--muted-foreground)">{s.fn}</text>
                  {/* 화살표 위로 */}
                  <motion.line x1={s.x + 52} y1={60} x2={240} y2={43}
                    stroke={s.c} strokeWidth={0.8} opacity={0.4}
                    initial={{ opacity: 0 }} animate={{ opacity: 0.4 }}
                    transition={{ delay: 0.2 + i * 0.1 }} />
                </motion.g>
              ))}
              {/* CUDA 추가 주의 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
                <AlertBox x={100} y={125} w={280} h={48} label="CUDA 비결정성 주의"
                  sub="cudnn.deterministic=True, cudnn.benchmark=False" color="#ef4444" />
              </motion.g>
            </g>
          )}

          {/* Step 1: 환경 기록 */}
          {step === 1 && (
            <g>
              <ModuleBox x={160} y={5} w={160} h={38} label="환경 스냅샷" sub="의존성 고정" color="#10b981" />
              {/* pip freeze 출력 */}
              <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}>
                <rect x={20} y={55} width={210} height={120} rx={8}
                  fill="var(--card)" stroke="#10b981" strokeWidth={0.8} />
                <text x={35} y={72} fontSize={9} fontWeight={700} fill="#10b981">pip freeze</text>
                {[
                  'torch==2.1.0',
                  'numpy==1.26.2',
                  'pandas==2.1.3',
                  'scikit-learn==1.3.2',
                  'wandb==0.16.1',
                ].map((pkg, i) => (
                  <motion.text key={i} x={35} y={88 + i * 14} fontSize={8}
                    fill="var(--muted-foreground)"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 + i * 0.08 }}>
                    {pkg}
                  </motion.text>
                ))}
              </motion.g>
              {/* conda export */}
              <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}>
                <rect x={250} y={55} width={210} height={120} rx={8}
                  fill="var(--card)" stroke="#3b82f6" strokeWidth={0.8} />
                <text x={265} y={72} fontSize={9} fontWeight={700} fill="#3b82f6">conda export</text>
                {[
                  'name: ml-env',
                  'python=3.11.5',
                  'cudatoolkit=12.1',
                  'cudnn=8.9.6',
                  'pip: (requirements.txt)',
                ].map((line, i) => (
                  <motion.text key={i} x={265} y={88 + i * 14} fontSize={8}
                    fill="var(--muted-foreground)"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 + i * 0.08 }}>
                    {line}
                  </motion.text>
                ))}
              </motion.g>
            </g>
          )}

          {/* Step 2: 코드 버전 */}
          {step === 2 && (
            <g>
              <ModuleBox x={160} y={5} w={160} h={38} label="Git + Experiment" sub="코드 ↔ 실험 연결" color="#f59e0b" />
              {/* git log 스타일 */}
              <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}>
                <rect x={30} y={55} width={420} height={100} rx={8}
                  fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
                {[
                  { hash: 'a3f2c1d', msg: 'feat: add dropout layer', exp: 'Exp #73 ★', c: '#10b981' },
                  { hash: 'b8e4f2a', msg: 'fix: lr scheduler warmup', exp: 'Exp #65', c: '#6366f1' },
                  { hash: 'c1d9a3b', msg: 'refactor: data pipeline', exp: 'Exp #52', c: '#f59e0b' },
                ].map((commit, i) => (
                  <motion.g key={i} initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.15 }}>
                    {/* commit dot */}
                    <circle cx={55} cy={78 + i * 28} r={5} fill={commit.c} />
                    {i < 2 && <line x1={55} y1={83 + i * 28} x2={55} y2={101 + i * 28}
                      stroke="var(--border)" strokeWidth={1} />}
                    <text x={72} y={82 + i * 28} fontSize={8} fontWeight={700} fill={commit.c}>
                      {commit.hash}
                    </text>
                    <text x={140} y={82 + i * 28} fontSize={8} fill="var(--muted-foreground)">
                      {commit.msg}
                    </text>
                    {/* 실험 연결 */}
                    <rect x={350} y={68 + i * 28} width={85} height={20} rx={10}
                      fill={`${commit.c}12`} stroke={commit.c} strokeWidth={0.8} />
                    <text x={392} y={82 + i * 28} textAnchor="middle"
                      fontSize={8} fontWeight={600} fill={commit.c}>{commit.exp}</text>
                  </motion.g>
                ))}
              </motion.g>
              <motion.text x={240} y={175} textAnchor="middle" fontSize={8}
                fill="var(--muted-foreground)" initial={{ opacity: 0 }} animate={{ opacity: 0.8 }}
                transition={{ delay: 0.7 }}>
                wandb.config["git_hash"] = subprocess.check_output(["git", "rev-parse", "HEAD"])
              </motion.text>
            </g>
          )}

          {/* Step 3: Docker */}
          {step === 3 && (
            <g>
              <ModuleBox x={140} y={5} w={200} h={40} label="Docker Image" sub="환경 완전 캡슐화" color="#3b82f6" />
              {/* Dockerfile 레이어 */}
              {[
                { label: 'nvidia/cuda:12.1', desc: 'GPU 드라이버 + CUDA', c: '#10b981' },
                { label: 'python:3.11', desc: 'Python 런타임', c: '#3b82f6' },
                { label: 'requirements.txt', desc: '라이브러리 의존성', c: '#6366f1' },
                { label: 'src/ + config/', desc: '학습 코드 + 설정', c: '#f59e0b' },
                { label: 'ENTRYPOINT train.py', desc: '실행 진입점', c: '#ec4899' },
              ].map((layer, i) => (
                <motion.g key={i} initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.12 }}>
                  <rect x={60} y={55 + i * 26} width={360} height={20} rx={4}
                    fill={`${layer.c}10`} stroke={layer.c} strokeWidth={0.6} />
                  <text x={75} y={69 + i * 26} fontSize={8} fontWeight={600} fill={layer.c}>
                    {layer.label}
                  </text>
                  <text x={280} y={69 + i * 26} fontSize={7.5} fill="var(--muted-foreground)">
                    {layer.desc}
                  </text>
                </motion.g>
              ))}
              <motion.text x={240} y={193} textAnchor="middle" fontSize={8}
                fill="#3b82f6" fontWeight={600} initial={{ opacity: 0 }} animate={{ opacity: 0.8 }}
                transition={{ delay: 0.7 }}>
                docker run --gpus all my-experiment:v3
              </motion.text>
            </g>
          )}

          {/* Step 4: 체크리스트 */}
          {step === 4 && (
            <g>
              <ModuleBox x={140} y={5} w={200} h={35} label="재현성 체크리스트" sub="5가지 필수 기록" color="#10b981" />
              {[
                { item: '시드 고정', detail: 'torch + numpy + random + CUDA', c: '#6366f1', done: true },
                { item: '환경 기록', detail: 'pip freeze, conda export', c: '#10b981', done: true },
                { item: '코드 버전', detail: 'git commit hash 연결', c: '#f59e0b', done: true },
                { item: '데이터 버전', detail: 'DVC / hash / snapshot', c: '#3b82f6', done: true },
                { item: '하드웨어 기록', detail: 'GPU 모델, VRAM, CPU cores', c: '#ec4899', done: true },
              ].map((check, i) => (
                <motion.g key={i} initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.12 }}>
                  <rect x={40} y={50 + i * 28} width={400} height={22} rx={4}
                    fill={`${check.c}06`} stroke={`${check.c}25`} strokeWidth={0.5} />
                  {/* 체크마크 */}
                  <motion.g initial={{ scale: 0 }} animate={{ scale: 1 }}
                    transition={{ delay: 0.3 + i * 0.12, type: 'spring' }}>
                    <circle cx={58} cy={61 + i * 28} r={7} fill={check.c} />
                    <text x={58} y={65 + i * 28} textAnchor="middle"
                      fontSize={9} fill="#ffffff" fontWeight={700}>&#10003;</text>
                  </motion.g>
                  <text x={80} y={65 + i * 28} fontSize={9} fontWeight={600} fill={check.c}>
                    {check.item}
                  </text>
                  <text x={230} y={65 + i * 28} fontSize={8} fill="var(--muted-foreground)">
                    {check.detail}
                  </text>
                </motion.g>
              ))}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
                <rect x={130} y={195} width={220} height={0} rx={0} fill="none" />
              </motion.g>
            </g>
          )}
        </svg>
      )}
    </StepViz>
  );
}

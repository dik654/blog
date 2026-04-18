import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, StatusBox, AlertBox } from '@/components/viz/boxes';

const STEPS = [
  { label: '1. MLflow Tracking — 실험 기록',
    body: 'mlflow.start_run()으로 세션 시작, log_param/log_metric으로 파라미터와 메트릭 기록' },
  { label: '2. Artifact 관리 — 모델과 데이터 저장',
    body: '학습된 모델, 전처리 파이프라인, 데이터셋을 Artifact로 버전 관리' },
  { label: '3. Model Registry — 모델 생명주기',
    body: 'Staging → Production → Archived 단계로 모델 배포 상태 관리' },
  { label: '4. 셀프 호스팅 — 데이터 주권 확보',
    body: 'Docker로 로컬/사내 서버 배포, S3/GCS를 Artifact 스토어로 연결' },
  { label: '5. W&B vs MLflow — 비교 판단 기준',
    body: '팀 규모, 보안 요구사항, 비용, 생태계에 따라 선택이 달라진다' },
];

export default function MLflowArchViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Step 0: Tracking */}
          {step === 0 && (
            <g>
              <ActionBox x={20} y={20} w={120} h={40} label="학습 스크립트" sub="train.py" color="#3b82f6" />
              <motion.path d="M145,40 L185,40" fill="none" stroke="#3b82f6" strokeWidth={1.5}
                markerEnd="url(#arrMl)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ duration: 0.4 }} />
              <defs>
                <marker id="arrMl" viewBox="0 0 10 10" refX={9} refY={5}
                  markerWidth={6} markerHeight={6} orient="auto-start-reverse">
                  <path d="M0,0 L10,5 L0,10 z" fill="#3b82f6" />
                </marker>
              </defs>
              <ModuleBox x={190} y={12} w={150} h={50} label="MLflow Tracking" sub="http://localhost:5000" color="#3b82f6" />
              {/* API 호출 목록 */}
              <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}>
                {[
                  { fn: 'mlflow.start_run()', desc: '실험 세션 시작', c: '#6366f1' },
                  { fn: 'mlflow.log_param("lr", 0.001)', desc: '파라미터 기록', c: '#10b981' },
                  { fn: 'mlflow.log_metric("loss", 0.23)', desc: '메트릭 기록', c: '#f59e0b' },
                  { fn: 'mlflow.log_artifact("model.pt")', desc: '파일 저장', c: '#ec4899' },
                ].map((api, i) => (
                  <motion.g key={i} initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + i * 0.12 }}>
                    <rect x={30} y={78 + i * 26} width={420} height={20} rx={4}
                      fill={`${api.c}08`} stroke={`${api.c}25`} strokeWidth={0.5} />
                    <text x={40} y={92 + i * 26} fontSize={8} fontWeight={600} fill={api.c}>{api.fn}</text>
                    <text x={340} y={92 + i * 26} fontSize={7.5} fill="var(--muted-foreground)">{api.desc}</text>
                  </motion.g>
                ))}
              </motion.g>
            </g>
          )}

          {/* Step 1: Artifact */}
          {step === 1 && (
            <g>
              <ModuleBox x={160} y={5} w={160} h={40} label="Artifact Store" sub="S3 / GCS / Local" color="#f59e0b" />
              {[
                { label: 'model.pt', sub: '학습된 모델 가중치', c: '#6366f1', x: 20, y: 65 },
                { label: 'preprocessor.pkl', sub: '전처리 파이프라인', c: '#10b981', x: 175, y: 65 },
                { label: 'dataset_v2.csv', sub: '학습 데이터 스냅샷', c: '#ec4899', x: 340, y: 65 },
              ].map((a, i) => (
                <motion.g key={i} initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15 }}>
                  <DataBox x={a.x} y={a.y} w={120} h={36} label={a.label} sub={a.sub} color={a.c} />
                  <motion.line x1={a.x + 60} y1={a.y} x2={240} y2={45}
                    stroke={a.c} strokeWidth={0.8} opacity={0.4}
                    initial={{ opacity: 0 }} animate={{ opacity: 0.4 }}
                    transition={{ delay: 0.2 + i * 0.1 }} />
                </motion.g>
              ))}
              {/* 버전 표시 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                <rect x={80} y={120} width={320} height={55} rx={8}
                  fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
                <text x={100} y={138} fontSize={9} fontWeight={600} fill="#f59e0b">버전 관리</text>
                {['v1: baseline (2024-01-10)', 'v2: +dropout (2024-01-15)', 'v3: +scheduler (2024-01-20)'].map((v, i) => (
                  <text key={i} x={100} y={153 + i * 12} fontSize={8} fill="var(--muted-foreground)">{v}</text>
                ))}
              </motion.g>
            </g>
          )}

          {/* Step 2: Model Registry */}
          {step === 2 && (
            <g>
              {/* 3단계 파이프라인 */}
              {[
                { label: 'None', sub: '실험 단계', c: '#94a3b8', x: 20 },
                { label: 'Staging', sub: '검증 중', c: '#f59e0b', x: 135 },
                { label: 'Production', sub: '배포 완료', c: '#10b981', x: 260 },
                { label: 'Archived', sub: '은퇴', c: '#6b7280', x: 375 },
              ].map((s, i) => (
                <motion.g key={i} initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.15 }}>
                  <StatusBox x={s.x} y={20} w={100} h={55} label={s.label} sub={s.sub}
                    color={s.c} progress={i === 2 ? 1 : i === 1 ? 0.6 : i === 3 ? 0.1 : 0} />
                </motion.g>
              ))}
              {/* 화살표 */}
              {[0, 1, 2].map((i) => (
                <motion.path key={i}
                  d={`M${120 + i * 125},47 L${135 + i * 125},47`}
                  fill="none" stroke="var(--foreground)" strokeWidth={1}
                  markerEnd="url(#arrReg)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                  transition={{ delay: 0.5 + i * 0.15 }} />
              ))}
              <defs>
                <marker id="arrReg" viewBox="0 0 10 10" refX={9} refY={5}
                  markerWidth={5} markerHeight={5} orient="auto-start-reverse">
                  <path d="M0,0 L10,5 L0,10 z" fill="var(--foreground)" />
                </marker>
              </defs>
              {/* 모델 정보 */}
              <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}>
                <rect x={60} y={95} width={360} height={80} rx={8}
                  fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
                <text x={80} y={115} fontSize={9} fontWeight={600} fill="#10b981">my-classifier v3 (Production)</text>
                {[
                  'run_id: a3f2c1d8-...',
                  'metrics: accuracy=0.947, f1=0.932',
                  'tags: team=ml, task=classification',
                ].map((line, i) => (
                  <text key={i} x={80} y={132 + i * 14} fontSize={8} fill="var(--muted-foreground)">{line}</text>
                ))}
              </motion.g>
            </g>
          )}

          {/* Step 3: 셀프 호스팅 */}
          {step === 3 && (
            <g>
              <ModuleBox x={160} y={5} w={160} h={40} label="Docker Compose" sub="셀프 호스팅 스택" color="#3b82f6" />
              {[
                { label: 'MLflow Server', sub: ':5000', c: '#3b82f6', x: 30, y: 60 },
                { label: 'PostgreSQL', sub: 'Backend Store', c: '#6366f1', x: 180, y: 60 },
                { label: 'MinIO (S3)', sub: 'Artifact Store', c: '#f59e0b', x: 330, y: 60 },
              ].map((s, i) => (
                <motion.g key={i} initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15 }}>
                  <ModuleBox x={s.x} y={s.y} w={120} h={48} label={s.label} sub={s.sub} color={s.c} />
                </motion.g>
              ))}
              {/* 연결 화살표 */}
              <motion.line x1={150} y1={84} x2={180} y2={84}
                stroke="var(--border)" strokeWidth={1}
                initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} transition={{ delay: 0.4 }} />
              <motion.line x1={300} y1={84} x2={330} y2={84}
                stroke="var(--border)" strokeWidth={1}
                initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} transition={{ delay: 0.5 }} />
              {/* 장점 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
                {[
                  { label: '데이터 사내 보관', c: '#10b981' },
                  { label: '비용 = 서버 비용', c: '#3b82f6' },
                  { label: 'VPN 내부 접근', c: '#6366f1' },
                ].map((p, i) => (
                  <g key={i}>
                    <rect x={50 + i * 140} y={130} width={120} height={28} rx={14}
                      fill={`${p.c}10`} stroke={p.c} strokeWidth={0.8} />
                    <text x={110 + i * 140} y={148} textAnchor="middle"
                      fontSize={8} fontWeight={600} fill={p.c}>{p.label}</text>
                  </g>
                ))}
              </motion.g>
            </g>
          )}

          {/* Step 4: 비교 */}
          {step === 4 && (
            <g>
              {/* 헤더 */}
              <rect x={20} y={10} width={440} height={25} rx={6}
                fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
              <text x={120} y={26} textAnchor="middle" fontSize={9} fontWeight={700} fill="var(--foreground)">항목</text>
              <text x={260} y={26} textAnchor="middle" fontSize={9} fontWeight={700} fill="#f59e0b">W&B</text>
              <text x={390} y={26} textAnchor="middle" fontSize={9} fontWeight={700} fill="#3b82f6">MLflow</text>
              {/* 행 */}
              {[
                { item: '호스팅', wb: 'SaaS (클라우드)', ml: '셀프 호스팅' },
                { item: '비용', wb: '팀 규모별 과금', ml: '무료 (OSS)' },
                { item: '대시보드', wb: '풍부한 시각화', ml: '기본 UI' },
                { item: 'Sweep/튜닝', wb: '내장 Sweep', ml: 'Optuna 연동' },
                { item: '모델 레지스트리', wb: 'Artifact + Registry', ml: 'Model Registry' },
                { item: '데이터 보안', wb: '클라우드 저장', ml: '사내 보관 가능' },
              ].map((r, i) => (
                <motion.g key={i} initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}>
                  <rect x={20} y={40 + i * 24} width={440} height={20} rx={3}
                    fill={i % 2 === 0 ? 'var(--card)' : 'transparent'} />
                  <text x={120} y={54 + i * 24} textAnchor="middle" fontSize={8} fontWeight={600}
                    fill="var(--foreground)">{r.item}</text>
                  <text x={260} y={54 + i * 24} textAnchor="middle" fontSize={8}
                    fill="#f59e0b">{r.wb}</text>
                  <text x={390} y={54 + i * 24} textAnchor="middle" fontSize={8}
                    fill="#3b82f6">{r.ml}</text>
                </motion.g>
              ))}
            </g>
          )}
        </svg>
      )}
    </StepViz>
  );
}

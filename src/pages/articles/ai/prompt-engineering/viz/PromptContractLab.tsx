import {
  BadgeCheck,
  Braces,
  FileWarning,
  Gauge,
  LockKeyhole,
  ShieldCheck,
} from 'lucide-react';
import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const scenes = [
  {
    key: 'raw',
    label: '요청만 있으면 성공도 실패도 판정할 수 없다',
    body: '“청구서를 처리해 줘”에는 입력 범위, 완료 조건, 허용 행동과 증거가 없다.',
  },
  {
    key: 'success',
    label: '성공 조건을 관찰 가능한 상태로 바꾼다',
    body: '필수 필드, 금액 검산, 중복 판정과 외부 쓰기 전 승인 조건을 먼저 고정한다.',
  },
  {
    key: 'boundary',
    label: '신뢰한 지시와 신뢰하지 않는 문서를 분리한다',
    body: '문서 속 문장은 추출할 데이터이며, 작업 목표나 권한을 바꾸는 지시가 아니다.',
  },
  {
    key: 'gates',
    label: '출력 모양과 실제 행동을 서로 다른 gate가 검사한다',
    body: 'Schema는 구조를, validator는 의미를, policy와 approval은 side effect를 맡는다.',
  },
  {
    key: 'release',
    label: 'Held-out 사례와 effect evidence가 있어야 배포한다',
    body: '정상 예시뿐 아니라 누락, 인젝션, timeout과 중복 실행을 고정된 회귀 집합으로 돌린다.',
  },
] as const;

const lanes = [
  { key: 'request', label: '요청', icon: FileWarning, tone: 'text-amber-700 dark:text-amber-300' },
  { key: 'success', label: '성공 계약', icon: BadgeCheck, tone: 'text-blue-700 dark:text-blue-300' },
  { key: 'boundary', label: '신뢰 경계', icon: LockKeyhole, tone: 'text-violet-700 dark:text-violet-300' },
  { key: 'shape', label: '구조·의미', icon: Braces, tone: 'text-emerald-700 dark:text-emerald-300' },
  { key: 'effect', label: '행동·증거', icon: ShieldCheck, tone: 'text-rose-700 dark:text-rose-300' },
] as const;

const details = [
  {
    owner: '판정 불가',
    headline: '지난달 청구서를 처리해 줘.',
    checks: ['어느 문서인가?', '처리는 추출인가, 전송인가?', '언제 완료인가?'],
    evidence: '없음',
  },
  {
    owner: 'Prompt contract',
    headline: '필드 추출 → 합계 검산 → 중복 확인 → 승인 전 대기',
    checks: ['vendor·invoice_id·currency 필수', 'line total과 grand total 비교', '외부 전송은 승인 뒤에만'],
    evidence: '검산 결과 + 대기 상태',
  },
  {
    owner: 'Host authority',
    headline: '작업 지시와 문서 본문을 서로 다른 owner로 유지',
    checks: ['trusted: 목표·정책·승인 record', 'untrusted: PDF·메일·검색 결과', '문서 속 “즉시 전송”은 데이터'],
    evidence: 'source ID + trust label',
  },
  {
    owner: 'Validator + Policy',
    headline: 'parseable하다는 것과 실행해도 된다는 것은 다르다',
    checks: ['JSON Schema: 타입·필수 필드', 'semantic validator: 합계·통화·중복', 'policy: 수신처·승인·허용 tool'],
    evidence: 'validation report + approval ID',
  },
  {
    owner: 'Eval + Harness',
    headline: '응답 timeout은 실패 확정이 아니라 effect 미확정이다',
    checks: ['idempotency key로 재시도 제한', '외부 시스템에서 effect 조회', '같은 fixture로 변경 전후 비교'],
    evidence: 'trace ID + effect receipt',
  },
] as const;

export function PromptContractLab() {
  return (
    <div data-prompt-contract-lab className="article-viz-document">
      <StepViz steps={scenes.map(({ label, body }) => ({ label, body }))}>
        {(step) => {
          const detail = details[step];
          return (
            <div
              className="grid w-full min-w-0 gap-4 lg:grid-cols-[minmax(0,1.25fr)_minmax(15rem,0.75fr)]"
              data-stage={scenes[step].key}
            >
              <div className="min-w-0 rounded-md border border-border/80 bg-background p-3 sm:p-5">
                <div className="mb-4 flex min-w-0 items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold uppercase text-muted-foreground">Invoice task packet</p>
                    <p className="mt-1 break-words text-sm font-bold leading-snug sm:text-base">{detail.headline}</p>
                  </div>
                  <Gauge className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden="true" />
                </div>
                <div className="grid min-w-0 grid-cols-2 gap-2 sm:grid-cols-5">
                  {lanes.map((lane, index) => {
                    const active = index <= step;
                    const Icon = lane.icon;
                    return (
                      <motion.div
                        key={lane.key}
                        initial={false}
                        animate={{ opacity: active ? 1 : 0.38, y: active ? 0 : 2 }}
                        className={`min-w-0 rounded-md border p-3 ${
                          index === step ? 'border-foreground/25 bg-muted/35 ring-1 ring-foreground/10' : 'border-border/70 bg-card'
                        }`}
                      >
                        <Icon className={`h-4 w-4 ${active ? lane.tone : 'text-muted-foreground'}`} aria-hidden="true" />
                        <p className="mt-2 break-words text-xs font-bold leading-snug">{lane.label}</p>
                        <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                          {active ? (index < step ? '고정됨' : '이번 장면') : '아직 없음'}
                        </p>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              <motion.div
                key={scenes[step].key}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="min-w-0 rounded-md border border-border/80 bg-background p-4"
              >
                <p className="text-[11px] font-bold uppercase text-muted-foreground">Failure owner</p>
                <p className="mt-1 text-lg font-black">{detail.owner}</p>
                <ul className="mt-4 space-y-2">
                  {detail.checks.map((check) => (
                    <li key={check} className="flex min-w-0 gap-2 text-xs leading-relaxed text-muted-foreground">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/55" aria-hidden="true" />
                      <span className="min-w-0 break-words [overflow-wrap:anywhere]">{check}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 border-t border-border pt-3">
                  <p className="text-[11px] font-semibold text-muted-foreground">남겨야 할 증거</p>
                  <p className="mt-1 break-words font-mono text-xs font-bold">{detail.evidence}</p>
                </div>
              </motion.div>
            </div>
          );
        }}
      </StepViz>
    </div>
  );
}

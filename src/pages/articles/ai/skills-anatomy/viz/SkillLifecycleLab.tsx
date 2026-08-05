import {
  BookOpenCheck,
  Boxes,
  FileCode2,
  Fingerprint,
  PackageCheck,
  ShieldCheck,
} from 'lucide-react';
import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const scenes = [
  {
    key: 'catalog',
    label: 'Catalog에는 이름과 설명만 먼저 보인다',
    body: '모델은 모든 Skill 본문을 읽지 않고, 현재 작업과 맞을 가능성이 있는 후보만 찾는다.',
  },
  {
    key: 'activate',
    label: 'Description match는 로드 제안이지 권한 승인이 아니다',
    body: '호스트가 설치·허용한 Skill인지 확인한 뒤에만 본문을 context에 넣는다.',
  },
  {
    key: 'body',
    label: 'SKILL.md 본문이 작업 절차를 제공한다',
    body: '순서, 품질 기준, 실패 조건을 읽지만 아직 외부 시스템에 변화는 없다.',
  },
  {
    key: 'resource',
    label: '필요한 reference나 script만 지연 로드한다',
    body: '큰 자료를 처음부터 모두 넣지 않고 현재 단계에 필요한 파일만 읽거나 실행 후보로 만든다.',
  },
  {
    key: 'gate',
    label: 'Tool·Policy·Approval이 실제 행동을 다시 판정한다',
    body: 'Skill에 “전송”이라고 적혀 있어도 tool 노출, 입력 검증, 권한과 승인이 닫혀 있으면 실행되지 않는다.',
  },
  {
    key: 'evidence',
    label: 'Executor 결과와 effect evidence로 작업을 닫는다',
    body: 'Timeout이면 바로 재실행하지 않고 idempotency key와 외부 effect 조회로 상태를 확정한다.',
  },
] as const;

const lifecycle = [
  { label: 'metadata', owner: 'catalog', icon: Boxes },
  { label: 'activation', owner: 'host', icon: Fingerprint },
  { label: 'SKILL.md', owner: 'context', icon: BookOpenCheck },
  { label: 'resources', owner: 'loader', icon: FileCode2 },
  { label: 'action gates', owner: 'policy', icon: ShieldCheck },
  { label: 'effect receipt', owner: 'executor', icon: PackageCheck },
] as const;

const packets = [
  {
    loaded: 'name + description',
    decision: 'invoice-processing 후보를 표시',
    closed: '본문·script·tool 권한',
  },
  {
    loaded: '설치 source + version + metadata',
    decision: '허용된 package인지 admission 확인',
    closed: '외부 쓰기 권한',
  },
  {
    loaded: 'SKILL.md 절차',
    decision: '추출 → 검산 → 승인 대기 순서를 제안',
    closed: '실제 API 호출',
  },
  {
    loaded: 'invoice-schema.md + validator script',
    decision: '현재 단계에 필요한 resource만 사용',
    closed: 'script의 임의 network 접근',
  },
  {
    loaded: 'tool schema + policy + approval record',
    decision: '수신처와 금액을 검사하고 승인된 call만 dispatch',
    closed: '승인 밖 action',
  },
  {
    loaded: 'executor result + external status',
    decision: 'effect가 한 번 반영됐는지 확정',
    closed: '근거 없는 retry',
  },
] as const;

export function SkillLifecycleLab() {
  return (
    <div data-skill-lifecycle-lab className="article-viz-document">
      <StepViz steps={scenes.map(({ label, body }) => ({ label, body }))}>
        {(step) => {
          const packet = packets[step];
          return (
            <div
              data-stage={scenes[step].key}
              className="grid w-full min-w-0 gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(16rem,0.85fr)]"
            >
              <div className="min-w-0 rounded-md border border-border/80 bg-background p-3 sm:p-5">
                <p className="mb-4 text-[11px] font-bold uppercase text-muted-foreground">Progressive disclosure</p>
                <div className="grid min-w-0 grid-cols-2 gap-2 sm:grid-cols-3">
                  {lifecycle.map((item, index) => {
                    const Icon = item.icon;
                    const active = index <= step;
                    return (
                      <motion.div
                        key={item.label}
                        initial={false}
                        animate={{ opacity: active ? 1 : 0.35 }}
                        className={`min-w-0 rounded-md border p-3 ${
                          index === step ? 'border-blue-600/35 bg-blue-500/[0.05] ring-1 ring-blue-600/10' : 'border-border/70 bg-card'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <Icon className={`h-4 w-4 ${active ? 'text-blue-700 dark:text-blue-300' : 'text-muted-foreground'}`} aria-hidden="true" />
                          <span className="font-mono text-[10px] text-muted-foreground">{String(index + 1).padStart(2, '0')}</span>
                        </div>
                        <p className="mt-2 break-words font-mono text-xs font-bold">{item.label}</p>
                        <p className="mt-1 text-[11px] text-muted-foreground">owner: {item.owner}</p>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              <motion.dl
                key={scenes[step].key}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="min-w-0 divide-y divide-border overflow-hidden rounded-md border border-border/80 bg-background"
              >
                {[
                  ['지금 읽은 것', packet.loaded],
                  ['이번 판정', packet.decision],
                  ['여전히 닫힌 것', packet.closed],
                ].map(([term, value], index) => (
                  <div key={term} className="min-w-0 p-4">
                    <dt className="flex items-center gap-2 text-[11px] font-bold text-muted-foreground">
                      <span className={`h-1.5 w-1.5 rounded-full ${index === 2 ? 'bg-rose-600' : 'bg-blue-600'}`} aria-hidden="true" />
                      {term}
                    </dt>
                    <dd className="mt-1.5 min-w-0 break-words text-sm font-semibold leading-relaxed [overflow-wrap:anywhere]">{value}</dd>
                  </div>
                ))}
              </motion.dl>
            </div>
          );
        }}
      </StepViz>
    </div>
  );
}

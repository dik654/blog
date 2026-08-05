import { Fragment } from 'react';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import {
  ArrowDown,
  ArrowRight,
  Ban,
  CheckCircle2,
  Database,
  FileCheck2,
  FileWarning,
  Fingerprint,
  Inbox,
  LockKeyhole,
  MessageSquareText,
  ScanSearch,
  ShieldCheck,
} from 'lucide-react';
import StepViz from '@/components/ui/step-viz';

const ACCENTS = {
  authority: '#1d4ed8',
  untrusted: '#a16207',
  sensitive: '#9333ea',
  proposal: '#475569',
  gate: '#0f766e',
  allow: '#047857',
  deny: '#be123c',
} as const;

const steps = [
  {
    label: '외부 content가 context에 들어와도 authority로 승격시키지 않는다.',
    body: '사용자 목표와 vendor email을 같은 prompt에 넣더라도 source ID, trust class와 data label은 별도 metadata로 유지한다.',
  },
  {
    label: '모델 출력은 side effect가 아니라 검증 대기 중인 proposal이다.',
    body: 'Injection을 놓친 모델이 고객 조회·외부 송신·memory 저장을 제안할 수 있다. 이 순간까지 현실의 DB, 네트워크와 durable memory는 바뀌지 않았다.',
  },
  {
    label: '정책 엔진이 intent·capability·누적 flow·승인을 따로 검사한다.',
    body: 'Global registry의 도구 수가 아니라 현재 task grant를 기준으로 다섯 proposal을 2 allow와 3 deny로 나눈다.',
  },
  {
    label: 'Prepare와 commit 사이의 변화를 실행 직전에 다시 판정한다.',
    body: 'Draft는 검토 가능한 artifact로 끝낸다. 별도 승인된 action도 destination이나 resource가 바뀌면 action hash가 달라져 commit되지 않는다.',
  },
  {
    label: 'Source부터 commit까지의 증거를 같은 fixture로 재실행한다.',
    body: '차단 로그만 남기지 않는다. 정상 요약·초안은 계속 성공하고 forbidden side effect는 0인지 paired regression으로 확인한다.',
  },
];

function StageTitle({
  icon: Icon,
  eyebrow,
  title,
}: {
  icon: LucideIcon;
  eyebrow: string;
  title: string;
}) {
  return (
    <div className="flex min-w-0 items-start gap-3 border-b border-border pb-4">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md border border-border bg-background">
        <Icon className="h-4 w-4" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="text-[11px] font-bold uppercase text-muted-foreground">{eyebrow}</p>
        <p className="mt-1 text-sm font-bold leading-5">{title}</p>
      </div>
    </div>
  );
}

function FlowArrow() {
  return (
    <div className="flex min-h-8 shrink-0 items-center justify-center text-muted-foreground" aria-hidden="true">
      <ArrowDown className="h-4 w-4 lg:hidden" />
      <ArrowRight className="hidden h-4 w-4 lg:block" />
    </div>
  );
}

function BoundaryNode({
  icon: Icon,
  label,
  value,
  detail,
  color,
  delay = 0,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  detail: string;
  color: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 7 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="relative min-w-0 overflow-hidden rounded-md border border-border bg-background p-4"
    >
      <span className="absolute inset-y-0 left-0 w-0.5" style={{ backgroundColor: color }} />
      <div className="flex min-w-0 items-center gap-2">
        <Icon className="h-4 w-4 shrink-0" style={{ color }} aria-hidden="true" />
        <p className="min-w-0 text-[11px] font-bold uppercase text-muted-foreground">{label}</p>
      </div>
      <p className="mt-3 break-words text-sm font-bold leading-5">{value}</p>
      <p className="mt-2 text-[11px] leading-5 text-muted-foreground">{detail}</p>
    </motion.div>
  );
}

function Receipt({
  owner,
  output,
  invariant,
}: {
  owner: string;
  output: string;
  invariant: string;
}) {
  return (
    <dl className="mt-5 grid min-w-0 grid-cols-3 divide-x divide-border border-y border-border">
      {[
        ['현재 책임', owner],
        ['남긴 출력', output],
        ['다음 단계의 불변식', invariant],
      ].map(([term, value]) => (
        <div className="min-w-0 px-2 py-3 sm:px-3" key={term}>
          <dt className="text-[11px] font-bold text-muted-foreground">{term}</dt>
          <dd className="mt-1 break-words font-mono text-[11px] font-semibold leading-5 [overflow-wrap:anywhere]">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

function SourceStage() {
  const packetRows = [
    ['authority', 'user-request-42', 'Vendor 메일 요약 + 답장 초안', ACCENTS.authority],
    ['external', 'email-884', 'external · untrusted', ACCENTS.untrusted],
    ['sensitive', 'customer-417', 'confidential · 아직 읽지 않음', ACCENTS.sensitive],
  ] as const;

  return (
    <div className="min-w-0">
      <StageTitle icon={Inbox} eyebrow="Source boundary" title="같은 context 안에서도 지시와 읽을 데이터를 다른 권한으로 보존한다" />
      <div className="mt-6 grid min-w-0 gap-6 lg:grid-cols-[minmax(0,0.88fr)_2rem_minmax(0,1.12fr)] lg:items-center">
        <div className="grid min-w-0 grid-cols-2 gap-2 lg:grid-cols-1">
          <BoundaryNode
            icon={MessageSquareText}
            label="Authority"
            value="사용자 요청"
            detail="요약과 답장 초안만 task intent로 승인했다."
            color={ACCENTS.authority}
          />
          <BoundaryNode
            icon={FileWarning}
            label="Untrusted content"
            value="Vendor email의 숨은 명령"
            detail="업무상 읽을 데이터지만 목표·정책·권한을 바꿀 수 없다."
            color={ACCENTS.untrusted}
            delay={0.08}
          />
        </div>
        <FlowArrow />
        <motion.div
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          className="min-w-0 rounded-md border border-border bg-background p-4"
        >
          <div className="flex min-w-0 items-start justify-between gap-3 border-b border-border pb-3">
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase text-muted-foreground">Context packet</p>
              <p className="mt-1 text-sm font-bold">문자열과 trust metadata를 함께 전달</p>
            </div>
            <Fingerprint className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          </div>
          <div className="mt-2 grid min-w-0 grid-cols-3 divide-x divide-border">
            {packetRows.map(([kind, id, value, color], index) => (
              <motion.div
                initial={{ opacity: 0, x: 7 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.12 + index * 0.07 }}
                className="min-w-0 px-2 py-3 sm:px-3"
                key={id}
              >
                <span className="font-mono text-[11px] font-black" style={{ color }}>{kind}</span>
                <code className="mt-1 block break-words text-[11px] font-bold [overflow-wrap:anywhere]">{id}</code>
                <p className="mt-1 text-[11px] leading-5 text-muted-foreground">{value}</p>
              </motion.div>
            ))}
          </div>
          <p className="mt-3 border-l-2 pl-3 text-[11px] font-semibold leading-5" style={{ borderColor: ACCENTS.deny }}>
            Prompt 안의 위치나 말투는 authority 증명서가 아니다.
          </p>
        </motion.div>
      </div>
      <Receipt owner="Context builder + lineage store" output="task intent · source IDs · data labels" invariant="external content ≠ authority" />
    </div>
  );
}

const proposals = [
  ['01', 'read_inbox', '최근 vendor email 읽기'],
  ['02', 'read_customer:417', '공격이 추가한 confidential lookup'],
  ['03', 'http_request:evil', '공격자 destination으로 송신'],
  ['04', 'write_memory:admin', '가짜 권한 fact 영구 저장'],
  ['05', 'draft_reply', '사용자가 요청한 답장 초안'],
] as const;

function ProposalStage() {
  return (
    <div className="min-w-0">
      <StageTitle icon={ScanSearch} eyebrow="Proposal boundary" title="모델이 틀릴 수 있다는 전제에서 실행 후보를 구조화한다" />
      <div className="mt-6 grid min-w-0 gap-6 lg:grid-cols-[minmax(12rem,0.72fr)_2rem_minmax(0,1.28fr)] lg:items-center">
        <BoundaryNode
          icon={ScanSearch}
          label="Model output"
          value="5 action proposals"
          detail="Email 속 지시를 사용자 목표로 오인했다. 아직 어떤 tool도 실행하지 않았다."
          color={ACCENTS.proposal}
        />
        <FlowArrow />
        <div className="min-w-0 divide-y divide-border border-y border-border">
          {proposals.map(([number, action, detail], index) => (
            <motion.div
              initial={{ opacity: 0, x: 7 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.06 }}
              className="grid min-w-0 grid-cols-[2.25rem_minmax(0,1fr)] gap-x-3 py-3 sm:grid-cols-[2.25rem_minmax(10rem,0.8fr)_minmax(0,1.2fr)]"
              key={action}
            >
              <span className="font-mono text-[11px] font-black text-muted-foreground">{number}</span>
              <code className="min-w-0 break-words text-[11px] font-bold">{action}</code>
              <p className="col-start-2 mt-1 min-w-0 text-[11px] leading-5 text-muted-foreground sm:col-start-3 sm:mt-0">{detail}</p>
            </motion.div>
          ))}
        </div>
      </div>
      <div className="mt-5 flex min-w-0 items-start gap-3 border-l-2 pl-3" style={{ borderColor: ACCENTS.proposal }}>
        <LockKeyhole className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        <p className="text-xs font-semibold leading-5">
          Proposal에는 실행 credential이 없다. Tool name이 문법적으로 맞아도 authorization은 아직 0이다.
        </p>
      </div>
      <Receipt owner="Model + proposal parser" output="typed ActionProposal[5]" invariant="proposal ≠ authorization ≠ commit" />
    </div>
  );
}

const gateChecks = [
  ['I', 'Intent', '목표', '사용자 목표에 포함됐는가?', ACCENTS.authority],
  ['C', 'Capability', '권한', '현재 task grant 안인가?', ACCENTS.gate],
  ['F', 'Flow', '흐름', '이력까지 합쳐 허용된 data flow인가?', ACCENTS.sensitive],
  ['A', 'Approval', '승인', '이 대상과 영향이 구체적으로 승인됐는가?', ACCENTS.untrusted],
] as const;

const decisions = [
  ['read_inbox', 'allow', 'I=1 · C=1 · read-only'],
  ['read_customer:417', 'deny', 'C=0 · resource scope 없음'],
  ['http_request:evil', 'deny', 'C=0 · F=0 · confidential egress'],
  ['write_memory:admin', 'deny', 'I=0 · F=0 · policy 승격'],
  ['draft_reply', 'allow', 'I=1 · C=1 · artifact only'],
] as const;

function GateStage() {
  return (
    <div className="min-w-0">
      <StageTitle icon={ShieldCheck} eyebrow="Deterministic policy" title="문장 분류 결과가 아니라 현재 action과 누적 실행 이력을 판정한다" />
      <div className="mt-5 grid min-w-0 grid-cols-4 gap-1.5 sm:gap-2">
        {gateChecks.map(([symbol, label, mobileLabel, detail, color], index) => (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
            className="relative min-w-0 overflow-hidden rounded-md border border-border bg-background p-3"
            key={symbol}
          >
            <span className="absolute inset-x-0 top-0 h-0.5" style={{ backgroundColor: color }} />
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-2">
              <span className="font-mono text-sm font-black" style={{ color }}>{symbol}</span>
              <span className="text-[11px] font-bold">
                <span className="sm:hidden">{mobileLabel}</span>
                <span className="hidden sm:inline">{label}</span>
              </span>
            </div>
            <p className="mt-2 hidden text-[11px] leading-5 text-muted-foreground sm:block">{detail}</p>
          </motion.div>
        ))}
      </div>
      <div className="mt-5 min-w-0 divide-y divide-border border-y border-border">
        {decisions.map(([action, state, reason], index) => {
          const allowed = state === 'allow';
          const Icon = allowed ? CheckCircle2 : Ban;
          const color = allowed ? ACCENTS.allow : ACCENTS.deny;
          return (
            <motion.div
              initial={{ opacity: 0, x: 6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.18 + index * 0.05 }}
              className="grid min-w-0 grid-cols-[minmax(0,1fr)_4.5rem] gap-x-3 py-2.5 sm:grid-cols-[minmax(10rem,0.8fr)_5rem_minmax(0,1.2fr)] sm:items-center"
              key={action}
            >
              <code className="min-w-0 break-words text-[11px] font-bold">{action}</code>
              <span className="flex items-center gap-1 text-[11px] font-black uppercase" style={{ color }}>
                <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                {state}
              </span>
              <p className="col-span-2 mt-1 min-w-0 text-[11px] leading-5 text-muted-foreground sm:col-span-1 sm:mt-0">{reason}</p>
            </motion.div>
          );
        })}
      </div>
      <div className="mt-4 grid grid-cols-3 divide-x divide-border border-y border-border text-center">
        {[
          ['5', 'proposal', ACCENTS.proposal],
          ['2', 'allow', ACCENTS.allow],
          ['3', 'deny', ACCENTS.deny],
        ].map(([value, label, color]) => (
          <div className="px-2 py-3" key={label}>
            <p className="font-mono text-xl font-black" style={{ color }}>{value}</p>
            <p className="mt-1 text-[11px] font-bold text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>
      <Receipt owner="Policy engine + resource server" output="2 allow · 3 deny" invariant="외부·영구 effect = 0" />
    </div>
  );
}

function CommitStage() {
  const recheck = [
    ['Prepare', 'vendor.example/reply', 'vendor/reply', 'hash 7a3c', ACCENTS.allow],
    ['Resolve again', 'redirect → evil.example', '→ evil.example', 'hash 19be', ACCENTS.untrusted],
    ['Commit gate', 'hash mismatch', 'hash mismatch', 'BLOCK', ACCENTS.deny],
  ] as const;

  return (
    <div className="min-w-0">
      <StageTitle icon={LockKeyhole} eyebrow="Prepare → commit" title="검토 가능한 artifact와 현실을 바꾸는 side effect를 분리한다" />
      <div className="mt-6 grid min-w-0 gap-6 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:items-start">
        <BoundaryNode
          icon={FileCheck2}
          label="Current task"
          value="draft_reply → artifact"
          detail="답장 초안은 저장하지만 send endpoint는 호출하지 않는다. 사용자는 내용과 destination을 먼저 검토한다."
          color={ACCENTS.allow}
        />
        <div className="min-w-0">
          <p className="mb-3 text-[11px] font-bold uppercase text-muted-foreground">별도 승인 후에도 실행 직전 재검사</p>
          <div className="grid min-w-0 grid-cols-3 gap-1.5 lg:hidden">
            {recheck.map(([label, , mobileValue, result, color], index) => (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                className="relative min-w-0 overflow-hidden rounded-md border border-border bg-background p-2.5"
                key={label}
              >
                <span className="font-mono text-[11px] font-black text-muted-foreground">{String(index + 1).padStart(2, '0')}</span>
                <p className="mt-2 text-[11px] font-bold uppercase" style={{ color }}>{label}</p>
                <p className="mt-2 break-words font-mono text-[11px] font-bold leading-5 [overflow-wrap:anywhere]">{mobileValue}</p>
                <p className="mt-2 font-mono text-[11px] leading-5 text-muted-foreground">{result}</p>
              </motion.div>
            ))}
          </div>
          <div className="hidden min-w-0 lg:grid lg:grid-cols-[minmax(0,1fr)_1.5rem_minmax(0,1fr)_1.5rem_minmax(0,0.8fr)] lg:items-stretch">
            {recheck.map(([label, value, , result, color], index) => (
              <Fragment key={label}>
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                  className="relative min-w-0 overflow-hidden rounded-md border border-border bg-background p-3"
                >
                  <span className="absolute inset-y-0 left-0 w-0.5" style={{ backgroundColor: color }} />
                  <p className="text-[11px] font-bold uppercase" style={{ color }}>{label}</p>
                  <p className="mt-3 break-words font-mono text-[11px] font-bold leading-5">{value}</p>
                  <p className="mt-2 font-mono text-[11px] leading-5 text-muted-foreground">{result}</p>
                </motion.div>
                {index < recheck.length - 1 ? (
                  <div className="flex min-h-7 items-center justify-center text-muted-foreground" aria-hidden="true">
                    <ArrowDown className="h-4 w-4 lg:hidden" />
                    <ArrowRight className="hidden h-4 w-4 lg:block" />
                  </div>
                ) : null}
              </Fragment>
            ))}
          </div>
          <p className="mt-4 border-l-2 pl-3 text-[11px] font-semibold leading-5" style={{ borderColor: ACCENTS.deny }}>
            Approval은 자연어 요약이 아니라 tool, 대상, 핵심 인자와 예상 side effect의 hash에 묶인다.
          </p>
        </div>
      </div>
      <Receipt owner="Approval service + commit gate" output="draft artifact · blocked outbound" invariant="approved hash = resolved action hash" />
    </div>
  );
}

const evidenceRows = [
  ['01', 'Source', 'email-884 · external · untrusted', '원문 hash + lineage', FileWarning, ACCENTS.untrusted],
  ['02', 'Proposal', 'http_request(evil, customer-417)', '미실행 action', ScanSearch, ACCENTS.proposal],
  ['03', 'Decision', 'deny: tool_scope + data_flow', 'policy v17 · grant g42', ShieldCheck, ACCENTS.gate],
  ['04', 'Commit', 'external writes = 0', 'side effect 없음', Ban, ACCENTS.deny],
  ['05', 'Replay', 'normal pass + forbidden commit 0', 'release fixture', FileCheck2, ACCENTS.allow],
] as const;

function EvidenceStage() {
  return (
    <div className="min-w-0">
      <StageTitle icon={FileCheck2} eyebrow="Evidence → replay" title="차단된 한 번을 다음 변경에서도 재현 가능한 release invariant로 바꾼다" />
      <div className="mt-5 min-w-0 divide-y divide-border border-y border-border">
        {evidenceRows.map(([number, stage, evidence, output, Icon, color], index) => (
          <motion.div
            initial={{ opacity: 0, x: 7 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.07 }}
            className="grid min-w-0 grid-cols-[2.25rem_6.5rem_minmax(0,1fr)] gap-x-2 py-3 sm:grid-cols-[2.25rem_7rem_minmax(0,1.15fr)_minmax(0,0.85fr)] sm:gap-x-3"
            key={stage}
          >
            <span className="font-mono text-[11px] font-black text-muted-foreground">{number}</span>
            <strong className="flex min-w-0 items-center gap-1.5 text-[11px]" style={{ color }}>
              <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              {stage}
            </strong>
            <code className="min-w-0 break-words text-[11px] font-bold leading-5">{evidence}</code>
            <p className="col-start-2 col-span-2 mt-1 min-w-0 text-[11px] leading-5 text-muted-foreground sm:col-start-4 sm:col-span-1 sm:mt-0">{output}</p>
          </motion.div>
        ))}
      </div>
      <div className="mt-5 grid min-w-0 gap-2 sm:grid-cols-2">
        <div className="flex min-w-0 items-center justify-between gap-3 border border-border bg-background px-4 py-3">
          <span className="text-[11px] font-bold">정상 task</span>
          <span className="flex items-center gap-1.5 font-mono text-[11px] font-black" style={{ color: ACCENTS.allow }}>
            <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
            PASS
          </span>
        </div>
        <div className="flex min-w-0 items-center justify-between gap-3 border border-border bg-background px-4 py-3">
          <span className="text-[11px] font-bold">Forbidden commit</span>
          <span className="flex items-center gap-1.5 font-mono text-[11px] font-black" style={{ color: ACCENTS.deny }}>
            <Database className="h-3.5 w-3.5" aria-hidden="true" />
            0
          </span>
        </div>
      </div>
      <Receipt owner="Trace store + evaluation harness" output="incident fixture · paired rerun" invariant="normal succeeds ∧ forbidden commit = 0" />
    </div>
  );
}

const sceneByStep = [
  <SourceStage key="source" />,
  <ProposalStage key="proposal" />,
  <GateStage key="gate" />,
  <CommitStage key="commit" />,
  <EvidenceStage key="evidence" />,
] as const;

export function PromptInjectionContainmentViz() {
  return (
    <div
      data-agent-security-viz
      className="not-prose min-w-0 [&_.step-viz]:my-8 [&_.step-viz__stage]:min-h-[300px] sm:[&_.step-viz__stage]:min-h-[410px]"
      style={{ '--viz-accent': ACCENTS.gate } as React.CSSProperties}
    >
      <StepViz steps={steps} stageClassName="items-stretch">
        {(step) => sceneByStep[step]}
      </StepViz>
    </div>
  );
}

import { motion } from 'framer-motion';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import SwarmEventViz from './viz/SwarmEventViz';

const POLL_ORDER = [
  { priority: '1순위', target: 'behaviour.poll()', reason: '로컬 작업 우선 처리', color: '#6366f1' },
  { priority: '2순위', target: 'pool.poll()', reason: '기존 연결 유지 우선', color: '#10b981' },
  { priority: '3순위', target: 'transport.poll()', reason: '새 연결은 마지막', color: '#8b5cf6' },
];

const HANDLER_STEPS = [
  'Behaviour → ToSwarm::NotifyHandler 반환',
  'Swarm → pending_handler_event에 저장',
  '다음 루프: 해당 연결에 이벤트 전달',
  '전달 완료까지 Behaviour 폴링 중지',
];

export default function SwarmLoop({ onCodeRef }: {
  title?: string; onCodeRef?: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="swarm-loop" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Swarm 이벤트 루프</h2>

      <div className="not-prose mb-8"><SwarmEventViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <code>Swarm::poll_next_event()</code>는 libp2p의 심장이다.<br />
          하나의 <code>loop {'{}'}</code> 안에서 세 컴포넌트를 <strong>우선순위 순</strong>으로 폴링한다.
        </p>
      </div>
      <div className="rounded-xl border border-border bg-card p-5 my-6">
        <p className="text-xs font-mono text-foreground/50 mb-3">poll_next_event 우선순위</p>
        <div className="flex flex-col gap-2">
          {POLL_ORDER.map((p, i) => (
            <motion.div key={p.target}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.12 }}
              className="flex items-center gap-3 rounded-lg border px-4 py-2.5"
              style={{ borderColor: p.color + '40', background: p.color + '08' }}>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded shrink-0"
                style={{ background: p.color + '20', color: p.color }}>{p.priority}</span>
              <span className="text-xs font-mono font-bold"
                style={{ color: p.color }}>{p.target}</span>
              <span className="text-xs text-foreground/50">{p.reason}</span>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          이 우선순위가 중요한 이유가 있다.<br />
          Behaviour가 Dial 요청을 내면 <strong>즉시 처리</strong>되어야 한다.<br />
          외부에서 오는 새 연결 수락은 늦어도 괜찮다.
        </p>

        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() => onCodeRef('poll-next-event', codeRefs['poll-next-event'])} />
            <CodeViewButton onClick={() => onCodeRef('swarm-struct', codeRefs['swarm-struct'])} />
            <CodeViewButton onClick={() => onCodeRef('swarm-dial', codeRefs['swarm-dial'])} />
          </div>
        )}

        <h3>pending_handler_event 전달</h3>
        <p>
          Behaviour가 <code>NotifyHandler</code>를 반환하면 바로 전달되지 않는다.<br />
          다음 루프에서 해당 연결을 찾아 이벤트를 넘긴다.<br />
          전달 완료까지 Behaviour 폴링은 <strong>중지</strong>된다.
        </p>
      </div>
      <div className="rounded-xl border border-border bg-card p-5 my-6">
        <p className="text-xs font-mono text-foreground/50 mb-3">NotifyHandler 전달 흐름</p>
        <div className="flex flex-col gap-1.5">
          {HANDLER_STEPS.map((s, i) => (
            <div key={i} className="flex items-start gap-2.5 text-xs">
              <span className="font-mono text-foreground/30 mt-0.5 w-4 shrink-0">{i + 1}</span>
              <span className="text-foreground/70">{s}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>handle_behaviour_event 분기</h3>
        <p>
          Behaviour가 반환하는 <code>ToSwarm</code> 커맨드를 처리한다.
          <code>GenerateEvent</code>면 사용자에게 반환.
          <code>Dial</code>이면 <code>transport.dial()</code> 호출.
          <code>NotifyHandler</code>면 pending에 저장한다.
        </p>
      </div>
    </section>
  );
}

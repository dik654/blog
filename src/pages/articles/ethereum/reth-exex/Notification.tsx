import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';
import NotificationDetailViz from './viz/NotificationDetailViz';
import type { CodeRef } from '@/components/code/types';
import { NOTIFICATION_EVENTS } from './NotificationData';

export default function Notification({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const [activeEvent, setActiveEvent] = useState<string | null>(null);
  const sel = NOTIFICATION_EVENTS.find(e => e.id === activeEvent);

  return (
    <section id="notification" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">ExExNotification 스트림</h2>
      <div className="not-prose mb-8"><NotificationDetailViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-4">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('exex-notification', codeRefs['exex-notification'])} />
          <span className="text-[10px] text-muted-foreground self-center">ExExNotification</span>
          <CodeViewButton onClick={() => onCodeRef('exex-manager', codeRefs['exex-manager'])} />
          <span className="text-[10px] text-muted-foreground self-center">ExExManager</span>
          <CodeViewButton onClick={() => onCodeRef('exex-context', codeRefs['exex-context'])} />
          <span className="text-[10px] text-muted-foreground self-center">ExExContext</span>
        </div>
        <p>
          ExExNotification은 3종의 체인 이벤트를 정의한다.<br />
          모든 이벤트가 <code>Arc&lt;Chain&gt;</code>으로 감싸져 있어, clone 시 블록 데이터를 복사하지 않는다.
          10개 ExEx가 동시에 구독해도 메모리에는 블록 데이터 1벌만 존재한다.
        </p>
        <p>
          ExExManager가 send_notification()을 호출하면, 등록된 모든 ExEx에 이벤트가 fan-out된다.<br />
          각 ExEx는 자신의 속도로 이벤트를 처리하고, 완료 시 FinishedHeight를 보고한다.
        </p>
      </div>

      {/* Event type cards */}
      <div className="not-prose grid grid-cols-3 gap-3 mb-4">
        {NOTIFICATION_EVENTS.map(e => (
          <button key={e.id}
            onClick={() => setActiveEvent(activeEvent === e.id ? null : e.id)}
            className="rounded-lg border p-3 text-left transition-all duration-200 cursor-pointer"
            style={{
              borderColor: activeEvent === e.id ? e.color : 'var(--color-border)',
              background: activeEvent === e.id ? `${e.color}10` : undefined,
            }}>
            <p className="font-mono text-xs font-bold" style={{ color: e.color }}>{e.name}</p>
            <p className="text-xs text-foreground/60 mt-1">{e.desc}</p>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {sel && (
          <motion.div key={sel.id}
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}
            className="not-prose rounded-lg border border-border/60 bg-background/60 px-5 py-4 mb-6 overflow-hidden">
            <p className="font-semibold text-sm mb-2" style={{ color: sel.color }}>{sel.name}</p>
            <div className="space-y-1 text-sm">
              <p className="text-foreground/80"><span className="text-foreground/50">페이로드:</span> {sel.payload}</p>
              <p className="text-foreground/80"><span className="text-foreground/50">처리 예시:</span> {sel.handling}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>Arc fan-out의 효율성</strong> — Arc&lt;Chain&gt;의 clone은 원자적 참조 카운트 증가(1 CPU 명령어)뿐이다.<br />
          수 MB의 블록 데이터를 복사하는 것과는 차원이 다른 성능을 제공한다.
        </p>
      </div>
    </section>
  );
}

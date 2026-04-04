import { motion } from 'framer-motion';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from '../libp2p/codeRefs';

const FIELDS = [
  { name: 'quinn_config', desc: 'QuinnConfig — 클라이언트/서버/엔드포인트 설정', color: '#8b5cf6' },
  { name: 'listeners', desc: 'SelectAll<Listener<P>> — 리스너 스트림 통합', color: '#10b981' },
  { name: 'dialer', desc: 'HashMap<SocketFamily, Endpoint> — 리스너 없을 때 다이얼러', color: '#f59e0b' },
  { name: 'hole_punch_attempts', desc: 'HashMap<SocketAddr, Sender> — 홀펀칭 대기', color: '#ef4444' },
];

const REASONS = [
  { lib: 'quinn', why: 'Rust QUIC 중 가장 성숙. tokio 네이티브, RFC 9000 완전 구현', pick: true },
  { lib: 'quiche', why: 'Cloudflare C 라이브러리 바인딩. FFI 오버헤드 존재', pick: false },
  { lib: 's2n-quic', why: 'AWS 제작. 안정적이나 libp2p 통합 어려움', pick: false },
];

export default function QuinnIntegration({ onCodeRef }: {
  onCodeRef?: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="quinn-integration" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">quinn 라이브러리 통합</h2>

      {/* GenTransport 필드 시각화 */}
      <div className="rounded-xl border border-border bg-card p-5 mb-6">
        <p className="text-xs font-mono text-foreground/50 mb-4">
          GenTransport&lt;P&gt; 구조체 필드
        </p>
        <div className="flex flex-col gap-2">
          {FIELDS.map((f, i) => (
            <motion.div key={f.name}
              initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="flex items-center gap-3 rounded-lg border px-4 py-2.5"
              style={{ borderColor: f.color + '40', background: f.color + '08' }}>
              <span className="text-xs font-mono font-bold shrink-0"
                style={{ color: f.color }}>{f.name}</span>
              <span className="text-xs text-foreground/60 flex-1">{f.desc}</span>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">왜 quinn인가?</h3>
        <p>Rust QUIC 구현은 세 가지다. libp2p가 quinn을 선택한 이유는 명확하다.</p>
      </div>

      {/* 라이브러리 비교 */}
      <div className="rounded-xl border border-border bg-card p-5 mt-4 mb-6">
        <div className="flex flex-col gap-2">
          {REASONS.map((r, i) => (
            <motion.div key={r.lib}
              initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              className="flex items-center gap-3 rounded-lg border px-4 py-2.5"
              style={{
                borderColor: r.pick ? '#10b98140' : '#94a3b830',
                background: r.pick ? '#10b98108' : 'transparent',
              }}>
              <span className={`text-xs font-mono font-bold w-16 shrink-0 ${
                r.pick ? 'text-emerald-500' : 'text-foreground/40'
              }`}>{r.lib}</span>
              <span className="text-xs text-foreground/60 flex-1">{r.why}</span>
              {r.pick && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-500">
                  선택
                </span>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>Endpoint 생성:</strong> <code>new_endpoint()</code>는 quinn::Endpoint를 래핑한다.<br />
          Provider 트레이트로 런타임을 추상화하고, tokio 플래그가 필요하다.
        </p>
        <p>
          <strong>Listener 구조:</strong> listen_on() 호출마다 Listener를 생성한다.<br />
          SelectAll로 통합되어 poll() 한 번으로 전체를 폴링한다.
        </p>

        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton
              onClick={() => onCodeRef('quic-transport', codeRefs['quic-transport'])}
            />
            <span className="text-[10px] text-muted-foreground self-center">
              GenTransport 전체 코드
            </span>
          </div>
        )}
      </div>
    </section>
  );
}

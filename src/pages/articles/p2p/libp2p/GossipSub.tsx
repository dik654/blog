import CodePanel from '@/components/ui/code-panel';
import GossipMeshViz from './viz/GossipMeshViz';
import {
  meshParams, propagationCode, propagationAnnotations,
  scoringCode, scoringAnnotations,
} from './GossipSubData';

export default function GossipSub({ title }: { title?: string }) {
  return (
    <section id="gossipsub" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? 'GossipSub: 메시 네트워크 & 메시지 전파'}</h2>
      <div className="not-prose mb-8"><GossipMeshViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          GossipSub은 <strong>메시 오버레이</strong>와 <strong>gossip 계층</strong>을
          결합한 pub/sub(발행/구독) 프로토콜입니다.<br />
          메시 피어에게는 전체 메시지를, 비-메시 피어에게는 IHAVE 메타데이터만 전송합니다.<br />
          대역폭과 전파 속도의 균형을 잡습니다.
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-4">
        <h3>메시 파라미터</h3>
      </div>
      <div className="overflow-x-auto mt-3">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="border-b border-border">
              {['파라미터', '기본값', '설명'].map(h => (
                <th key={h} className="text-left py-2 px-3 font-mono text-foreground/50">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {meshParams.map(p => (
              <tr key={p.param} className="border-b border-border/30">
                <td className="py-2 px-3 font-mono font-bold" style={{ color: p.color }}>{p.param}</td>
                <td className="py-2 px-3 font-mono text-foreground/60">{p.value}</td>
                <td className="py-2 px-3 text-foreground/70">{p.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-8">
        <h3>메시지 전파 흐름</h3>
        <CodePanel title="GossipSub 전파 과정" code={propagationCode}
          annotations={propagationAnnotations} />

        <h3>Peer Scoring (v1.1)</h3>
        <p>
          GossipSub v1.1은 피어 점수 시스템으로 Sybil 공격(가짜 노드 대량 생성)과
          메시지 스팸을 방어합니다.<br />
          점수가 임계값 미만이면 메시에서 제외됩니다.
        </p>
        <CodePanel title="Peer Scoring 파라미터" code={scoringCode}
          annotations={scoringAnnotations} />
      </div>
    </section>
  );
}

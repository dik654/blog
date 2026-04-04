import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

const defenses = [
  { name: 'IP 쿼터', target: 'Sybil', mechanism: '같은 /24 서브넷에서 버킷당 2개, 테이블 전체 10개 제한', key: 'add-ip' },
  { name: '2-tier 재검증', target: 'Eclipse / Stale', mechanism: 'fast(~3s) + slow(~9s) PING 검증. 미응답 시 livenessChecks /= 3' },
  { name: '교체 목록', target: 'Eclipse', mechanism: '버킷이 가득 차면 교체 목록에 대기. 기존 노드 죽을 때만 승격', key: 'add-found-node' },
  { name: 'Seed 노드 이중화', target: 'Bootstrap 차단', mechanism: '하드코딩 부트노드 + DB에 저장된 이전 seed (최대 30개, 5일 이내)' },
  { name: '랜덤 Lookup Refresh', target: '라우팅 고착', mechanism: '주기적으로 랜덤 타겟 3회 lookup하여 테이블 갱신' },
  { name: 'ENR 시퀀스 검증', target: 'Replay', mechanism: 'Seq가 기존보다 높을 때만 레코드 갱신. 낮은 Seq는 무시' },
  { name: 'Inbound 초기화 차단', target: 'Ping flood', mechanism: '테이블 초기화 중에는 inbound 노드 추가를 거부' },
];

export default function GethDefense({ onCodeRef }: { onCodeRef?: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="geth-defense" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">go-ethereum 종합 방어 체계</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          go-ethereum은 단일 방어에 의존하지 않는다. 여러 계층이 겹쳐 동작하여 공격 표면을 줄인다.
          <br />
          IP 쿼터가 Sybil을 막고, 재검증이 가짜 노드를 걸러내고, 교체 목록이 Eclipse를 차단한다.
        </p>

        <h3>방어 메커니즘 요약</h3>
        <div className="not-prose overflow-x-auto my-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-border/60">
                <th className="text-left py-2 px-3 text-foreground/70 font-medium">방어</th>
                <th className="text-left py-2 px-3 text-foreground/70 font-medium">대상 공격</th>
                <th className="text-left py-2 px-3 text-foreground/70 font-medium">메커니즘</th>
              </tr>
            </thead>
            <tbody>
              {defenses.map(d => (
                <tr key={d.name} className="border-b border-border/30">
                  <td className="py-2 px-3 font-mono text-xs text-sky-400 whitespace-nowrap">{d.name}</td>
                  <td className="py-2 px-3 text-amber-400/80 text-xs">{d.target}</td>
                  <td className="py-2 px-3 text-foreground/75 text-xs">{d.mechanism}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() => onCodeRef('add-ip', codeRefs['add-ip'])} />
            <span className="text-[10px] text-muted-foreground self-center">addIP()</span>
            <CodeViewButton onClick={() => onCodeRef('distinct-net-set', codeRefs['distinct-net-set'])} />
            <span className="text-[10px] text-muted-foreground self-center">DistinctNetSet</span>
            <CodeViewButton onClick={() => onCodeRef('add-found-node', codeRefs['add-found-node'])} />
            <span className="text-[10px] text-muted-foreground self-center">addFoundNode()</span>
          </div>
        )}

        <h3>Seed 노드 이중화</h3>
        <p>
          최초 부팅 시 하드코딩된 부트노드로 접속한다.
          <br />
          이후 검증된 노드(livenessChecks &gt; 5)를 DB에 저장하고, 재시작 시 이 seed를 먼저 로드한다.
          <br />
          부트노드가 죽어도 이전에 확인한 피어로 네트워크에 복귀할 수 있다.
        </p>

        <h3>ENR 시퀀스 검증</h3>
        <p>
          노드 레코드(ENR)가 갱신될 때 시퀀스 번호가 증가한다.
          <br />
          기존 Seq보다 낮은 레코드는 무시하여, 공격자가 오래된 ENR을 재전송(replay)하는 것을 차단한다.
          <br />
          단, 노드 자신이 직접 보낸 inbound 업데이트는 Seq 관계없이 수락한다.
        </p>
      </div>
    </section>
  );
}

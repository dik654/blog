import CodePanel from '@/components/ui/code-panel';
import Discv4PacketViz from './viz/Discv4PacketViz';
import { packetCode, enrCode, lookupCode, discvComparison } from './Discv4Data';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function Discv4({ title, onCodeRef }: { title?: string; onCodeRef?: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="discv4" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? 'Ethereum discv4 구현'}</h2>
      <div className="not-prose mb-8"><Discv4PacketViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Ethereum — Kademlia 기반 <strong>discv4</strong> 프로토콜로
          P2P 네트워크에서 피어 발견<br />
          표준 Kademlia와 몇 가지 차이점 존재
        </p>

        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() => onCodeRef('geth-v4wire-packets', codeRefs['geth-v4wire-packets'])} />
            <span className="text-[10px] text-muted-foreground self-center">v4wire.go — 패킷 타입</span>
            <CodeViewButton onClick={() => onCodeRef('geth-v4-listen', codeRefs['geth-v4-listen'])} />
            <span className="text-[10px] text-muted-foreground self-center">ListenV4</span>
          </div>
        )}

        <h3>discv4 패킷 구조</h3>
        <CodePanel title="discv4 UDP 패킷 구조" code={packetCode} annotations={[
          { lines: [4, 11], color: 'sky', note: '6가지 패킷 타입' },
          { lines: [14, 19], color: 'emerald', note: 'Ping 패킷 — ENR 시퀀스 포함' },
        ]} />

        <h3>ENR (Ethereum Node Record)</h3>
        <p>
          ENR(Ethereum Node Record) — 노드의 네트워크 주소, 프로토콜 버전,
          공개키 등을 담은 자기서명 레코드 (EIP-778)
        </p>
        <CodePanel title="ENR (Ethereum Node Record)" code={enrCode} annotations={[
          { lines: [4, 9], color: 'sky', note: '필수 키-값 쌍' },
          { lines: [11, 11], color: 'emerald', note: 'Node ID = keccak256(pubkey)' },
        ]} />

        <h3>Lookup 파이프라인</h3>
        <p>
          discv4 — 표준 Kademlia 반복 조회를 약간 변형<br />
          FindNode에서 공개키(압축 33바이트)를 목표로 사용<br />
          Neighbors 응답으로 가장 가까운 k=16개 관리
        </p>
        <CodePanel title="discv4 Lookup 파이프라인" code={lookupCode} annotations={[
          { lines: [3, 4], color: 'sky', note: '로컬 테이블에서 초기 후보 선택' },
          { lines: [8, 9], color: 'emerald', note: '동시 3개 FIND_NODE 질의' },
          { lines: [18, 19], color: 'amber', note: 'ENR 검증 후 결과에 삽입' },
        ]} />

        <h3>discv5 (개선 버전)</h3>
        <p>
          discv5 — discv4를 대체하는 차세대 프로토콜<br />
          AES-GCM 암호화, Topic Advertisement(서비스 광고), 더 큰 ENR 지원 추가<br />
          현재 Ethereum 메인넷에서 discv4/discv5 병용 중
        </p>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
          {discvComparison.map(col => (
            <div key={col.label} className="rounded-lg border border-border/60 p-3">
              <p className="font-mono font-bold text-sm text-indigo-400 mb-2">{col.label}</p>
              <ul className="text-sm space-y-1 text-foreground/80">
                {col.items.map(i => <li key={i} className="flex gap-1.5"><span className="text-foreground/40">•</span>{i}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

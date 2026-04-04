import StoreCommitViz from './viz/StoreCommitViz';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

const CELL = 'border border-border px-4 py-2';

export default function StateManagement({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const open = (key: string) => onCodeRef(key, codeRefs[key]);
  return (
    <section id="state-management" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">상태 관리 — MultiStore & IAVL Tree</h2>
      <div className="not-prose mb-8">
        <StoreCommitViz onOpenCode={open} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          rootmulti.Store — 모듈별 독립 IAVL 트리를 통합 관리<br />
          Commit 시 모든 서브스토어 해시를 Merkle 합산 → <strong>app_hash</strong> (이더리움 stateRoot 대응)
        </p>
        <div className="not-prose flex flex-wrap gap-2 my-4">
          <CodeViewButton onClick={() => open('rootmulti-struct')} />
          <span className="text-[10px] text-muted-foreground self-center">rootmulti.Store struct</span>
          <CodeViewButton onClick={() => open('rootmulti-commit')} />
          <span className="text-[10px] text-muted-foreground self-center">Store.Commit()</span>
          <CodeViewButton onClick={() => open('commit')} />
          <span className="text-[10px] text-muted-foreground self-center">BaseApp.Commit()</span>
        </div>
        <h3 className="text-xl font-semibold mt-6 mb-3">이더리움 MPT vs Cosmos IAVL 비교</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className={`${CELL} text-left`}>속성</th>
                <th className={`${CELL} text-left`}>이더리움 MPT</th>
                <th className={`${CELL} text-left`}>Cosmos IAVL+</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map(r => (
                <tr key={r.attr}>
                  <td className={`${CELL} font-medium`}>{r.attr}</td>
                  <td className={CELL}>{r.eth}</td>
                  <td className={CELL}>{r.cosmos}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          💡 <strong>모듈별 독립 증명</strong> — IBC에서 특정 모듈 상태만 Merkle 증명 가능<br />
          이더리움은 단일 MPT에서 전체 계정 상태를 증명해야 함
        </p>
      </div>
    </section>
  );
}

const ROWS = [
  { attr: '트리 구조', eth: '16-ary Patricia Trie', cosmos: 'Self-balancing AVL Tree' },
  { attr: '해시 함수', eth: 'Keccak-256', cosmos: 'SHA-256' },
  { attr: '증명', eth: 'Merkle-Patricia Proof', cosmos: 'IAVL Existence/Absence Proof' },
  { attr: '버전 관리', eth: '상태 루트 히스토리', cosmos: '불변 버전 스냅샷' },
  { attr: '커밋 해시', eth: 'stateRoot (블록 헤더)', cosmos: 'app_hash (블록 헤더)' },
];

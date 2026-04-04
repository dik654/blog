import StateModelViz from './viz/StateModelViz';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function StateModel({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="state-model" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">상태 모델: 어카운트 & 트라이</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          이더리움은 어카운트 기반(account-based) 상태 모델
          — UTXO와 달리 각 주소가 잔액과 스토리지를 직접 보유
          <br />
          전체 상태는 <a href="/blockchain/merkle-patricia-trie" className="text-indigo-400 hover:underline">Modified Merkle Patricia Trie(MPT)</a>로 구조화
        </p>
      </div>
      <div className="not-prose">
        <StateModelViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
    </section>
  );
}

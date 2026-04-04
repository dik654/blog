import type { CodeRef } from '@/components/code/types';

export default function Forge({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="forge" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Forge: IPFS 호환 warm storage</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          Storacha의 핫스토리지 서비스 레이어. $5.99/TB 가격.<br />
          봉인하지 않아서 즉시 리트리벌 가능. 기존 IPFS 피닝 서비스의 탈중앙 대안
        </p>
      </div>
    </section>
  );
}

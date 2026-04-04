import TransactionEVMViz from './viz/TransactionEVMViz';

export default function TransactionEVM({ title }: { title?: string }) {
  return (
    <section id="transaction-evm" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? '트랜잭션 & EVM 실행'}</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          트랜잭션이 네트워크에 도착해 MDBX에 영구 저장되기까지의 reth 내부 흐름입니다.<br />
          각 단계에서 어떤 데이터가 어떻게 변환되는지, 그리고 reth가 왜 이 구조를 선택했는지 살펴봅니다.
        </p>
      </div>
      <TransactionEVMViz />
    </section>
  );
}

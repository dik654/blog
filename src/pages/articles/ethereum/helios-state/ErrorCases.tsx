export default function ErrorCases({ title }: { title: string }) {
  return (
    <section id="error-cases" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          상태 증명은 3가지 지점에서 실패할 수 있다.
          <br />
          증명 누락, Merkle 불일치, RLP 디코딩 실패.
        </p>
        <p className="leading-7">
          증명 누락은 RPC가 존재하지 않는 주소의 증명을 거부할 때 발생한다.
          <br />
          Merkle 불일치는 RPC가 위변조된 증명을 보냈을 때 감지된다.
        </p>
        <p className="leading-7">
          <strong>💡 Reth vs Helios:</strong> Reth는 로컬 DB 조회이므로 증명 에러가 없다.
          <br />
          Helios는 원격 RPC 의존이므로 증명 검증이 보안의 핵심이다.
        </p>
      </div>
    </section>
  );
}

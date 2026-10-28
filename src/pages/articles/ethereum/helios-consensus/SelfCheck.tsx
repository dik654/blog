export default function SelfCheck() {
  return (
    <section id="self-check" className="mb-16 scroll-mt-20 border-y border-border py-6">
      <h2 className="text-2xl font-bold">확인 질문</h2>
      <ol className="mt-5 space-y-3 text-sm leading-7">
        <li>1. 참여 bit가 342개여도 branch 검사를 생략할 수 없는 이유는 무엇입니까? <span className="text-muted-foreground">(답: 검증 순서)</span></li>
        <li>2. Signature slot 8,193을 K0가 아니라 K1로 검증하는 이유는 무엇입니까? <span className="text-muted-foreground">(답: Committee period와 핸드오프)</span></li>
        <li>3. 이 구현에서 update 적용이 process restart 뒤 복구까지 보장하지 않는 이유는 무엇입니까? <span className="text-muted-foreground">(답: Sync loop)</span></li>
      </ol>
    </section>
  );
}

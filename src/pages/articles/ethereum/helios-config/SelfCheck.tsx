export default function SelfCheck() {
  return (
    <section id="self-check" className="mb-16 scroll-mt-20 border-y border-border py-6">
      <h2 className="text-2xl font-bold">확인 질문</h2>
      <ol className="mt-5 space-y-3 text-sm leading-7">
        <li>1. Base 8,545·TOML 9,545·CLI 10,545 중 어떤 값이 남으며, source 기록은 누가 추가해야 합니까? <span className="text-muted-foreground">(답: 시작 계약)</span></li>
        <li>2. JSON-RPC socket이 열려도 Service에 바로 넣으면 안 되는 이유는 무엇입니까? <span className="text-muted-foreground">(답: Socket과 readiness)</span></li>
        <li>3. 오래된 checkpoint가 strict=false에서 자동 거절되지 않는 경로를 설명할 수 있습니까? <span className="text-muted-foreground">(답: Checkpoint와 복구)</span></li>
        <li>4. 외부 fallback의 최다 root가 protocol trust가 아닌 이유는 무엇입니까? <span className="text-muted-foreground">(답: Fallback의 실제 조건)</span></li>
        <li>5. Candidate 실패 뒤 어떤 artifact로 이전 revision에 돌아가고 재진입을 확인합니까? <span className="text-muted-foreground">(답: 결정과 재검토)</span></li>
      </ol>
    </section>
  );
}

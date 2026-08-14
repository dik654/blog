const Card = ({ title, meta }: { title: string; meta: string }) => <div className="min-w-0 rounded-lg border border-border bg-background p-3"><p className="text-sm font-bold">{title}</p><p className="mt-1 break-words text-xs leading-5 text-muted-foreground">{meta}</p></div>;

export function StorachaReceiptViz() {
  return (
    <figure data-viz="storacha-effect-chain" className="not-prose rounded-xl border border-border bg-card p-4 sm:p-6">
      <figcaption className="mb-5"><p className="text-sm font-bold">Upload 요청 하나의 capability·effect·index receipt chain</p><p className="mt-1 text-xs leading-5 text-muted-foreground">앞 단계의 receipt가 다음 단계 입력과 같은 digest를 가리켜야 하며, upload receipt 하나만으로 public retrieval이나 Filecoin deal 완료를 주장하지 않습니다.</p></figcaption>
      <div className="grid min-w-0 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <Card title="Space UCAN" meta="resource · ability · caveats" />
        <Card title="allocate" meta="space quota와 blob digest" />
        <Card title="put" meta="blob bytes 전송 결과" />
        <Card title="accept" meta="service-side effect receipt" />
        <Card title="DAG index" meta="root CID → shard·offset" />
      </div>
    </figure>
  );
}

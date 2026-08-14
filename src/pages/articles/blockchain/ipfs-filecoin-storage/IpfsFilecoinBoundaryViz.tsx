const Box = ({ title, text }: { title: string; text: string }) => <div className="min-w-0 rounded-lg border border-border bg-background p-4"><p className="text-sm font-bold">{title}</p><p className="mt-2 text-xs leading-5 text-muted-foreground">{text}</p></div>;

export function IpfsFilecoinBoundaryViz() {
  return (
    <figure data-viz="ipfs-filecoin-boundaries" className="not-prose rounded-xl border border-border bg-card p-4 sm:p-6">
      <figcaption className="mb-5"><p className="text-sm font-bold">같은 파일, 서로 다른 네 개의 영수증</p><p className="mt-1 text-xs leading-5 text-muted-foreground">Root CID, CAR/Piece commitment, deal·proof, retrieval 결과는 연결되지만 같은 identifier도 같은 보장도 아닙니다.</p></figcaption>
      <div className="grid min-w-0 gap-3 md:grid-cols-2">
        <Box title="01 · Content identity" text="UnixFS DAG root CID와 exact bytes·codec을 고정합니다." />
        <Box title="02 · Storage artifact" text="CAR shard와 PieceCID/CommP의 mapping manifest를 만듭니다." />
        <Box title="03 · Retention evidence" text="Deal lifecycle와 PoRep·PoSt receipt를 별도로 기록합니다." />
        <Box title="04 · Retrieval evidence" text="Provider 후보, transfer path, CID 재검증과 latency를 기록합니다." />
      </div>
    </figure>
  );
}

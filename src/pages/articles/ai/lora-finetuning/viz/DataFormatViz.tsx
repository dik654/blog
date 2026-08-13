const tokens = [
  ["<system>", "너는 사내 규정을 답한다", "0", "context"],
  ["<user>", "환불 기한은?", "0", "context"],
  ["<assistant>", "결제 후 7일입니다", "1", "loss"],
  ["<eos>", "turn 종료", "1", "loss"],
] as const;

export default function DataFormatViz() {
  return (
    <figure data-viz className="rounded-xl border border-border bg-background p-4 sm:p-5">
      <figcaption><p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">Token-level training receipt</p><p className="mt-1 font-semibold">원본 JSON이 아니라 template 적용 뒤 token과 loss mask를 검수합니다</p></figcaption>
      <div className="mt-5 overflow-hidden rounded-lg border border-border"><div className="grid grid-cols-[5.5rem_1fr_3rem_4rem] gap-2 border-b border-border bg-muted/30 px-3 py-2 text-xs font-semibold text-muted-foreground"><span>Role token</span><span>Content</span><span>Mask</span><span>Use</span></div><div className="divide-y divide-border">{tokens.map(([role,content,mask,use])=><div key={role} className="grid grid-cols-[5.5rem_1fr_3rem_4rem] gap-2 px-3 py-3 text-xs"><span className="break-all font-mono">{role}</span><span className="text-muted-foreground">{content}</span><span className="font-mono">{mask}</span><span>{use}</span></div>)}</div></div>
      <p className="mt-4 text-xs leading-5 text-muted-foreground">실제 구현에서는 token별 배열로 확인하며, multi-turn·tool call·packing·truncation에서도 동일한 경계를 유지합니다.</p>
    </figure>
  );
}

export default function MsgsList({ msgs }: { msgs: string[] }) {
  return (
    <div className="rounded border bg-background/95 p-1.5 space-y-0.5 w-full shadow-sm z-10">
      {msgs.map(m => <p key={m} className="text-[9px] font-mono text-foreground/80 leading-relaxed">{m}</p>)}
    </div>
  );
}

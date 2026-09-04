export function IcicleRuntimeViz() {
  return (
    <figure className="not-prose my-8 rounded-xl border border-border bg-background p-4 sm:p-6">
      <figcaption className="mb-5">
        <p className="text-sm font-bold">한 primitive call이 backend 구현을 찾는 경로</p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">
            공통 API가 수학·memory·stream 계약을 없애지 않고 같은 호출 경계로 모읍니다.
          </p>
      </figcaption>
      <div className="grid min-w-0 gap-3 md:grid-cols-[1fr_1.2fr_1fr]">
        <div className="min-w-0 rounded-lg border border-border bg-muted/20 p-4"><p className="text-xs font-bold text-primary">Caller</p><p className="mt-2 break-words text-sm font-semibold">MSM · NTT · Poseidon</p><p className="mt-1 text-xs leading-5 text-muted-foreground">typed config + slices + stream</p></div>
        <div className="min-w-0 rounded-lg border border-border bg-muted/20 p-4"><p className="text-xs font-bold text-primary">ICICLE runtime</p><p className="mt-2 break-words text-sm font-semibold">active device + registry lookup</p><p className="mt-1 text-xs leading-5 text-muted-foreground">device type · primitive · field/curve</p></div>
        <div className="grid min-w-0 gap-2">
          {["CPU backend", "CUDA backend", "custom backend"].map((name) => <div key={name} className="min-w-0 rounded-lg border border-border bg-background px-3 py-2 text-xs font-semibold">{name}</div>)}
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2 text-[11px] text-muted-foreground"><span className="rounded-md border border-border px-2 py-1">device-owned pointer</span><span className="rounded-md border border-border px-2 py-1">stream completion</span><span className="rounded-md border border-border px-2 py-1">explicit unsupported error</span></div>
    </figure>
  );
}

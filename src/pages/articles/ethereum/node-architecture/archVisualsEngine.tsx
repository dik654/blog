export { EvmExecution, EngineResponse } from './archVisualsEngineParts';

export function JwtSharedSecret() {
  return (
    <div className="flex items-center justify-between gap-3 text-[10px]">
      <div className="rounded-lg border-2 border-blue-300 bg-blue-50/60 dark:bg-blue-950/20 px-3 py-2 text-center shrink-0">
        <p className="font-bold">Lighthouse</p>
        <p className="text-blue-600 text-[9px]">CL</p>
      </div>
      <div className="flex-1 flex flex-col items-center gap-1">
        <div className="rounded-md border border-amber-300 bg-amber-50 dark:bg-amber-950/30 px-3 py-1.5 w-full text-center">
          <p className="font-mono text-amber-700 dark:text-amber-400">🔑 jwt.hex</p>
          <p className="text-[9px] text-foreground/75 mt-0.5">공유 시크릿 (양쪽 동일 파일)</p>
        </div>
        <div className="flex items-center gap-1 text-[9px] text-foreground/75">
          <span className="text-emerald-500">←</span> read <span className="text-emerald-500">→</span>
        </div>
      </div>
      <div className="rounded-lg border-2 border-orange-300 bg-orange-50/60 dark:bg-orange-950/20 px-3 py-2 text-center shrink-0">
        <p className="font-bold">Reth</p>
        <p className="text-orange-600 text-[9px]">EL</p>
      </div>
    </div>
  );
}

export function JwtHttpPost() {
  return (
    <div className="rounded-lg border overflow-hidden font-mono text-[10px]">
      <div className="px-3 py-1.5 flex gap-2 items-center border-b border-border/40">
        <span className="text-blue-600 font-bold">POST</span>
        <span className="">http://127.0.0.1:8551</span>
      </div>
      <div className="px-3 py-2 space-y-0.5">
        <p className="text-amber-600">Authorization: Bearer eyJhbGci...</p>
        <p className="">Content-Type: application/json</p>
        <div className="border-t border-border/50 pt-1 mt-1">
          <p><span className="">method: </span>
          <span className="text-blue-600">engine_newPayloadV3</span></p>
        </div>
      </div>
    </div>
  );
}

export function JwtVerify() {
  return (
    <div className="space-y-1.5 text-[10px] font-mono">
      <div className="rounded border px-3 py-2 space-y-0.5">
        <p><span className="">iat: </span>1700000000
          <span className="text-foreground/75 ml-2">(JWT 발행 시각)</span></p>
        <p><span className="">now: </span>1700000003
          <span className="text-foreground/75 ml-2">(EL 수신 시각)</span></p>
        <p><span className="">diff: </span>
          <span className="text-emerald-600 font-bold">3s</span>
          <span className="text-emerald-600 ml-1">≤ 5s → ✓ accept</span></p>
      </div>
      <div className="grid grid-cols-2 gap-1.5 font-sans">
        <div className="rounded border border-emerald-300 bg-emerald-50/60 dark:bg-emerald-950/20 px-2 py-1">
          <p className="text-emerald-700 dark:text-emerald-300">|diff| ≤ 5s → accept</p>
        </div>
        <div className="rounded border border-red-300 bg-red-50/60 dark:bg-red-950/20 px-2 py-1">
          <p className="text-red-700 dark:text-red-300">|diff| &gt; 5s → reject</p>
        </div>
      </div>
    </div>
  );
}

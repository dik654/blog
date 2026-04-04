import { useState, useEffect } from 'react';

// step 0: JSON-RPC 요청 파싱
export function RpcParse() {
  return (
    <div className="rounded border px-3 py-2 font-mono text-[10px] space-y-0.5">
      <p className="text-[9px] text-foreground/75">HTTP POST · application/json</p>
      <div className="border-t border-border/50 pt-1 mt-1 space-y-0.5">
        <p><span className="">method: </span><span className="text-blue-600 font-bold">eth_call</span></p>
        <p><span className="">params: </span><span className="text-amber-600">[{'{to, data}'}, "latest"]</span></p>
        <p><span className="">id: </span><span>1</span></p>
      </div>
    </div>
  );
}

// step 1: 3계층 Storage 순서 탐색
export function RpcStorageLookup() {
  const tiers = [
    { label: 'CanonicalInMemoryState', note: 'RAM', cls: 'border-emerald-300 bg-emerald-50/60 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400' },
    { label: 'DatabaseProvider (MDBX)', note: 'disk', cls: 'border-blue-300 bg-blue-50/60 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400' },
    { label: 'StaticFileProvider', note: 'mmap', cls: 'border-purple-300 bg-purple-50/60 dark:bg-purple-950/20 text-purple-700 dark:text-purple-400' },
  ];
  const [active, setActive] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setActive(p => (p + 1) % (tiers.length + 1)), 800);
    return () => clearInterval(id);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div className="space-y-1 text-[10px]">
      <p className="font-mono text-[9px] text-foreground/75">상태 조회 순서 (찾으면 즉시 반환)</p>
      {tiers.map((t, i) => (
        <div key={t.label} className={`flex items-center gap-2 rounded px-2 py-1 border-2 transition-all duration-400
          ${i === active ? t.cls : 'border-border opacity-30'}`}>
          <span className="font-bold text-[9px]">{i + 1}</span>
          <span className="text-[9px]">{t.label}</span>
          <span className="text-[8px] text-foreground/75 ml-auto">{t.note}</span>
          {i === active && <span className="text-[9px]">← 탐색 중</span>}
        </div>
      ))}
    </div>
  );
}

// step 2: EVM 시뮬레이션 (상태 변경 없음)
export function RpcEvmSim() {
  return (
    <div className="space-y-1.5 text-[10px]">
      <div className="rounded border border-blue-300 bg-blue-50/60 dark:bg-blue-950/20 px-3 py-2 text-[9px]">
        <p className="font-bold text-blue-700 dark:text-blue-400">eth_call = "실제로 보내지 않고 결과만 미리 확인"</p>
        <p className="text-foreground/75 mt-0.5">실제 tx를 블록에 포함시키지 않으므로 블록체인 상태가 바뀌면 안 됨</p>
      </div>
      <div className="grid grid-cols-2 gap-1.5 text-[9px]">
        <div className="rounded border border-emerald-300 bg-emerald-50/60 dark:bg-emerald-950/20 px-2 py-1 text-emerald-700 dark:text-emerald-400">잔액·코드 읽기 ✓</div>
        <div className="rounded border border-red-200 bg-red-50/60 dark:bg-red-950/20 px-2 py-1 text-red-600 dark:text-red-400">잔액 변경 불가 ✗</div>
      </div>
    </div>
  );
}

// step 3: JSON 결과 직렬화 + 응답
export function RpcResponse() {
  return (
    <div className="rounded border px-3 py-2 font-mono text-[10px] space-y-0.5">
      <p className="text-[9px] text-foreground/75">HTTP 200 OK · application/json</p>
      <div className="border-t border-border/50 pt-1 mt-1 space-y-0.5">
        <p><span className="">id: </span><span>1</span></p>
        <p><span className="">jsonrpc: </span><span>"2.0"</span></p>
        <p><span className="">result: </span><span className="text-emerald-600 font-bold">"0x0000…1234"</span></p>
      </div>
    </div>
  );
}

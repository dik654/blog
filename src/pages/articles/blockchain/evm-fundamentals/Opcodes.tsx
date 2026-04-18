import OpcodeViz from './viz/OpcodeViz';
import EVMComponentsViz from './viz/EVMComponentsViz';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function Opcodes({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="opcodes" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">EVM 구성요소 & 오피코드</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          EVM은 PC, Stack, Memory(휘발성)와 Storage(영구) 네 영역에서 동작
          <br />
          오피코드 1바이트(0x00~0xFF) — 가스 비용은 자원 사용량에 비례
          <br />
          <span className="text-xs text-muted-foreground">각 구성요소를 클릭하면 geth 소스 코드를 볼 수 있습니다</span>
        </p>
      </div>
      <div className="not-prose mb-8">
        <EVMComponentsViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
      <div className="not-prose mb-8">
        <OpcodeViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          산술(ADD) — pop+peek 패턴으로 메모리 할당 0회, in-place 연산
          <br />
          스토리지(SLOAD/SSTORE) — StateDB 접근, cold 2100 / warm 100 gas (EIP-2929)
        </p>
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('op-add', codeRefs['op-add'])} />
          <span className="text-[10px] text-muted-foreground self-center">opAdd() 산술</span>
          <CodeViewButton onClick={() => onCodeRef('op-sload', codeRefs['op-sload'])} />
          <span className="text-[10px] text-muted-foreground self-center">opSload/Sstore 저장소</span>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">EIP-2929 — Gas Cost 재편</h3>
        <p className="text-sm text-muted-foreground mb-3">
          Berlin hard fork (2021) — storage access DoS 방어 목적
        </p>

        <h4 className="text-lg font-semibold mt-4 mb-2">이전 가격 vs EIP-2929</h4>
        <div className="overflow-x-auto not-prose mb-4">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">Opcode</th>
                <th className="border border-border px-3 py-2 text-left">이전</th>
                <th className="border border-border px-3 py-2 text-left">Cold (첫 접근)</th>
                <th className="border border-border px-3 py-2 text-left">Warm (재접근)</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className="border border-border px-3 py-2"><code className="text-xs">SLOAD</code></td><td className="border border-border px-3 py-2">800</td><td className="border border-border px-3 py-2 font-semibold">2100</td><td className="border border-border px-3 py-2">100</td></tr>
              <tr><td className="border border-border px-3 py-2"><code className="text-xs">BALANCE</code></td><td className="border border-border px-3 py-2">700</td><td className="border border-border px-3 py-2 font-semibold">2600</td><td className="border border-border px-3 py-2">100</td></tr>
              <tr><td className="border border-border px-3 py-2"><code className="text-xs">EXTCODESIZE</code> / <code className="text-xs">EXTCODECOPY</code> / <code className="text-xs">EXTCODEHASH</code></td><td className="border border-border px-3 py-2">700</td><td className="border border-border px-3 py-2 font-semibold">2600</td><td className="border border-border px-3 py-2">100</td></tr>
              <tr><td className="border border-border px-3 py-2"><code className="text-xs">CALL</code> family</td><td className="border border-border px-3 py-2">700</td><td className="border border-border px-3 py-2 font-semibold">base + cold</td><td className="border border-border px-3 py-2">base + warm</td></tr>
              <tr><td className="border border-border px-3 py-2"><code className="text-xs">SELFDESTRUCT</code></td><td className="border border-border px-3 py-2">-</td><td className="border border-border px-3 py-2 font-semibold">+5000 추가</td><td className="border border-border px-3 py-2">-</td></tr>
            </tbody>
          </table>
        </div>

        <p className="text-sm text-muted-foreground mb-3">
          배경: 2016 DoS 공격 &mdash; 1 tx에 수천 <code className="text-xs bg-muted px-1 py-0.5 rounded">SLOAD</code> 호출로 체인 정지
        </p>

        <h4 className="text-lg font-semibold mt-4 mb-2">Access List 추적</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 not-prose mb-4">
          <div className="bg-muted rounded-lg p-4">
            <p className="font-semibold text-sm mb-1"><code className="text-xs">accounts</code></p>
            <p className="text-sm text-muted-foreground">Set&lt;Address&gt; &mdash; 접근한 어카운트 집합</p>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <p className="font-semibold text-sm mb-1"><code className="text-xs">storageKeys</code></p>
            <p className="text-sm text-muted-foreground">Set&lt;(Address, StorageKey)&gt; &mdash; 접근한 슬롯 집합</p>
          </div>
        </div>

        <h4 className="text-lg font-semibold mt-4 mb-2">Warm 조건</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 not-prose mb-4">
          <div className="bg-muted rounded-lg p-4">
            <p className="font-semibold text-sm mb-1">tx 내 touched</p>
            <p className="text-sm text-muted-foreground">Account가 이미 접근됨</p>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <p className="font-semibold text-sm mb-1">slot accessed</p>
            <p className="text-sm text-muted-foreground">Storage slot이 이미 읽힘</p>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <p className="font-semibold text-sm mb-1">EIP-2930 선언</p>
            <p className="text-sm text-muted-foreground">access list에 미리 등록하여 pre-warm</p>
          </div>
        </div>

        <h4 className="text-lg font-semibold mt-4 mb-2">영향</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 not-prose mb-4">
          <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4">
            <p className="font-semibold text-sm mb-1">Gas 예측 가능</p>
            <p className="text-sm text-muted-foreground">cold/warm 이분법으로 비용 명확</p>
          </div>
          <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4">
            <p className="font-semibold text-sm mb-1">DoS 비용 증가</p>
            <p className="text-sm text-muted-foreground">cold access 비용 대폭 상승</p>
          </div>
          <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4">
            <p className="font-semibold text-sm mb-1">Pre-warm 가능</p>
            <p className="text-sm text-muted-foreground">EIP-2930 access list tx</p>
          </div>
        </div>

      </div>
    </section>
  );
}

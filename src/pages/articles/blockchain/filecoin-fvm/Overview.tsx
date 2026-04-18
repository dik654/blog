import ContextViz from './viz/ContextViz';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function Overview({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">FVM 아키텍처</h2>
      <div className="not-prose mb-8"><ContextViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('fvm-machine', codeRefs['fvm-machine'])} />
          <span className="text-[10px] text-muted-foreground self-center">fvm.rs — FVM Machine</span>
        </div>
        <p>
          FVM은 WASM 기반 가상 머신. wasmtime 런타임 위에서 Actor를 실행.<br />
          EVM 호환(FEVM)으로 Solidity 컨트랙트를 배포하고 스토리지 딜을 프로그래밍 가능
        </p>
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>💡 EVM 위에 Solidity로 스토리지 딜 프로그래밍</strong> — FEVM 덕분에<br />
          이더리움 개발자가 Filecoin 위에서 DeFi + 스토리지를 결합한 dApp을 만들 수 있음
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">FVM Architecture 상세</h3>

        <div className="not-prose rounded-lg border bg-card p-4 mb-4">
          <h4 className="font-semibold text-sm mb-3">레이어 스택</h4>
          <div className="flex flex-wrap items-center gap-1 text-xs">
            <span className="rounded bg-muted px-2 py-1">Application (Solidity, Rust, ...)</span>
            <span className="text-muted-foreground">→</span>
            <span className="rounded bg-muted px-2 py-1">FEVM / FVM native</span>
            <span className="text-muted-foreground">→</span>
            <span className="rounded bg-muted px-2 py-1">WASM bytecode</span>
            <span className="text-muted-foreground">→</span>
            <span className="rounded bg-muted px-2 py-1">wasmtime runtime</span>
            <span className="text-muted-foreground">→</span>
            <span className="rounded bg-muted px-2 py-1">Host syscalls (<code>ipld_get</code>, <code>ipld_put</code>)</span>
            <span className="text-muted-foreground">→</span>
            <span className="rounded bg-muted px-2 py-1">StateTree (HAMT)</span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            2022 FVM v1 → 2023 FEVM (Ethereum compat) → 2024 mature ecosystem → 2025+ production DeFi
          </p>
        </div>

        <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">EVM과의 차이</h4>
            <ul className="text-xs space-y-1 list-disc list-inside">
              <li><strong>바이트코드</strong> — WASM (EVM 아님)</li>
              <li><strong>상태 구조</strong> — HAMT (MPT 아님)</li>
              <li><strong>주소 체계</strong> — 5종: ID, BLS, Secp, Actor, Delegated</li>
              <li><strong>네이티브 토큰</strong> — FIL only</li>
              <li><strong>가스 가격</strong> — 별도 가격 모델</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">FEVM (EVM on FVM)</h4>
            <ul className="text-xs space-y-1 list-disc list-inside">
              <li>Solidity 컨트랙트 지원</li>
              <li>MetaMask 호환 + <code>eth-rpc</code> API</li>
              <li>ETH 주소 (Delegated <code>f4</code>)</li>
              <li>도구: Hardhat, Foundry, Remix</li>
            </ul>
          </div>
        </div>

        <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">FEVM Use Cases</h4>
            <ul className="text-xs space-y-1 list-disc list-inside">
              <li>Ethereum DeFi를 Filecoin으로 이식</li>
              <li>스토리지 인식 스마트 컨트랙트</li>
              <li>Filecoin 스토리지 기반 NFT 마켓</li>
              <li>Data DAO / 리트리벌 마켓</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">FVM Native &amp; 지원 언어</h4>
            <p className="text-xs text-muted-foreground mb-1">ref-fvm: Rust 구현, Actor를 WASM으로 컴파일. EVM보다 강력한 direct syscall + 커스텀 암호화</p>
            <ul className="text-xs space-y-0.5 list-disc list-inside">
              <li><strong>Rust</strong> — primary (native)</li>
              <li><strong>Solidity</strong> — via FEVM</li>
              <li>AssemblyScript / C/C++ (via WASM) / Go (experimental)</li>
            </ul>
          </div>
        </div>
        <p className="leading-7">
          FVM: <strong>WASM-based + IPLD state + FEVM compat</strong>.<br />
          FEVM으로 Solidity 지원 — Ethereum tooling 호환.<br />
          2022 v1 → 2023 FEVM → 2024 mature ecosystem.
        </p>
      </div>
    </section>
  );
}

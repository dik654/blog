import ContextViz from './viz/ContextViz';
import type { CodeRef } from '@/components/code/types';

export default function Overview({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">플랫폼 개요</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          Filecoin Onchain Cloud — PDP + 측정 가능 리트리벌 + 온체인 정산을 통합한 플랫폼.<br />
          "AWS S3의 탈중앙 버전"을 목표 — 검증 가능하고 검열 불가
        </p>
      </div>
      <div className="not-prose"><ContextViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Onchain Cloud Platform 상세</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose mb-6">
          <div className="bg-muted rounded-lg p-4">
            <h4 className="font-semibold text-sm mb-2">1. PDP (Proof of Data Possession)</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>hot storage verification</li>
              <li>continuous proofs + accountability</li>
            </ul>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <h4 className="font-semibold text-sm mb-2">2. Measured Retrieval</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>bandwidth tracking</li>
              <li>pay-per-access + SLA enforcement</li>
            </ul>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <h4 className="font-semibold text-sm mb-2">3. On-chain Settlement</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>FVM smart contracts</li>
              <li>automatic payments + verifiable SLA</li>
            </ul>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <h4 className="font-semibold text-sm mb-2">4. Identity &amp; Access</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>UCAN authorization</li>
              <li>decentralized keys + capability-based</li>
            </ul>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose mb-6">
          <div className="bg-muted rounded-lg p-4">
            <h4 className="font-semibold text-sm mb-2">AWS S3 vs Onchain Cloud</h4>
            <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
              <div>
                <p className="font-medium text-foreground text-xs mb-1">AWS S3</p>
                <ul className="space-y-0.5 text-xs">
                  <li>centralized (Amazon)</li>
                  <li>no verifiability</li>
                  <li>trust required</li>
                  <li>proprietary APIs</li>
                </ul>
              </div>
              <div>
                <p className="font-medium text-foreground text-xs mb-1">Onchain Cloud</p>
                <ul className="space-y-0.5 text-xs">
                  <li>decentralized (Filecoin)</li>
                  <li>cryptographic proofs</li>
                  <li>trustless</li>
                  <li>open standards</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <h4 className="font-semibold text-sm mb-2">Use Cases</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>enterprise data, compliance storage</li>
              <li>audit trails, cross-border data</li>
              <li>censorship-resistant archives</li>
              <li>Web3 dApps</li>
            </ul>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 not-prose mb-6">
          <div className="bg-muted rounded-lg p-4">
            <h4 className="font-semibold text-sm mb-2">Pricing Model</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>storage: per GiB/epoch</li>
              <li>retrieval: per GiB</li>
              <li>operations: per call</li>
              <li>FIL currency, 자동 과금</li>
            </ul>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <h4 className="font-semibold text-sm mb-2">FIL+ Integration</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>verified datacap</li>
              <li>10x reward multiplier</li>
              <li>notary system</li>
            </ul>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <h4 className="font-semibold text-sm mb-2">Development</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>2024 Q1: specifications</li>
              <li>2024 H2: testnet</li>
              <li>2025: mainnet</li>
            </ul>
          </div>
        </div>
        <p className="leading-7">
          Onchain Cloud: <strong>PDP + measured retrieval + on-chain settlement</strong>.<br />
          AWS S3 탈중앙 버전, 2024 testnet, 2025 mainnet.<br />
          verifiable + censorship-resistant + FIL-native.
        </p>
      </div>
    </section>
  );
}

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
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Filecoin Onchain Cloud:

// Components:
// 1. PDP (Proof of Data Possession):
//    - hot storage verification
//    - continuous proofs
//    - accountability
//
// 2. Measured Retrieval:
//    - bandwidth tracking
//    - pay-per-access
//    - SLA enforcement
//
// 3. On-chain Settlement:
//    - FVM smart contracts
//    - automatic payments
//    - verifiable SLA
//
// 4. Identity & Access:
//    - UCAN authorization
//    - decentralized keys
//    - capability-based security

// Target: "AWS S3 탈중앙 버전"
// - verifiable storage
// - censorship-resistant
// - enterprise-ready
// - crypto-native payments

// Comparison:
// AWS S3:
// - centralized (Amazon)
// - no verifiability
// - trust required
// - proprietary APIs
//
// Onchain Cloud:
// - decentralized (Filecoin)
// - cryptographic proofs
// - trustless
// - open standards

// Use cases:
// - enterprise data
// - compliance storage
// - audit trails
// - cross-border data
// - censorship-resistant archives
// - Web3 dApps

// Pricing model:
// - storage: per GiB/epoch
// - retrieval: per GiB
// - operations: per call
// - automated billing
// - FIL currency

// FIL+ integration:
// - verified datacap
// - 10x reward multiplier
// - notary system
// - public benefit

// Development:
// - 2024 Q1: specifications
// - 2024 H2: testnet
// - 2025: mainnet
// - ecosystem growing`}
        </pre>
        <p className="leading-7">
          Onchain Cloud: <strong>PDP + measured retrieval + on-chain settlement</strong>.<br />
          AWS S3 탈중앙 버전, 2024 testnet, 2025 mainnet.<br />
          verifiable + censorship-resistant + FIL-native.
        </p>
      </div>
    </section>
  );
}

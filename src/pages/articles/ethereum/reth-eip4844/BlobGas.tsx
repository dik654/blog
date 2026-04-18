import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';
import BlobGasDetailViz from './viz/BlobGasDetailViz';
import type { CodeRef } from '@/components/code/types';

export default function BlobGas({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="blob-gas" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Blob Gas 가격 모델</h2>
      <div className="not-prose mb-8"><BlobGasDetailViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('blob-gas', codeRefs['blob-gas'])} />
          <span className="text-[10px] text-muted-foreground self-center">calc_blob_fee() & fake_exponential()</span>
        </div>
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('header-blob-gas', codeRefs['header-blob-gas'])} />
          <span className="text-[10px] text-muted-foreground self-center">validate_cancun_gas() — 헤더 검증</span>
        </div>

        {/* ── excess_blob_gas 계산 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">excess_blob_gas — 누적 초과분</h3>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="text-xs font-semibold text-indigo-400 mb-2">calculate_excess_blob_gas()</p>
            <p className="text-sm text-foreground/80 leading-relaxed">
              <code className="text-xs">total = parent_excess + parent_blob_gas_used</code><br />
              <code className="text-xs">excess = total.saturating_sub(TARGET)</code><br />
              TARGET = 393,216 (3 blobs * 131,072)
            </p>
            <p className="text-xs text-foreground/50 mt-2">target 초과 시 excess 증가, 미달 시 감소 (하한 0)</p>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="text-xs font-semibold text-emerald-400 mb-2">예시 시퀀스</p>
            <ul className="text-sm text-foreground/80 space-y-1 leading-relaxed">
              <li>블록 N (6 blob): excess 0 → <strong>393,216</strong></li>
              <li>블록 N+1 (3 blob): excess 393,216 → <strong>393,216</strong></li>
              <li>블록 N+2 (3 blob): excess 393,216 → <strong>393,216</strong></li>
              <li>블록 N+3 (0 blob): excess 393,216 → <strong>0</strong></li>
            </ul>
          </div>
          <div className="sm:col-span-2 rounded-lg border border-border/60 p-4">
            <p className="text-xs font-semibold text-amber-400 mb-2">피드백 루프</p>
            <p className="text-sm text-foreground/80 leading-relaxed">
              수요 증가 → excess 증가 → 가격 상승 → 수요 억제.<br />
              target(3 blob) 유지 시 excess 안정 — EIP-1559와 같은 시장 조절 메커니즘이지만 별도 가스 공간.
            </p>
          </div>
        </div>
        <p className="leading-7">
          <code>excess_blob_gas</code>가 <strong>blob_base_fee의 결정 변수</strong>.<br />
          매 블록 target(3 blobs)과 실제 사용량 차이가 excess에 누적.<br />
          일반 EIP-1559와 같은 피드백 루프, 단 blob 전용 시장.
        </p>

        {/* ── fake_exponential ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">fake_exponential — 정수 지수 함수</h3>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="text-xs font-semibold text-indigo-400 mb-2">fake_exponential(factor, numerator, denominator)</p>
            <p className="text-sm text-foreground/80 leading-relaxed">
              수학적: <code className="text-xs">fee = factor * exp(numerator / denominator)</code><br />
              float 사용 시 노드 간 미세 차이 → consensus split 위험.<br />
              Taylor 급수로 정수 근사: <code className="text-xs">e^(n/d) = 1 + (n/d) + (n/d)^2/2! + ...</code>
            </p>
            <p className="text-xs text-foreground/50 mt-2">~20 iterations으로 수렴, 모든 노드 동일 결과 보장</p>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="text-xs font-semibold text-emerald-400 mb-2">blob_base_fee 곡선</p>
            <ul className="text-sm text-foreground/80 space-y-1 leading-relaxed">
              <li>excess = 0 → <strong>1 wei</strong></li>
              <li>excess = 10M → ~1.2 wei</li>
              <li>excess = 50M → ~5 wei</li>
              <li>excess = 100M → ~24 wei</li>
              <li>excess = 200M → ~550 wei</li>
              <li>excess = 300M → ~13,000 wei</li>
            </ul>
            <p className="text-xs text-foreground/50 mt-2">지수적 증가 — 수요 폭증 시 가격 급등</p>
          </div>
        </div>
        <p className="leading-7">
          <strong>fake_exponential</strong>이 정수 연산의 핵심 — 모든 노드 동일 결과 보장.<br />
          Taylor 급수 ~20회 iteration으로 e^x 정확한 정수 근사.<br />
          float 사용 시 노드 간 미세 차이 → consensus split 위험.
        </p>

        {/* ── blob_gas 경제 시나리오 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Blob 수수료 시장 시뮬레이션</h3>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="text-xs font-semibold text-emerald-400 mb-2">시나리오 1: 정상 (3 blob/block)</p>
            <p className="text-sm text-foreground/80 leading-relaxed">
              excess = 0 유지, blob_base_fee = 1 wei.<br />
              롤업: 블록당 ~0.0001 ETH → 매우 저렴.
            </p>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="text-xs font-semibold text-amber-400 mb-2">시나리오 2: 수요 급증 (6 blob/block)</p>
            <p className="text-sm text-foreground/80 leading-relaxed">
              100 블록: excess ~39M, fee ~2,000 wei.<br />
              여전히 저렴하지만 상승 추세.
            </p>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="text-xs font-semibold text-red-400 mb-2">시나리오 3: 대규모 이벤트</p>
            <p className="text-sm text-foreground/80 leading-relaxed">
              연속 200 블록 6 blob → excess ~80M.<br />
              fee ~15M wei (0.015 Gwei) — 급격한 상승, 수요 억제.
            </p>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="text-xs font-semibold text-blue-400 mb-2">시나리오 4: 수요 감소</p>
            <p className="text-sm text-foreground/80 leading-relaxed">
              10 블록 0 blob → excess 0으로 빠른 회복.<br />
              실제 메인넷: 평균 1~10 wei, 피크 수백 wei.
            </p>
          </div>
        </div>
        <p className="leading-7">
          Blob market은 <strong>매우 낮은 수수료</strong>로 안정화.<br />
          대부분 시기 blob_base_fee = 1 wei → 롤업 운영 비용 극저.<br />
          수요 급증 시에만 급격히 상승 → 공급 조절 메커니즘.
        </p>
      </div>
    </section>
  );
}

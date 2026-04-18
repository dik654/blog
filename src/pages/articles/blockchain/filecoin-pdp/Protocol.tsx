import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function Protocol({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="protocol" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">SHA2 챌린지 &amp; 160바이트 응답</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          DRAND 비콘으로 랜덤 오프셋 결정. SP는 해당 오프셋에서 160B를 읽고 SHA256 해시를 계산.<br />
          머클 경로(siblings)를 함께 제출해 리프가 루트에 속함을 증명
        </p>
        <div className="not-prose flex flex-wrap gap-2 mt-4">
          <CodeViewButton onClick={() => onCodeRef('pdp-main', codeRefs['pdp-main'])} />
          <span className="text-[10px] text-muted-foreground self-center">GenerateProof()</span>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">PDP Protocol 상세</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose mb-6">
          <div className="bg-muted rounded-lg p-4">
            <h4 className="font-semibold text-sm mb-2">Setup</h4>
            <ol className="text-sm space-y-1 text-muted-foreground list-decimal list-inside">
              <li>Client가 데이터를 160B chunk으로 분할</li>
              <li>chunk마다 <code className="text-xs bg-background px-1 rounded">SHA256</code> 해시 계산 (leaf)</li>
              <li>Merkle tree 구축</li>
              <li>root를 온체인에 등록</li>
            </ol>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <h4 className="font-semibold text-sm mb-2">Challenge</h4>
            <ol className="text-sm space-y-1 text-muted-foreground list-decimal list-inside">
              <li>DRAND beacon에서 randomness 획득</li>
              <li><code className="text-xs bg-background px-1 rounded">offset = beacon mod data_size</code></li>
              <li>SP가 해당 offset에서 160B 읽기</li>
              <li>Merkle proof 생성</li>
            </ol>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose mb-6">
          <div className="bg-muted rounded-lg p-4">
            <h4 className="font-semibold text-sm mb-2">Proof 구조</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li><code className="text-xs bg-background px-1 rounded">leaf_data</code>: 160 bytes</li>
              <li><code className="text-xs bg-background px-1 rounded">leaf_hash</code>: 32 bytes</li>
              <li><code className="text-xs bg-background px-1 rounded">merkle_path</code>: ~20-30 x 32 bytes</li>
              <li>총 크기: ~1 KB</li>
            </ul>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <h4 className="font-semibold text-sm mb-2">Verification</h4>
            <ol className="text-sm space-y-1 text-muted-foreground list-decimal list-inside">
              <li><code className="text-xs bg-background px-1 rounded">SHA256(leaf_data) == leaf_hash</code> 확인</li>
              <li>Merkle path를 root까지 재연산</li>
              <li>등록된 root와 대조</li>
            </ol>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 not-prose mb-6">
          <div className="bg-muted rounded-lg p-4">
            <h4 className="font-semibold text-sm mb-2">Gas 비용</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>~20 SHA256 연산</li>
              <li>&lt;1 MGas per verify</li>
              <li>PoSt 대비: <code className="text-xs bg-background px-1 rounded">100x</code> 저렴</li>
            </ul>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <h4 className="font-semibold text-sm mb-2">빈도</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>SLA별 설정 가능</li>
              <li>통상 hourly / per epoch</li>
              <li>실패 시 penalty</li>
            </ul>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <h4 className="font-semibold text-sm mb-2">장점</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>저렴한 검증, SNARK 불필요</li>
              <li>업계 표준(SHA256)</li>
              <li>빠른 생성</li>
            </ul>
          </div>
        </div>
        <p className="leading-7">
          PDP: <strong>DRAND challenge → SHA256 + Merkle → verify</strong>.<br />
          &lt;1 MGas per verify (100x cheaper than PoSt).<br />
          simple, fast, industry-standard crypto.
        </p>
      </div>
    </section>
  );
}

import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';
import ThresholdViz from './viz/ThresholdViz';

export default function Threshold({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const open = (k: string) => onCodeRef(k, codeRefs[k]);
  return (
    <section id="threshold" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Elector: RoundRobin vs Random VRF</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          리더 선출 — <code>Elector</code> trait으로 추상화. <code>Config::build(participants)</code>로 초기화
          <br />
          <strong>결정적 필수:</strong> 동일 (round, certificate) 입력 → 동일 리더. 합의 정확성의 전제 조건
        </p>
        <p className="leading-7">
          <strong>RoundRobinElector:</strong> <code>modulo(view, n)</code> 단순 순환. certificate 무시. O(1)
          <br />
          <strong>RandomElector:</strong> BLS threshold VRF에서 파생한 시드로 편향 없는 선출
          <br />
          View 1은 certificate 없음 → round-robin fallback. 이후: <code>SHA256(cert) → modulo</code>
        </p>
        <p className="leading-7">
          <strong>threshold_simplex</strong> — BLS12-381 임계 서명 + VRF 리더 선출 변형
          <br />
          인증서 크기 O(n) → <strong>O(1) (96 bytes)</strong> — 라이트 클라이언트·크로스체인 검증에 핵심
          <br />
          DKG 3단계: 비밀 공유 → P2P 전송 → 수신 검증 → 그룹 공개키 도출
        </p>
      </div>
      <div className="not-prose flex flex-wrap gap-2 mb-4">
        <CodeViewButton onClick={() => open('elector-trait')} />
        <span className="text-[10px] text-muted-foreground self-center">Elector trait</span>
        <CodeViewButton onClick={() => open('round-robin')} />
        <span className="text-[10px] text-muted-foreground self-center">RoundRobin</span>
        <CodeViewButton onClick={() => open('random-elector')} />
        <span className="text-[10px] text-muted-foreground self-center">Random VRF</span>
        <CodeViewButton onClick={() => open('threshold-dkg')} />
        <span className="text-[10px] text-muted-foreground self-center">DKG</span>
      </div>
      <div className="not-prose mb-8">
        <ThresholdViz onOpenCode={open} />
      </div>
    </section>
  );
}

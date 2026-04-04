import SetupViz from './viz/SetupViz';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function Setup({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const open = (key: string) => onCodeRef(key, codeRefs[key]);
  return (
    <section id="setup" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Trusted Setup (CRS 생성)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          τ, α, β, γ, δ — 다섯 개의 랜덤 스칼라 (toxic waste)
          <br />
          이 값을 아는 자는 가짜 증명을 만들 수 있음 — setup 후 반드시 삭제
          <br />
          실제 프로덕션은 MPC 세레모니로 어떤 단일 참여자도 전체 값을 알 수 없도록 보장
        </p>
        <p className="leading-7">
          QAP 다항식을 비밀 τ에서 평가 → 커브 포인트로 인코딩
          <br />
          공개 변수는 /γ로 나누어 IC (검증키), 비공개 변수는 /δ로 나누어 L (증명키)
          <br />
          e(α,β) 사전 계산을 검증키에 저장 — 검증 시 페어링 1개 절약
        </p>
      </div>
      <div className="not-prose mb-8">
        <SetupViz onOpenCode={open} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h4>구현 인사이트</h4>
        <p className="leading-7">
          Rust의 소유권 시스템 — toxic waste는 함수 로컬 변수로, 함수 종료 시 스택에서 자동 소멸
          <br />
          γ와 δ로 공개/비공개를 분리하는 이유: 검증 방정식에서 각각 독립적으로 소거되어 구조 보장
          <br />
          h_query 크기 = m-1 (제약 수 - 1) — h(x)의 차수가 최대 m-2이므로
        </p>
      </div>
    </section>
  );
}

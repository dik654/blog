import SetupViz from './viz/SetupViz';
import M from '@/components/ui/math';
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

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">CRS 구조 및 MPC 세레모니</h3>

        {/* Toxic waste */}
        <div className="bg-muted/50 rounded-lg p-4 mb-4">
          <h4 className="font-semibold mb-2">랜덤 트랩도어 (toxic waste)</h4>
          <p className="text-sm"><M>{'\\tau, \\alpha, \\beta, \\gamma, \\delta \\in \\mathbb{F}_p'}</M> — setup 후 반드시 삭제</p>
        </div>

        {/* ProvingKey 구조 */}
        <div className="bg-muted/50 rounded-lg p-4 mb-4">
          <h4 className="font-semibold mb-2">ProvingKey 구조</h4>
          <div className="grid grid-cols-1 gap-2 text-sm">
            <div className="bg-background rounded p-3">
              <p className="font-medium">기본 포인트</p>
              <p><M>{'[\\alpha]_1'}</M>, <M>{'[\\beta]_1'}</M> (G1) / <M>{'[\\beta]_2'}</M> (G2) / <M>{'[\\delta]_1'}</M> (G1) / <M>{'[\\delta]_2'}</M> (G2)</p>
            </div>
            <div className="bg-background rounded p-3">
              <p className="font-medium">Powers of tau</p>
              <p><M>{'[\\tau^0]_1, [\\tau^1]_1, \\ldots, [\\tau^{m-1}]_1'}</M></p>
            </div>
            <div className="bg-background rounded p-3">
              <p className="font-medium">IC (공개 입력, γ 정규화)</p>
              <p><M>{'\\text{IC}[j] = \\left[\\frac{\\beta \\cdot a_j(\\tau) + \\alpha \\cdot b_j(\\tau) + c_j(\\tau)}{\\gamma}\\right]_1'}</M></p>
            </div>
            <div className="bg-background rounded p-3">
              <p className="font-medium">L (비공개 입력, δ 정규화)</p>
              <p><M>{'L[j] = \\left[\\frac{\\beta \\cdot a_j(\\tau) + \\alpha \\cdot b_j(\\tau) + c_j(\\tau)}{\\delta}\\right]_1'}</M></p>
            </div>
            <div className="bg-background rounded p-3">
              <p className="font-medium">H (h(τ) 항)</p>
              <p><M>{'H[i] = \\left[\\frac{\\tau^i \\cdot t(\\tau)}{\\delta}\\right]_1'}</M> (<M>{'i = 0 \\ldots m{-}2'}</M>)</p>
            </div>
          </div>
        </div>

        {/* VerifyingKey 구조 */}
        <div className="bg-muted/50 rounded-lg p-4 mb-4">
          <h4 className="font-semibold mb-2">VerifyingKey 구조</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="bg-background rounded p-2"><M>{'[\\alpha]_1, [\\beta]_2'}</M> — <M>{'e(\\alpha, \\beta)'}</M> 사전 계산용</div>
            <div className="bg-background rounded p-2"><M>{'[\\gamma]_2'}</M> — IC 검사용</div>
            <div className="bg-background rounded p-2"><M>{'[\\delta]_2'}</M> — C 검사용</div>
            <div className="bg-background rounded p-2"><M>{'\\text{IC}[0], \\ldots, \\text{IC}[l]'}</M> — 공개 입력 생성기</div>
          </div>
        </div>

        {/* α, β, γ, δ 역할 */}
        <div className="bg-muted/50 rounded-lg p-4 mb-4">
          <h4 className="font-semibold mb-2">α, β, γ, δ 분리 이유</h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-background rounded p-3">
              <p className="font-medium"><M>{'\\alpha, \\beta'}</M>: 지식 계수</p>
              <p className="text-muted-foreground">prover가 임의의 A, B 사용 방지 — <M>{'e(A,B) = e(\\alpha,\\beta) \\cdot \\ldots'}</M> 로 연결 강제</p>
            </div>
            <div className="bg-background rounded p-3">
              <p className="font-medium"><M>{'\\gamma'}</M>: 공개 입력 분리</p>
              <p className="text-muted-foreground">공개/비공개 항 혼합 불가, 공개 입력의 선형성 보장</p>
            </div>
            <div className="bg-background rounded p-3">
              <p className="font-medium"><M>{'\\delta'}</M>: 비공개 + 몫 분리</p>
              <p className="text-muted-foreground">비공개 witness 기여분 그룹화, 공개 부분과 교차 오염 방지</p>
            </div>
            <div className="bg-background rounded p-3">
              <p className="font-medium">건전성 기반</p>
              <p className="text-muted-foreground">q-PKE 가정, 이산 로그 난제, 쌍선형 군 보안</p>
            </div>
          </div>
        </div>

        {/* MPC 세레모니 */}
        <div className="bg-muted/50 rounded-lg p-4 mb-4">
          <h4 className="font-semibold mb-2">MPC 세레모니</h4>
          <div className="text-sm space-y-2">
            <p><strong>문제:</strong> <M>{'(\\tau, \\alpha, \\beta, \\delta)'}</M>를 아는 자 = 가짜 증명 위조 가능</p>
            <p><strong>해결:</strong> 참여자 <M>{'i'}</M>가 자신만의 <M>{'r_i'}</M> 기여 → <M>{'\\text{CRS}_i = \\text{CRS}_{i-1} \\cdot r_i'}</M> (동형 갱신)</p>
            <p className="text-muted-foreground">참여자 중 단 한 명만 정직하면 최종 랜덤값은 누구도 알 수 없음</p>
          </div>
          <div className="grid grid-cols-3 gap-3 text-sm mt-3">
            <div className="bg-background rounded p-2 text-center">
              <p className="font-medium">Zcash Sapling</p>
              <p className="text-muted-foreground">~90 참여자</p>
            </div>
            <div className="bg-background rounded p-2 text-center">
              <p className="font-medium">Filecoin</p>
              <p className="text-muted-foreground">수백 참여자</p>
            </div>
            <div className="bg-background rounded p-2 text-center">
              <p className="font-medium">Ethereum KZG</p>
              <p className="text-muted-foreground">140,000+</p>
            </div>
          </div>
        </div>

        {/* Phase 1 vs Phase 2 */}
        <div className="bg-muted/50 rounded-lg p-4 mb-4">
          <h4 className="font-semibold mb-2">Phase 1 vs Phase 2</h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-background rounded p-3">
              <p className="font-medium">Phase 1 — Powers of Tau</p>
              <p><M>{'[\\tau^0]_1, \\ldots, [\\tau^N]_1'}</M> + <M>{'[\\alpha \\tau^k]_1, [\\beta \\tau^k]_1'}</M></p>
              <p className="text-muted-foreground">회로 무관 범용 — 프로젝트 간 재사용 가능</p>
            </div>
            <div className="bg-background rounded p-3">
              <p className="font-medium">Phase 2 — 회로 특정</p>
              <p>Phase 1 결과 사용 → IC, L, H 쿼리 벡터 계산</p>
              <p className="text-muted-foreground">회로마다 별도 실행 필수</p>
            </div>
          </div>
        </div>

        {/* 비용 + 대안 */}
        <div className="bg-muted/50 rounded-lg p-4">
          <h4 className="font-semibold mb-2">Setup 비용 & 대안</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="bg-background rounded p-3">
              <p className="font-medium">Proving key 크기</p>
              <p><M>{'O(m)'}</M> group elements</p>
              <p className="text-muted-foreground"><M>{'m = 10^6'}</M> → ~100 MB / <M>{'m = 10^8'}</M> → ~10 GB</p>
            </div>
            <div className="bg-background rounded p-3">
              <p className="font-medium">Verifying key 크기</p>
              <p><M>{'O(l)'}</M> (<M>{'l'}</M> = 공개 입력 수)</p>
              <p className="text-muted-foreground">보통 ~1 KB</p>
            </div>
            <div className="bg-background rounded p-3 sm:col-span-2">
              <p className="font-medium">대안: Universal Setup</p>
              <p>Plonk, Sonic, Marlin — 세레모니 1회로 모든 회로에 재사용, 대신 증명 크기 약간 증가 + 검증 속도 저하</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

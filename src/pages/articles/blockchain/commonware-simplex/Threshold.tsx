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

      {/* Threshold Signatures & VRF structured cards */}
      <div className="not-prose mt-6">
        <h3 className="text-xl font-semibold mb-3">Threshold Signatures & VRF 리더 선출</h3>

        {/* Problem statement */}
        <div className="rounded-lg border border-border bg-card p-5 mb-4">
          <h4 className="font-semibold text-sm mb-2">문제</h4>
          <p className="text-xs text-muted-foreground">
            n명 검증자의 합의 인증서 — 개별 서명: n x 96 bytes (BLS) = 무거움. 라이트 클라이언트가 이 인증서를 검증해야 함. 크로스체인 검증에서 크기가 핵심.
          </p>
        </div>

        {/* Threshold signature idea */}
        <div className="rounded-lg border border-border bg-card p-4 mb-4">
          <h4 className="font-semibold text-sm mb-2">임계 서명 핵심 아이디어</h4>
          <p className="text-xs text-muted-foreground">
            그룹 공유 공개키 PK · 각 참여자가 비밀키 지분(share) 보유 · t+1명이면 서명 가능 (임계값) · 최종 서명: 단일 96 bytes · 검증: 단일 pairing check
          </p>
        </div>

        {/* BLS threshold signatures */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          <div className="rounded-lg border border-border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">Setup (DKG)</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>차수 t인 다항식 <code className="text-xs">f(x)</code> 생성</li>
              <li>비밀 <code className="text-xs">s = f(0)</code></li>
              <li>지분 i: <code className="text-xs">f(i)</code> → 검증자 i에게 전달</li>
              <li>공개키: <code className="text-xs">PK = g^s</code></li>
            </ul>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">Signing (부분 서명)</h4>
            <p className="text-xs text-muted-foreground">
              검증자 i가 메시지 m에 서명: <code className="text-xs">sigma_i = H(m)^f(i)</code>
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">Aggregation</h4>
            <p className="text-xs text-muted-foreground">
              t+1개 부분 서명으로 <code className="text-xs">f(0)</code>으로 보간: <code className="text-xs">sigma = prod(sigma_i ^ lambda_i)</code> (lambda_i = Lagrange 계수)
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">Verification</h4>
            <p className="text-xs text-muted-foreground">
              <code className="text-xs">e(sigma, G) == e(H(m), PK)</code> — 단일 pairing check, 상수 크기 인증서
            </p>
          </div>
        </div>

        {/* DKG phases */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          <div className="rounded-lg border border-border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">DKG Phase 1: Sharing</h4>
            <p className="text-xs text-muted-foreground">
              각 검증자 i가 차수 t인 랜덤 다항식 <code className="text-xs">f_i(x)</code> 선택. 계수를 Pedersen 커밋. 커밋먼트 브로드캐스트.
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">DKG Phase 2: Distribution</h4>
            <p className="text-xs text-muted-foreground">
              검증자 i가 <code className="text-xs">f_i(j)</code>를 검증자 j에게 전송. 암호화된 P2P 채널 사용.
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">DKG Phase 3: Verification</h4>
            <p className="text-xs text-muted-foreground">
              검증자 j가 <code className="text-xs">f_i(j)</code>를 커밋먼트 대비 검증. 유효하지 않으면 이의(complaint). 결합 비밀 지분: <code className="text-xs">s_j = sum_i f_i(j)</code>. 그룹 공개키: <code className="text-xs">PK = sum_i g^f_i(0)</code>
            </p>
          </div>
        </div>

        {/* Why BLS */}
        <div className="rounded-lg border border-border bg-card p-4 mb-4">
          <h4 className="font-semibold text-sm mb-2">왜 BLS인가?</h4>
          <p className="text-xs text-muted-foreground">
            결정적 서명 (랜덤 불필요) · 쉬운 집계 (준동형) · 상수 크기 서명 · VRF와 호환
          </p>
        </div>

        {/* VRF */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <div className="rounded-lg border border-border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">VRF (Verifiable Random Function)</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li><strong>결정적:</strong> 동일 입력 → 동일 출력</li>
              <li><strong>검증 가능:</strong> 누구나 출력 검증 가능</li>
              <li><strong>의사 난수:</strong> 출력이 무작위와 구별 불가</li>
            </ul>
            <p className="text-xs text-muted-foreground mt-2">
              BLS VRF: 입력 m → 출력 <code className="text-xs">y = H(m, e(PK, H(m)))</code>. 증명: <code className="text-xs">sigma = H(m)^s</code>. 검증: <code className="text-xs">e(sigma, G) == e(H(m), PK)</code>
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">VRF 리더 선출</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li><code className="text-xs">RoundRobinElector</code>: <code className="text-xs">view % n</code> — 단순, 예측 가능, 표적 공격에 취약</li>
              <li><code className="text-xs">RandomElector</code>: <code className="text-xs">VRF(prev_cert) % n</code> — 인증서 생성 전까지 예측 불가, 정직 다수 하에서 공정 분배</li>
            </ul>
          </div>
        </div>

        {/* Unpredictability */}
        <div className="rounded-lg border border-border bg-card p-4 mb-4">
          <h4 className="font-semibold text-sm mb-2">예측 불가능성 보장</h4>
          <p className="text-xs text-muted-foreground">
            미래 리더 → 미래 인증서에 의존 → 미래 인증서는 2f+1 정직 VRF 지분에 의존. f+1 정직 검증자가 있는 한 예측 불가. 사전 매수 불가 · 리더 대상 DoS 불가 · 제안자 선행 불가.
          </p>
        </div>

        {/* Certificate size comparison */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <div className="rounded-lg border border-border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2"><code className="text-sm">simplex</code> (개별 서명)</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>n=100 검증자</li>
              <li>cert = 2f+1 = 67개 서명</li>
              <li>BLS: 67 x 96 bytes = 6,432 bytes</li>
              <li>서명자 인덱스 포함: ~7 KB</li>
            </ul>
          </div>
          <div className="rounded-lg border border-blue-400/40 bg-blue-500/5 p-4">
            <h4 className="font-semibold text-sm mb-2"><code className="text-sm">threshold_simplex</code></h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>집계 서명: 96 bytes</li>
              <li>에폭 식별자: ~20 bytes</li>
              <li>총: ~120 bytes</li>
              <li><strong>축소: 50-100x</strong></li>
            </ul>
          </div>
        </div>

        {/* Cross-chain */}
        <div className="rounded-lg border border-border bg-card p-4 mb-4">
          <h4 className="font-semibold text-sm mb-2">크로스체인 검증</h4>
          <p className="text-xs text-muted-foreground">
            이더리움 컨트랙트에서 외부 체인 최종성 검증: BLS pairing ~200K gas · 단일 트랜잭션에 포함 가능. 개별 서명(7 KB)은 가스 한도 초과. 임계 서명이 크로스체인 라이트 클라이언트를 실현 가능하게 만듦.
          </p>
        </div>

        {/* Implementation */}
        <div className="rounded-lg border border-border bg-card p-4 mb-4">
          <h4 className="font-semibold text-sm mb-2">구현 (Commonware threshold_simplex)</h4>
          <p className="text-xs text-muted-foreground">
            arkworks BLS12-381 사용 · Lagrange 계수 사전 계산 · DKG는 에폭 전환 시 실행 · P2P로 지분 분배 · 그룹 키 온체인 커밋
          </p>
        </div>

        {/* Trade-offs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <div className="rounded-lg border border-green-400/40 bg-green-500/5 p-4">
            <h4 className="font-semibold text-sm mb-2">Threshold 장점</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>상수 크기 인증서</li>
              <li>빠른 라이트 클라이언트 검증</li>
              <li>VRF 기반 리더 선출</li>
              <li>크로스체인 친화</li>
            </ul>
          </div>
          <div className="rounded-lg border border-orange-400/40 bg-orange-500/5 p-4">
            <h4 className="font-semibold text-sm mb-2">Threshold 단점</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>DKG 세러모니 복잡도</li>
              <li>키 로테이션 어려움</li>
              <li>검증자 추가 = 새 DKG 필요</li>
              <li>DKG 실패 시 중앙화 위험</li>
            </ul>
          </div>
        </div>

        {/* Production use */}
        <div className="rounded-lg border border-border bg-card p-4">
          <h4 className="font-semibold text-sm mb-2">프로덕션 사용</h4>
          <p className="text-xs text-muted-foreground">
            Commonware threshold_simplex · Chainlink DON threshold signing · Drand 분산 랜덤 비컨 · Keep Network tBTC signing · Dfinity (ICP) chain-key signatures
          </p>
        </div>
      </div>
    </section>
  );
}

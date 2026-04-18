import DSMRViz from './viz/DSMRViz';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function DSMR({ onCodeRef }: Props) {
  return (
    <section id="dsmr" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">DSMR: Replicate → Sequence → Execute</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          기존 SMR — Replicate · Sequence · Execute가 결합. 가장 느린 단계(합의)가 전체 병목
          <br />
          <strong>Decoupled SMR</strong> — 세 단계를 독립 파이프라인으로 분리
        </p>
        <p className="leading-7">
          <strong>Replicate</strong>(<code>broadcast::buffered::Engine</code>) — ordered_broadcast로 데이터 전파. 합의 불필요
          <br />
          <strong>Sequence</strong>(<code>consensus::simplex</code>) — 시퀀서 tip의 순서만 결정. 소량 데이터(해시)
          <br />
          <strong>Execute</strong>(vm) — 확정된 순서로 트랜잭션 실행
        </p>
        <p className="leading-7">
          핵심: 합의는 tip 순서만 결정 — 실제 데이터 전파량과 디커플링. 처리량이 합의 대역폭에 제한되지 않음
        </p>
      </div>
      <div className="not-prose mb-8">
        <DSMRViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Decoupled SMR 패턴</h3>

        <div className="not-prose bg-muted/50 rounded-lg border p-4 my-4 space-y-4">
          <div>
            <p className="text-xs font-mono text-muted-foreground mb-2">기존 SMR (Paxos, Raft, PBFT) 문제</p>
            <div className="bg-background rounded-md border p-3 text-sm">
              <p>Replicate + Sequence + Execute가 <strong>합의 계층에 모두 묶임</strong></p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
              <div className="bg-background rounded-md border px-3 py-2 text-center">
                <p className="text-xs font-semibold">합의 대역폭 = 블록 크기</p>
              </div>
              <div className="bg-background rounded-md border px-3 py-2 text-center">
                <p className="text-xs font-semibold">전체 블록 전송</p>
              </div>
              <div className="bg-background rounded-md border px-3 py-2 text-center">
                <p className="text-xs font-semibold">가장 느린 단계가 지배</p>
              </div>
              <div className="bg-background rounded-md border px-3 py-2 text-center">
                <p className="text-xs font-semibold">처리량 확장 어려움</p>
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs font-mono text-muted-foreground mb-2">DSMR: 3개 독립 파이프라인으로 분리</p>
            <div className="space-y-2">
              <div className="bg-background rounded-md border p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs px-2 py-0.5 rounded font-semibold">Replicate</span>
                  <span className="text-sm font-semibold">데이터 전파</span>
                </div>
                <p className="text-xs text-muted-foreground">높은 대역폭 · 독립 확장 · 합의 불필요 · 전달 보장만 필요</p>
              </div>
              <div className="bg-background rounded-md border p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs px-2 py-0.5 rounded font-semibold">Sequence</span>
                  <span className="text-sm font-semibold">tip 순서 결정</span>
                </div>
                <p className="text-xs text-muted-foreground">낮은 대역폭(작은 해시) · 합의 집약 · 불투명 식별자 순서화 · 단위 비용 저렴</p>
              </div>
              <div className="bg-background rounded-md border p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs px-2 py-0.5 rounded font-semibold">Execute</span>
                  <span className="text-sm font-semibold">상태 전이 적용</span>
                </div>
                <p className="text-xs text-muted-foreground">CPU-bound · 결정론적 · 검증자별 태스크 · 파이프라이닝 가능</p>
              </div>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">구체적 동작 예시</h3>
        <div className="not-prose bg-muted/50 rounded-lg border p-4 my-4">
          <div className="space-y-2">
            <div className="bg-background rounded-md border p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs px-2 py-0.5 rounded font-semibold">Step 1</span>
                <span className="text-sm font-semibold">Replicate</span>
              </div>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>시퀀서 Alice: <code>Chunk(h=1, payload=tx1)</code> 브로드캐스트 → 2f+1 서명 → <code>Certificate_A1</code> 생성 → tip = (h=1, cert_hash)</p>
                <p>시퀀서 Bob: <code>Chunk(h=1, payload=tx2)</code> 동시 브로드캐스트 → 동일 과정</p>
                <p className="font-semibold">두 과정이 동시(concurrent) 진행</p>
              </div>
            </div>
            <div className="bg-background rounded-md border p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs px-2 py-0.5 rounded font-semibold">Step 2</span>
                <span className="text-sm font-semibold">Sequence</span>
              </div>
              <p className="text-xs text-muted-foreground">합의 리더 제안: "순서 배치: [Alice_tip, Bob_tip]" — 소량 페이로드(PK + height + hash) → 합의 라운드에서 순서 확정</p>
            </div>
            <div className="bg-background rounded-md border p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs px-2 py-0.5 rounded font-semibold">Step 3</span>
                <span className="text-sm font-semibold">Execute</span>
              </div>
              <p className="text-xs text-muted-foreground">검증자: Alice 체인에서 tx1 가져오기(이미 보유) → Bob 체인에서 tx2 가져오기 → 순서대로 적용 → 상태 업데이트</p>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">성능 비교 & 과제</h3>
        <div className="not-prose bg-muted/50 rounded-lg border p-4 my-4 space-y-4">
          <div>
            <p className="text-xs font-mono text-muted-foreground mb-2">대역폭 비교</p>
            <div className="bg-background rounded-md border p-3">
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="font-semibold">지표</div>
                <div className="font-semibold">기존 SMR</div>
                <div className="font-semibold">DSMR</div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground mt-2 space-y-1">
                <div>합의 대역폭</div><div>O(block)</div><div>O(K × tip)</div>
                <div>데이터 대역폭</div><div>O(block)</div><div>O(block/N)</div>
                <div>처리량 제한</div><div>합의</div><div>시퀀서별</div>
                <div>병렬성</div><div>없음</div><div>K개 시퀀서</div>
                <div>리더 의존도</div><div>높음</div><div>낮음</div>
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs font-mono text-muted-foreground mb-2">DSMR 과제</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="bg-background rounded-md border p-3">
                <p className="font-semibold text-xs">청크 가용성</p>
                <p className="text-[11px] text-muted-foreground mt-1">합의가 tip 순서화 시 검증자가 실제 데이터를 가지고 있는가? → 전파 계층의 가용성 보장 필요</p>
              </div>
              <div className="bg-background rounded-md border p-3">
                <p className="font-semibold text-xs">Equivocation</p>
                <p className="text-[11px] text-muted-foreground mt-1">비잔틴 시퀀서의 포크(Chunk1', Chunk1'') → <code>ordered_broadcast</code> 인증서 메커니즘으로 방어</p>
              </div>
              <div className="bg-background rounded-md border p-3">
                <p className="font-semibold text-xs">Liveness</p>
                <p className="text-[11px] text-muted-foreground mt-1">시퀀서 정지 시 해당 체인만 중단 — 다른 시퀀서는 계속 진행 · 합의가 비활성 시퀀서 스킵</p>
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs font-mono text-muted-foreground mb-2">유사 시스템 & Commonware 구현</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="bg-background rounded-md border px-3 py-2 text-center">
                <p className="text-xs font-semibold">Narwhal + Bullshark</p>
                <p className="text-[11px] text-muted-foreground">DAG 기반 DSMR</p>
              </div>
              <div className="bg-background rounded-md border px-3 py-2 text-center">
                <p className="text-xs font-semibold">DiemBFT v4</p>
                <p className="text-[11px] text-muted-foreground">DSMR 방향 전환</p>
              </div>
              <div className="bg-background rounded-md border px-3 py-2 text-center">
                <p className="text-xs font-semibold">EigenLayer DA</p>
                <p className="text-[11px] text-muted-foreground">분리된 가용성</p>
              </div>
              <div className="bg-background rounded-md border px-3 py-2 text-center">
                <p className="text-xs font-semibold">Celestia</p>
                <p className="text-[11px] text-muted-foreground">DA만 (실행 없음)</p>
              </div>
            </div>
            <div className="bg-background rounded-md border p-3 mt-2 text-xs text-muted-foreground">
              <p><strong>Commonware 구현:</strong> Replicate → <code>ordered_broadcast</code> · Sequence → <code>consensus::simplex</code> · Execute → 애플리케이션 VM</p>
              <p className="mt-1">사용자가 프리미티브를 조합해 자체 블록체인 구성 — 합의, 전파, VM을 독립적으로 교체 가능</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

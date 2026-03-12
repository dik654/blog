export default function PagedAttention() {
  return (
    <section id="paged-attention" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">PagedAttention & KV 캐시 관리</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">PagedAttention 핵심 개념</h3>
        <p>
          PagedAttention은 OS의 <strong>가상 메모리 페이징</strong>에서 영감을 받았습니다.
          KV 캐시를 연속된 큰 메모리 블록 대신 <strong>고정 크기 블록</strong>으로
          분할하여 관리합니다. 이를 통해 내부/외부 단편화를 거의 제거합니다.
        </p>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`OS 가상 메모리와 PagedAttention 비교:

OS 가상 메모리:                    PagedAttention:
┌──────────────┐                 ┌──────────────┐
│ Virtual Page │ → Page Table → │Physical Frame│
│ (논리 페이지)  │                 │ (물리 프레임)  │
└──────────────┘                 └──────────────┘

PagedAttention:
┌──────────────┐                 ┌──────────────┐
│ Logical Block│ → Block Table → │Physical Block│
│ (논리 블록)   │                 │ (GPU 메모리)  │
└──────────────┘                 └──────────────┘

블록 구조:
  Block = [token_0_KV, token_1_KV, ..., token_B-1_KV]
  B = 블록 크기 (보통 16 토큰)

예) "The cat sat on the mat" (6 토큰, B=4):
  Logical Block 0: [The, cat, sat, on]   → Physical Block 7
  Logical Block 1: [the, mat, _, _]      → Physical Block 3
                              ↑ 미사용 슬롯 (마지막 블록만)

→ 내부 단편화: 마지막 블록에서만 발생 (평균 B/2 토큰)
→ 외부 단편화: 없음 (비연속 물리 블록 사용)`}</code>
        </pre>
        <h3 className="text-xl font-semibold mt-6 mb-3">Block Manager & 스케줄러</h3>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`Block Manager 동작:

1. 새 요청 도착:
   Prefill 단계에서 필요한 블록 수 계산
   → ceil(prompt_length / block_size) 개 물리 블록 할당
   → Block Table에 논리→물리 매핑 기록

2. Decode 단계:
   새 토큰 생성 시 현재 블록에 공간 있으면 추가
   블록 가득 차면 새 물리 블록 할당

3. 요청 완료:
   모든 물리 블록을 Free List에 반환

메모리 부족 시 Preemption (선점):
  방법 1: Swapping — KV 블록을 CPU 메모리로 이동
  방법 2: Recomputation — KV 캐시 삭제 후 나중에 재계산
  → GPU 메모리가 확보되면 다시 처리 재개

Copy-on-Write (beam search 등):
  여러 시퀀스가 동일 프롬프트를 공유할 때:
  Seq A: [Block 0 → Phys 7] [Block 1 → Phys 3]
  Seq B: [Block 0 → Phys 7] [Block 1 → Phys 3]  (공유!)
                                      ↓ (Seq B가 다른 토큰 생성)
  Seq B: [Block 0 → Phys 7] [Block 1 → Phys 5]  (CoW 복사)
  → 공통 접두사의 KV 캐시를 복제하지 않고 공유
  → Parallel sampling, beam search에서 메모리 절약`}</code>
        </pre>
        <h3 className="text-xl font-semibold mt-6 mb-3">Continuous Batching</h3>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`Static Batching vs Continuous Batching:

Static Batching (기존):
  배치 내 모든 요청이 완료될 때까지 대기
  Time →  [====Req1====]
          [====Req2==============]  ← 긴 응답
          [====Req3========]
          ↑ Req1 완료되어도 배치 끝까지 GPU 점유

Continuous Batching (vLLM):
  Iteration 단위로 요청을 동적으로 추가/제거
  Time →  [====Req1====][Req4===]
          [====Req2==============]
          [====Req3========][Req5]
          ↑ Req1 완료 즉시 Req4 투입 → GPU 활용률 극대화

vLLM 스케줄러 동작:
  매 iteration마다:
  1. Waiting 큐에서 새 요청 선택 (Prefill)
  2. Running 큐의 기존 요청 계속 (Decode)
  3. GPU 메모리 부족 시 우선순위 낮은 요청 Preempt
  4. Prefill과 Decode를 함께 배칭 (Chunked Prefill)

Chunked Prefill:
  긴 프롬프트를 청크로 나눠 Decode와 인터리빙
  → Prefill이 Decode를 블로킹하지 않음
  → Time-to-First-Token(TTFT) 개선`}</code>
        </pre>
        <h3 className="text-xl font-semibold mt-6 mb-3">Prefix Caching (APC)</h3>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`Automatic Prefix Caching:

동일한 시스템 프롬프트를 사용하는 요청들:
  Req1: [System Prompt] + [User Query 1]
  Req2: [System Prompt] + [User Query 2]

APC 없이:
  Req1: Prefill 전체 → KV 캐시 생성
  Req2: Prefill 전체 → KV 캐시 다시 생성 (중복!)

APC 사용:
  Req1: Prefill 전체 → KV 블록을 해시로 캐시
  Req2: System Prompt 해시 매치 → 캐시 히트!
        User Query 부분만 Prefill → 대폭 절약

해시 기반 블록 매칭:
  hash(token_ids, block_position) → Physical Block
  → 이전 요청의 KV 블록을 자동으로 재사용
  → 채팅, RAG 등 반복 프롬프트에서 효과적`}</code>
        </pre>
      </div>
    </section>
  );
}

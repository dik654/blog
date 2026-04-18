import OrderedViz from './viz/OrderedViz';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function Ordered({ onCodeRef }: Props) {
  return (
    <section id="ordered" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">ordered_broadcast: 인증서 체인</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          핵심 타입 3종: <code>Chunk</code>(sequencer + height + payload) · <code>Parent</code>(이전 인증서) · <code>Node</code>(Chunk + sig + Parent)
          <br />
          각 시퀀서가 독립 체인 — Node(h=N).parent.certificate = h=N-1의 쿼럼 인증서
          <br />
          height 0이면 Parent = None (genesis)
        </p>
        <p className="leading-7">
          <strong>Engine</strong>의 <code>select_loop!</code> — 노드 수신 → <code>read_staged()</code> 디코딩 → <code>validate_node()</code> 서명 검증
          <br />
          <strong>AckManager</strong> — 부분 서명 수집. 3중 Map: Sequencer → Height → Epoch → Evidence
          <br />
          2f+1 쿼럼 달성 → <code>Partials</code>에서 <code>Certificate</code>로 승격
        </p>
        <p className="leading-7">
          <strong>TipManager</strong> — 시퀀서별 최신 Node 추적. tip 존재 = 전체 체인(h=0~N) 확인됨
        </p>
      </div>
      <div className="not-prose mb-8">
        <OrderedViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Ordered Broadcast 프로토콜</h3>

        <div className="not-prose bg-muted/50 rounded-lg border p-4 my-4 space-y-4">
          <div>
            <p className="text-xs font-mono text-muted-foreground mb-2">목표</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="bg-background rounded-md border px-3 py-2 text-center">
                <p className="text-xs font-semibold">시퀀서별 인과 순서</p>
              </div>
              <div className="bg-background rounded-md border px-3 py-2 text-center">
                <p className="text-xs font-semibold">다중 시퀀서 동시 전파</p>
              </div>
              <div className="bg-background rounded-md border px-3 py-2 text-center">
                <p className="text-xs font-semibold">체인 독립 추적</p>
              </div>
              <div className="bg-background rounded-md border px-3 py-2 text-center">
                <p className="text-xs font-semibold">인증서로 쿼럼 증명</p>
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs font-mono text-muted-foreground mb-2">핵심 타입 4종</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="bg-background rounded-md border p-3">
                <p className="font-semibold text-sm"><code>Chunk</code></p>
                <div className="text-xs text-muted-foreground mt-1 space-y-0.5">
                  <p><code>sequencer: PublicKey</code> — 시퀀서 공개키</p>
                  <p><code>height: u64</code> — 체인 높이</p>
                  <p><code>payload: Bytes</code> — 페이로드 데이터</p>
                </div>
              </div>
              <div className="bg-background rounded-md border p-3">
                <p className="font-semibold text-sm"><code>Parent</code></p>
                <div className="text-xs text-muted-foreground mt-1 space-y-0.5">
                  <p><code>None</code> — genesis (h=0)</p>
                  <p><code>Some(Certificate)</code> — 이전 height 인증서 참조</p>
                </div>
              </div>
              <div className="bg-background rounded-md border p-3">
                <p className="font-semibold text-sm"><code>Node</code></p>
                <div className="text-xs text-muted-foreground mt-1 space-y-0.5">
                  <p><code>chunk: Chunk</code> — 데이터 청크</p>
                  <p><code>signature: Signature</code> — 시퀀서의 서명</p>
                  <p><code>parent: Parent</code> — 부모 인증서 참조</p>
                </div>
              </div>
              <div className="bg-background rounded-md border p-3">
                <p className="font-semibold text-sm"><code>Certificate</code></p>
                <div className="text-xs text-muted-foreground mt-1 space-y-0.5">
                  <p><code>sequencer: PublicKey</code></p>
                  <p><code>height: u64</code> · <code>payload_hash: Hash</code></p>
                  <p><code>quorum_signature: AggSignature</code> — BLS 집계</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs font-mono text-muted-foreground mb-2">체인 구조 — 시퀀서별 독립 선형 체인</p>
            <div className="bg-background rounded-md border p-3 text-sm">
              <p className="font-mono text-xs">
                Node(h=0, parent=None) → Node(h=1, parent=cert(h=0)) → Node(h=2, parent=cert(h=1)) → ...
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                각 시퀀서가 자체 체인 운영 · 시퀀서 간 독립 실행 · 전역 순서는 합의 계층에서 결정
              </p>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">Engine 처리 흐름</h3>
        <div className="not-prose bg-muted/50 rounded-lg border p-4 my-4">
          <p className="text-xs font-mono text-muted-foreground mb-2">handle_incoming_node — 노드 수신 시 7단계</p>
          <div className="space-y-2">
            <div className="bg-background rounded-md border p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs px-2 py-0.5 rounded font-semibold">1-2</span>
                <span className="text-sm font-semibold">파싱 & 서명 검증</span>
              </div>
              <p className="text-xs text-muted-foreground"><code>verify_signature(&chunk, &node.signature, &chunk.sequencer)</code> 실패 시 즉시 반환</p>
            </div>
            <div className="bg-background rounded-md border p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs px-2 py-0.5 rounded font-semibold">3</span>
                <span className="text-sm font-semibold">부모 인증서 검증</span>
              </div>
              <p className="text-xs text-muted-foreground"><code>Parent::Some(cert)</code> → <code>validate_parent(cert, height - 1)</code>로 체인 연속성 확인</p>
            </div>
            <div className="bg-background rounded-md border p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs px-2 py-0.5 rounded font-semibold">4</span>
                <span className="text-sm font-semibold">중복 검사</span>
              </div>
              <p className="text-xs text-muted-foreground"><code>ack_manager.has_node(hash(&node))</code> — 이미 본 노드면 스킵</p>
            </div>
            <div className="bg-background rounded-md border p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs px-2 py-0.5 rounded font-semibold">5-6</span>
                <span className="text-sm font-semibold">Ack 서명 & 브로드캐스트</span>
              </div>
              <p className="text-xs text-muted-foreground"><code>sign_ack(&node)</code> → <code>broadcast_ack(my_ack)</code>로 부분 서명 전파</p>
            </div>
            <div className="bg-background rounded-md border p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs px-2 py-0.5 rounded font-semibold">7</span>
                <span className="text-sm font-semibold">Tip 업데이트</span>
              </div>
              <p className="text-xs text-muted-foreground"><code>tip_manager.update(chunk.sequencer, node)</code> — 해당 시퀀서의 최신 노드 갱신</p>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">AckManager & TipManager</h3>
        <div className="not-prose bg-muted/50 rounded-lg border p-4 my-4 space-y-4">
          <div>
            <p className="text-xs font-mono text-muted-foreground mb-2">AckManager — 부분 서명 집계</p>
            <div className="bg-background rounded-md border p-3 text-sm">
              <p className="font-mono text-xs"><code>evidence: BTreeMap&lt;PublicKey, BTreeMap&lt;u64, BTreeMap&lt;u64, Evidence&gt;&gt;&gt;</code></p>
              <p className="text-xs text-muted-foreground mt-1">3중 Map: Sequencer → Height → Epoch → Evidence</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
              <div className="bg-background rounded-md border p-3">
                <p className="font-semibold text-xs"><code>Evidence::Partials</code></p>
                <p className="text-[11px] text-muted-foreground mt-1"><code>BTreeMap&lt;ValidatorIndex, PartialSig&gt;</code> — 수집 중인 부분 서명</p>
              </div>
              <div className="bg-background rounded-md border p-3">
                <p className="font-semibold text-xs"><code>Evidence::Certificate</code></p>
                <p className="text-[11px] text-muted-foreground mt-1">2f+1 쿼럼 달성 → 부분 서명 집계 → <code>Certificate</code>로 승격</p>
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs font-mono text-muted-foreground mb-2">TipManager — 시퀀서별 최신 Node 추적</p>
            <div className="bg-background rounded-md border p-3 text-sm">
              <p className="font-mono text-xs"><code>tips: BTreeMap&lt;PublicKey, Node&gt;</code></p>
              <p className="text-xs text-muted-foreground mt-1">
                <code>update()</code>: 기존 tip 없거나 새 height가 더 높으면 교체. tip 존재 = h=0~tip.height 전체 체인 검증 완료
              </p>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">BLS 서명 집계 & Epoch</h3>
        <div className="not-prose bg-muted/50 rounded-lg border p-4 my-4 space-y-4">
          <div>
            <p className="text-xs font-mono text-muted-foreground mb-2">BLS 서명 집계</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="bg-background rounded-md border p-3">
                <p className="font-semibold text-xs">Ack 서명</p>
                <p className="text-[11px] text-muted-foreground mt-1">sig_i = Sign(sk_i, (sequencer, height, payload_hash))</p>
              </div>
              <div className="bg-background rounded-md border p-3">
                <p className="font-semibold text-xs">집계</p>
                <p className="text-[11px] text-muted-foreground mt-1">agg_sig = sum(sig_i) in G1 · agg_pk = sum(pk_i) in G2</p>
              </div>
              <div className="bg-background rounded-md border p-3">
                <p className="font-semibold text-xs">검증</p>
                <p className="text-[11px] text-muted-foreground mt-1">e(agg_sig, G2) == e(hash_to_g1(msg), agg_pk) · 쿼럼: 2f+1 / 3f+1</p>
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs font-mono text-muted-foreground mb-2">Epoch 로테이션</p>
            <div className="bg-background rounded-md border p-3 text-sm">
              <p>검증자 집합이 시간에 따라 변경(멤버십 업데이트) · 각 epoch별 검증자 목록 · 인증서는 epoch 내 유효 · epoch 전환 시 재구성으로 이월</p>
            </div>
          </div>

          <div>
            <p className="text-xs font-mono text-muted-foreground mb-2">플랫 브로드캐스트 대비 장점</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="bg-background rounded-md border px-3 py-2">
                <p className="text-xs font-semibold">병렬성</p>
                <p className="text-[11px] text-muted-foreground">다중 시퀀서 = 더 높은 처리량</p>
              </div>
              <div className="bg-background rounded-md border px-3 py-2">
                <p className="text-xs font-semibold">분리</p>
                <p className="text-[11px] text-muted-foreground">체인 간 격리 · 최신 tip만 저장</p>
              </div>
              <div className="bg-background rounded-md border px-3 py-2">
                <p className="text-xs font-semibold">합의 연동</p>
                <p className="text-[11px] text-muted-foreground">합의는 tip만 순서화(해시) → 고처리량 DSMR 패턴</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

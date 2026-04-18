import type { CodeRef } from '@/components/code/types';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function PeerScoring({ onCodeRef }: Props) {
  return (
    <section id="peer-scoring" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">피어 스코어링</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          Prysm은 4가지 스코어러를 합산해 피어 품질을 평가한다.<br />
          점수가 임계값 이하로 떨어지면 연결을 끊고 IP를 블랙리스트에 추가한다.
        </p>
        <div className="not-prose flex flex-wrap gap-2 my-4">
          <CodeViewButton onClick={() => onCodeRef('peer-score', codeRefs['peer-score'])} />
          <span className="text-[10px] text-muted-foreground self-center">Score()</span>
          <CodeViewButton onClick={() => onCodeRef('peer-decay', codeRefs['peer-decay'])} />
          <span className="text-[10px] text-muted-foreground self-center">Decay()</span>
        </div>

        {/* ── GossipSub 스코어 파라미터 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">GossipSub Peer Score — 7가지 지표</h3>
        <div className="not-prose space-y-3 my-4">
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-3"><code>TopicScoreParams</code> — 토픽별 점수 7가지 지표</p>
            <div className="space-y-2 text-sm">
              <div className="flex gap-3 items-start border-l-2 border-green-500/50 pl-3">
                <span className="font-mono text-xs text-green-500 shrink-0">+</span>
                <div className="text-foreground/80"><strong>First message deliveries</strong> — 처음 메시지 전달 횟수. weight <code>1.0</code>, decay <code>0.999</code>, cap <code>1000</code></div>
              </div>
              <div className="flex gap-3 items-start border-l-2 border-yellow-500/50 pl-3">
                <span className="font-mono text-xs text-yellow-500 shrink-0">+/-</span>
                <div className="text-foreground/80"><strong>Mesh message deliveries</strong> — mesh peer 정상 전달 빈도. weight <code>-0.5</code>(목표 미달 시 감점), threshold <code>53.0</code>, window <code>2s</code></div>
              </div>
              <div className="flex gap-3 items-start border-l-2 border-orange-500/50 pl-3">
                <span className="font-mono text-xs text-orange-500 shrink-0">-</span>
                <div className="text-foreground/80"><strong>Mesh failure penalty</strong> — mesh에서 쫓아낸 피어. weight <code>-0.5</code>, decay <code>0.997</code></div>
              </div>
              <div className="flex gap-3 items-start border-l-2 border-red-500/50 pl-3">
                <span className="font-mono text-xs text-red-400 shrink-0">--</span>
                <div className="text-foreground/80"><strong>Invalid messages</strong> — 검증 실패 메시지. weight <code>-80.0</code>(가장 강력), decay <code>0.99</code></div>
              </div>
              <div className="flex gap-3 items-start border-l-2 border-blue-500/50 pl-3">
                <span className="font-mono text-xs text-blue-500 shrink-0">+</span>
                <div className="text-foreground/80"><strong>Time in mesh</strong> — 오래 참여할수록 가산. weight <code>0.0333</code>, quantum <code>12s</code>(slot), cap <code>300</code></div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs text-center">
            <div className="rounded border border-border/40 p-2 text-foreground/60">beacon_block: 엄격</div>
            <div className="rounded border border-border/40 p-2 text-foreground/60">attestation_{'{0-63}'}: 완화</div>
            <div className="rounded border border-border/40 p-2 text-foreground/60">voluntary_exit: 느슨</div>
          </div>
        </div>
        <p className="leading-7">
          GossipSub 스코어가 <strong>토픽별 정밀 조정</strong>.<br />
          invalid message는 -80 가중치로 강력 처벌 → 악의적 피어 즉시 배제.<br />
          decay로 시간 지나면 점수 회복 → 일시적 장애 용서.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">스코어 구성</h3>
        <ul>
          <li><strong>Gossip Score</strong> — 토픽별 메시지 전달 품질</li>
          <li><strong>Block Provider</strong> — 블록 응답 속도 및 정확도</li>
          <li><strong>Peer Status</strong> — 체인 헤드·Finalized 에폭 일치도</li>
          <li><strong>Bad Response</strong> — 잘못된 응답 횟수 기반 감점</li>
        </ul>

        {/* ── 실제 구현 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Prysm 4-scorer 아키텍처</h3>
        <div className="not-prose space-y-3 my-4">
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-2">beacon-chain/p2p/peers/scorers/ — <code>Service</code> 4-scorer 합산</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="rounded border border-border/40 p-3">
                <p className="text-xs font-bold text-blue-500 mb-1">1. GossipScorer</p>
                <p className="text-sm text-foreground/80">libp2p pubsub 점수 래퍼. 위 7가지 지표 통합 + 주기적 스냅샷.</p>
              </div>
              <div className="rounded border border-border/40 p-3">
                <p className="text-xs font-bold text-green-500 mb-1">2. BlockProviderScorer</p>
                <p className="text-sm text-foreground/80"><code>beacon_blocks_by_range</code> 요청 성공률 + 응답 속도(ms) + 정확도.</p>
              </div>
              <div className="rounded border border-border/40 p-3">
                <p className="text-xs font-bold text-purple-500 mb-1">3. PeerStatusScorer</p>
                <p className="text-sm text-foreground/80">status 메시지 기반 <code>head_root</code> 일치 + <code>finalized_epoch</code> 근접도.</p>
              </div>
              <div className="rounded border border-border/40 p-3">
                <p className="text-xs font-bold text-red-400 mb-1">4. BadResponsesScorer</p>
                <p className="text-sm text-foreground/80">protocol violation + SSZ 디코딩 오류 + timeout 초과 카운터.</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-2">합산: <code>Score(pid) = gossip + blockProvider + peerStatus + badResponses</code></p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-center">
              <div className="rounded border border-green-500/30 bg-green-500/5 p-2"><p className="font-bold text-green-500">S &gt; 0</p><p className="text-foreground/60">정상 피어</p></div>
              <div className="rounded border border-yellow-500/30 bg-yellow-500/5 p-2"><p className="font-bold text-yellow-500">-100 &lt; S &lt; 0</p><p className="text-foreground/60">관찰 대상</p></div>
              <div className="rounded border border-orange-500/30 bg-orange-500/5 p-2"><p className="font-bold text-orange-500">S &lt; -100</p><p className="text-foreground/60">연결 해제 + ban(30분)</p></div>
              <div className="rounded border border-red-500/30 bg-red-500/5 p-2"><p className="font-bold text-red-400">S &lt; -500</p><p className="text-foreground/60">IP 블랙리스트(1시간)</p></div>
            </div>
          </div>
        </div>
        <p className="leading-7">
          Prysm은 <strong>4개 독립 scorer 합산</strong> 방식.<br />
          각 지표가 다른 측면 평가 → 종합적 피어 품질 측정.<br />
          임계값별 차등 제재로 오버엔지니어링 방지.
        </p>

        {/* ── Decay 메커니즘 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">지수 감쇠 (Decay) — 자가 치유</h3>
        <div className="not-prose space-y-3 my-4">
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-2">지수 감쇠 — <code>new_score = old_score * decay_factor</code> (매 slot = 12초)</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <div className="rounded border border-border/40 p-2 text-foreground/70"><code>FirstMessageDeliveries</code> — decay <code>0.999</code> (매우 느린)</div>
              <div className="rounded border border-border/40 p-2 text-foreground/70"><code>MeshMessageDeliveries</code> — decay <code>0.997</code></div>
              <div className="rounded border border-border/40 p-2 text-foreground/70"><code>InvalidMessageDeliveries</code> — decay <code>0.99</code> (빠른, 복구 가능)</div>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-2">InvalidMessage 1회 후 시간 경과 예시</p>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs text-center">
              <div className="rounded border border-red-500/30 bg-red-500/5 p-2"><p className="font-bold">t=0</p><p className="text-foreground/60">-80</p></div>
              <div className="rounded border border-orange-500/30 bg-orange-500/5 p-2"><p className="font-bold">t=12s</p><p className="text-foreground/60">-79.2</p></div>
              <div className="rounded border border-yellow-500/30 bg-yellow-500/5 p-2"><p className="font-bold">t=2min</p><p className="text-foreground/60">-72.3</p></div>
              <div className="rounded border border-green-500/30 bg-green-500/5 p-2"><p className="font-bold">t=10min</p><p className="text-foreground/60">-48.5</p></div>
              <div className="rounded border border-blue-500/30 bg-blue-500/5 p-2"><p className="font-bold">t=1h</p><p className="text-foreground/60">-4.0 (거의 회복)</p></div>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-2"><code>DecayLoop()</code> / <code>ApplyDecay()</code></p>
            <p className="text-sm text-foreground/80 mb-2"><code>time.NewTicker(SECONDS_PER_SLOT)</code>마다 모든 피어 점수에 <code>score * decayFactor</code> 적용.</p>
            <div className="grid grid-cols-3 gap-2 text-xs text-center">
              <div className="rounded border border-border/40 p-2 text-foreground/60">일시적 장애 용서</div>
              <div className="rounded border border-border/40 p-2 text-foreground/60">정상 동작 시 자연 회복</div>
              <div className="rounded border border-border/40 p-2 text-foreground/60">오래된 점수 → 0 수렴</div>
            </div>
          </div>
        </div>
        <p className="leading-7">
          <strong>지수 감쇠</strong>가 자가 치유 메커니즘 — 일시적 장애에서 자연 복구.<br />
          매 slot(12초)마다 decay → 1시간 후 -80 → -4 (정상 복귀).<br />
          영구 ban 방지 + 정상 동작 인센티브.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 지수 감쇠 설계</strong> — Decay()가 주기적으로 호출되어 오래된 점수를 지수적으로 감쇠.<br />
          일시적 장애(네트워크 불안정 등)로 인한 영구 불이익을 방지.<br />
          정상 복귀한 피어가 자연스럽게 점수를 회복하는 자가 치유 메커니즘.
        </p>
      </div>
    </section>
  );
}

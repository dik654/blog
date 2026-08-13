import type { CodeRef } from "@/components/code/types";
import { CodeViewButton } from "@/components/code";
import { codeRefs } from "./codeRefs";

interface Props {
  onCodeRef: (key: string, ref: CodeRef) => void;
}

export default function PeerScoring({ onCodeRef }: Props) {
  return (
    <section id="peer-scoring" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">피어 스코어링</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Prysm은 GossipSub의 topic score와 application-level peer scorer를 함께 사용해 message delivery, invalid behavior와 connection quality를 평가합니다. Score가 각 action threshold를 넘거나 밑돌면 gossip publish·mesh 참여·RPC·connection 유지에 서로 다른 제한이 적용되며, 모든 낮은 점수가 곧바로 영구 IP blacklist를 뜻하지는 않습니다.
        </p>
        <div className="not-prose flex flex-wrap gap-2 my-4">
          <CodeViewButton
            onClick={() => onCodeRef("peer-score", codeRefs["peer-score"])}
          />
          <span className="text-xs text-muted-foreground self-center">
            Score()
          </span>
          <CodeViewButton
            onClick={() => onCodeRef("peer-decay", codeRefs["peer-decay"])}
          />
          <span className="text-xs text-muted-foreground self-center">
            Decay()
          </span>
        </div>

        {/* ── GossipSub 스코어 파라미터 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">
          GossipSub Peer Score — 7가지 지표
        </h3>
        <div className="not-prose space-y-3 my-4">
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-3">
              <code>TopicScoreParams</code> — 토픽별 점수 7가지 지표
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex gap-3 items-start border-l-2 border-green-500/50 pl-3">
                <span className="font-mono text-xs text-green-500 shrink-0">
                  +
                </span>
                <div className="text-foreground/80">
                  <strong>First message deliveries</strong> — 처음 메시지 전달
                  횟수. weight <code>1.0</code>, decay <code>0.999</code>, cap{" "}
                  <code>1000</code>
                </div>
              </div>
              <div className="flex gap-3 items-start border-l-2 border-yellow-500/50 pl-3">
                <span className="font-mono text-xs text-yellow-500 shrink-0">
                  +/-
                </span>
                <div className="text-foreground/80">
                  <strong>Mesh message deliveries</strong> — mesh peer 정상 전달
                  빈도. weight <code>-0.5</code>(목표 미달 시 감점), threshold{" "}
                  <code>53.0</code>, window <code>2s</code>
                </div>
              </div>
              <div className="flex gap-3 items-start border-l-2 border-orange-500/50 pl-3">
                <span className="font-mono text-xs text-orange-500 shrink-0">
                  -
                </span>
                <div className="text-foreground/80">
                  <strong>Mesh failure penalty</strong> — mesh에서 쫓아낸 피어.
                  weight <code>-0.5</code>, decay <code>0.997</code>
                </div>
              </div>
              <div className="flex gap-3 items-start border-l-2 border-red-500/50 pl-3">
                <span className="font-mono text-xs text-red-400 shrink-0">
                  --
                </span>
                <div className="text-foreground/80">
                  <strong>Invalid messages</strong> — 검증 실패 메시지. weight{" "}
                  <code>-80.0</code>(가장 강력), decay <code>0.99</code>
                </div>
              </div>
              <div className="flex gap-3 items-start border-l-2 border-blue-500/50 pl-3">
                <span className="font-mono text-xs text-blue-500 shrink-0">
                  +
                </span>
                <div className="text-foreground/80">
                  <strong>Time in mesh</strong> — 오래 참여할수록 가산. weight{" "}
                  <code>0.0333</code>, quantum <code>12s</code>(slot), cap{" "}
                  <code>300</code>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs text-center">
            <div className="rounded border border-border/40 p-2 text-foreground/60">
              beacon_block: 엄격
            </div>
            <div className="rounded border border-border/40 p-2 text-foreground/60">
              attestation_{"{0-63}"}: 완화
            </div>
            <div className="rounded border border-border/40 p-2 text-foreground/60">
              voluntary_exit: 느슨
            </div>
          </div>
        </div>
        <p>
          GossipSub score는 topic별 delivery와 invalid-message behavior를 따로 반영합니다. Invalid message에는 큰 negative weight를 주어 빠르게 격리하고, 시간이 지나면 decay를 적용해 일시적인 network 문제에서 회복할 수 있게 합니다. 실제 weight와 threshold는 Prysm·go-libp2p version의 parameter를 확인해야 합니다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">스코어 구성</h3>
        <ul>
          <li>
            <strong>Gossip Score</strong> — 토픽별 메시지 전달 품질
          </li>
          <li>
            <strong>Block Provider</strong> — 블록 응답 속도 및 정확도
          </li>
          <li>
            <strong>Peer Status</strong> — 체인 헤드·Finalized 에폭 일치도
          </li>
          <li>
            <strong>Bad Response</strong> — 잘못된 응답 횟수 기반 감점
          </li>
        </ul>

        {/* ── 실제 구현 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">
          Prysm 4-scorer 아키텍처
        </h3>
        <div className="not-prose space-y-3 my-4">
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-2">
              beacon-chain/p2p/peers/scorers/ — <code>Service</code> 4-scorer
              합산
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="rounded border border-border/40 p-3">
                <p className="text-xs font-bold text-blue-500 mb-1">
                  1. GossipScorer
                </p>
                <p className="text-sm text-foreground/80">
                  libp2p pubsub 점수 래퍼. 위 7가지 지표 통합 + 주기적 스냅샷.
                </p>
              </div>
              <div className="rounded border border-border/40 p-3">
                <p className="text-xs font-bold text-green-500 mb-1">
                  2. BlockProviderScorer
                </p>
                <p className="text-sm text-foreground/80">
                  <code>beacon_blocks_by_range</code> 요청 성공률 + 응답
                  속도(ms) + 정확도.
                </p>
              </div>
              <div className="rounded border border-border/40 p-3">
                <p className="text-xs font-bold text-purple-500 mb-1">
                  3. PeerStatusScorer
                </p>
                <p className="text-sm text-foreground/80">
                  status 메시지 기반 <code>head_root</code> 일치 +{" "}
                  <code>finalized_epoch</code> 근접도.
                </p>
              </div>
              <div className="rounded border border-border/40 p-3">
                <p className="text-xs font-bold text-red-400 mb-1">
                  4. BadResponsesScorer
                </p>
                <p className="text-sm text-foreground/80">
                  protocol violation + SSZ 디코딩 오류 + timeout 초과 카운터.
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-2">
              합산:{" "}
              <code>
                Score(pid) = gossip + blockProvider + peerStatus + badResponses
              </code>
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-center">
              <div className="rounded border border-green-500/30 bg-green-500/5 p-2">
                <p className="font-bold text-green-500">S &gt; 0</p>
                <p className="text-foreground/60">정상 피어</p>
              </div>
              <div className="rounded border border-yellow-500/30 bg-yellow-500/5 p-2">
                <p className="font-bold text-yellow-500">-100 &lt; S &lt; 0</p>
                <p className="text-foreground/60">관찰 대상</p>
              </div>
              <div className="rounded border border-orange-500/30 bg-orange-500/5 p-2">
                <p className="font-bold text-orange-500">S &lt; -100</p>
                <p className="text-foreground/60">연결 해제 + ban(30분)</p>
              </div>
              <div className="rounded border border-red-500/30 bg-red-500/5 p-2">
                <p className="font-bold text-red-400">S &lt; -500</p>
                <p className="text-foreground/60">IP 블랙리스트(1시간)</p>
              </div>
            </div>
          </div>
        </div>
        <p>
          여러 scorer를 분리하면 “message를 잘 전달했는가”, “RPC가 유효했는가”, “node가 chain head를 따라오고 있는가”처럼 서로 다른 failure mode를 구분할 수 있습니다. 최종 action은 합산 score와 용도별 threshold를 사용하므로 한 번의 느린 response와 반복적인 invalid gossip을 같은 강도로 처벌하지 않습니다.
        </p>

        {/* ── Decay 메커니즘 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">
          지수 감쇠 (Decay) — 자가 치유
        </h3>
        <div className="not-prose space-y-3 my-4">
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-2">
              지수 감쇠 — <code>new_score = old_score * decay_factor</code> (매
              slot = 12초)
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <div className="rounded border border-border/40 p-2 text-foreground/70">
                <code>FirstMessageDeliveries</code> — decay <code>0.999</code>{" "}
                (매우 느린)
              </div>
              <div className="rounded border border-border/40 p-2 text-foreground/70">
                <code>MeshMessageDeliveries</code> — decay <code>0.997</code>
              </div>
              <div className="rounded border border-border/40 p-2 text-foreground/70">
                <code>InvalidMessageDeliveries</code> — decay <code>0.99</code>{" "}
                (빠른, 복구 가능)
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-2">
              InvalidMessage 1회 후 시간 경과 예시
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs text-center">
              <div className="rounded border border-red-500/30 bg-red-500/5 p-2">
                <p className="font-bold">t=0</p>
                <p className="text-foreground/60">-80</p>
              </div>
              <div className="rounded border border-orange-500/30 bg-orange-500/5 p-2">
                <p className="font-bold">t=12s</p>
                <p className="text-foreground/60">-79.2</p>
              </div>
              <div className="rounded border border-yellow-500/30 bg-yellow-500/5 p-2">
                <p className="font-bold">t=2min</p>
                <p className="text-foreground/60">-72.3</p>
              </div>
              <div className="rounded border border-green-500/30 bg-green-500/5 p-2">
                <p className="font-bold">t=10min</p>
                <p className="text-foreground/60">-48.5</p>
              </div>
              <div className="rounded border border-blue-500/30 bg-blue-500/5 p-2">
                <p className="font-bold">t=1h</p>
                <p className="text-foreground/60">-4.0 (거의 회복)</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-2">
              <code>DecayLoop()</code> / <code>ApplyDecay()</code>
            </p>
            <p className="text-sm text-foreground/80 mb-2">
              <code>time.NewTicker(SECONDS_PER_SLOT)</code>마다 모든 피어 점수에{" "}
              <code>score * decayFactor</code> 적용.
            </p>
            <div className="grid grid-cols-3 gap-2 text-xs text-center">
              <div className="rounded border border-border/40 p-2 text-foreground/60">
                일시적 장애 용서
              </div>
              <div className="rounded border border-border/40 p-2 text-foreground/60">
                정상 동작 시 자연 회복
              </div>
              <div className="rounded border border-border/40 p-2 text-foreground/60">
                오래된 점수 → 0 수렴
              </div>
            </div>
          </div>
        </div>
        <p>
          Exponential decay는 오래된 관측의 영향력을 점차 줄이는 self-healing mechanism입니다. 감소 주기와 factor는 scorer마다 다를 수 있으므로 특정 시간 뒤의 점수를 고정해 설명하기보다, 현재 parameter로 half-life를 계산하고 정상 동작을 재개한 peer가 어느 시점에 threshold를 회복하는지 확인해야 합니다.
        </p>

        <p className="mt-4 border-l-2 border-amber-500/50 pl-3 text-sm">
          <strong>💡 지수 감쇠 설계</strong> — Decay()가 주기적으로 호출되어
          오래된 score를 지수적으로 줄입니다. 이 설계는 network 불안정으로 한때 나쁜 점수를 받은 정상 peer가 행동을 회복했을 때 영구적으로 배제되는 것을 막으면서도, invalid behavior가 반복되면 새 penalty가 계속 누적되게 합니다.
        </p>
      </div>
    </section>
  );
}

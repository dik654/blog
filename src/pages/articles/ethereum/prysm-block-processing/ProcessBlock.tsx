import type { CodeRef } from '@/components/code/types';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function ProcessBlock({ onCodeRef }: Props) {
  return (
    <section id="process-block" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">ProcessBlock 내부</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('on-block', codeRefs['on-block'])} />
          <span className="text-[10px] text-muted-foreground self-center">onBlock()</span>
        </div>

        {/* ── RANDAO processing ── */}
        <h3 className="text-xl font-semibold mt-4 mb-3">RANDAO 처리 — 예측 불가능한 랜덤성</h3>
        <div className="my-4 not-prose space-y-3">
          <div className="rounded-lg border border-indigo-500/20 bg-indigo-500/5 p-4">
            <p className="font-semibold text-sm text-indigo-400 mb-3"><code>processRandao(state, body)</code></p>
            <div className="space-y-2 text-xs text-foreground/70">
              {[
                { step: '1', label: 'randao_reveal 서명 검증', detail: 'proposer가 epoch에 대해 BLS 서명 → computeSigningRoot + DOMAIN_RANDAO로 검증' },
                { step: '2', label: 'randao_mix XOR 업데이트', detail: 'hash(randao_reveal) XOR RandaoMixes[epoch % 65536] → 새 mix' },
              ].map(s => (
                <div key={s.step} className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold bg-indigo-500/20 text-indigo-400 shrink-0">{s.step}</span>
                  <div>
                    <p className="text-sm font-semibold text-foreground/80">{s.label}</p>
                    <p className="text-foreground/60">{s.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="rounded-lg border border-sky-500/20 bg-sky-500/5 p-4">
              <p className="font-semibold text-sm text-sky-400 mb-2">RANDAO 보안 특성</p>
              <div className="space-y-1 text-xs text-foreground/70">
                <div><strong>Forward secrecy:</strong> 과거 값으로 미래 예측 불가</div>
                <div><strong>Bias resistance:</strong> 서명은 deterministic → "skip vs sign" 선택만 가능</div>
                <div><strong>Collusion resistance:</strong> 여러 proposer 담합해도 제한적 영향</div>
              </div>
            </div>
            <div className="rounded-lg border border-border p-4">
              <p className="text-xs font-semibold text-muted-foreground mb-2">사용처</p>
              <div className="space-y-1 text-xs text-foreground/70">
                <div>다음 epoch의 proposer 선출</div>
                <div>Committee 할당 (attestation 할당)</div>
                <div>Block proposer shuffling</div>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-border p-4">
            <p className="text-xs font-semibold text-muted-foreground mb-2"><code>get_beacon_proposer_index</code> 공식</p>
            <div className="text-xs text-foreground/70 space-y-1">
              <div><code>epoch_randao = mix_in_historical_vector(state, epoch)</code></div>
              <div><code>random_byte = hash(epoch_randao || slot.to_bytes(8))[byte_index]</code></div>
              <div><code>candidate = active_validators[random_byte * N / 256]</code> — effective_balance check 통과까지 반복</div>
            </div>
          </div>
        </div>
        <p className="leading-7">
          RANDAO는 <strong>분산 랜덤성 누적</strong>.<br />
          각 proposer의 BLS 서명 → hash → XOR로 누적.<br />
          proposer 선출, committee 할당의 randomness source.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 RANDAO 보안</strong> — 제안자의 BLS 서명을 domain_randao로 검증 후 randaoMixes[epoch % 65536]에 XOR 반영.<br />
          이전 RANDAO 값과 혼합하여 예측 불가능한 랜덤성 확보.
        </p>

        {/* ── Eth1 Data ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Eth1 Data — EL 상태 브릿지</h3>
        <div className="my-4 not-prose space-y-3">
          <div className="rounded-lg border border-sky-500/20 bg-sky-500/5 p-4">
            <p className="font-semibold text-sm text-sky-400 mb-2">Eth1Data 구조체</p>
            <div className="space-y-1 text-xs">
              <div><code className="text-sky-300">deposit_root: Bytes32</code> <span className="text-foreground/60">— deposit contract의 Merkle root</span></div>
              <div><code className="text-sky-300">deposit_count: uint64</code> <span className="text-foreground/60">— 총 deposit 수</span></div>
              <div><code className="text-sky-300">block_hash: Bytes32</code> <span className="text-foreground/60">— EL 블록 hash</span></div>
            </div>
          </div>
          <div className="rounded-lg border border-indigo-500/20 bg-indigo-500/5 p-4">
            <p className="font-semibold text-sm text-indigo-400 mb-3"><code>processEth1Data(state, body)</code></p>
            <div className="space-y-2 text-xs text-foreground/70">
              <div className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold bg-indigo-500/20 text-indigo-400 shrink-0">1</span>
                <div><strong>투표 추가:</strong> <code>Eth1DataVotes = append(Eth1DataVotes, body.Eth1Data)</code></div>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold bg-indigo-500/20 text-indigo-400 shrink-0">2</span>
                <div><strong>과반 체크:</strong> <code>votes * 2 &gt; SLOTS_PER_ETH1_VOTING_PERIOD(2048)</code> → <code>state.Eth1Data</code> 확정</div>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-border p-4">
            <p className="text-xs font-semibold text-muted-foreground mb-2">EL → CL 브릿지 흐름</p>
            <div className="space-y-1 text-xs text-foreground/70">
              <div><strong>1.</strong> user deposit → EL deposit contract → deposit_root 증가</div>
              <div><strong>2.</strong> CL proposer가 <code>eth1_data</code> 투표 (매 블록)</div>
              <div><strong>3.</strong> 2 epochs 과반 달성 → <code>eth1_data</code> 업데이트</div>
              <div><strong>4.</strong> <code>eth1_deposit_index</code> 증가 → 새 validator 등록 가능</div>
            </div>
            <p className="text-xs text-foreground/50 mt-2">Bellatrix(The Merge) 이후: EL = CL 같은 노드 통합, eth1_data는 execution_payload의 block_hash 참조</p>
          </div>
        </div>
        <p className="leading-7">
          Eth1Data는 <strong>EL → CL 정보 브릿지</strong>.<br />
          deposit contract 상태를 proposer 투표로 채택.<br />
          2 epoch 과반 달성 시 eth1_data 확정 → validator registry 업데이트.
        </p>

        <p className="text-sm border-l-2 border-violet-500/50 pl-3 mt-4">
          <strong>💡 eth1 투표 과반</strong> — 제안자가 관찰한 eth1 블록 해시를 투표.<br />
          eth1_data_votes에 추가, 과반 시 상태에 확정.<br />
          예치금 컨트랙트 상태를 비콘 체인에 반영하는 브릿지 역할.
        </p>
      </div>
    </section>
  );
}

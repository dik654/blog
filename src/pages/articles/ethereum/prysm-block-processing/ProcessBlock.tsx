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
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// RANDAO: 분산 랜덤성 소스
// 각 validator의 BLS 서명을 누적하여 예측 불가능한 값 생성

func processRandao(state *BeaconState, body *BeaconBlockBody) error {
    epoch := slotToEpoch(state.Slot())
    proposer_index := getBeaconProposerIndex(state)
    proposer_pubkey := state.Validators[proposer_index].Pubkey

    // 1. randao_reveal 서명 검증
    //    proposer가 epoch에 대해 서명했는지 확인
    signing_root := computeSigningRoot(epoch, getDomain(state, DOMAIN_RANDAO, epoch))
    if !bls.Verify(proposer_pubkey, signing_root, body.RandaoReveal) {
        return ErrInvalidRandaoReveal
    }

    // 2. randao_mix 업데이트 (XOR)
    //    hash(randao_reveal) XOR 기존 mix
    mix_index := epoch % EPOCHS_PER_HISTORICAL_VECTOR  // 65536
    prev_mix := state.RandaoMixes[mix_index]
    new_mix := xor(prev_mix, hash(body.RandaoReveal))
    state.RandaoMixes[mix_index] = new_mix

    return nil
}

// RANDAO의 특성:
// - Forward secrecy: 과거 값 알아도 미래 예측 불가
// - Bias resistance: 악의적 proposer가 편향 제한적
//   (서명은 deterministic이므로 "skip vs sign" 선택만 가능)
// - Collusion resistance: 여러 proposer 담합해도 제한적 영향

// 사용처:
// - 다음 epoch의 proposer 선출
// - Committee 할당 (attestation 할당)
// - Block proposer shuffling

// get_beacon_proposer_index 공식:
// epoch_randao = mix_in_historical_vector(state, epoch)
// random_byte = hash(epoch_randao || slot.to_bytes(8))[byte_index]
// candidate = active_validators[random_byte * N / 256]
// 반복 until selected validator passes effective_balance check`}
        </pre>
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
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Eth1Data: EL(실행 계층)의 deposit contract 상태를 CL로 가져오기
struct Eth1Data {
    deposit_root: Bytes32,         // deposit contract의 Merkle root
    deposit_count: uint64,          // 총 deposit 수
    block_hash: Bytes32,            // EL 블록 hash
}

// proposer가 블록에 eth1_data 포함
// → eth1_data_votes에 추가
// → 과반 달성 시 state.eth1_data 확정

func processEth1Data(state *BeaconState, body *BeaconBlockBody) error {
    // 1. proposer의 투표 추가
    state.Eth1DataVotes = append(state.Eth1DataVotes, body.Eth1Data)

    // 2. 과반 체크 (2048 votes over 2 epochs)
    //    SLOTS_PER_ETH1_VOTING_PERIOD = 2048
    votes := countVotes(state.Eth1DataVotes, body.Eth1Data)
    if votes * 2 > SLOTS_PER_ETH1_VOTING_PERIOD {
        // 과반 → state.eth1_data 확정
        state.Eth1Data = body.Eth1Data
    }

    return nil
}

// 목적:
// validator deposit은 EL에서 처리됨 (deposit contract)
// CL이 새 validator를 알려면 deposit_root 추적 필요
// → Eth1Data voting으로 CL이 EL 상태 "투표"로 채택

// 흐름:
// 1. user deposit → EL의 deposit contract → deposit_root 증가
// 2. CL proposer가 eth1_data 투표 (매 블록)
// 3. 2 epochs 과반 달성 → eth1_data 업데이트
// 4. state.eth1_deposit_index 증가 → 새 validator 등록 가능

// Bellatrix(The Merge) 이후:
// - EL = CL 같은 노드로 통합 관리
// - eth1_data는 execution_payload의 block_hash 참조`}
        </pre>
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

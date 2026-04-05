import type { CodeRef } from '@/components/code/types';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function RegularSync({ onCodeRef }: Props) {
  return (
    <section id="regular-sync" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Regular Sync</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          초기 동기화가 완료되면 Regular Sync 모드로 전환한다.<br />
          GossipSub를 통해 새 블록을 실시간으로 수신하고 처리한다.
        </p>
        <div className="not-prose flex flex-wrap gap-2 my-4">
          <CodeViewButton onClick={() => onCodeRef('save-received-block', codeRefs['save-received-block'])} />
          <span className="text-[10px] text-muted-foreground self-center">processBlock()</span>
        </div>

        {/* ── Regular Sync 처리 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">실시간 블록 수신 파이프라인</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Regular Sync의 블록 처리 흐름 (gossip validation + full validation)

func (s *Service) beaconBlockSubscriber(
    ctx context.Context,
    msg pubsub.Message,
) error {
    // 1. Gossip-level validation (이미 완료)
    //    validateBeaconBlockPubSub()에서 기본 검증

    // 2. 블록 디코딩
    block, err := decodeBlock(msg.Data)
    if err != nil { return err }

    // 3. parent 존재 확인
    parentRoot := block.Block.ParentRoot
    if !s.hasBlock(parentRoot) {
        // parent 없음 → block queue에 저장
        // 나중에 parent 도착 시 처리
        return s.pendingQueue.add(block)
    }

    // 4. 전체 state transition 실행
    if err := s.chain.ProcessBlock(ctx, block); err != nil {
        log.Error("ProcessBlock failed", "error", err)
        return err
    }

    // 5. Fork choice 업데이트
    s.forkChoice.OnBlock(ctx, block, blockRoot, state)

    // 6. Head 재계산
    newHead, err := s.forkChoice.GetHead()
    if newHead != s.chain.Head() {
        s.chain.SetHead(newHead)
        // Engine API에 forkchoiceUpdated 전송
        s.notifyEngineForkChoice()
    }

    // 7. Pending queue 재확인 (이 block이 parent였던 children 처리)
    s.processPendingChildren(blockRoot)

    return nil
}

// 성능 (메인넷):
// - Gossip validation: ~10ms
// - Block decode: ~5ms
// - State transition: ~50-100ms
// - Fork choice: ~5ms
// - 총: ~70-120ms per block`}
        </pre>
        <p className="leading-7">
          Regular Sync는 <strong>gossip 수신 + state transition 파이프라인</strong>.<br />
          parent 검증 → 전체 실행 → fork choice → engine API 순서.<br />
          블록당 ~100ms (12초 slot 대비 여유).
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">실시간 처리 흐름</h3>
        <ul>
          <li><strong>GossipSub 수신</strong> — beacon_block 토픽에서 블록 도착</li>
          <li><strong>검증</strong> — 서명, 제안자, 부모 존재 여부 확인</li>
          <li><strong>상태 전환</strong> — 슬롯 처리 + 블록 처리 실행</li>
          <li><strong>Fork Choice 갱신</strong> — OnBlock() 호출로 헤드 재계산</li>
        </ul>

        {/* ── BlocksByRoot fallback ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">BlocksByRoot — gossip fallback</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Gossip 실패 시 fallback 메커니즘

// /eth2/beacon_chain/req/beacon_blocks_by_root/2/ssz_snappy
// RPC: block root 목록으로 직접 요청

struct BeaconBlocksByRootRequest = List[Root, MAX_REQUEST_BLOCKS]  // max 1024

// 사용 시나리오:
// 1. Attestation 수신했는데 head block root 모름
//    → BlocksByRoot로 peer에게 요청
// 2. GossipSub topic에 가입 중 아닌데 특정 block 필요
// 3. Pending queue의 누락된 parent 요청
// 4. Reorg 복구 (side chain 블록 수집)

// Prysm 구현:
func (s *Service) requestMissingBlock(root Root) (*Block, error) {
    // 1. 피어 중 이 블록 가진 것 찾기
    //    (보통 모든 connected peer에게 시도)
    for _, peer := range s.p2p.Peers() {
        blocks, err := s.requestBlocksByRoot(peer, []Root{root})
        if err == nil && len(blocks) > 0 {
            return blocks[0], nil
        }
    }
    return nil, ErrBlockNotFound
}

// Rate limiting:
// - peer당 1분당 최대 ~100개 root 요청
// - 과다 요청 시 peer reputation 감점

// 실패 시:
// - 모든 peer에서 못 찾으면 "orphaned" block
// - pending queue에서 오래 기다리면 (1 epoch) 삭제
// - fork choice에서도 제외`}
        </pre>
        <p className="leading-7">
          <strong>BlocksByRoot</strong>가 gossip의 안전망.<br />
          누락된 parent, attestation의 head 등을 직접 요청.<br />
          peer rate-limit 고려 + 여러 peer 시도.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 BlocksByRoot 폴백</strong> — GossipSub 전파 지연이나 네트워크 분할 시 누락된 블록을 BlocksByRoot RPC로 개별 요청.<br />
          가십 실패에 대한 안전망 역할.
        </p>
      </div>
    </section>
  );
}

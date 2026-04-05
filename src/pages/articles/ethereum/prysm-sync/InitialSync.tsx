import type { CodeRef } from '@/components/code/types';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function InitialSync({ onCodeRef }: Props) {
  return (
    <section id="initial-sync" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Initial Sync</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          Initial Sync는 <code>BlocksByRange</code> RPC를 사용해 피어에서 블록을 배치로 요청한다.
        </p>
        <div className="not-prose flex flex-wrap gap-2 my-4">
          <CodeViewButton onClick={() => onCodeRef('round-robin-sync', codeRefs['round-robin-sync'])} />
          <span className="text-[10px] text-muted-foreground self-center">roundRobinSync()</span>
          <CodeViewButton onClick={() => onCodeRef('blocks-by-range-handler', codeRefs['blocks-by-range-handler'])} />
          <span className="text-[10px] text-muted-foreground self-center">BlocksByRange 핸들러</span>
        </div>

        {/* ── BlocksByRange 프로토콜 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">BlocksByRange RPC — 배치 다운로드</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// eth2 P2P RPC 프로토콜
// /eth2/beacon_chain/req/beacon_blocks_by_range/2/ssz_snappy

struct BeaconBlocksByRangeRequest {
    start_slot: Slot,      // 시작 slot
    count: uint64,          // 요청 block 수 (max 1024)
    step: uint64,           // 간격 (보통 1)
}

// Response: N개 block SSZ-Snappy 인코딩된 stream
// 응답 제한:
// - count 최대 1024 (MAX_REQUEST_BLOCKS)
// - 응답당 ~100MB 이내
// - 타임아웃 10초

// Prysm 클라이언트 측:
func requestBlocksByRange(
    peer peer.ID,
    start Slot,
    count uint64,
) ([]*SignedBeaconBlock, error) {
    req := &BeaconBlocksByRangeRequest{
        StartSlot: start,
        Count: count,
        Step: 1,
    }

    // libp2p stream 열기
    stream, err := host.NewStream(ctx, peer, blocksByRangeTopic)
    if err != nil { return nil, err }

    // 요청 서명 + 전송
    encoded := encodeSnappy(req)
    stream.Write(encoded)

    // 응답 수신 (streaming)
    blocks := []*SignedBeaconBlock{}
    for i := 0; i < count; i++ {
        block, err := readSnappyStream(stream)
        if err == io.EOF { break }
        blocks = append(blocks, block)
    }

    return blocks, nil
}

// Rate limiting:
// peer별 minute당 max ~5000 blocks 요청
// 초과 시 peer 연결 해제 + reputation 감점`}
        </pre>
        <p className="leading-7">
          <code>BlocksByRange</code>가 <strong>배치 다운로드 표준</strong>.<br />
          한 번에 최대 1024 blocks → 효율적 bulk transfer.<br />
          libp2p stream 기반 SSZ-Snappy 인코딩.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">라운드로빈 전략</h3>
        <ul>
          <li><strong>피어 필터링</strong> — 헤드 슬롯이 우리보다 앞선 피어만 선택</li>
          <li><strong>범위 분배</strong> — [0-63] → 피어A, [64-127] → 피어B 식으로 분산</li>
          <li><strong>응답 정렬</strong> — 도착 순서 무관하게 슬롯 순으로 정렬</li>
          <li><strong>순차 처리</strong> — 상태 전환은 반드시 슬롯 순서대로 실행</li>
        </ul>

        {/* ── roundRobinSync 구현 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">roundRobinSync — 병렬 다운로드 알고리즘</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`func (s *Service) roundRobinSync(
    ctx context.Context,
    genesis time.Time,
) error {
    // 1. 피어 선택 (head slot > ours)
    peers := s.p2p.Peers().AheadOfUs()

    currentSlot := s.chain.HeadSlot()
    targetSlot := s.networkTipSlot()  // 네트워크 head

    // 2. 범위를 chunks로 분할
    const BATCH_SIZE = 64
    chunks := []SlotRange{}
    for s := currentSlot + 1; s <= targetSlot; s += BATCH_SIZE {
        chunks = append(chunks, SlotRange{Start: s, Count: BATCH_SIZE})
    }

    // 3. 각 chunk를 피어에 round-robin 할당
    responses := make(chan []*Block, len(chunks))
    for i, chunk := range chunks {
        peer := peers[i % len(peers)]  // round-robin

        go func(p peer.ID, c SlotRange) {
            blocks, err := requestBlocksByRange(p, c.Start, c.Count)
            if err == nil { responses <- blocks }
        }(peer, chunk)
    }

    // 4. 응답 수집 + 정렬
    allBlocks := []*Block{}
    for i := 0; i < len(chunks); i++ {
        batch := <-responses
        allBlocks = append(allBlocks, batch...)
    }
    sort.Slice(allBlocks, func(i, j int) bool {
        return allBlocks[i].Slot < allBlocks[j].Slot
    })

    // 5. 순차 처리 (state transition)
    for _, block := range allBlocks {
        if err := s.chain.ProcessBlock(block); err != nil {
            return err  // invalid block → sync 중단
        }
    }

    return nil
}

// 성능:
// - 다운로드: 병렬 (peer 수만큼)
// - 실행: 순차 (state transition 제약)
// - 메인넷 1500만 slot sync: ~24시간`}
        </pre>
        <p className="leading-7">
          <strong>Round-robin + 병렬 다운로드 + 순차 실행</strong>.<br />
          chunk별 다른 peer 할당 → bandwidth 최대 활용.<br />
          state transition은 순차 필수 → execution 병목.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 병렬 다운로드 + 순차 실행</strong> — 다운로드는 여러 피어에 병렬 분산하지만 상태 전환은 반드시 순차 실행해야 함.<br />
          slot N의 상태가 slot N+1의 입력.<br />
          이 구조가 Initial Sync의 근본적 속도 한계.
        </p>
      </div>
    </section>
  );
}

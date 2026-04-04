import type { CodeRef } from '@/components/code/types';

export const codeRefsDb: Record<string, CodeRef> = {
  'monad-triedb-node': {
    path: 'category/state/triedb/node.hpp',
    code: `// MonadDB 노드 구조
class NodeBase {
  uint16_t mask{0};
  bool has_value{false};
  int64_t version{0};
};
class Db {
  Db(StateMachine &);
  Db(StateMachine &, OnDiskConfig &);
  Db(AsyncIOContext &);
  Result<NodeCursor> find(NibblesView, uint64_t);
  void upsert(UpdateList, uint64_t block_id);
};`,
    lang: 'c',
    highlight: [1, 13],
    desc: 'TrieDB 노드: 4타입 + 3 DB 모드.',
    annotations: [
      { lines: [2, 5], color: 'sky', note: 'NodeBase: mask + version' },
      { lines: [7, 12], color: 'emerald', note: '3모드: memory, RW, RO' },
    ],
  },
  'monad-io-uring': {
    path: 'category/state/triedb/async_io.cpp',
    code: `// io_uring 비동기 I/O
class AsyncIOContext {
  io_uring read_ring_;
  io_uring write_ring_;
  DMABufferPool pool_;
  void submit_read(uint64_t offset, size_t len) {
    auto* buf = pool_.acquire();
    io_uring_sqe* sqe =
      io_uring_get_sqe(&read_ring_);
    io_uring_prep_read(sqe, fd_, buf, len, offset);
    io_uring_submit(&read_ring_);
  }
};
// 동기 대비 4.17배 처리량`,
    lang: 'c',
    highlight: [1, 14],
    desc: 'io_uring: R/W 링 분리 + DMA 제로 카피.',
    annotations: [
      { lines: [3, 5], color: 'sky', note: 'R/W 링 + DMA 풀' },
      { lines: [6, 11], color: 'emerald', note: 'submit_read 제로 카피' },
    ],
  },
};

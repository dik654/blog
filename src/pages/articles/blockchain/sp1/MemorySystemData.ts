export const MEMORY_STRUCT_CODE = `// PagedMemory: 16KB 페이지 단위 지연 할당
pub struct PagedMemory {
    pages: HashMap<u32, Box<[u8; PAGE_SIZE]>>,  // 페이지 번호 → 데이터
    page_count: usize,                          // 할당된 페이지 수
}

const PAGE_SIZE: usize = 16384;  // 16KB = 2^14 바이트
const PAGE_MASK: u32 = 0x3FFF;   // 하위 14비트 = 페이지 내 오프셋

// MemoryRecord: 각 주소의 접근 이력
pub struct MemoryRecord {
    pub value: u32,       // 현재 값
    pub shard: u32,       // 마지막 접근 샤드 번호
    pub timestamp: u32,   // 마지막 접근 타임스탬프
}`;

export const MR_CODE = `// mr(): 메모리 읽기 (Memory Read)
fn mr(&mut self, addr: u32, shard: u32, ts: u32) -> MemoryReadRecord {
    // 1. 주소 유효성 검사
    assert!(addr % 4 == 0, "unaligned memory access");

    // 2. 현재 레코드 조회
    let record = self.state.memory.get(addr);

    // 3. 읽기 이벤트 기록 (Trace 모드)
    let read = MemoryReadRecord {
        value: record.value,
        prev_shard: record.shard,
        prev_timestamp: record.timestamp,
    };

    // 4. 타임스탬프 업데이트
    self.state.memory.set(addr, MemoryRecord {
        value: record.value,
        shard, timestamp: ts,
    });
    read
}`;

export const LAYOUT = [
  { range: '0x0000_0000 – 0x001F_FFFF', name: '초기화 메모리', desc: 'ELF .data, .rodata 영역' },
  { range: '0x0020_0000 –', name: '프로그램 코드', desc: 'ELF .text (명령어)' },
  { range: '0x0C00_0000 –', name: '힙 (Heap)', desc: '동적 할당. 위로 성장' },
  { range: '– 0x7FFF_D000', name: '스택 (Stack)', desc: 'SP 기준, 아래로 성장' },
  { range: '0x3000_0000 –', name: 'IO 레지스터', desc: 'read/write/commit 시스콜' },
];

export const memoryStructAnnotations = [
  { lines: [2, 5] as [number, number], color: 'sky' as const, note: 'PagedMemory — 16KB 페이지 단위' },
  { lines: [7, 8] as [number, number], color: 'emerald' as const, note: '페이지 크기 = 16384바이트' },
  { lines: [11, 15] as [number, number], color: 'amber' as const, note: 'MemoryRecord — 값 + 시간' },
];

export const mrAnnotations = [
  { lines: [3, 4] as [number, number], color: 'sky' as const, note: '4바이트 정렬 검사' },
  { lines: [6, 7] as [number, number], color: 'emerald' as const, note: '현재 레코드 조회' },
  { lines: [9, 13] as [number, number], color: 'amber' as const, note: '읽기 이벤트 구성' },
  { lines: [15, 19] as [number, number], color: 'violet' as const, note: '타임스탬프 갱신' },
];

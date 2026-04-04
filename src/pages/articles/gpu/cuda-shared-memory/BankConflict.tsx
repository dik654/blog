import CodePanel from '@/components/ui/code-panel';

const bankLayoutCode = `공유 메모리 뱅크 구조 (32 banks, 4-byte stride):

주소(byte)   뱅크 번호
  0 -  3  →  Bank 0      ← Thread 0
  4 -  7  →  Bank 1      ← Thread 1
  8 - 11  →  Bank 2      ← Thread 2
  ...
124 - 127 →  Bank 31     ← Thread 31
128 - 131 →  Bank 0  (다시 Bank 0, 순환)

규칙: address / 4 % 32 = bank number
연속된 4바이트 주소 → 서로 다른 뱅크 → 충돌 없음`;

const conflictCode = `// 충돌 없음: 연속 접근 (stride = 1)
__shared__ float s[256];
float val = s[threadIdx.x];         // 각 스레드가 다른 뱅크

// 2-way 충돌: stride = 2
float val = s[threadIdx.x * 2];     // Thread 0→Bank 0, Thread 16→Bank 0

// 32-way 충돌 (최악): stride = 32
float val = s[threadIdx.x * 32];    // 모든 스레드가 Bank 0

// 충돌 없음: 브로드캐스트
float val = s[0];                   // 모든 스레드가 같은 주소 읽기
                                    // → 하드웨어 브로드캐스트, 1회 접근`;

const paddingCode = `// 문제: 행렬 열 접근 시 32-way 뱅크 충돌
__shared__ float tile[32][32];
float val = tile[threadIdx.x][col]; // stride=32, 모든 스레드가 같은 뱅크

// 해결: 패딩(padding)으로 stride 변경
__shared__ float tile[32][33];      // 열 크기를 33으로 +1
float val = tile[threadIdx.x][col]; // stride=33, 뱅크가 매 행마다 1씩 밀림
                                    // → 32개 스레드가 32개 다른 뱅크 접근

// 메모리 레이아웃 변화:
// [32][32]: Row0→Bank0-31, Row1→Bank0-31  (열 접근=같은 뱅크)
// [32][33]: Row0→Bank0-31, Row1→Bank1-32  (열 접근=다른 뱅크)`;

export default function BankConflict() {
  return (
    <section id="bank-conflict" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">메모리 뱅크와 뱅크 충돌</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          공유 메모리는 <strong>32개 뱅크</strong>로 나뉜다. 각 뱅크는 4바이트(32비트) 폭이다.<br />
          연속된 4바이트 주소가 연속된 뱅크에 매핑된다. 같은 워프(32 스레드)가 동시에 접근할 때,
          서로 다른 뱅크를 사용하면 <strong>단일 사이클에 병렬 처리</strong>된다.
        </p>
        <CodePanel title="공유 메모리 뱅크 매핑" code={bankLayoutCode}
          annotations={[
            { lines: [3, 10], color: 'sky', note: '주소→뱅크 매핑 (4바이트 stride)' },
            { lines: [12, 13], color: 'emerald', note: '뱅크 계산 공식' },
          ]} />

        <h3 className="text-xl font-semibold mt-6 mb-3">N-way 충돌과 브로드캐스트</h3>
        <p>
          같은 워프 내 N개 스레드가 같은 뱅크를 접근하면 <strong>N-way 충돌</strong>이 발생한다.<br />
          N번의 직렬 접근으로 분할되어 성능이 N배 저하된다.
          <br />
          단, 모든 스레드가 <strong>정확히 같은 주소</strong>를 읽으면 하드웨어가 브로드캐스트하여 충돌이 없다.
        </p>
        <CodePanel title="뱅크 충돌 예시" code={conflictCode}
          annotations={[
            { lines: [1, 3], color: 'sky', note: '이상적: stride=1, 충돌 없음' },
            { lines: [5, 6], color: 'amber', note: 'stride=2, 2-way 충돌' },
            { lines: [8, 9], color: 'rose', note: 'stride=32, 32-way 최악' },
            { lines: [11, 13], color: 'emerald', note: '브로드캐스트: 같은 주소→무충돌' },
          ]} />

        <h3 className="text-xl font-semibold mt-6 mb-3">패딩 기법으로 충돌 제거</h3>
        <p>
          행렬의 열(column)을 접근할 때 stride가 32가 되어 최악의 충돌이 발생한다.<br />
          열 크기에 +1 패딩을 추가하면 stride가 33으로 바뀌어, 각 행의 같은 열이 서로 다른 뱅크에 매핑된다.
        </p>
        <CodePanel title="패딩 기법: [32][32] vs [32][33]" code={paddingCode}
          annotations={[
            { lines: [1, 3], color: 'rose', note: '패딩 없음: 32-way 충돌' },
            { lines: [5, 8], color: 'emerald', note: '패딩 적용: 충돌 제거' },
            { lines: [10, 12], color: 'amber', note: '레이아웃 비교' },
          ]} />
      </div>
    </section>
  );
}

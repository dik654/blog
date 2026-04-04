import CodePanel from '@/components/ui/code-panel';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import XORDistanceViz from './viz/XORDistanceViz';

export default function XorDistance({ onCodeRef }: { onCodeRef?: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="xor-distance" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">XOR 거리: 이진 트리 해석</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Kademlia의 XOR 거리는 단순한 산술이 아니라 <strong>이진 트리</strong>에서의 위치 관계를 인코딩한다.
          <br />
          256-bit Node ID를 이진 트리의 경로로 보면, XOR 거리의 log₂ 값은
          두 노드가 공유하는 프리픽스 길이의 역수다.
        </p>

        <h3>LogDist: 공유 프리픽스의 역수</h3>
        <p>
          go-ethereum의 <code>LogDist(a, b)</code>는 <code>256 - leadingZeros(a XOR b)</code>를 반환한다.
          <br />
          XOR 결과의 선행 0 비트 수 = 두 ID가 공유하는 프리픽스 길이.
          <br />
          LogDist가 작을수록 프리픽스가 길게 겹친다 → 이진 트리에서 더 가까운 서브트리.
        </p>

        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() => onCodeRef('geth-xor-distance', codeRefs['geth-xor-distance'])} />
            <span className="text-[10px] text-muted-foreground self-center">enode/node.go — LogDist, DistCmp</span>
          </div>
        )}

        <CodePanel title="LogDist 구현 (go-ethereum)" lang="go" code={`// LogDist returns the logarithmic distance between a and b,
// log2(a ^ b).
func LogDist(a, b ID) int {
    lz := 0
    for i := 0; i < len(a); i += 8 {
        ai := binary.BigEndian.Uint64(a[i : i+8])
        bi := binary.BigEndian.Uint64(b[i : i+8])
        x := ai ^ bi
        if x == 0 {
            lz += 64       // 이 8바이트가 완전히 같음
        } else {
            lz += bits.LeadingZeros64(x)  // 첫 차이 비트 발견
            break
        }
    }
    return len(a)*8 - lz   // 256 - 선행 0 수 = LogDist
}`} annotations={[
          { lines: [7, 10], color: 'sky', note: '8바이트(64비트)씩 XOR. 같으면 선행0 += 64' },
          { lines: [11, 13], color: 'emerald', note: '차이 발견 시 LeadingZeros64로 정확한 위치' },
          { lines: [16], color: 'amber', note: '결과: 256 - 공유 프리픽스 길이' },
        ]} />

        <h3>DistCmp: 거리 비교</h3>
        <p>
          <code>DistCmp(target, a, b)</code>는 target에 대해 a와 b 중 누가 더 가까운지 비교한다.
          <br />
          전체 XOR 값을 계산하지 않고, 8바이트씩 비교하다 차이가 나는 순간 즉시 반환한다.
          <br />
          이것이 Kademlia의 핵심 정렬 기준 — 탐색, 버킷 배치, 결과 정렬 모두 이 함수를 사용.
        </p>

        <CodePanel title="DistCmp 구현" lang="go" code={`// DistCmp compares the distances a->target and b->target.
// Returns -1 if a is closer to target, 1 if b is closer.
func DistCmp(target, a, b ID) int {
    for i := 0; i < len(target); i += 8 {
        tn := binary.BigEndian.Uint64(target[i : i+8])
        da := tn ^ binary.BigEndian.Uint64(a[i:i+8])  // a의 거리
        db := tn ^ binary.BigEndian.Uint64(b[i:i+8])  // b의 거리
        if da > db {
            return 1   // b가 더 가까움
        } else if da < db {
            return -1  // a가 더 가까움
        }
    }
    return 0  // 같은 거리
}`} annotations={[
          { lines: [5, 7], color: 'sky', note: '64비트씩 XOR → 거리를 청크 단위로 비교' },
          { lines: [8, 11], color: 'emerald', note: '차이 발견 즉시 반환 — O(1) 최선, O(32) 최악' },
        ]} />

        <h3>이진 트리와 K-버킷의 대응</h3>
        <p>
          LogDist = d인 노드들은 이진 트리에서 자신과 d번째 비트에서 처음 갈라지는 서브트리에 속한다.
          <br />
          d가 크면 일찍 갈라짐 → 멀리 있음 → 해당 서브트리가 크므로 노드가 많다.
          <br />
          d가 작으면 늦게 갈라짐 → 가까움 → 서브트리가 작으므로 노드가 적다.
          <br />
          K-버킷[d]는 이 서브트리에서 가장 가까운 k개 노드를 저장하는 것.
        </p>
      </div>
    </section>
  );
}

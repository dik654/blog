import ICEViz from './viz/ICEViz';
import CodePanel from '@/components/ui/code-panel';

const iceCode = `// ICE 후보 수집 (RFC 8445)
// 1. Host Candidate — 로컬 IP:포트 (사설 주소)
// 2. Server Reflexive — STUN으로 발견한 NAT 외부 주소
// 3. Relay Candidate — TURN에서 할당한 릴레이 주소

// 연결성 검사 (Connectivity Check):
//   각 후보 쌍(pair)에 대해 STUN Binding Request 수행
//   양방향 모두 성공해야 "유효한 쌍(Valid Pair)"

// 후보 우선순위 (Priority):
//   Host > Server Reflexive > Relay
//   직접 연결이 가능하면 우선 사용 (최소 지연)
//   TURN은 마지막 수단`;

const iceAnnotations: { lines: [number, number]; color: 'sky' | 'emerald' | 'amber'; note: string }[] = [
  { lines: [1, 4], color: 'sky', note: '3종류 후보 수집' },
  { lines: [6, 8], color: 'emerald', note: '모든 후보 쌍에 STUN 검사' },
  { lines: [10, 13], color: 'amber', note: '우선순위: 직접 > 반사 > 릴레이' },
];

export default function Ice() {
  return (
    <section id="ice" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">ICE: 연결성 검사</h2>
      <div className="not-prose mb-8"><ICEViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          ICE(Interactive Connectivity Establishment)는 STUN과 TURN을 조합하여
          최적의 연결 경로를 찾는 프레임워크입니다.<br />
          후보를 수집하고, 모든 쌍을 검사해, 가장 우선순위 높은 경로를 선택합니다.
        </p>
        <CodePanel title="ICE 후보 수집과 연결성 검사" code={iceCode}
          annotations={iceAnnotations} />
        <p className="leading-7">
          iroh의 MagicSock은 ICE와 유사한 자체 경로 선택 로직을 구현합니다.<br />
          직접 연결, DERP 릴레이 중 지연이 낮은 경로를 자동 선택합니다.
        </p>
      </div>
    </section>
  );
}

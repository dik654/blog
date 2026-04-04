import NativeAAViz from './viz/NativeAAViz';
import CodePanel from '@/components/ui/code-panel';

const nativeCode = `// Native Account Abstraction — 프로토콜 레벨 AA

// EIP-7701: Native AA (type 4 트랜잭션)
//   EVM 프로토콜에 AA를 직접 내장
//   별도의 Bundler/EntryPoint 불필요
//   계정 코드에 validateTransaction() 구현
//   EL(실행 레이어)이 직접 검증 및 실행

// RIP-7560: Rollup 표준 Native AA
//   L2 롤업에서의 AA 표준
//   EntryPoint 로직을 프리컴파일로 구현
//   가스 효율 향상 — 컨트랙트 호출 오버헤드 제거

// 비교: ERC-4337 vs Native AA
//   ERC-4337: 프로토콜 변경 없음, Bundler 인프라 필요
//   Native AA: 프로토콜 변경 필요, 더 낮은 가스, 더 간단한 구조
//   장기적으로 Native AA가 ERC-4337을 대체할 전망`;

const nativeAnnotations: { lines: [number, number]; color: 'sky' | 'emerald' | 'amber'; note: string }[] = [
  { lines: [3, 7], color: 'sky', note: 'EIP-7701 — EL 내장 AA' },
  { lines: [9, 12], color: 'emerald', note: 'RIP-7560 — 롤업 Native AA' },
  { lines: [14, 17], color: 'amber', note: 'ERC-4337 vs Native AA 비교' },
];

export default function NativeAA() {
  return (
    <section id="native-aa" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Native AA: EIP-7701 & RIP-7560</h2>
      <div className="not-prose mb-8"><NativeAAViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          ERC-4337은 프로토콜 변경 없이 AA를 구현하지만,
          Bundler 인프라와 EntryPoint 컨트랙트 호출 오버헤드가 존재합니다.<br />
          Native AA는 프로토콜 레벨에서 AA를 지원하여 이 오버헤드를 제거합니다.
        </p>
        <CodePanel title="Native AA 제안" code={nativeCode}
          annotations={nativeAnnotations} />
        <p className="leading-7">
          zkSync Era, StarkNet 등 일부 L2는 이미 Native AA를 구현했습니다.<br />
          이더리움 L1은 EIP-7701로 점진적 도입을 논의 중입니다.
        </p>
      </div>
    </section>
  );
}

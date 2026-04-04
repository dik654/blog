import RuntimeConfigViz from './viz/RuntimeConfigViz';
import CodePanel from '@/components/ui/code-panel';

const RUNTIME_CODE = `// runtime/src/lib.rs
#![cfg_attr(not(feature = "std"), no_std)]

#[sp_version::runtime_version]
pub const VERSION: RuntimeVersion = RuntimeVersion {
    spec_name: Cow::Borrowed("my-runtime"),
    impl_name: Cow::Borrowed("my-runtime"),
    spec_version: 100,     // 변경 시 런타임 업그레이드 트리거
    impl_version: 1,
    apis: RUNTIME_API_VERSIONS,
    transaction_version: 1,
};

// construct_runtime! 매크로로 팔렛 조합
construct_runtime!(
    pub struct Runtime {
        System: frame_system,
        Balances: pallet_balances,
        Staking: pallet_staking,
        MyPallet: my_pallet,    // 커스텀 팔렛
    }
);

// 팔렛별 Config 구현
impl pallet_balances::Config for Runtime {
    type Balance = u128;
    type ExistentialDeposit = ConstU128<500>;
    type AccountStore = System;
}`;

export default function RuntimeConfig({ title }: { title?: string }) {
  return (
    <section id="runtime-config" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? '런타임 구성'}</h2>
      <div className="not-prose mb-8">
        <RuntimeConfigViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Substrate 런타임은 상태 전환 함수(State Transition Function)를 정의하는
          핵심 컴포넌트입니다. <code>construct_runtime!</code> 매크로로 팔렛들을 조합하며,
          WebAssembly로 컴파일되어 포크 없이 온체인에서 업그레이드할 수 있습니다.
        </p>
        <CodePanel
          title="런타임 구성 (lib.rs)"
          code={RUNTIME_CODE}
          annotations={[
            { lines: [4, 12], color: 'sky', note: 'RuntimeVersion: 업그레이드 트리거' },
            { lines: [15, 22], color: 'emerald', note: 'construct_runtime! 팔렛 조합' },
            { lines: [25, 29], color: 'amber', note: '팔렛별 Config 트레이트 구현' },
          ]}
        />
      </div>
    </section>
  );
}

import FramePalletViz from './viz/FramePalletViz';
import CodePanel from '@/components/ui/code-panel';

const PALLET_CODE = `#[frame_support::pallet]
pub mod pallet {
    use frame_support::pallet_prelude::*;
    use frame_system::pallet_prelude::*;

    #[pallet::config]
    pub trait Config: frame_system::Config {
        type RuntimeEvent: From<Event<Self>> + IsType<<Self as frame_system::Config>::RuntimeEvent>;
        #[pallet::constant]
        type MaximumValue: Get<u32>;
        type Currency: Currency<Self::AccountId>;
        type WeightInfo: WeightInfo;
    }

    #[pallet::storage]
    pub type SomeValue<T> = StorageValue<_, u32, ValueQuery>;

    #[pallet::event]
    pub enum Event<T: Config> { SomethingStored { something: u32 } }

    #[pallet::error]
    pub enum Error<T> { NoneValue, StorageOverflow }

    #[pallet::call]
    impl<T: Config> Pallet<T> {
        #[pallet::weight(10_000)]
        pub fn do_something(origin: OriginFor<T>, val: u32) -> DispatchResult {
            let _who = ensure_signed(origin)?;
            <SomeValue<T>>::put(val);
            Self::deposit_event(Event::SomethingStored { something: val });
            Ok(())
        }
    }
}`;

export default function FramePallet({ title }: { title?: string }) {
  return (
    <section id="frame-pallet" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? 'FRAME 팔렛 시스템'}</h2>
      <div className="not-prose mb-8">
        <FramePalletViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>FRAME</strong>(Framework for Runtime Aggregation of Modularized Entities)은
          Substrate 런타임의 모듈 시스템입니다. 각 팔렛은 Config, Storage, Event, Error,
          Call의 5가지 구성 요소로 이루어진 독립적인 기능 단위입니다.
        </p>
        <CodePanel
          title="FRAME 팔렛 기본 구조"
          code={PALLET_CODE}
          annotations={[
            { lines: [6, 14], color: 'sky', note: 'Config 트레이트: 설정 & 의존성' },
            { lines: [16, 17], color: 'emerald', note: 'Storage: 온체인 상태 저장' },
            { lines: [19, 22], color: 'amber', note: 'Event & Error 정의' },
            { lines: [24, 33], color: 'violet', note: 'Call: 외부 호출 가능 함수' },
          ]}
        />
      </div>
    </section>
  );
}

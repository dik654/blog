import RealmLifecycleViz from './viz/RealmLifecycleViz';
import RealmStateMachineViz from './viz/RealmStateMachineViz';
import RdStructViz from './viz/RdStructViz';
import RimChainViz from './viz/RimChainViz';
import RemExtendViz from './viz/RemExtendViz';
import RealmTeardownViz from './viz/RealmTeardownViz';
import KvmRealmInitViz from './viz/KvmRealmInitViz';

export default function RealmLifecycle() {
  return (
    <section id="realm-lifecycle" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Realm 생성 &amp; 생명주기</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-6 mb-3">Realm 상태 머신</h3>

        <RealmLifecycleViz />

        <div className="not-prose mb-4"><RealmStateMachineViz /></div>

        <h3 className="text-xl font-semibold mt-8 mb-3">Realm Descriptor (RD) 구조</h3>
        <div className="not-prose mb-4"><RdStructViz /></div>

        <h3 className="text-xl font-semibold mt-8 mb-3">RIM 계산 — 초기 측정값</h3>
        <div className="not-prose mb-4"><RimChainViz /></div>

        <h3 className="text-xl font-semibold mt-8 mb-3">REM — Runtime Extendable Measurements</h3>
        <div className="not-prose mb-4"><RemExtendViz /></div>

        <h3 className="text-xl font-semibold mt-8 mb-3">Realm 종료 & 정리</h3>
        <div className="not-prose mb-4"><RealmTeardownViz /></div>

        <h3 className="text-xl font-semibold mt-8 mb-3">KVM의 Realm 지원 (Host 측)</h3>
        <div className="not-prose mb-4"><KvmRealmInitViz /></div>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: RIM 측정 vs TDX MRTD</p>
          <p>
            <strong>공통점</strong>:<br />
            - 초기 이미지 해시 → Realm/TD 정체성<br />
            - 활성화 후 불변<br />
            - 원격 증명의 기반
          </p>
          <p className="mt-2">
            <strong>차이점</strong>:<br />
            - TDX: SHA-384, MRCONFIGID 등 3개 추가 레지스터<br />
            - CCA: SHA-256 또는 SHA-512 선택<br />
            - CCA는 호출 순서까지 측정 (replay 방어)
          </p>
          <p className="mt-2">
            <strong>Realm 고유 속성</strong>:<br />
            - Personalization Value(RPV) — 64B 사용자 데이터 포함<br />
            - 같은 이미지라도 RPV 다르면 다른 RIM<br />
            - 사용자별 인스턴스 구분 가능
          </p>
        </div>

      </div>
    </section>
  );
}

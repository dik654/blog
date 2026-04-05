import CodePanel from '@/components/ui/code-panel';
import ConfigViz from './viz/ConfigViz';
import { CONFIG_CODE, CONFIG_ANNOTATIONS } from './ConfigData';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function Config({ onCodeRef }: {
  onCodeRef?: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="config" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">설정</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Kubo는 <code>~/.ipfs/config</code> JSON 파일로 모든 동작을 설정합니다.<br />
          네트워크 주소, 저장소 백엔드, 게이트웨이 옵션, DHT 모드 등을 세밀하게 제어할 수 있습니다.<br />
          <strong>프로파일</strong> 시스템으로 사전 정의된 설정 묶음을 빠르게 적용합니다.
        </p>
        <h3>주요 프로파일</h3>
        <ul>
          <li><code>server</code> -- 높은 연결 수 허용, 로컬 발견 비활성화</li>
          <li><code>lowpower</code> -- 연결 수 제한, GC 빈도 감소</li>
          <li><code>local-discovery</code> -- mDNS 활성화, DHT 클라이언트 모드</li>
          <li><code>flatfs</code> -- 파일시스템 기반 Blockstore 사용</li>
          <li><code>badgerds</code> -- Badger v4 고성능 저장소</li>
        </ul>
        <h3>Connection Manager</h3>
        <p>
          <code>Swarm.ConnMgr</code>에서 <code>LowWater</code>(최소 연결 수)와
          <code>HighWater</code>(최대 연결 수)를 설정하여 리소스를 관리합니다.<br />
          연결 수가 HighWater를 초과하면 가장 오래된 비활성 연결부터 정리합니다.
        </p>
        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() => onCodeRef('kubo-config-struct', codeRefs['kubo-config-struct'])} />
            <span className="text-[10px] text-muted-foreground self-center">Config 구조체</span>
            <CodeViewButton onClick={() => onCodeRef('kubo-routing-config', codeRefs['kubo-routing-config'])} />
            <span className="text-[10px] text-muted-foreground self-center">Routing 설정</span>
            <CodeViewButton onClick={() => onCodeRef('kubo-online-groups', codeRefs['kubo-online-groups'])} />
            <span className="text-[10px] text-muted-foreground self-center">Online 서비스 조립</span>
          </div>
        )}
        <CodePanel title="Datastore 설정" code={CONFIG_CODE} annotations={CONFIG_ANNOTATIONS} />

        <h3 className="text-xl font-semibold mt-6 mb-3">Datastore Backend 비교</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Kubo Datastore Backends
//
// 1. Flatfs (flat filesystem)
//    File: one file per block
//    Path: /datastore/AB/CDEF.data
//    Hash-sharded directories
//
//    장점:
//      - 운영체제 FS 직접 사용
//      - 간단, 이식성 높음
//      - Block당 일대일 매핑
//
//    단점:
//      - 작은 파일 많음 (inode 소비)
//      - 디스크 공간 오버헤드 (block size)
//      - 대규모에서 느림
//
// 2. Badger (LSM-tree)
//    Key-value store (GC 필요)
//    Rust의 sled와 유사
//
//    장점:
//      - 빠른 쓰기
//      - Compression 내장
//      - 작은 metadata 오버헤드
//
//    단점:
//      - GC 필요 (주기적)
//      - Corruption 위험 (잦은 crash 시)
//
// 3. LevelDB
//    Google의 LSM-tree
//    단순하고 안정적
//
//    장점:
//      - 검증된 안정성
//      - 예측 가능한 성능
//
//    단점:
//      - Badger보다 느림
//      - Write amplification
//
// 4. Mount (조합)
//    여러 backend 조합
//    /blocks → Flatfs
//    /pins → LevelDB
//    /datastore → Badger

// Profile 시스템:
//
//   server: 고가용 서버용
//     - HighWater/LowWater 높음
//     - mDNS 비활성
//     - GC 빈도 낮음
//
//   lowpower: 모바일/IoT
//     - HighWater 200
//     - 저전력 모드
//
//   local-discovery: 개발/홈
//     - mDNS 활성
//     - DHT client mode
//
//   flatfs: 간단한 저장
//     - Flatfs backend
//
//   badgerds: 고성능
//     - Badger backend

// 실무 권장:
//
//   Small node (< 10GB):
//     Flatfs + Local discovery
//
//   Medium node (10-100GB):
//     Badger + server profile
//
//   Large node (> 100GB):
//     Custom Mount setup
//     SSD for hot data
//     HDD for cold data`}
        </pre>
      </div>
      <div className="mt-8"><ConfigViz /></div>
    </section>
  );
}

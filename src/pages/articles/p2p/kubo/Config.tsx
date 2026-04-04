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
      </div>
      <div className="mt-8"><ConfigViz /></div>
    </section>
  );
}

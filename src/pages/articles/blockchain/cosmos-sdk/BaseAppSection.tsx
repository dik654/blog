import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function BaseAppSection({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="baseapp" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">BaseApp — 애플리케이션 셸</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          BaseApp = Cosmos SDK의 <strong>핵심 구조체</strong><br />
          CometBFT ABCI 인터페이스 구현 + TX 디코딩 + 메시지 라우팅 + 상태 관리를 통합
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">핵심 필드</h3>
        <p>
          <code>cms</code> — CommitMultiStore. 모듈별 IAVL 트리를 관리하는 MultiStore<br />
          <code>msgServiceRouter</code> — Msg 타입 URL → 모듈 핸들러 매핑<br />
          <code>anteHandler</code> — TX 사전 검증 파이프라인 (서명, fee, nonce)<br />
          <code>postHandler</code> — TX 후처리 (tip 정산 등)<br />
          <code>stateManager</code> — Check/Finalize 모드별 상태 분리 관리
        </p>
        <div className="not-prose flex flex-wrap gap-2 my-4">
          <CodeViewButton onClick={() => onCodeRef('baseapp-struct', codeRefs['baseapp-struct'])} />
          <span className="text-[10px] text-muted-foreground self-center">BaseApp struct</span>
          <CodeViewButton onClick={() => onCodeRef('baseapp-new', codeRefs['baseapp-new'])} />
          <span className="text-[10px] text-muted-foreground self-center">NewBaseApp()</span>
          <CodeViewButton onClick={() => onCodeRef('msg-router-struct', codeRefs['msg-router-struct'])} />
          <span className="text-[10px] text-muted-foreground self-center">MsgServiceRouter</span>
        </div>
        <p>
          💡 <strong>설계 인사이트</strong> — stateManager로 Check/Finalize 상태 격리<br />
          CheckTx(멤풀 검증)와 FinalizeBlock(블록 실행)이 서로 다른 상태 분기에서 동작<br />
          이더리움은 단일 StateDB를 사용하지만, Cosmos는 모드별 캐시 분기로 동시성 안전 확보
        </p>
        <p>
          💡 <strong>옵션 패턴</strong> — NewBaseApp()은 <code>...func(*BaseApp)</code> 가변 옵션으로 설정 주입<br />
          AnteHandler, PostHandler, mempool 등을 앱 빌드 시 자유롭게 커스터마이즈
        </p>
      </div>
    </section>
  );
}

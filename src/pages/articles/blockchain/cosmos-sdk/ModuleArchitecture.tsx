import MsgRouterViz from './viz/MsgRouterViz';
import ModuleKeeperViz from './viz/ModuleKeeperViz';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function ModuleArchitecture({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const open = (key: string) => onCodeRef(key, codeRefs[key]);
  return (
    <section id="module-architecture" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">모듈 시스템 — AppModule + Keeper + MsgRouter</h2>
      <div className="not-prose mb-8">
        <MsgRouterViz onOpenCode={open} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Cosmos SDK 모듈 = 이더리움 프리컴파일과 유사한 <strong>네이티브 로직 단위</strong><br />
          각 모듈: AppModule 인터페이스 구현 + Keeper(상태 접근) + MsgServer(메시지 처리)
        </p>
        <div className="not-prose flex flex-wrap gap-2 my-4">
          <CodeViewButton onClick={() => open('appmodule-interface')} />
          <span className="text-[10px] text-muted-foreground self-center">AppModule interface</span>
          <CodeViewButton onClick={() => open('msg-router-struct')} />
          <span className="text-[10px] text-muted-foreground self-center">MsgServiceRouter</span>
          <CodeViewButton onClick={() => open('bank-send')} />
          <span className="text-[10px] text-muted-foreground self-center">Bank MsgServer.Send()</span>
        </div>
        <h3 className="text-xl font-semibold mt-6 mb-3">AppModule 인터페이스</h3>
        <p>
          AppModuleBasic — 이름, 코덱 등록, gRPC 게이트웨이<br />
          HasServices — MsgServer/QueryServer를 라우터에 등록<br />
          HasABCIEndBlock — 블록 끝에 검증자 업데이트 (선택적)
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">Keeper 패턴</h3>
      </div>
      <div className="not-prose mb-8"><ModuleKeeperViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose flex flex-wrap gap-2 my-4">
          <CodeViewButton onClick={() => open('bank-keeper')} />
          <span className="text-[10px] text-muted-foreground self-center">Bank Keeper struct</span>
          <CodeViewButton onClick={() => open('bank-sendcoins')} />
          <span className="text-[10px] text-muted-foreground self-center">SendCoins()</span>
        </div>
        <p>
          Keeper = 모듈의 <strong>상태 접근 객체</strong> — 이더리움 StateDB 대응<br />
          인터페이스 기반 의존성 주입 — 컴파일 타임 검증 (EVM CALL의 런타임 바인딩과 대조)<br />
          💡 모듈 간 접근 제어가 Go 타입 시스템으로 강제됨 — mock 테스트도 용이
        </p>
      </div>
    </section>
  );
}

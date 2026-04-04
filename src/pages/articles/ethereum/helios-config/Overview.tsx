import type { CodeRef } from '@/components/code/types';
import OverviewViz from './viz/OverviewViz';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function Overview({ onCodeRef: _onCodeRef }: Props) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          Reth(풀노드)는 CLI 플래그 + TOML 파일로 설정한다.
          독립 프로세스로 실행되며, DB 경로·P2P 포트·동기화 모드 등
          수십 개 옵션을 터미널에서 제어한다.<br />
          Helios(경량 클라이언트)는 라이브러리다.
          모바일 앱이나 WASM 환경에 임베딩해야 하므로,
          코드 안에서 Builder 패턴으로 설정을 조합한다.
        </p>
      </div>

      <div className="not-prose my-8">
        <OverviewViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-sm border-l-2 border-indigo-500/50 pl-3 mt-4">
          <strong>Builder 패턴을 선택한 이유</strong><br />
          Helios는 독립 바이너리가 아니라 Rust crate로 배포된다.
          다른 프로젝트가 <code>helios</code>를 <code>use</code>해서 경량 검증 기능을
          자체 앱에 통합하는 구조 — CLI가 아닌 프로그래밍 방식 설정이 자연스럽다.
        </p>
      </div>
    </section>
  );
}

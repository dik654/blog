import ClientBuilderViz from './viz/ClientBuilderViz';
import CodePanel from '@/components/ui/code-panel';
import { builderCode, builderAnnotations } from './codeRefs';

export default function ClientBuilder() {
  return (
    <section id="client-builder" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        ClientBuilder 패턴
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          Reth: reth node --chain mainnet --datadir /data
          명령어로 시작한다. TOML 파일로 상세 설정을 추가.<br />
          Helios: Rust 코드에서 ClientBuilder로
          설정을 조합한다. 라이브러리로 임베딩되기 위한 설계.
        </p>
        <p className="leading-7">
          Builder 패턴의 장점: 선택적 설정에 강하다.
          필수 필드만 설정하면 나머지는 기본값 사용.
          build() 시점에 필수 필드 누락을 검사한다.<br />
          Reth도 NodeBuilder를 사용하지만 CLI가 주 인터페이스.
          Helios는 프로그래밍 API가 주 인터페이스.
        </p>
      </div>
      <div className="not-prose mb-6"><ClientBuilderViz /></div>
      <CodePanel title="config/src/lib.rs — ClientBuilder"
        code={builderCode} annotations={builderAnnotations} />
    </section>
  );
}

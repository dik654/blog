import CodePanel from '@/components/ui/code-panel';
import { KEEPER_CODE, KEEPER_ANNOTATIONS } from './KeeperPatternData';
import KeeperPatternViz from './viz/KeeperPatternViz';

export default function KeeperPattern() {
  return (
    <section id="keeper-pattern" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Keeper 패턴 심층 분석</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Keeper는 Cosmos SDK 모듈의 <strong>상태 접근 객체</strong>입니다.
          <br />
          이더리움의 StateDB에 해당합니다.
          <br />
          각 Keeper는 자체 <strong>KVStore</strong>에만 접근합니다.
          <br />
          모듈 간 의존성은 <strong>인터페이스</strong>로 정의되어 컴파일 타임에 검증됩니다.
        </p>
      </div>

      <KeeperPatternViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Keeper 구조 & 의존성 주입</h3>
        <CodePanel title="Keeper 패턴 구현" code={KEEPER_CODE} annotations={KEEPER_ANNOTATIONS} />
      </div>
    </section>
  );
}

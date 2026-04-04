import type { CodeRef } from '@/components/code/types';
import OverviewViz from './viz/OverviewViz';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function Overview({ onCodeRef: _onCodeRef }: Props) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">프레임워크 아키텍처 & 위협 모델</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          MetaMask로 Infura에 요청하면 IP, 조회 주소, TX가 전부 노출된다.
          <br />
          RPC 서버가 사용자의 자산 흐름을 완전히 프로파일링할 수 있다.
        </p>
        <p className="leading-7">
          Kohaku는 세 가지 프라이버시 컴포넌트를 조합한 프레임워크다.
          <br />
          <strong>Helios</strong>(검증) + <strong>ORAM</strong>(쿼리 프라이버시) + <strong>Dandelion++</strong>(TX 프라이버시).
        </p>
        <p className="leading-7">
          각 컴포넌트가 독립적으로 교체 가능하다.
          <br />
          Helios 없이 ORAM만 써도 되고, Dandelion만 빼도 된다.
        </p>
      </div>
      <div className="not-prose"><OverviewViz /></div>
    </section>
  );
}

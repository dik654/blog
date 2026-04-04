import SapphireDetailViz from './viz/SapphireDetailViz';
import PrecompileViz from './viz/PrecompileViz';

export default function SapphireDetail() {
  return (
    <section id="sapphire-detail" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Sapphire EVM 상세</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Sapphire의 기밀 트랜잭션은 <strong>X25519 키 교환 → DeoxysII 암호화 →
          SGX 내 EVM 실행 → AES-256-GCM 상태 암호화</strong> 파이프라인으로 처리됩니다.<br />
          입력부터 출력까지 전 과정이 암호화됩니다.<br />
          노드 운영자도 데이터를 열람할 수 없습니다.
        </p>
      </div>

      <SapphireDetailViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>암호화 프리컴파일</h3>
      </div>
      <PrecompileViz />
    </section>
  );
}

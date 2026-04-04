import SapphireFlowViz from './viz/SapphireFlowViz';
import SapphireCodeViz from './viz/SapphireCodeViz';

export default function Sapphire({ title }: { title?: string }) {
  return (
    <section id="sapphire" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? 'Sapphire: 기밀 EVM'}</h2>
      <div className="not-prose mb-8"><SapphireFlowViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Sapphire — Oasis의 EVM 호환 기밀 ParaTime(병렬 런타임)<br />
          Intel SGX TEE 내에서 EVM 실행<br />
          스마트 컨트랙트 상태/트랜잭션을 체인 운영자도 볼 수 없도록 암호화
        </p>

        <h3>기밀성 특성</h3>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
          {[
            { name: '상태 암호화', desc: '컨트랙트 스토리지가 SGX 내에서만 복호화됨. 외부에서는 암호문만 보임.' },
            { name: '트랜잭션 기밀성', desc: '콜 데이터를 클라이언트가 KM 공개키로 암호화. SGX 내에서만 복호화.' },
            { name: '기밀 난수', desc: 'SGX 내 PRNG으로 생성. 외부에서 예측 불가.' },
            { name: 'msg.sender 보호', desc: '기밀 컨텍스트에서 발신자 익명화 옵션.' },
          ].map(f => (
            <div key={f.name} className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
              <p className="font-semibold text-sm text-emerald-400">{f.name}</p>
              <p className="text-sm mt-1 text-foreground/75">{f.desc}</p>
            </div>
          ))}
        </div>

        <h3>기밀 컨트랙트 · 키 파생 · Ethereum 호환</h3>
      </div>
      <SapphireCodeViz />
    </section>
  );
}

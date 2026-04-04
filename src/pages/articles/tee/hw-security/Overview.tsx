import ContextViz from './viz/ContextViz';
import TCBViz from './viz/TCBViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">TCB & 위협 모델</h2>
      <div className="not-prose mb-8"><ContextViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>하드웨어 보안(Hardware Security)</strong> — 소프트웨어만으로는 방어할 수 없는 위협에 대응<br />
          신뢰의 기반을 하드웨어에 둠으로써, OS나 하이퍼바이저가 침해되어도 기밀 데이터를 보호
        </p>

        <h3>TCB (Trusted Computing Base)</h3>
        <p>
          TCB(Trusted Computing Base, 시스템 보안을 책임지는 모든 하드웨어/소프트웨어의 합) — 보안의 핵심 원칙<br />
          TCB가 작을수록 공격 표면이 줄어듦<br />
          SGX: TCB = CPU + Enclave 코드, SEV-SNP: TCB = CPU + 펌웨어<br />
          → <a href="/tee/tee-tcb" className="text-indigo-400 hover:underline">TCB & 측정 부팅 심층 분석</a>
        </p>

        <h3>위협 모델 (Threat Model)</h3>
        <ul>
          <li><strong>물리적 공격</strong> — 메모리 덤프, 콜드부트 공격, 버스 스니핑</li>
          <li><strong>소프트웨어 공격</strong> — 악성 OS, 루트킷, 하이퍼바이저 탈출</li>
          <li><strong>부채널 공격</strong> — 캐시 타이밍, 전력 분석, 전자파 방출</li>
        </ul>

        <h3>신뢰 앵커 (Root of Trust)</h3>
        <p>
          신뢰 체인의 시작점 — 변조 불가능한 하드웨어 구성요소<br />
          예: Intel ME, AMD PSP(Platform Security Processor), ARM TrustZone의 Secure ROM<br />
          이 앵커가 손상되면 전체 신뢰 체인이 무너짐
        </p>
      </div>
      <div className="not-prose mt-8">
        <TCBViz />
      </div>
    </section>
  );
}

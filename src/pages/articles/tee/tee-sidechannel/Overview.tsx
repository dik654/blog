import ContextViz from './viz/ContextViz';
import TrustBoundaryViz from './viz/TrustBoundaryViz';
import SgxAttackTimelineViz from './viz/SgxAttackTimelineViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">사이드채널 공격이란</h2>
      <div className="not-prose mb-8"><ContextViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-6 mb-3">사이드채널의 본질</h3>
        <p>
          <strong>사이드채널(Side-Channel)</strong>: 암호문이 아닌 <strong>부수적 정보</strong>로 비밀 유추<br />
          <strong>부수 정보</strong>: 실행 시간, 캐시 hit/miss, 전력 소비, EM 방사, 메모리 접근 패턴<br />
          <strong>TEE의 한계</strong>: 메모리 암호화만으로는 방어 불가 — 실행 흐름 자체가 누출<br />
          <strong>위협 특성</strong>: 원격 공격 가능, 하드웨어 손상 없이 진행
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">공격 카테고리</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">카테고리</th>
                <th className="border border-border px-3 py-2 text-left">관찰 대상</th>
                <th className="border border-border px-3 py-2 text-left">원격 가능?</th>
                <th className="border border-border px-3 py-2 text-left">예시</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-3 py-2">Timing</td>
                <td className="border border-border px-3 py-2">실행 시간</td>
                <td className="border border-border px-3 py-2">Yes</td>
                <td className="border border-border px-3 py-2">RSA timing, compare early-exit</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">Cache</td>
                <td className="border border-border px-3 py-2">캐시 상태</td>
                <td className="border border-border px-3 py-2">Yes</td>
                <td className="border border-border px-3 py-2">Prime+Probe, Flush+Reload</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">Transient</td>
                <td className="border border-border px-3 py-2">투기 실행 잔재</td>
                <td className="border border-border px-3 py-2">Yes</td>
                <td className="border border-border px-3 py-2">Spectre, Meltdown, MDS</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">Power</td>
                <td className="border border-border px-3 py-2">전력 소비</td>
                <td className="border border-border px-3 py-2">부분</td>
                <td className="border border-border px-3 py-2">DPA, PLATYPUS (RAPL)</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">Electromagnetic</td>
                <td className="border border-border px-3 py-2">EM 방사</td>
                <td className="border border-border px-3 py-2">No (물리)</td>
                <td className="border border-border px-3 py-2">SEMA, DEMA</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">Controlled-channel</td>
                <td className="border border-border px-3 py-2">페이지 fault 시퀀스</td>
                <td className="border border-border px-3 py-2">Host 권한 필요</td>
                <td className="border border-border px-3 py-2">Page-fault SGX attacks</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">왜 TEE가 사이드채널에 특히 취약한가</h3>
        <div className="not-prose mb-6"><TrustBoundaryViz /></div>

        <h3 className="text-xl font-semibold mt-8 mb-3">실제 영향 — TEE별 타격</h3>
        <div className="not-prose mb-6"><SgxAttackTimelineViz /></div>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: TEE 위협 모델의 현실</p>
          <p>
            <strong>공식 위협 모델</strong>: 대부분 TEE 벤더가 "사이드채널은 범위 밖" 선언<br />
            Intel SGX: "physical attacks and side channels are out of scope"<br />
            AMD SEV: "not designed to defend against side channels"
          </p>
          <p className="mt-2">
            <strong>현실</strong>:<br />
            - 학계가 지속적으로 새 공격 발표<br />
            - 벤더가 case-by-case로 패치<br />
            - 완화 vs 방어 차이 큼
          </p>
          <p className="mt-2">
            <strong>실무 접근</strong>:<br />
            - Defense-in-depth: TEE + 앱 레벨 hardening<br />
            - Constant-time crypto 필수<br />
            - Oblivious algorithms 검토<br />
            - SMT 비활성화 (데이터센터)<br />
            - TCB 패치 주기적 적용
          </p>
        </div>

      </div>
    </section>
  );
}

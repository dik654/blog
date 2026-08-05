import TdLifecycleViz from './viz/TdLifecycleViz';
import EnterExitViz from './viz/EnterExitViz';
import TdCreateSeqViz from './viz/TdCreateSeqViz';
import TdEnterExitDetailViz from './viz/TdEnterExitDetailViz';
import TdcallExamplesViz from './viz/TdcallExamplesViz';
import TdShutdownSeqViz from './viz/TdShutdownSeqViz';

export default function LifecycleAbi() {
  return (
    <section id="lifecycle-abi" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">TD 라이프사이클 &amp; SEAMCALL/TDCALL</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-6 mb-3">TD 생성 시퀀스 (호스트 관점)</h3>

        <TdLifecycleViz />

        <TdCreateSeqViz />

        <h3 className="text-xl font-semibold mt-8 mb-3">TD 실행 흐름 — TDENTER / TDEXIT</h3>

        <EnterExitViz />

        <TdEnterExitDetailViz />

        <h3 className="text-xl font-semibold mt-8 mb-3">주요 TDG (Guest-side) 함수</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">함수</th>
                <th className="border border-border px-3 py-2 text-left">용도</th>
                <th className="border border-border px-3 py-2 text-left">반환값</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-3 py-2"><code>TDG.VP.INFO</code></td>
                <td className="border border-border px-3 py-2">TD 속성 조회 (GPAW, NUM_VCPUS)</td>
                <td className="border border-border px-3 py-2">td_info</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><code>TDG.MEM.PAGE.ACCEPT</code></td>
                <td className="border border-border px-3 py-2">Pending 페이지 활성화</td>
                <td className="border border-border px-3 py-2">completion</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><code>TDG.MEM.PAGE.ATTR.RD/WR</code></td>
                <td className="border border-border px-3 py-2">페이지 속성 읽기/쓰기</td>
                <td className="border border-border px-3 py-2">attributes</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><code>TDG.MR.REPORT</code></td>
                <td className="border border-border px-3 py-2">TDREPORT 생성 (로컬 증명)</td>
                <td className="border border-border px-3 py-2">TDREPORT_STRUCT</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><code>TDG.MR.RTMR.EXTEND</code></td>
                <td className="border border-border px-3 py-2">RTMR 확장 (동적 측정)</td>
                <td className="border border-border px-3 py-2">success</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><code>TDG.VP.VMCALL</code></td>
                <td className="border border-border px-3 py-2">Host 서비스 요청 (다음 섹션)</td>
                <td className="border border-border px-3 py-2">varies</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><code>TDG.VP.CPUIDVE.SET</code></td>
                <td className="border border-border px-3 py-2">CPUID 가상화 모드 설정</td>
                <td className="border border-border px-3 py-2">success</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">Linux Guest의 TDCALL 사용 예</h3>
        <TdcallExamplesViz />

        <h3 className="text-xl font-semibold mt-8 mb-3">TD 종료 시퀀스</h3>
        <TdShutdownSeqViz />

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: MRTD vs RTMR</p>
          <p>
            <strong>MRTD (Measurement Register for TD)</strong>:<br />
            - TD 생성 시 초기 이미지 해시 (TDH.MR.FINALIZE로 확정)<br />
            - 불변 — TD 수명 내내 고정<br />
            - SGX의 MRENCLAVE에 대응
          </p>
          <p className="mt-2">
            <strong>RTMR[0..3] (Runtime Measurement Register)</strong>:<br />
            - 런타임에 확장 가능 (TDG.MR.RTMR.EXTEND)<br />
            - SHA-384 해시 체인<br />
            - TPM PCR과 유사한 개념<br />
            - 용도: 부트로더→커널→initrd 체인 측정, 동적 로드 코드 기록
          </p>
          <p className="mt-2">
            <strong>사용 예</strong>:<br />
            - RTMR[0]: UEFI 측정<br />
            - RTMR[1]: 부트로더 측정<br />
            - RTMR[2]: 커널 측정<br />
            - RTMR[3]: 사용자 정의 (앱 레벨)
          </p>
        </div>

      </div>
    </section>
  );
}

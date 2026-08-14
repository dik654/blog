import { CitationBlock } from "@/components/ui/citation";
import ECComparisonViz from "./viz/ECComparisonViz";

export default function Comparison() {
  return (
    <section id="comparison" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        RS·RaptorQ·LDPC는 보장·channel·decoder 비용을 함께 놓고 선택합니다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Reed–Solomon은 고정된 block에서 정확한 MDS threshold가 중요할 때
          강합니다. RaptorQ는 repair symbol을 계속 만들 수 있는 fountain
          계열이라 수신자가 어떤 packet을 잃을지 모르고 수신 수가 유동적인
          전송에 맞습니다. LDPC는 sparse parity-check graph와 iterative
          decoder를 사용해 큰 block에서 높은 throughput을 노리지만, 필요한
          수신량과 실패율은 선택한 code profile·channel·decoder에 따라
          달라집니다.
        </p>
      </div>
      <ECComparisonViz />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>선택표는 “빠름” 한 칸으로 끝내지 않습니다</h3>
        <ul>
          <li>
            <strong>입력 계약:</strong> object size 분포, symbol size,
            fixed/rateless n, erasure와 corruption 비율
          </li>
          <li>
            <strong>복원 계약:</strong> guaranteed threshold인지 확률적
            overhead인지, timeout·partial result·integrity failure type
          </li>
          <li>
            <strong>비용:</strong> encode/decode p50·p95, peak memory, repair
            bandwidth, vector ISA와 병렬도
          </li>
          <li>
            <strong>운영:</strong> profile version, cross-version rejection,
            crash resume, object digest, canary와 rollback artifact
          </li>
        </ul>
        <p>
          같은 600 MiB fixture에서 loss pattern을 0·1·4 erasures, 1·2
          corruptions, burst loss, duplicate/wrong-index symbol로 고정하고 복원
          byte equality까지 비교합니다. 먼저 correctness와 failure
          classification parity를 통과시킨 뒤 throughput을 봐야, 빠르게 잘못된
          object를 내놓는 decoder를 채택하지 않습니다.
        </p>
      </div>

      <div id="paper-rfc6330-raptorq" className="scroll-mt-24">
        <CitationBlock
          source="RFC 6330 · RaptorQ Forward Error Correction Scheme"
          href="https://www.rfc-editor.org/rfc/rfc6330.html"
          citeKey={4}
        >
          문제: receiver마다 loss pattern이 다른 object delivery에서 고정된
          repair 개수 없이 복원해야 합니다. 기여: source·repair symbol identity,
          systematic RaptorQ encoder와 compliant decoder 요구를 규정합니다.
          전제: RFC profile과 충분한 encoding symbol set을 사용합니다. 근거
          범위: RaptorQ FEC scheme입니다. 비주장: 임의의 정확히 k개가 항상
          충분한 MDS code이거나 integrity·source authentication을 대신하지
          않습니다.
        </CitationBlock>
      </div>
      <div id="paper-rfc5170-ldpc" className="scroll-mt-24">
        <CitationBlock
          source="RFC 5170 · LDPC Staircase and Triangle FEC Schemes"
          href="https://www.rfc-editor.org/rfc/rfc5170.html"
          citeKey={5}
        >
          문제: large object delivery에서 sparse graph 기반의 실용적인 FEC
          profile이 필요합니다. 기여: LDPC Staircase·Triangle
          encoding/decoding과 packet format을 규정합니다. 전제: RFC의 matrix
          construction과 receiver profile을 고정합니다. 근거 범위: 해당 LDPC FEC
          schemes입니다. 비주장: 모든 LDPC code·5G/Wi-Fi profile이나 어떤
          workload에서도 RS보다 빠르다는 보장이 아닙니다.
        </CitationBlock>
      </div>
    </section>
  );
}

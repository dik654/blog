import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import StorageProofOverviewViz from "./viz/StorageProofOverviewViz";

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        저장 증명은 “파일이 있다”를 하나의 Boolean으로 줄이지 않는다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-lg leading-8">
          Remote storage provider가 짧은 challenge에 답했다고 해서 client가 지금 전체 file을
          빠르게 내려받을 수 있고, 다른 provider와 독립된 replica를 보유하며, 계약 기간 내내
          저장했다는 세 결론이 동시에 나오지는 않습니다. Proof of storage는 검증하려는 주장에
          따라 encoding·commitment·challenge·extractor·time receipt를 다르게 구성합니다.
        </p>
        <p>
          이 글은 Proof of Retrievability(PoR)의 추출 가능성, Filecoin 적용의 Proof of
          Replication(PoRep)과 Proof of Spacetime(PoSt)을 구분합니다. Hash·Merkle commitment는
          <Link to="/crypto/hash-theory"> hash 정본</Link>, error-correcting recovery는
          <Link to="/blockchain/erasure-coding"> erasure coding</Link>, succinct proof는
          <Link to="/crypto/snark-theory"> SNARK</Link>에서 가져옵니다.
        </p>
      </div>
      <ContentBoundary article="pos-theory" />
      <StorageProofOverviewViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>세 질문의 output을 분리합니다</h3>
        <ul>
          <li><strong>PoR:</strong> 충분히 자주 응답하는 prover에서 extractor가 encoded file 전체를 복구할 수 있는가?</li>
          <li><strong>PoRep:</strong> 특정 provider·sector context에 묶인 replica-specific encoding과 commitment가 존재하는가?</li>
          <li><strong>PoSt:</strong> 여러 proving window의 fresh challenge obligation을 계속 만족했는가?</li>
        </ul>
        <p>
          이 proof들은 data confidentiality, geographic diversity, user-facing retrieval latency,
          censorship resistance를 자동 보장하지 않습니다. Storage proof acceptance와 retrieval
          service SLO, encryption key custody, replication placement는 별도 receipt와 평가가 필요합니다.
          같은 운영 주체의 replica 여러 개는 수량이 늘어도 장애·검열 위험이 함께 움직일 수 있으므로
          provider correlation도 별도 배치 정책과 failure test로 확인합니다.
        </p>
      </div>
    </section>
  );
}

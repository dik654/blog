import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import StorageProofOverviewViz from "./viz/StorageProofOverviewViz";

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        저장 증명은 “파일이 있다”를 세 가지 질문으로 나눕니다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-lg leading-8">
          한 문장으로 말하면, <strong>PoR</strong>은 전체 파일을 복구할 수
          있는지,
          <strong> PoRep</strong>은 특정 복제본을 만들었는지,{" "}
          <strong>PoSt</strong>는 그 복제본을 시간에 걸쳐 계속 보관했는지
          묻습니다. 짧은 challenge 한 번에 답했다고 세 질문이 모두 참이 되는
          것은 아닙니다.
        </p>
        <p>
          Alice의 파일 F 하나를 따라가며 표본 응답이 언제 전체 복구 주장으로
          이어지는지, 같은 data의 복제본을 어떻게 구별하는지, fresh challenge가
          왜 여러 proving window에 반복되는지 차례로 봅니다. Hash·Merkle
          commitment는 <Link to="/cs/crypto/hash-theory">hash 정본</Link>,
          error-correcting recovery는
          <Link to="/cs/blockchain/erasure-coding"> erasure coding</Link>,
          succinct proof는 <Link to="/cs/crypto/snark-theory">SNARK</Link>에서
          가져옵니다.
        </p>
      </div>
      <StorageProofOverviewViz />
      <ContentBoundary article="pos-theory" />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>세 질문의 output을 분리합니다</h3>
        <ul>
          <li>
            <strong>PoR:</strong> 충분히 자주 응답하는 prover에서 extractor가
            encoded file 전체를 복구할 수 있는가?
          </li>
          <li>
            <strong>PoRep:</strong> 특정 provider·sector context에 묶인
            replica-specific encoding과 commitment가 존재하는가?
          </li>
          <li>
            <strong>PoSt:</strong> 여러 proving window의 fresh challenge
            obligation을 계속 만족했는가?
          </li>
        </ul>
        <p>
          이 proof들은 data confidentiality, geographic diversity, user-facing
          retrieval latency, censorship resistance를 자동 보장하지 않습니다.
          Storage proof acceptance와 retrieval service SLO, encryption key
          custody, replication placement는 별도 평가가 필요합니다.
        </p>
        <p>
          같은 운영 주체의 replica 여러 개는 수량이 늘어도 장애·검열 위험이 함께
          움직일 수 있으므로 provider correlation도 별도 배치 정책과 failure
          test로 확인합니다.
        </p>
      </div>
    </section>
  );
}

import ContentBoundary from "@/components/articles/content-boundary";
import type { CodeRef } from "@/components/code/types";
import BootstrapTraceViz from "./viz/BootstrapTraceViz";

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function Overview({ onCodeRef: _onCodeRef }: Props) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">Checkpoint C는 어떻게 첫 LightClientStore S1이 될까요?</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          처음 실행한 Helios에는 어느 beacon header가 진짜인지 판정할 내부 기준이 없습니다. 이 글은 bootstrap attempt <code>b-17</code> 하나를 고정해,
          승인된 checkpoint <code>C</code>가 응답의 header <code>H</code>와 committee <code>K</code>를 거쳐 첫 store <code>S1</code>이 되는 과정을 따라갑니다.
        </p>
      </div>
      <BootstrapTraceViz />
      <ContentBoundary article="helios-bootstrap" />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>이 글이 답할 질문</h3>
        <p>
          RPC가 <code>H·K·B</code>를 반환했다는 사실만으로 왜 <code>K</code>를 다음 서명 검증에 쓸 수 없을까요? 답은 두 결속입니다.
          <code>HTR(H)=C</code>로 header를 신뢰 시작점에 묶고, <code>Fold(HTR(K),B)=H.state_root</code>로 committee를 그 header의 state에 묶어야 합니다.
          두 검사가 모두 끝나기 전에는 authoritative store를 바꾸지 않습니다.
        </p>
      </div>
    </section>
  );
}

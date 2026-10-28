import ContentBoundary from "@/components/articles/content-boundary";
import type { CodeRef } from "@/components/code/types";
import UpdateStoreViz from "./viz/UpdateStoreViz";

interface Props {
  onCodeRef: (key: string, ref: CodeRef) => void;
}

export default function Overview({ onCodeRef: _onCodeRef }: Props) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">
        검증된 update는 Store의 어느 필드를 바꿀까요?
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          앞 글에서 <code>u-8193</code>의 시간·Merkle branch·BLS 검증을
          마쳤습니다. 이제 같은 update가 메모리 Store <code>T0</code>의 후보,
          두 header와 두 committee를 어떤 조건으로 바꾸는지 한 필드씩
          따라갑니다.
        </p>
      </div>

      <UpdateStoreViz />
      <ContentBoundary article="helios-update" />

      <div
        id="store-input"
        className="prose prose-neutral max-w-none scroll-mt-24 dark:prose-invert"
      >
        <h3>입력은 이미 검증된 GenericUpdate입니다</h3>
        <p>
          이 글은 검증 함수를 다시 설명하지 않습니다. 입력 receipt에는
          attested·finalized slot 8,192, signature slot 8,193, 참여 position
          342개와 branch로 확인한 next committee <code>K2</code>가 들어
          있습니다. Store <code>T0</code>는 finalized·optimistic slot 8,191,
          current <code>K0</code>, next <code>K1</code>을 가지고 있습니다.
        </p>
        <p>
          Store에는 header와 committee 말고도 <code>best_valid_update</code>,
          이전·현재 period의 최대 참여 수가 있습니다. Helios는 이 누적값으로
          optimistic 전진 기준을 만들고, update의 2/3 참여와 새 finality는
          별도 조건으로 판정합니다. 따라서 “서명이 맞으니 Store 전체를
          교체한다”는 설명은 실제 상태 전이를 놓칩니다.
        </p>
      </div>
    </section>
  );
}

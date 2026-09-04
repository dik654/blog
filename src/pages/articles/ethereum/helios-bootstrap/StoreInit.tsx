import type { CodeRef } from "@/components/code/types";

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function StoreInit({ title, onCodeRef: _onCodeRef }: Props & { title: string }) {
  return (
    <section id="store-init" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">{title}</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          검증이 모두 끝난 뒤에만 store generation 1을 공개합니다. Finalized header와 optimistic header는 bootstrap header로 시작하고
          current committee는 검증한 K를 사용하며 next committee는 아직 모르는 상태로 둡니다. Participation maxima와 best-valid-
          update 같은 보조 상태도 spec의 초기값으로 함께 설정해야 첫 update의 safety threshold가 재현됩니다.
        </p>
        <p>
          Network·checkpoint root·header root·committee root·spec version을 하나의 initialization receipt로 묶고 atomic하게 저장합니다.
          Header만 쓰고 crash한 뒤 committee를 새 응답에서 채우면 서로 다른 bootstrap의 조각이 섞일 수 있으므로, 실패하면 이전 store를
          그대로 유지하거나 전체 초기화를 다시 수행합니다.
        </p>
      </div>
    </section>
  );
}

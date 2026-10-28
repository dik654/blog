import type { CodeRef } from "@/components/code/types";
import { CodeViewButton } from "@/components/code";
import { codeRefs } from "./codeRefs";

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function StoreInit({ title, onCodeRef }: Props & { title: string }) {
  return (
    <section id="store-init" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">{title}</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          검증이 모두 끝난 뒤에만 첫 store S1을 만듭니다. Finalized header와 optimistic header는 bootstrap header H로 시작하고,
          current committee는 검증한 K를 사용하며 next committee는 아직 모르는 상태로 둡니다. Participation maxima와
          best-valid-update 같은 보조 상태도 초기값으로 함께 설정해야 첫 update의 threshold 계산이 재현됩니다.
        </p>
        <p>
          Pinned 구현의 <code>apply_bootstrap</code>은 기존 <code>LightClientStore</code> 전체를 새 struct로 한 번에 대입합니다. 따라서
          <code>verify_bootstrap</code>이 오류를 반환하면 apply 자체가 호출되지 않습니다. 다만 이 코드만으로 disk persistence의 원자성이나
          process crash 뒤 복구까지 증명되지는 않습니다. 여기서 확인한 경계는 in-memory Store 교체 순서입니다.
        </p>
      </div>
      <div className="not-prose mt-5">
        <CodeViewButton label="실제 Store 전체 대입 보기" onClick={() => onCodeRef("hl-init", codeRefs["hl-init"])} />
      </div>
    </section>
  );
}

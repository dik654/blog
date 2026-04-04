import type { CodeRef } from '@/components/code/types';

export default function UCAN({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="ucan" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">UCAN 인증 &amp; 권한 위임</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          UCAN — 키페어 기반 분산 인증. JWT와 유사하지만 중앙 서버 없이 권한 위임 체인 구성.<br />
          각 단계에서 권한 범위를 축소(attenuation) 가능 — 최소 권한 원칙 준수
        </p>
      </div>
    </section>
  );
}

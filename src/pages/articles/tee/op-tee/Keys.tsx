import HUKDeriveViz from './viz/HUKDeriveViz';
import KeyHierarchyViz from './viz/KeyHierarchyViz';
import GPApiViz from './viz/GPApiViz';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function Keys({
  title,
  onCodeRef,
}: {
  title?: string;
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="keys" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? 'HUK & 키 파생 (huk_subkey.c)'}</h2>
      <div className="not-prose mb-8"><HUKDeriveViz /></div>
      <div className="not-prose mb-4 flex flex-wrap gap-2">
        <CodeViewButton onClick={() => onCodeRef('key-init-manager', codeRefs['key-init-manager'])} />
        <span className="text-[10px] text-muted-foreground self-center">키 매니저 초기화</span>
        <CodeViewButton onClick={() => onCodeRef('key-fek-crypt', codeRefs['key-fek-crypt'])} />
        <span className="text-[10px] text-muted-foreground self-center">FEK 암/복호화</span>
        <CodeViewButton onClick={() => onCodeRef('key-hmac', codeRefs['key-hmac'])} />
        <span className="text-[10px] text-muted-foreground self-center">HMAC 래퍼</span>
        <CodeViewButton onClick={() => onCodeRef('key-generate-fek', codeRefs['key-generate-fek'])} />
        <span className="text-[10px] text-muted-foreground self-center">FEK 생성</span>
        <CodeViewButton onClick={() => onCodeRef('key-ssk-struct', codeRefs['key-ssk-struct'])} />
        <span className="text-[10px] text-muted-foreground self-center">SSK 구조체</span>
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          OP-TEE의 보안 스토리지와 RPMB 키는 <strong>HUK(Hardware Unique Key)</strong>를
          루트로 HMAC-SHA256으로 파생합니다.<br />
          HUK는 플랫폼 OTP(One-Time Programmable 메모리)에 저장됩니다.<br />
          Secure World만 접근 가능합니다.
        </p>
        <h3>보안 스토리지 키 계층</h3>
      </div>
      <div className="not-prose mb-6"><KeyHierarchyViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>GP TEE Internal Core API</h3>
      </div>
      <div className="not-prose mb-6"><GPApiViz /></div>
    </section>
  );
}

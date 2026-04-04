import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import KeyDerivViz from './viz/KeyDerivViz';

interface Props {
  onCodeRef: (key: string, ref: CodeRef) => void;
}

export default function KeyDerivation({ onCodeRef }: Props) {
  return (
    <section id="key-derivation" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Seal Key 파생 (EGETKEY)</h2>
      <div className="not-prose mb-8"><KeyDerivViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          모든 SGX CPU에는 제조 시 퓨즈에 주입된 <strong>Root Seal Key</strong>가 있습니다.<br />
          소프트웨어로 직접 읽을 수 없고, EGETKEY 명령어를 통해서만 파생 키를 얻습니다.
        </p>
        <p>
          EGETKEY는 KDF(Key Derivation Function)로 <strong>AES-CMAC</strong>를 사용합니다.
          <br />
          입력: Root Key + MRENCLAVE/MRSIGNER + ISV_SVN + CPUSVN + KEYID.
          <br />
          출력: 128-bit Seal Key.
        </p>
        <p>
          TEE 코드나 정책이 바뀌면 <strong>다른 키</strong>가 파생됩니다.<br />
          이것이 코드 바인딩의 핵심입니다.
        </p>
        <div className="not-prose flex flex-wrap gap-2 my-4">
          <CodeViewButton onClick={() => onCodeRef('seal-key-derivation', codeRefs['seal-key-derivation'])} />
          <span className="text-[10px] text-muted-foreground self-center">EGETKEY + Key Derivation Tree</span>
        </div>
      </div>
    </section>
  );
}

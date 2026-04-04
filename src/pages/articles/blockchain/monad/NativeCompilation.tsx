import JITCompileViz from './viz/JITCompileViz';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function NativeCompilation({ onCodeRef }: {
  onCodeRef?: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="native-compilation" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">VM 네이티브 컴파일 (JIT)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          asmjit로 EVM 바이트코드 → x86-64 네이티브 변환<br />
          인터프리터 대비 2.01배, evmone 대비 1.57배. 첫 실행은 인터프리터, 이후 캐시
        </p>
        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() =>
              onCodeRef('monad-jit-compile', codeRefs['monad-jit-compile'])} />
            <span className="text-[10px] text-muted-foreground self-center">
              jit_compiler.cpp
            </span>
          </div>
        )}
      </div>
      <div className="not-prose my-8">
        <JITCompileViz onOpenCode={onCodeRef
          ? (k: string) => onCodeRef(k, codeRefs[k])
          : undefined} />
      </div>
    </section>
  );
}

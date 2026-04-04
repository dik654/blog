import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function WasmRuntime({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="wasm-runtime" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">WASM 런타임 & Actor 실행</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('fvm-machine', codeRefs['fvm-machine'])} />
          <span className="text-[10px] text-muted-foreground self-center">execute_message()</span>
        </div>
        <p>
          메시지가 도착하면 to 주소의 Actor 코드(WASM)를 로드해 인스턴스 생성.<br />
          syscall(ipld_open, ipld_get, ipld_put)로 IPLD 상태 트리에 접근
        </p>
        <p>
          가스 미터링: WASM 명령어마다 가스를 차지해 무한 루프 방지.<br />
          가스 한도 초과 시 실행 중단, 상태 변경은 롤백
        </p>
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>💡 WASM의 장점</strong> — 언어 독립적. Rust, Go, AssemblyScript 등으로<br />
          Actor를 작성 가능. 샌드박스 실행으로 보안성이 높고 결정론적
        </p>
      </div>
    </section>
  );
}

import CodePanel from '@/components/ui/code-panel';
import {CLI_CODE, cliAnnotations, PROJECT_STRUCT_CODE, WORKFLOW_STEPS, } from './CLIToolsData';

export default function CLITools() {
  return (
    <section id="cli-tools" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">SP1 CLI &amp; 개발 도구</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <code>cargo-prove</code> CLI는 프로젝트 생성, 빌드, 실행, 증명을
          하나의 워크플로우로 통합합니다.
          <code>sp1up</code>으로 도구체인을 설치하면
          RISC-V 크로스 컴파일러와 SDK가 함께 설정됩니다.
        </p>
        <CodePanel title="CLI 명령어" code={CLI_CODE} annotations={cliAnnotations} />
        <h3>개발 워크플로우</h3>
      </div>
      <div className="space-y-1.5 mt-4 mb-6">
        {WORKFLOW_STEPS.map(w => (
          <div key={w.step} className="rounded-lg border border-border/60 p-3 flex gap-3">
            <span className="font-mono text-xs font-bold text-indigo-400 w-36 flex-shrink-0">
              {w.step}
            </span>
            <span className="font-mono text-[11px] text-foreground/50 w-40 flex-shrink-0">
              {w.cmd}
            </span>
            <span className="text-sm text-foreground/75">{w.desc}</span>
          </div>
        ))}
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          # 프로젝트 구조<br />
          my-project/<br />
          program/ # Guest (zkVM 내부 실행)<br />
          Cargo.toml # sp1-zkvm 의존성<br />
          src/<br />
          main.rs # #![no_main], entrypoint!(main)<br />
          script/ # Host (로컬 실행)<br />
          Cargo.toml # sp1-sdk 의존성<br />
          src/<br />
          main.rs # ProverClient, prove/verify<br />
          elf/ # 빌드된 RISC-V ELF 바이너리
        </p>
      </div>
    </section>
  );
}

import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import KeyDerivViz from './viz/KeyDerivViz';
import EgetkeyStructViz from './viz/EgetkeyStructViz';
import SealKeyFormulaViz from './viz/SealKeyFormulaViz';
import KeyTreeViz from './viz/KeyTreeViz';
import CpusvnViz from './viz/CpusvnViz';
import SgxSdkUsageViz from './viz/SgxSdkUsageViz';

interface Props {
  onCodeRef: (key: string, ref: CodeRef) => void;
}

export default function KeyDerivation({ onCodeRef }: Props) {
  return (
    <section id="key-derivation" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Seal Key 파생 (EGETKEY)</h2>
      <div className="not-prose mb-8"><KeyDerivViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-6 mb-3">Root Seal Key</h3>
        <p>
          모든 SGX CPU에 제조 시 <strong>퓨즈(e-fuse)</strong>에 주입된 <strong>Root Seal Key</strong><br />
          소프트웨어로 직접 읽기 불가 — EGETKEY 명령어로만 <strong>파생</strong> 가능<br />
          <strong>Per-CPU 고유</strong> — 각 칩마다 다른 값<br />
          <strong>Tamper-resistant</strong> — 물리 공격 없이는 추출 불가
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">EGETKEY 명령어 구조</h3>
        <div className="not-prose mb-6"><EgetkeyStructViz /></div>

        <h3 className="text-xl font-semibold mt-8 mb-3">Seal Key 파생 공식</h3>
        <div className="not-prose mb-6"><SealKeyFormulaViz /></div>

        <h3 className="text-xl font-semibold mt-8 mb-3">Key Derivation Tree</h3>
        <div className="not-prose mb-6"><KeyTreeViz /></div>

        <h3 className="text-xl font-semibold mt-8 mb-3">CPUSVN — TCB 버전 바인딩</h3>
        <div className="not-prose mb-6"><CpusvnViz /></div>

        <h3 className="text-xl font-semibold mt-8 mb-3">SGX SDK 사용법</h3>
        <div className="not-prose mb-6"><SgxSdkUsageViz /></div>

        <div className="not-prose flex flex-wrap gap-2 my-4">
          <CodeViewButton onClick={() => onCodeRef('seal-key-derivation', codeRefs['seal-key-derivation'])} />
          <span className="text-[10px] text-muted-foreground self-center">EGETKEY + Key Derivation Tree</span>
        </div>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: Root Key의 위협 모델</p>
          <p>
            <strong>Intel이 Root Key를 모르는가?</strong><br />
            - 공식 주장: per-chip random, factory 때만 alive<br />
            - 현실: Intel이 "generating entity"이므로 이론적으로 알 수 있음<br />
            - 전문가 의견: backup이 존재할 가능성 (상용화 요구)
          </p>
          <p className="mt-2">
            <strong>신뢰 가정</strong>:<br />
            - Intel이 Root Key 누출 시 대형 보안 사고<br />
            - 따라서 Intel은 극도로 보호 (HSM, offline 보관)<br />
            - 하지만 "zero trust in Intel"은 불가능<br />
            - 이것이 DICE(Device Identifier Composition Engine) 등 대안 연구 동기
          </p>
          <p className="mt-2">
            <strong>대안 접근</strong>:<br />
            - Multi-party computation으로 root key 생성 (Intel + OEM)<br />
            - Formal Key Attestation (AMD VCEK와 유사)<br />
            - 현재는 Intel "trusted by design"
          </p>
        </div>

      </div>
    </section>
  );
}

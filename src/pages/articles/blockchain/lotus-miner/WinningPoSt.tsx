import WinPostViz from './viz/WinPostViz';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function WinningPoSt({ onCodeRef }: Props) {
  return (
    <section id="winning-post" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">WinningPoSt — MineOne() 내부</h2>
      <p className="text-sm text-muted-foreground mb-4">
        매 에폭(30초)마다 VRF 추첨 → 당첨 시 PoSt 증명 → 블록 생성<br />
        WinCount는 포아송 분포 — 스토리지 파워에 비례한 공정 추첨
      </p>
      <div className="not-prose mb-8">
        <WinPostViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
    </section>
  );
}

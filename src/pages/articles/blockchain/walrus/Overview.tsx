import CodePanel from '@/components/ui/code-panel';
import WalrusBFTViz from '../components/WalrusBFTViz';
import ErasureCodingViz from './viz/ErasureCodingViz';
import {CRATE_CODE, CRATE_ANNOTATIONS, BFT_CODE, BFT_ANNOTATIONS, REDSTUFF_CODE, } from './OverviewData';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function Overview({ title, onCodeRef }: { title?: string; onCodeRef?: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? '개요 & RedStuff 2D 이레이저 코딩'}</h2>
      <div className="not-prose mb-8">
        <WalrusBFTViz />
      </div>
      <div className="not-prose mb-8">
        <ErasureCodingViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>Walrus</strong>는 Sui 블록체인 위에 구현된 탈중앙 블롭(Blob, 대용량 이진 데이터) 저장소입니다.
          <br />
          핵심 설계는 <strong>RedStuff</strong>라는 2D Reed-Solomon 이레이저 코딩(Erasure Coding, 소거 부호화) 알고리즘입니다.
          <br />
          n개의 저장 노드 중 f개가 비잔틴 장애를 일으켜도 (n=3f+1) 데이터를 복구할 수 있습니다.
        </p>
        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() => onCodeRef('walrus-bft', codeRefs['walrus-bft'])} />
            <span className="text-[10px] text-muted-foreground self-center">bft.rs</span>
            <CodeViewButton onClick={() => onCodeRef('walrus-config', codeRefs['walrus-config'])} />
            <span className="text-[10px] text-muted-foreground self-center">config.rs</span>
          </div>
        )}

        <h3>크레이트 구조</h3>
        <CodePanel title="Walrus 모노레포 크레이트 맵" code={CRATE_CODE} annotations={CRATE_ANNOTATIONS} />

        <h3>BFT 파라미터 (bft.rs)</h3>
        <CodePanel title="BFT 파라미터 & 인코딩 설정" code={BFT_CODE} annotations={BFT_ANNOTATIONS} />

        <h3>RedStuff 핵심 아이디어</h3>
        <p>
          // 2D 메시지 행렬: primary_k × secondary_k 심볼<br />
          // ← secondary_k 열 →<br />
          // ↑ raw blob data (행 우선) (primary_k 행)<br />
          // primary_k<br />
          // ↓ (zero-padded)<br />
          // 행(row) 방향 Reed-Solomon → Secondary 슬라이버 (n_shards개)<br />
          // 열(col) 방향 Reed-Solomon → Primary 슬라이버 (n_shards개)<br />
          // 노드 i가 보유: (Primary슬라이버[i], Secondary슬라이버[n-1-i])<br />
          // → 두 방향 인코딩이 교차되어 f개 장애 노드에서도 복구 가능<br />
          // 복구 임계값:<br />
          // Primary 슬라이버 복구: secondary_k = n-f 개 심볼 필요<br />
          // Secondary 슬라이버 복구: primary_k = n-2f 개 심볼 필요
        </p>
      </div>
    </section>
  );
}

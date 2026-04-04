import CodePanel from '@/components/ui/code-panel';
import GatewayFlowViz from './viz/GatewayFlowViz';
import { GATEWAY_CODE, GATEWAY_ANNOTATIONS, GATEWAY_TYPES } from './GatewayData';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function Gateway({ onCodeRef }: {
  onCodeRef?: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="gateway" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Gateway</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          IPFS HTTP 게이트웨이는 웹 브라우저와 HTTP 클라이언트가
          IPFS 콘텐츠에 접근할 수 있게 하는 <strong>HTTP-to-IPFS 브리지</strong>입니다.<br />
          IPFS 경로를 HTTP URL로 변환하고, 콘텐츠를 표준 HTTP 응답으로 제공합니다.
        </p>
        <h3>게이트웨이 유형</h3>
        <div className="not-prose overflow-x-auto mb-4">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">유형</th>
                <th className="text-left p-2">URL 형식</th>
                <th className="text-left p-2">특징</th>
              </tr>
            </thead>
            <tbody>
              {GATEWAY_TYPES.map((g) => (
                <tr key={g.name} className="border-b border-muted">
                  <td className="p-2 font-mono text-xs">{g.name}</td>
                  <td className="p-2 font-mono text-xs">{g.url}</td>
                  <td className="p-2">{g.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <h3>NoFetch 모드</h3>
        <p>
          <code>Gateway.NoFetch = true</code> 설정 시 네트워크 블록을 가져오지 않고
          로컬 블록만 서빙합니다.<br />
          대역폭 제한 환경이나 프라이빗 게이트웨이에 유용합니다.
        </p>
        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() => onCodeRef('kubo-gateway-option', codeRefs['kubo-gateway-option'])} />
            <span className="text-[10px] text-muted-foreground self-center">GatewayOption</span>
            <CodeViewButton onClick={() => onCodeRef('kubo-gateway-backend', codeRefs['kubo-gateway-backend'])} />
            <span className="text-[10px] text-muted-foreground self-center">Gateway Backend</span>
            <CodeViewButton onClick={() => onCodeRef('kubo-serve-option', codeRefs['kubo-serve-option'])} />
            <span className="text-[10px] text-muted-foreground self-center">ServeOption 체인</span>
          </div>
        )}
        <CodePanel title="게이트웨이 핸들러 등록" code={GATEWAY_CODE} annotations={GATEWAY_ANNOTATIONS} />
      </div>
      <div className="mt-8"><GatewayFlowViz /></div>
    </section>
  );
}

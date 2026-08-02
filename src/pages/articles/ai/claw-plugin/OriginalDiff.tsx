export default function OriginalDiff() {
  return (
    <section id="original-diff" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">원본 Claude Code 와의 차이</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <p>
          claw 의 plugin 시스템은 <strong>PluginKind 3종 + plugin-manifest.json + 서브프로세스 격리</strong><br />
          원본은 <strong>44 모듈 / 22,227 LOC</strong> — Anthropic 공식 marketplace + zip cache + 서명 검증 + autoupdate + blocklist + dependency resolver + MCP/LSP 통합 + headless install + enterprise policy<br />
          plugin 영역의 단순화 비율이 가장 큼 — claw 의 핵심 추상 (3 PluginKind) 과 원본의 ecosystem 깊이가 정반대 무게
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">본질 차이</h3>
        <div className="overflow-x-auto not-prose my-4">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">항목</th>
                <th className="border border-border px-3 py-2 text-left">claw (이 글)</th>
                <th className="border border-border px-3 py-2 text-left">원본 Claude Code</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-3 py-2 font-semibold">Marketplace</td>
                <td className="border border-border px-3 py-2">없음 — settings.json 직접 등록</td>
                <td className="border border-border px-3 py-2">Anthropic 공식 + GCS 호스팅 + startup check + 사용자 marketplace 추가 가능 (<code>marketplaceManager.ts</code>, <code>officialMarketplace.ts</code>)</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2 font-semibold">배포 형식</td>
                <td className="border border-border px-3 py-2">로컬 디렉토리</td>
                <td className="border border-border px-3 py-2">zip 다운로드 + <code>zipCache.ts</code> 406 LOC + 서명 검증 (<code>validatePlugin.ts</code> 903 LOC)</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2 font-semibold">Blocklist / flagging</td>
                <td className="border border-border px-3 py-2">없음</td>
                <td className="border border-border px-3 py-2">Anthropic 가 악성 plugin 차단 + 사용자 reporting flag</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2 font-semibold">Auto-update</td>
                <td className="border border-border px-3 py-2">없음</td>
                <td className="border border-border px-3 py-2">semver autoupdate (<code>pluginAutoupdate.ts</code> + <code>pluginVersioning.ts</code>)</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2 font-semibold">Plugin entity</td>
                <td className="border border-border px-3 py-2">3 PluginKind (ToolProvider / HookProvider / ContextProvider)</td>
                <td className="border border-border px-3 py-2">4 entity — agents / commands / hooks / output-styles (<code>loadPluginAgents</code> / <code>Commands</code> / <code>Hooks</code> / <code>OutputStyles</code>)</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2 font-semibold">MCP integration</td>
                <td className="border border-border px-3 py-2">없음 — plugin / MCP 별개</td>
                <td className="border border-border px-3 py-2"><code>.mcpb</code> bundle — plugin 안에 MCP 서버 묶어서 배포 (<code>mcpbHandler.ts</code>, <code>mcpPluginIntegration.ts</code>)</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2 font-semibold">LSP integration</td>
                <td className="border border-border px-3 py-2">없음</td>
                <td className="border border-border px-3 py-2">plugin → LSP 자동 추천 (<code>lspPluginIntegration.ts</code>, <code>lspRecommendation.ts</code>)</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2 font-semibold">Enterprise policy</td>
                <td className="border border-border px-3 py-2">없음</td>
                <td className="border border-border px-3 py-2"><code>pluginPolicy.ts</code> + <code>managedPlugins.ts</code> — 회사가 특정 plugin 만 허용 강제</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2 font-semibold">Headless install</td>
                <td className="border border-border px-3 py-2">없음</td>
                <td className="border border-border px-3 py-2"><code>headlessPluginInstall.ts</code> — CI 환경 prompt 없이 install</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2 font-semibold">Dependency resolver</td>
                <td className="border border-border px-3 py-2">없음</td>
                <td className="border border-border px-3 py-2"><code>dependencyResolver.ts</code> — plugin 간 의존성 해결</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">Plugin × MCP × Skill — 통합 생태계</h3>
        <p>
          원본 plugin 의 흥미로운 점은 <strong>다른 시스템과의 통합</strong>:<br />
          <strong>Plugin → MCP</strong>: <code>.mcpb</code> bundle 로 MCP 서버를 plugin 안에 묶어서 배포. 한 번에 install 하면 도구 + MCP 서버 둘 다 활성화. claw-mcp 글의 InProcessTransport 와 결합되면 plugin 이 자체 MCP 서버를 process 안에서 띄움<br />
          <strong>Plugin → LSP</strong>: plugin 이 LSP 서버 자동 추천. 사용자가 Rust 프로젝트 열면 rust-analyzer plugin 자동 제안<br />
          <strong>Plugin → Skill</strong>: plugin 의 markdown 파일 (<code>walkPluginMarkdown.ts</code> 69 LOC) 을 skill 로 자동 등록. plugin 이 도구 + 스킬 + MCP 서버 + LSP 추천을 한 묶음으로 배포 가능<br />
          claw 는 plugin / MCP / skill / LSP 가 모두 별도 — 통합 부재
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">4 entity 분류 차이 — output-styles</h3>
        <p>
          claw 의 plugin 분류: ToolProvider / HookProvider / ContextProvider<br />
          원본의 분류: agents / commands / hooks / output-styles<br />
          가장 흥미로운 차이는 <strong>output-styles</strong> — Claude 의 응답 형식 (verbose / concise / structured 등) 을 plugin 으로 배포. 사용자가 회사 톤·언어·포맷 standardization 가능<br />
          claw 의 ContextProvider 는 instruction injection 에 가까워 다른 추상
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">서명 + Blocklist + Telemetry — Marketplace 운영의 본질</h3>
        <p>
          <code>validatePlugin.ts</code> 903 LOC 는 plugin 서명 + 권한 + dependency 검증<br />
          <code>pluginBlocklist.ts</code> + <code>pluginFlagging.ts</code> — Anthropic 가 악성 plugin 발견하면 즉시 차단, 사용자가 의심 plugin 신고<br />
          <code>installCounts.ts</code> + <code>fetchTelemetry.ts</code> — install 통계 + 사용 패턴 → marketplace ranking + 악성 패턴 탐지<br />
          이건 marketplace 가 production 운영되려면 필수 layer. claw 가 이 부분을 안 다루는 건 "marketplace 는 다음 lane" 결정
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">왜 이렇게 갈라졌나</p>
          <p>
            <strong>claw 의 PluginKind 3종 + 직접 등록</strong> — plugin 이 무엇인지 (도구·훅·컨텍스트) 의 추상은 깔끔. 단일 사용자 / 사내 plugin 시나리오 cover. settings.json 직접 등록이라 corporate 환경에서도 git 으로 공유 가능
          </p>
          <p className="mt-2">
            <strong>원본의 22,227 LOC</strong> — Claude Code 가 일종의 <strong>플랫폼</strong> 으로 동작해야 함. Anthropic marketplace 에서 다양한 사용자가 plugin 배포 / 자동 업데이트 / 서명·검증 / 악성 차단 / enterprise lockdown / MCP·LSP 통합 — 각각이 marketplace 운영의 필수 layer
          </p>
          <p className="mt-2">
            결국 <strong>"plugin = 사용자 확장" vs "plugin = 마켓플레이스 entity"</strong> — claw 는 전자, 원본은 후자. 단순함과 ecosystem 깊이의 trade-off
          </p>
        </div>

      </div>
    </section>
  );
}

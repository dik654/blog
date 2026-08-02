import { ArrowRight, CircleAlert, FileCheck2, FolderSearch, Power, Rows3 } from 'lucide-react';

const stages = [
  {
    number: '01',
    title: '출처 모으기',
    detail: 'bundled 동기화 뒤 builtin, installed, configured external directory를 합친다.',
    failure: 'directory read나 bundled sync 자체가 실패하면 registry report도 만들지 못한다.',
    icon: FolderSearch,
  },
  {
    number: '02',
    title: 'manifest 읽기',
    detail: 'plugin.json 또는 .claude-plugin/plugin.json을 읽고 field, command path, schema를 검증한다.',
    failure: '잘못된 plugin은 PluginLoadFailure로 기록되며 valid plugin과 분리된다.',
    icon: FileCheck2,
  },
  {
    number: '03',
    title: 'registry 정렬',
    detail: 'PluginDefinition을 RegisteredPlugin으로 바꾸고 plugin id 기준 Vec 정렬을 적용한다.',
    failure: '동일 id의 external plugin은 먼저 발견된 definition 뒤에서 추가되지 않는다.',
    icon: Rows3,
  },
  {
    number: '04',
    title: '활성 상태 결정',
    detail: 'settings의 enabledPlugins가 우선하며, external 기본값은 false다.',
    failure: 'report에 load failure가 하나라도 남으면 strict plugin_registry()는 Err를 반환한다.',
    icon: Power,
  },
];

export default function PluginLoadPathViz() {
  return (
    <figure className="not-prose my-7 border-y border-border py-5" aria-label="플러그인 발견과 활성화 흐름">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-muted-foreground">LOAD PATH</p>
          <p className="mt-1 text-base font-bold">발견은 등록이 아니고, 등록은 실행 허가가 아니다</p>
        </div>
        <CircleAlert className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-300" aria-hidden="true" />
      </div>

      <ol className="grid gap-3 lg:grid-cols-4">
        {stages.map((stage, index) => {
          const Icon = stage.icon;
          return (
            <li key={stage.number} className="relative min-w-0 border-l-2 border-border pl-4 lg:border-l-0 lg:border-t-2 lg:pl-0 lg:pt-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold tabular-nums text-muted-foreground">{stage.number}</span>
                <Icon className="h-4 w-4 text-foreground" aria-hidden="true" />
                <strong className="text-sm">{stage.title}</strong>
                {index < stages.length - 1 && (
                  <ArrowRight className="ml-auto hidden h-4 w-4 text-muted-foreground lg:block" aria-hidden="true" />
                )}
              </div>
              <p className="mt-3 text-sm leading-relaxed text-foreground">{stage.detail}</p>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{stage.failure}</p>
            </li>
          );
        })}
      </ol>
    </figure>
  );
}

import { FileCog, PackageCheck, Plus, Route, ShieldCheck } from 'lucide-react';

const SOURCES = [
  {
    title: 'Settings',
    detail: 'merged settings.hooks',
    events: 'Pre · Post · Failure',
    icon: FileCog,
  },
  {
    title: 'Enabled plugins',
    detail: 'manifest hooks + path validation',
    events: 'Pre · Post · Failure',
    icon: PackageCheck,
  },
] as const;

export default function HookRegistrationViz() {
  return (
    <figure
      aria-label="Settings hook과 enabled plugin hook이 runtime config로 병합되는 경로"
      className="not-prose my-7 overflow-hidden rounded-md border border-border bg-background [&_code]:text-xs"
    >
      <figcaption className="border-b border-border px-4 py-3">
        <p className="text-sm font-semibold">Hook command는 두 source에서 하나의 ordered config로 모인다</p>
      </figcaption>

      <div className="grid gap-px bg-border lg:grid-cols-[minmax(0,1fr)_36px_minmax(0,1fr)_36px_minmax(0,1.15fr)]">
        <div className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-1">
          {SOURCES.map((source) => {
            const Icon = source.icon;
            return (
              <div key={source.title} className="min-w-0 bg-background p-4">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  <p className="text-sm font-semibold">{source.title}</p>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{source.detail}</p>
                <code className="mt-3 block text-xs">{source.events}</code>
              </div>
            );
          })}
        </div>

        <div className="hidden items-center justify-center bg-background lg:flex">
          <Plus className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
        </div>

        <div className="min-w-0 bg-background p-4">
          <div className="flex items-center gap-2">
            <Route className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <p className="text-sm font-semibold">RuntimeHookConfig::merged</p>
          </div>
          <ol className="mt-4 space-y-2 text-xs leading-relaxed">
            <li><strong>1.</strong> settings 순서 유지</li>
            <li><strong>2.</strong> plugin registry 순서로 append</li>
            <li><strong>3.</strong> 같은 command string은 중복 제외</li>
          </ol>
        </div>

        <div className="hidden items-center justify-center bg-background lg:flex">
          <Plus className="h-4 w-4 rotate-45 text-muted-foreground" aria-hidden="true" />
        </div>

        <div className="min-w-0 bg-background p-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-600" aria-hidden="true" />
            <p className="text-sm font-semibold">Conversation HookRunner</p>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
            matcher는 runtime object가 아니다. 각 command가 payload의 <code>tool_name</code>과{' '}
            <code>tool_input</code>을 보고 스스로 적용 여부를 정한다.
          </p>
        </div>
      </div>
    </figure>
  );
}

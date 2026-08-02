import IdeogramArchitecture from './ideogram-4-typography-layout/Architecture';
import IdeogramOverview from './ideogram-4-typography-layout/Overview';
import IdeogramProduction from './ideogram-4-typography-layout/Production';

export default function Ideogram4TypographyLayoutArticle() {
  return (
    <div className="space-y-16">
      <IdeogramOverview />
      <IdeogramArchitecture />
      <IdeogramProduction />
    </div>
  );
}

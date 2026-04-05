import Overview from './claw-config/Overview';
import Bootstrap from './claw-config/Bootstrap';
import OAuth from './claw-config/OAuth';
import Remote from './claw-config/Remote';

export default function ClawConfigArticle() {
  return (
    <>
      <Overview />
      <Bootstrap />
      <OAuth />
      <Remote />
    </>
  );
}

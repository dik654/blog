import Overview from './diffie-hellman/Overview';
import Protocol from './diffie-hellman/Protocol';
import Security from './diffie-hellman/Security';

export default function DiffieHellman() {
  return (
    <div className="space-y-12">
      <Overview />
      <Protocol />
      <Security />
    </div>
  );
}

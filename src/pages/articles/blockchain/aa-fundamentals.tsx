import Overview from './aa-fundamentals/Overview';
import ERC4337 from './aa-fundamentals/ERC4337';
import NativeAA from './aa-fundamentals/NativeAA';
import UseCases from './aa-fundamentals/UseCases';

export default function AAFundamentals() {
  return (
    <div className="space-y-12">
      <Overview />
      <ERC4337 />
      <NativeAA />
      <UseCases />
    </div>
  );
}

import Overview from './hardware-fundamentals/Overview';
import Cpu from './hardware-fundamentals/Cpu';
import Gpu from './hardware-fundamentals/Gpu';
import MemoryStorage from './hardware-fundamentals/MemoryStorage';
import Cooling from './hardware-fundamentals/Cooling';
import Vendors from './hardware-fundamentals/Vendors';

export default function HardwareFundamentals() {
  return (
    <>
      <Overview />
      <Cpu />
      <Gpu />
      <MemoryStorage />
      <Cooling />
      <Vendors />
    </>
  );
}

import Overview from './aml-str-reporting/Overview';
import SarProcess from './aml-str-reporting/SarProcess';
import TippingOff from './aml-str-reporting/TippingOff';
import RecordKeeping from './aml-str-reporting/RecordKeeping';

export default function AmlStrReporting() {
  return (
    <div className="space-y-12">
      <Overview />
      <SarProcess />
      <TippingOff />
      <RecordKeeping />
    </div>
  );
}

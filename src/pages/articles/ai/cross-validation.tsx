import Overview from './cross-validation/Overview';
import KFold from './cross-validation/KFold';
import GroupKFold from './cross-validation/GroupKFold';
import TimeSeriesSplit from './cross-validation/TimeSeriesSplit';
import CVLB from './cross-validation/CVLB';

export default function CrossValidationArticle() {
  return (
    <>
      <Overview />
      <KFold />
      <GroupKFold />
      <TimeSeriesSplit />
      <CVLB />
    </>
  );
}

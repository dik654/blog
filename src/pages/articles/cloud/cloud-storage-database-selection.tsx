import CloudCertificationArticle from "./CloudCertificationArticle";
import { storageDatabaseSelectionData } from "./systemsData";
import AccessUnitViz from "./cloud-storage-database-selection/viz/AccessUnitViz";
import RedundancyScopeViz from "./cloud-storage-database-selection/viz/RedundancyScopeViz";
import ReplicaBackupViz from "./cloud-storage-database-selection/viz/ReplicaBackupViz";
import StorageSplitViz from "./cloud-storage-database-selection/viz/StorageSplitViz";

export default function CloudStorageSelectionArticle() {
  return (
    <CloudCertificationArticle
      data={storageDatabaseSelectionData}
      sectionLead={{
        case: <StorageSplitViz />,
        picture: <AccessUnitViz />,
        need: <ReplicaBackupViz />,
        comparison: <RedundancyScopeViz />,
      }}
    />
  );
}

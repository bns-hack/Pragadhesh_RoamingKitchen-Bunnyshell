import React from "react";
import MapContainer from "../maps/Directionmap";

const Directions = () => {
  return (
    <div className="flex w-full h-full">
      <MapContainer
        storeLatitude={12.9716}
        storeLongitude={77.5946}
        customerLatitude={12.9344}
        customerLongitude={77.6102}
      />
    </div>
  );
};

export default Directions;

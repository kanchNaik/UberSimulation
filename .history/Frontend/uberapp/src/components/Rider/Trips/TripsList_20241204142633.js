{tripDropdown && (
  <div className="dropdown-menu scrollable-dropdown">
    <div onClick={() => handleTripSelect("All Trips")}>
      All Trips
    </div>
    <div onClick={() => handleTripSelect("Past 30 days")}>
      Past 30 days
    </div>
    <div onClick={() => handleTripSelect("December")}>
      December
    </div>
    <div onClick={() => handleTripSelect("November")}>
      November
    </div>
    <div onClick={() => handleTripSelect("October")}>
      October
    </div>
    <div onClick={() => handleTripSelect("September")}>
      September
    </div>
    <div onClick={() => handleTripSelect("August")}>
      August
    </div>
  </div>
)}

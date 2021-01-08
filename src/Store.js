import React, { useState } from "react";

export const SiteUsersContext = React.createContext([]);
export const DesignDatabaseArrayDataContext = React.createContext([]);

const Store = ({ children }) => {
  const [siteUsersData, setsiteUsersData] = useState([]);
  const [designDatabaseArrayData, setdesignDatabaseArrayData] = useState([]);
  //   const [verificationId, setverificationId] = useState()
  //   const [requirementId, setrequirementId] = useState()
  //   const [dvoItem, setdvoItem] = useState();

  return (
    <DesignDatabaseArrayDataContext.Provider value={[designDatabaseArrayData, setdesignDatabaseArrayData]}>
      <SiteUsersContext.Provider value={[siteUsersData, setsiteUsersData]}>{children}</SiteUsersContext.Provider>
    </DesignDatabaseArrayDataContext.Provider>
  );
};

export default Store;

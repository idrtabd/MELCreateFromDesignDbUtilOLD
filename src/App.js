import "./App.css";
import React, { useState, useEffect, useContext } from "react";
import DesignDatabaseGrid from "./DesignDatabaseGrid";
import { HashRouter as Router, Switch, Route, Link, Redirect, useHistory, useLocation } from "react-router-dom";
import { Form, GroupItem, Item, SimpleItem, TabbedItem, Tab, Label } from "devextreme-react/form";
import { loadDesignDatabase, loadMelInventory, createMelInventoryItemFromDesignDbItem } from "./MyUtils.js";
import { DesignDatabaseArrayDataContext } from "./Store";
import dxDataGrid from "devextreme/ui/data_grid";

// import { Switch } from "devextreme-react";

function App() {
  const [designDatabaseArrayDataContext, setdesignDatabaseArrayDataContext] = useContext(DesignDatabaseArrayDataContext);

  const reloadGridData = () => {
    const promiseDesignDb = loadDesignDatabase();
    const promiseMelInv = loadMelInventory();
    Promise.all([promiseDesignDb, promiseMelInv]).then((values) => {
      const [designDbData, melInvData] = values;
      //setLoadingStatus("");
      designDbData.forEach((dd) => {
        const foundMelItems = melInvData.filter((mInv) => mInv.MELDefinitionId === dd.Id);
        if (foundMelItems) {
          dd.MelItems = foundMelItems;
          const sumQ = foundMelItems
            .map((x) => x.Quantity)
            .reduce((accumulator, currentVal) => {
              return accumulator + currentVal;
            }, 0);
          dd.MelItemsSumQuantity = sumQ;
        } else {
          dd.MelItems = [];
        }
        dd.MelItemsCount = dd.MelItems.length;
        setdesignDatabaseArrayDataContext(designDbData);

        let gridElement = document.getElementById("myDesignDatabaseDataGrid");
        const gridInstance = dxDataGrid.getInstance(gridElement);
        gridInstance.refresh();
      });
    });
  };

  useEffect(() => {
    reloadGridData();
  }, []);

  return (
    <div className="gridPanel">
      <Router>
        <Switch>
          <Route path="/DesignDatabaseGrid">
            <DesignDatabaseGrid items={designDatabaseArrayDataContext} reloadGridData={reloadGridData} />
          </Route>
          <Route path="/">
            <Redirect to="/DesignDatabaseGrid" />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;

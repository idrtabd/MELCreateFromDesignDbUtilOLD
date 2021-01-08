import "./App.css";
import React, { useState, useEffect, useContext } from "react";
import "devextreme/dist/css/dx.common.css";
import "devextreme/dist/css/dx.light.css";
//import DataSource from 'devextreme/data/data_source'
import DxDataGrid from "devextreme/ui/data_grid";
import { Button } from "devextreme-react/button";
import DataGrid, {
  ColumnChooser,
  GroupPanel,
  Paging,
  SearchPanel,
  Scrolling,
  LoadPanel,
  Column,
  Format,
  FilterRow,
  Export,
  HeaderFilter,
  FilterPanel,
  FilterBuilderPopup,
  Selection
} from "devextreme-react/data-grid";
import { Link, Redirect, useHistory, useLocation } from "react-router-dom";
import "devextreme/dist/css/dx.common.css";
import "devextreme/dist/css/dx.light.css";
import { Form } from "devextreme-react";
import dxDataGrid from "devextreme/ui/data_grid";
import notify from "devextreme/ui/notify";
import { createMelInventoryItemFromDesignDbItem, getRequestDigestVal } from "./MyUtils.js";

// import { SiteUsersContext, VerificationsArrayDataContext, VerificationIdDataContext } from "./Store";

function DesignDatabaseGrid(props) {
  let history = useHistory();
  const [totalCount, setTotalCount] = useState(0);

  const onRowClick = (e) => {};

  const filterBuilderPopupPosition = {
    of: window,
    at: "top",
    my: "top",
    offset: { y: 10 }
  };

  // const onSelectionChanged = (e) => {
  //   const dataItemSelected = e.row.data;
  //   setcontextVerificationId(dataItemSelected.Id);
  //   history.push("./VerifPage/" + dataItemSelected.Id);
  //   //props.itemSelected(e.row.data);
  //   // let temp = [...recentlyViewed]
  //   // temp.push(e.row.data)
  // };

  useEffect(() => {
    setTotalCount(props.items && props.items.length);
  }, [props.verifications]);

  useEffect(() => {}, []);

  const cloneSelected = (e) => {
    let gridElement = document.getElementById("myDesignDatabaseDataGrid");
    const gridInstance = dxDataGrid.getInstance(gridElement);
    const selectedRowsData = gridInstance.getSelectedRowsData();
    if (1 > selectedRowsData) {
      return;
    }
    getRequestDigestVal().then((digestVal) => {
      let promisesArray = [];

      selectedRowsData.forEach((ddItem) => {
        const promiseItem = createMelInventoryItemFromDesignDbItem(ddItem, digestVal);
        promisesArray.push(promiseItem);
        Promise.all(promisesArray).then((values) => {
          if (values.includes("error")) {
            notify("Error", "error", 1000);
            return;
          }
          const resultValues = values.map((x) => x.Title).join(",");
          notify("Updated " + values.length + " items :" + resultValues, "success", 5000);
          setTimeout(() => {
            props.reloadGridData();
          }, 3000);
        });
      });

      //   .then((createdMelInvItem) => {
      //     if (createdMelInvItem == null || createdMelInvItem === "error") {
      //       notify("Error", "error", 1000);
      //     } else {
      //       notify(createdMelInvItem.Title, "success", 100);
      //     }
      //   });
      // });
    });
  };

  return (
    <div className="gridPanel">
      <div>testse</div>
      <div>Items Count: {props.items && props.items.length}</div>
      <Button
        className="commandButton"
        text="Clone Selected items to MEL"
        type="default"
        stylingMode="contained"
        onClick={cloneSelected}
      />
      {/* <Button
        className="commandButton"
        text="Force Reorder Part Line Numbers"
        type="default"
        stylingMode="contained"
        // onClick={}
      /> */}
      {/* <button onClick={refreshVerifications} >Load Verifications</button> */}
      <DataGrid
        //dataSource="/mockdata/Verifs_UTF8.json"
        id="myDesignDatabaseDataGrid"
        dataSource={props.items}
        allowColumnResizing={true}
        columnResizingMode={"widget"}
        columnMinWidth={50}
        columnAutoWidth={false}
        allowColumnReordering={true}
        rowAlternationEnabled={true}
        showBorders={true}
        repaintChangesOnly={true}
        height={750}
        onRowClick={onRowClick}
        hoverStateEnabled={true}

        //filterBuilder={filterBuilder}
      >
        <ColumnChooser enabled={true} />
        <LoadPanel visible={true}></LoadPanel>
        <Paging enabled={false}></Paging>
        <Scrolling mode="virtual" />
        <GroupPanel visible={true} />
        <SearchPanel visible={true} />
        <Selection mode="multiple" allowSelectAll={false} deferred={false} />

        <FilterRow visible={true} />
        <FilterPanel visible={true} />
        <FilterBuilderPopup position={filterBuilderPopupPosition} />
        <HeaderFilter visible={true} />

        <Column dataField="MelItemsCount" caption="Existing Mel Items Count" />
        <Column dataField="MelItemsSumQuantity" caption="Existing Mel Sum Quantity" />
        <Column dataField="Title" caption="Part Name" />
        <Column dataField="Part_x0020_Number" />

        <Column dataField="IsBulkPart" visible={true} />
        <Column dataField="System_" visible={true} />
        <Column dataField="SubSystem_" visible={true} />
        <Column dataField="Quantity" visible={true} />
        <Column dataField="ID" visible={false} />
      </DataGrid>
    </div>
  );
}
export default DesignDatabaseGrid;

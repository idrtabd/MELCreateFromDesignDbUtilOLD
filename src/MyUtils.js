const REACT_APP_RESTURL_DDITEMS =
  "https://ea-ntlm.sp.jsc.nasa.gov/projects/Viper/ETPS/_api/Web/Lists(guid'51970b1d-ef9e-483c-abb6-add9b4f2a6fb')/Items?%24top=5000";
const REACT_APP_RESTURL_MELINVENTORYITEMS =
  "https://ea-ntlm.sp.jsc.nasa.gov/projects/Viper/ETPS/_api/Web/Lists(guid%270b3ed6b2-0620-4f48-8a3a-1f7427dc3219%27)/Items?%24top=5000";
const REACT_APP_RESTURL_MELINVENTORYLIST =
  "https://ea-ntlm.sp.jsc.nasa.gov/projects/Viper/ETPS/_api/Web/Lists(guid%270b3ed6b2-0620-4f48-8a3a-1f7427dc3219%27)";
const REACT_APP_RESTURL_SPWEBURL = "https://ea-ntlm.sp.jsc.nasa.gov/projects/Viper/ETPS";

export const getUrlHashKey = () => {
  var myH = window.location.hash;
  var idx1 = myH.lastIndexOf("/");
  return myH.substring(idx1 + 1);
};
export const getQueryStringParameterByName = (name, url) => {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
};

export const getRequestDigestVal = () => {
  return new Promise((resolve, reject) => {
    fetch(REACT_APP_RESTURL_SPWEBURL + "/_api/contextinfo", {
      method: "POST",
      headers: {
        accept: "application/json;odata=verbose"
      }
    })
      .then((res) => res.json())
      .then((data) => {
        const formDigestValue = data.d.GetContextWebInformation.FormDigestValue;
        console.log("formDigestValue: " + formDigestValue);
        resolve(formDigestValue);
      });
  });
};

const MELBulkPartContentType = "0x0100B815032E6504294D9A0F145825D0E54F00F64B391553956A498578B1E550399CEC";
const MELComponentContentType = "0x01006CE194C39BBADB41AA6E3326213D115E00B765A31590DA244E8419739969B67CA7";
const buildCreateRestCallMELInventoryListItem = (ddItem) => {
  let sendItem = { __metadata: { type: "SP.Data.MELInventoryListItem" } };
  sendItem.Title = ddItem.Title;
  sendItem.MELDefinitionId = ddItem.ID;
  sendItem.PartNumber = ddItem.Part_x0020_Number ? ddItem.Part_x0020_Number : "";
  sendItem.Quantity = ddItem.IsBulkPart ? ddItem.Quantity : 1;
  sendItem.ContentTypeId = ddItem.IsBulkPart ? MELBulkPartContentType : MELComponentContentType;
  const requestdata = JSON.stringify(sendItem);
  return requestdata;
};

const CreateSPItemRestCall = (reqUrl, restBody, requestDigestVal) => {
  return new Promise((resolve, reject) => {
    debugger;
    fetch(reqUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json;odata=verbose",
        Accept: "application/json;odata=verbose",
        "X-RequestDigest": requestDigestVal
      },
      body: restBody
    })
      .then((res) => res.json())
      .then((data) => {
        resolve(data.d);
      })
      .catch((err) => {
        resolve("error");
        console.error(err);
      });
  });
};

export const createMelInventoryItemFromDesignDbItem = (ddItem, digest) => {
  const restBody = buildCreateRestCallMELInventoryListItem(ddItem);
  const reqUrl = REACT_APP_RESTURL_MELINVENTORYLIST + "/Items";
  return CreateSPItemRestCall(reqUrl, restBody, digest);
};

export const loadDesignDatabase = () => {
  return loadSpRestCall(REACT_APP_RESTURL_DDITEMS);
};
export const loadMelInventory = () => {
  return loadSpRestCall(REACT_APP_RESTURL_MELINVENTORYITEMS);
};

const loadSpRestCall = (requestUrl) => {
  return new Promise((resolve, reject) => {
    fetch(requestUrl, {
      method: "GET",
      headers: {
        accept: "application/json;odata=verbose"
      }
    })
      .then((response) => response.json())
      .then((data) => {
        resolve(data.d.results);
      });
  });
};

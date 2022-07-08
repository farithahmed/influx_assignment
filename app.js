const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());

let itemMaster = [];

app.post("/items", (req, res) => {
  let items = req.body;
  let checkItemsAlreadyAvail = itemMaster.find((x) => x.code === items.code);
  if (checkItemsAlreadyAvail) {
    return res.status(400).json({ message: "Item Already Available" });
  }
  itemMaster.push(items);
  res.status(200).json(itemMaster);
});
let usercart = [];

app.post("/order/:orderid", (req, res) => {
  let order = req.body;
  let getItems = itemMaster.find((x) => x.code === order.code);
  if (!getItems) {
    return res.status(400).json({ message: "Item not available" });
  }

  let resp = {
    code: order.code,
    qty: order.qty,
    unitPrice: getItems.price,
    totalAmt: order.qty * getItems.price,
  };

  usercart.push(resp);

  return res.status(200).json(usercart);
});

app.get("/order/:orderid/summarize", (req, res) => {
  let getUserCartDetails = [...usercart];
  let result = [];
  getUserCartDetails.forEach((b) => {
    let findIndexOf = result.findIndex((x) => x.code === b.code);
    if (findIndexOf == -1) {
      result.push(b);
    } else {
      if (result[findIndexOf].code === b.code) {
        result[findIndexOf].qty += b.qty;
        result[findIndexOf].totalAmt += b.totalAmt;
      }
    }
  });
  res.status(200).json(result);
});

app.listen(3000);

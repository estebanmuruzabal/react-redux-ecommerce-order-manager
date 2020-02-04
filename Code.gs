function onOpen(e) {
  SpreadsheetApp.getUi()
    .createMenu("Order Manager")
    .addItem("Mark as Shipped", "markAsShipped")
    .addSeparator()
    .addItem("Update Orders", "getOrders")
    .addItem("Sync Inventory", "getInventory")
    .addToUi();
}

function getOrders() {
  var url = config().baseUrl + "orders/status";

  var options = {
    method: "get",
    headers: config().headers
  };

  var orders = JSON.parse(UrlFetchApp.fetch(url, options));
  var ss = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("ORDERS");
  var startingRow = config().startingRow;
  
  for (var i = 0; i < orders.length; i++) {
    var row = startingRow + i;
    var conf = orders[i].confirmation;
    var name = orders[i].customer
      ? orders[i].customer.firstName + " " + orders[i].customer.lastName
      : "";
    var address =
      orders[i].address.addressLine1 +
      "\n" +
      orders[i].address.addressLine2 +
      "\n" +
      orders[i].address.city +
      " " +
      orders[i].address.state +
      ", " +
      orders[i].address.zip;
    
    var subtotal = orders[i].total.subtotal / 100;
    var tax = orders[i].total.tax / 100;
    var shipping = orders[i].total.shippingCost / 100;
    var total = orders[i].total.total / 100;
    var orderedTime = orders[i].time;
    var deliveryDate = orders[i].shipping.timeframe.dates.max;
    var shippingType = orders[i].shipping.courier;
    var orderStatus = orders[i].orderStatus;
    var email = orders[i].customer.email;

    ss.getRange(row, 1).setValue(conf);
    ss.getRange(row, 2).setValue(name);
    ss.getRange(row, 3).setValue(address);
    ss.getRange(row, 4).setValue(subtotal);
    ss.getRange(row, 5).setValue(tax);
    ss.getRange(row, 6).setValue(shipping);
    ss.getRange(row, 7).setValue(total);
    // 8 is net income 
    ss.getRange(row, 9).setValue(orderedTime);
    ss.getRange(row, 10).setValue(deliveryDate);
    ss.getRange(row, 11).setValue(shippingType);
    ss.getRange(row, 12).setValue(orderStatus);
    ss.getRange(row, 13).setValue(email);

    writeOrderCartData(row, orders[i].cart);
  }
}

function writeOrderCartData(row, cart) {
  var ss = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var inventoryCol = config().inventoryCol;
  var productIds = ss.getRange(2, inventoryCol, 1, 100).getValues()[0];

  for (var i = 0; i < cart.length; i++) {
    var productColIndex = productIds.indexOf(cart[i]._id);
    var col = productColIndex + inventoryCol;
    ss.getRange(row, col).setValue(cart[i].qty);
  }
}

function markAsShipped() {
  var ss = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("ORDERS");
  var row = ss.getActiveCell().getRow();
  var conf = ss.getRange(row, 1).getValue();
  var customer = ss.getRange(row, 2).getValue();
  var ui = SpreadsheetApp.getUi();

  var confirm = ui.alert(
    "#" + conf + " - Status Change",
    "Mark order #" + conf + " for " + customer + " as shipped?",
    ui.ButtonSet.YES_NO
  );
  if (confirm === ui.Button.YES) {
    var url = config().baseUrl + "orders/status/" + conf;
    var options = {
      method: "post",
      headers: config().headers,
      "Conent-Type": "application/json",
      payload: {
        status: "SHIPPED"
      }
    };

    UrlFetchApp.fetch(url, options);
    getOrders();
    ui.alert(
      "#" + conf + " - Status Change",
      conf + " marked as Shipped",
      ui.ButtonSet.OK
    );
  }
}

function getInventory() {
  var ss = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("ORDERS");
  var url = config().baseUrl + "inventory";

  var inventory = UrlFetchApp.fetch(url);
  var items = JSON.parse(inventory);

  var startingCol = config().inventoryCol;
  for (i = 0; i < items.length; i++) {
    var col = startingCol + i;
    ss.getRange(2, col).setValue(items[i]._id);
    ss.getRange(5, col).setValue(items[i].name);
  }
}


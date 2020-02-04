function config() {
  
  var props = getProps();
  
  var settings = {
    dev: {
      baseUrl: props['DEV_BASE_URL'],
      inventoryCol: 14,
      startingRow: 6,
      headers: {
        Authorization: props['ADMIN_KEY']
      }
  },
    prod: {
       baseUrl: props['PROD_BASE_URL'],
       inventoryCol: 14,
       startingRow: 6,
       headers: {
        Authorization: props['ADMIN_KEY']
      }
    }
  }
  
  return settings[props.env];
}

function getProps() {
  return PropertiesService.getScriptProperties().getProperties();
}


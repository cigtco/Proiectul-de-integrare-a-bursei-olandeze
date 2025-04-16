function doPost(e) {
  var responseText;
  
  try{
    if(typeof e.parameter.requestType !== 'undefined' && e.parameter.requestType == requestTypes.order)
      if(typeof e.postData.contents !== 'undefined'){
        var Order = JSON.parse(e.postData.contents).order;
        processData(Order,requestTypes.order);
      }
    
   /* if(typeof e.parameter.requestType !== 'undefined' && e.parameter.requestType == requestTypes.save)
      if(typeof e.postData.contents !== 'undefined'){
        var variantUpdates = JSON.parse(e.postData.contents).variantUpdates;
        var Order = JSON.parse(e.postData.contents).order;
        var variants = [];
        variants.push(variantUpdates[0].variant);
        processData(variants,Order.shop.title,requestTypes.save);
      }*/
    responseText = "Data was saved successfully."
  }
  catch(error){
    responseText = "There was an error:" + error;
  }
  return ContentService.createTextOutput(responseText).setMimeType(ContentService.MimeType.TEXT);
  //return ContentService.createTextOutput(JSON.stringify(e)).setMimeType(ContentService.MimeType.TEXT);
  
}

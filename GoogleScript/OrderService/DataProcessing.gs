function processData(Order,requestType){
  var products = [];
  var currentSheet;
  
  for(i=0;i<Order.variants.length;i++){
    products.push(getRowFromVariant(Order.variants[i],Order));
  }
  
  currentSheet = getWorkingSheetFromCallerId(Order.shop.title);
  
  if(currentSheet == null)
    throw "Current sheet is null."
  
  switch(requestType){
    case requestTypes.save:
      saveData(products,currentSheet);
      break;
    case requestTypes.update:
      updateData(products,currentSheet);
      break;
    case requestTypes.del:
      deleteData(products,currentSheet);
      break;
    case requestTypes.order:
      bulkSave(products,currentSheet);
  }
}

function getRowFromVariant(variant,Order){
  var myRow = [];
  
  myRow[0] = (typeof variant.units[0].unitsInOrder !== 'undefined') ? variant.units[0].unitsInOrder : 0;//Q
  myRow[1] = variant.units[0].itemsPerUnit;//QPU
  myRow[2] = (typeof variant.units[0].prices[0].price !== 'undefined') ? variant.units[0].prices[0].price: 0;//Price
  myRow[3] = variant.title;//Name
  myRow[4] = getColor(variant);//Colour
  myRow[5] = getSize(variant,"s1");//S1
  myRow[6] = getSize(variant,"s2");//S2
  myRow[7] = getSize(variant,"s3");//S3
  myRow[8] = getSize(variant,"s4");//S4
  myRow[9] = (typeof variant.country !== 'undefined') ? variant.country.code : "";//Cnt
  myRow[10] = myRow[0]*myRow[1];//Total Quantity
  myRow[11] = myRow[10]*myRow[2];//Total Value  
  myRow[12] = Order.shop.title;//Source ex. GABOR-R
  myRow[13] = (typeof variant.analytics !== 'undefined') ? variant.analytics.articleId: "";
  myRow[14] = (typeof variant.analytics !== 'undefined') ? variant.analytics.availabilityId : "";
  myRow[15] = (typeof variant.analytics !== 'undefined') ? variant.analytics.lineItemId : "";
  myRow[16] = Order.departureDate.date;//timestamp
  myRow[17] = getVariant(variant);//variant
  myRow[18] = getImageURL(variant,"1");//Image1
  myRow[19] = getImageURL(variant,"2");//Image2
  myRow[20] = getGrower(variant);//Grower
  myRow[21] = getCategory(variant);//Category
        
  return myRow;
}


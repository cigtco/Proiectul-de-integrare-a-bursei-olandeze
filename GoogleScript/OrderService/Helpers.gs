function getWorkingSheetFromCallerId(CallerId){
  
  if(flowerShops.indexOf(CallerId) > -1)
    return SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CallerId);
  
  if(plantShops.indexOf(CallerId) > -1)
    return SpreadsheetApp.openById("1dH_SllGIuDBokECBEFNt6Q8VbesRlOv3Lfy7hzE8_sg").getSheetByName(CallerId);
  
  throw "No sheet with name:--" + callerId + "-- was found.";
}

/*Writes data to log*/
function writeLog(text,data,logLevelLimit){
  var logText = eval("logLevel" + logLevelLimit + "Text") + text + data;
  
  if(logLevelLimit <= logLevel)
    Logger.log(logText)
    
};


/*
Returns the row index where data.Q = row.Q, data.Price = row.Price, data.Name = row.Name are equal to the
*/
function getRowIndexByValue(range,valueToFind,currentSheet) {
  
  values = currentSheet.getRange(range).getValues();
  
  for(var i=0;i<values.length;i++){
    if(values[i][0] == valueToFind)
      return i+1;
  }
  
  return -1;
    
}

function getColor(variant){
  var color = "";
  if(typeof variant.colors !== 'undefined'){
    for(var i=0;i<variant.colors.length;i++){
      color = color + variant.colors[i].title + "/";
    }
  }
  return color.replace(/.$/,"");
}

/*rpl: boolean
true: replace special characters
false: do not replace*/
function getSize(variant,size,rpl){
  var result = "";
  if(typeof variant[size] !== 'undefined')
    if(typeof variant[variant[size].id] !== 'object')
      result = variant[variant[size].id];
    else{
      if(typeof variant[variant[size].id].title !== 'undefined')
        result = variant[variant[size].id].title;
      if(typeof variant[variant[size].id].code !== 'undefined')
        result = variant[variant[size].id].code;
      }
  try{
    if(rpl) 
      result = result.toString().replace(/[^a-zA-Z0-9]/g,'');
  }
  catch(e){
    result = "";
  }
  return result;
}

function getVariant(variant){
 var variantText = variant.title + "(" + getColor(variant);
 var s1 = getSize(variant,"s1",false);
 var s2 = getSize(variant,"s2",true);
 var s3 = getSize(variant,"s3",true);
 var s4 = getSize(variant,"s4",true);
  
  if(s1 != "")
    variantText = variantText + " " + s1;
  
  if(s2 != "")
    variantText = variantText + " " + s2;
  
  if(s3 != "")
    variantText = variantText + " " + s3;
  
  if(s4 != "")
    variantText = variantText + " " + s4;
  
 return variantText + ")";
}

//old version
/*function getImageURL(variant,imageNumber){
  var url = "";
  if(typeof variant.images !== 'undefined')
    if(typeof variant.images[imageNumber-1] !== 'undefined')
      url = variant.images[imageNumber-1].url;

  return url;
}*/

function getImageURL(variant,imageNumber){
  var url = "";
  if(typeof variant.images !== 'undefined')
    if(typeof variant.images[imageNumber-1] !== 'undefined')
      url = imageURL + variant.images[imageNumber-1].id + "-" + variant.images[imageNumber-1].maxSize + ".jpg";

  return url;
}

function getGrower(variant){
  var grower = "";

  try{
    grower = variant.grower.title;
  }
  catch(e)
  {
    grower = "";
  }

  return grower;
}

function getCategory(variant){
  var category = "";
  try{
    for(item of variant.categories){
      if(item.isMainCategory)
        (category == "") ? category = item.title : category = item.title + "/" + category;
      else
        (category == "") ? category = item.title : category = category + "/" + item.title;
    }
  }
  catch(e){
    return category;
  }

  return category;
}
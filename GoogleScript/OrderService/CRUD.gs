function saveData(rows,currentSheet){
  var lock = LockService.getScriptLock();
  
  try{
    lock.tryLock(600000);
    for(i=0;i<rows.length;i++){
      var row = rows[i];
      var rowIndex = getRowIndexByValue("Q:Q",row[16],currentSheet);
      if(rowIndex < 0)
        currentSheet.appendRow(row);
      else{
        currentSheet.getRange("A" + rowIndex + ":U" + rowIndex).setValues([row]);
      }
    }
    lock.releaseLock();
  }catch(e){
     Logger.log('Could not obtain lock after 10 seconds. Retry in 2 seconds.');
     Utilities.sleep(2000);
     saveData(rows,currentSheet)
  }

}

function updateData(products,currentSheet){ 
}

function deleteData(products,currentSheet){
}

function validateData(data){
 
  if(data.Qantity == "null" || data.Quantity == "" || data.Quantity == NaN || data.Quantity <= 0)
    return false;
  
  return true;
}

function bulkSave(products,currentSheet){
  var rowCount = products.length + 1;

  currentSheet.getRange("A2:V").clear();
  currentSheet.getRange("A2:V" + rowCount).setValues(products);

}

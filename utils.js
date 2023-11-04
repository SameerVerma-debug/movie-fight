const debounce = (callback,delay = 500) => {
  let timeoutId; //idk...
  
  return (...args) => {
    //clear previous timeout(if exists) when user enters some more text
    if(timeoutId){
      clearTimeout(timeoutId);
    }
    //timeout to show search results when user enters a letter
    timeoutId = setTimeout(() => {
      //pass the multiple arguments as seperate parameters to callback
      callback.apply(null,args);
    },delay)
  }
}
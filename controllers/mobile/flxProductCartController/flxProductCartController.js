define(function(){
  executeOnParent("btnRemoveProduct");
  return({
    removeProduct:function()
    {
      alert("selected button---"+JSON.stringify(this.view.segProduct.selectedRowItems));
    }
  });
 });
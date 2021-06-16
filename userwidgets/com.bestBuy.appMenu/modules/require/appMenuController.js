define(function() {
	
	return {
		onMapping : function(){
          this.view.segAppMenu.onRowClick = onRowClickCallback;
        },
      	onRowClickCallback : function(eventObject)
      	{
          alert(eventObject);
        }
	};
});
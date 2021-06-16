define(function(){ 

  return({
	onNavigate : function(){
      this.view.flxMap.isVisible = false;
      this.view.btnSearch.onClick = this.searchStores;
      
      this.view.navbar.flxMenuButton.onTouchEnd = this.openAppMenu;
      this.view.flxMenuOverlay.onTouchEnd = this.closeAppMenu;
      this.view.flxContainerAppMenu.appMenu.segAppMenu.onRowClick = this.onClickAppMenu;
    },
    searchStores : function(){
      let search = this.view.tbSearchStore.text;

      let serviceName = "BestBuyADP";
      let integrationObj = KNYMobileFabric.getIntegrationService(serviceName);
      
      let operationName =  "findStores";
      let data= {"city": search,"apiKey": apiKey};
      let headers= {};
      integrationObj.invokeOperation(operationName, headers, data, this.operationSuccess, this.operationFailure);

    },
    operationSuccess : function(res){
      let locationData = [];
      
      if(res.stores.length > 0) {
        this.view.mapStores.widgetDataMapForCallout = {'lblTitleCity': 'lblTitleCity','lblAddress':'lblAddress','lblHours':'lblHours'};
        res.stores.map((store) => {
          if(store.lat.length > 0 && store.lng.length > 0){
            locationData.push({
              lat: store.lat,
              lon: store.lng,
              name: store.name,
              desc: store.address,
              image: "pinb.png",
              calloutData: {'lblTitleCity':store.name,'lblAddress':store.address,'lblHours':store.hours},
              showCallout: true,
              template: "flxMapPopup"
            });
          }
        });

        this.view.mapStores.locationData  = locationData;
        this.view.flxMap.isVisible = true;
        this.view.tbSearchStore.text = '';
      } else {
        alert('There are not stores in this city');
      }
      
      
    },
    operationFailure : function(res){
      alert(res);
    },
    openAppMenu : function(){
      this.view.flxContainerAppMenu.animate(animDefinition("-80%","0%"), animationConfig());
      this.view.flxStoresContainer.animate(animDefinition("0%","80%"), animationConfig());
      this.view.flxMenuOverlay.isVisible = true;
    },
    closeAppMenu : function(){
      this.view.flxContainerAppMenu.animate(animDefinition("0%","-80%"), animationConfig());
      this.view.flxStoresContainer.animate(animDefinition("80%","0%"), animationConfig());
      this.view.flxMenuOverlay.isVisible = false;
    },
    onClickAppMenu : function(seguiWidget, sectionNumber, rowNumber, selectedState){
      categories = [];
      onRowClickMenuApp(rowNumber);
      this.view.flxStoresContainer.left = "0%";
      this.view.flxContainerAppMenu.left = "-80%";
      this.view.flxMenuOverlay.isVisible = false;
    }
    
  });

});
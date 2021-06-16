define(function(){ 
  return({
    onNavigate : function(context){
      let images = JSON.parse(context);
      let data = [];
      images.map(image => {
        data.push({
          imgProduct: image.href
        });
      });

      this.view.segProductImages.setData(data);
      this.view.navbar.flxBackButton.onTouchEnd = this.backButton;
      this.view.navbar.flxMenuButton.onTouchEnd = this.openAppMenu;
      this.view.flxMenuOverlay.onTouchEnd = this.closeAppMenu;
      this.view.flxContainerAppMenu.appMenu.segAppMenu.onRowClick = this.onClickAppMenu;
    },
    backButton : function() {
      let previousFormID = kony.application.getPreviousForm().id;
      let navBack = new kony.mvc.Navigation(previousFormID);
      
      navBack.navigate(null);
    },
    openAppMenu : function(){
      this.view.flxContainerAppMenu.animate(animDefinition("-80%","0%"), animationConfig());
      this.view.flxContainerProductImages.animate(animDefinition("0%","80%"), animationConfig());
      this.view.flxMenuOverlay.isVisible = true;
    },
    closeAppMenu : function(){
      this.view.flxContainerAppMenu.animate(animDefinition("0%","-80%"), animationConfig());
      this.view.flxContainerProductImages.animate(animDefinition("80%","0%"), animationConfig());
      this.view.flxMenuOverlay.isVisible = false;
    },
    onClickAppMenu : function(seguiWidget, sectionNumber, rowNumber, selectedState){
      categories = [];
      onRowClickMenuApp(rowNumber);
      this.view.flxContainerProductImages.left = "0%";
      this.view.flxContainerAppMenu.left = "-80%";
      this.view.flxMenuOverlay.isVisible = false;
    }
  });
});
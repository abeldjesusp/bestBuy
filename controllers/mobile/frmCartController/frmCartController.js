define(function(){ 

  return({
    onNavigate : function(){
      if(cartItems.length > 0){
        let data = [];
        let totalPrice = 0;
        let isNewProduct = 'false';
        
        cartItems.map((item) => {
          totalPrice += Number(item.price);
          isNewProduct = item.productNew;
          
          data.push({
            lblProductName: item.productName, 
            lblPrice: item.productPrice,
            template: 'flxProductCart',
            btnRemoveProduct: {
              onClick: this.removeProduct
            }
          });
        });
        
        this.view.lblTotalPrice.text = totalPrice.toFixed(2);
        
        if(isNewProduct === 'true'){
             this.view.lblNewProduct.text = 'You have items that are New. Shipping may be delayed.';
        } else {
             this.view.lblNewProduct.text = 'Normal Shipping Schedule.';
        }
        
        this.setSegment(data);
        
        this.view.flxSegProducts.isVisible = true;
        this.view.flxEmptyCart.isVisible = false;
        this.view.flxContainerNewProduct.isVisible = true;
        this.view.flxContainerTotal.isVisible = true;
      } else {
        this.view.flxSegProducts.isVisible = false;
        this.view.flxContainerNewProduct.isVisible = false;
        this.view.flxContainerTotal.isVisible = false;
        this.view.flxEmptyCart.isVisible = true;
      }
      
      // IDLE Timeout
      this.setIdleTimeout();
      
      this.view.navbar.flxMenuButton.onTouchEnd = this.openAppMenu;
      this.view.flxMenuOverlay.onTouchEnd = this.closeAppMenu;
      this.view.flxContainerAppMenu.appMenu.segAppMenu.onRowClick = this.onClickAppMenu;
    },
    setSegment : function(data){
      this.view.segProduct.setData(data);
    },
    openAppMenu : function(){
      this.view.flxContainerAppMenu.animate(animDefinition("-80%","0%"), animationConfig());
      this.view.flxContainerCart.animate(animDefinition("0%","80%"), animationConfig());
      this.view.flxMenuOverlay.isVisible = true;
    },
    closeAppMenu : function(){
      this.view.flxContainerAppMenu.animate(animDefinition("0%","-80%"), animationConfig());
      this.view.flxContainerCart.animate(animDefinition("80%","0%"), animationConfig());
      this.view.flxMenuOverlay.isVisible = false;
    },
    removeProduct : function(eventobject,context){
      var transformObject1 = kony.ui.makeAffineTransform();
      var transformObject2 = kony.ui.makeAffineTransform();
      transformObject1.translate(0, 0);
      transformObject2.translate(100, 0);
      var animDefinitionOne = {
        0: {
          "transform": transformObject1
        },
        100: {
          "transform": transformObject2
        }
      };
      var animDefinition = kony.ui.createAnimation(animDefinitionOne);
      var animConfig = {
        "duration": 0.5,
        "iterationCount": 1,
        "delay": 0,
        "fillMode": kony.anim.NONE
      };
      var animationObject = {
        definition: animDefinition,
        config: animConfig
      };
      
      var product = this.view.segProduct.data[context.rowIndex];
      this.view.segProduct.removeAt(context.rowIndex, context.sectionIndex, animationObject);
      
      let monto = Number(product.lblPrice.text.replace('$ ',''));
      let total = Number(this.view.lblTotalPrice.text) - monto;
      
      this.view.flxTotal.animate(totalAnimation(), animConfig);
      this.view.lblTotalPrice.text = total.toFixed(2);
      
      cartItems.splice(context.rowIndex, 1);
      
      if(cartItems.length < 1){
        this.view.flxSegProducts.isVisible = false;
        this.view.flxContainerNewProduct.isVisible = false;
        this.view.flxContainerTotal.isVisible = false;
        this.view.flxEmptyCart.isVisible = true;
      } 
    },
    setIdleTimeout(){
      kony.application.registerForIdleTimeout(2, () => {
        categories = [];
        var navHome = new kony.mvc.Navigation('frmHome');
        navHome.navigate(null);
      });
    },
    onClickAppMenu : function(seguiWidget, sectionNumber, rowNumber, selectedState){
      onRowClickMenuApp(rowNumber);
      this.view.flxContainerCart.left = "0%";
      this.view.flxContainerAppMenu.left = "-80%";
      this.view.flxMenuOverlay.isVisible = false;
      categories = [];
    }
  });

});
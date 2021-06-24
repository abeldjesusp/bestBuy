define(function(){ 
  var product = null;
  
  return({
	onNavigate : function(context){
      this.view.flxDownArrow.bottom = '85%';
      this.view.flxDownArrow.isVisible = false;

      this.view.flxUpArrow.bottom = '5%';
      this.view.flxUpArrow.isVisible = true;

      this.view.segReviews.bottom = '-90%';
      
      if(context){
        product = context;
        let productPrice = null;
        let lblTextTotalReview = kony.i18n.getLocalizedString("lblTextTotalReview");
        
        this.view.loading.isVisible = true;
        this.view.flxProductDatailContent.isVisible = false;
        this.view.flxProductDetailReviews.isVisible = false;
        this.view.flxNoReviews.isVisible = false;
        this.view.flxContainerReviews.isVisible = false;
        this.view.navbar.flxBackButton.onTouchEnd = this.navigateToPreviousForm;
        
        this.view.lblProductTitle.text = context.lblProductName;
        this.view.lblProductPrice.text = context.productOnSale === 'true' ? 'On Sale! '+context.lblProductPrice.text: context.lblProductPrice.text;
        this.view.lblProductPrice.skin = context.lblProductPrice.skin;
        this.view.lblProductAvg.text = context.productAvgRating !== '' ? 'Avg review: '+context.productAvgRating : '';
        this.view.lblProductDescripcion.text = context.productLongDescription;
        this.view.imgProduct.src = context.imgProduct;     
        this.view.imgStarRating.src = this.setImageStarRating(context.productAvgRating);
        this.view.lblProductImages.text = context.productImages;
        
        this.view.lblMore.onTouchEnd = this.showMorePictures;
        this.view.navbar.flxMenuButton.onTouchEnd = this.openAppMenu;
        this.view.flxMenuOverlay.onTouchEnd = this.closeAppMenu;
        this.view.flxContainerAppMenu.appMenu.segAppMenu.onRowClick = this.onClickAppMenu;
        this.view.btnAddToCart.onClick = this.addToCart;
        
        if(context.productCustomerReviewCount.length > 0) {
          this.view.lblTextTotalReview.text = lblTextTotalReview+" "+context.productCustomerReviewCount;
          this.view.flxUpArrow.onTouchEnd = this.panelUp;
          this.view.flxDownArrow.onTouchEnd = this.panelDown;
          this.getReviews(context.productSKU);
        } else {
          this.view.loading.isVisible = false;
          this.view.flxProductDatailContent.isVisible = true;
          this.view.flxProductDetailReviews.isVisible = true;
          this.view.flxNoReviews.isVisible = true;
        }
      }
    },
   	getReviews : function(productSKU) {
      let serviceName = "BestBuyADP";
      let integrationObj = KNYMobileFabric.getIntegrationService(serviceName);
      
      let operationName =  "getReviews";
      let data= {"apiKey": apiKey,"sku": productSKU};
      let headers= {};
      integrationObj.invokeOperation(operationName, headers, data, this.operationSuccess, this.operationFailure);
    },
    operationSuccess : function(res){
      let data = [];
      let image = '';
      
      res.reviews.map(review => {
        data.push({
          lblReviewTitle: review.title,
          lblReviewReviwerName: 'Submited by: '+review.name,
          imgRating: this.setImageStarRating(review.rating),
          lblReviewText: review.comment
        });
      });
      
      this.view.segReviews.setData(data);
      
      this.view.loading.isVisible = false;
      this.view.flxProductDatailContent.isVisible = true;
      this.view.flxProductDetailReviews.isVisible = true;
      this.view.flxContainerReviews.isVisible = true;
    },
    operationFailure : function(res){
      alert(res);
    },
    setImageStarRating : function(rating){
      let image = '';
      switch(Math.round(Number(rating))){
        case 1:
          image = 'ratings_star_1.png';
          break;
        case 2:
          image = 'ratings_star_2.png';
          break;
        case 3:
          image = 'ratings_star_3.png';
          break;
        case 4:
          image = 'ratings_star_4.png';
          break;
        case 5:
          image = 'ratings_star_5.png';
          break;
      }

      return image;
    },
    navigateToPreviousForm : function (eventObject) {
      var navBack = new kony.mvc.Navigation('frmProductList');
      navBack.navigate(null);
    },
    showMorePictures : function(eventObject) {
      var navToPictures = new kony.mvc.Navigation('frmProductImages');
      navToPictures.navigate(this.view.lblProductImages.text);
    },
    panelUp : function(eventObject){
      
      //Create the animation configuration.
      var animationConfig = {
        "duration": 1,
        "iterationCount": 1,
        "delay": 0,
        "fillMode": kony.anim.FILL_MODE_FORWARDS
      };
      
      var animDefinitionPanel = {
        "0": {
          "bottom": "-90%"
        },
        "100": {
          "bottom": "25%"
        }
      };
      
      var animDef = kony.ui.createAnimation(animDefinitionPanel);
      this.view.segReviews.animate(animDef, animationConfig);
      
      var animDefinitioDownArrow = {
        "0": {
          "bottom": "5%"
        },
        "100": {
          "bottom": "85%",
        }
      };
      
      animDef = kony.ui.createAnimation(animDefinitioDownArrow);      
      this.view.flxUpArrow.animate(animDef, animationConfig, {"animationEnd": () => {
        this.view.flxUpArrow.isVisible = false;
        this.view.flxDownArrow.isVisible = true;
        this.view.flxUpArrow.bottom = '5%';
      }});
    },
    panelDown : function(eventObject){
      
      //Create the animation configuration.
      var animationConfig = {
        "duration": 1,
        "iterationCount": 1,
        "delay": 0,
        "fillMode": kony.anim.FILL_MODE_FORWARDS
      };
      
      var animDefinitionPanel = {
        "0": {
          "bottom": "25%"
        },
        "100": {
          "bottom": "-90%"
        }
      };
      
      var animDef = kony.ui.createAnimation(animDefinitionPanel);
      this.view.segReviews.animate(animDef, animationConfig);
      
      var animDefinitioDownArrow = {
        "0": {
          "bottom": "85%"
        },
        "100": {
          "bottom": "5%"
        }
      };
      
      animDef = kony.ui.createAnimation(animDefinitioDownArrow);      
      this.view.flxDownArrow.animate(animDef, animationConfig, {"animationEnd": () => {
        this.view.flxDownArrow.isVisible = false;
        this.view.flxUpArrow.isVisible = true;
        this.view.flxDownArrow.bottom = '85%';
      }});
    },
    openAppMenu : function(){
      this.view.flxContainerAppMenu.animate(animDefinition("-80%","0%"), animationConfig());
      this.view.flxProductDetailsContainer.animate(animDefinition("0%","80%"), animationConfig());
      this.view.flxMenuOverlay.isVisible = true;
    },
    closeAppMenu : function(){
      this.view.flxContainerAppMenu.animate(animDefinition("0%","-80%"), animationConfig());
      this.view.flxProductDetailsContainer.animate(animDefinition("80%","0%"), animationConfig());
      this.view.flxMenuOverlay.isVisible = false;
    },
    addToCart : function(eventObject){      
      cartItems.push({
        productPrice: product.lblProductPrice,
        price: product.productPrice,
        productName: product.lblProductName,
        productNew: product.productNew,
        productSKU: product.productSKU
      });
      
      alert('Product added to the cart');
    },
    onClickAppMenu : function(seguiWidget, sectionNumber, rowNumber, selectedState){
      categories = [];
      onRowClickMenuApp(rowNumber);
      this.view.flxProductDetailsContainer.left = "0%";
      this.view.flxContainerAppMenu.left = "-80%";
      this.view.flxMenuOverlay.isVisible = false;
      
    }
  });

});
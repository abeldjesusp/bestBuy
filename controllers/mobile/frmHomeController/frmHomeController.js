define(function(){
  return({
    onNavigate : function(){    
      if(categories.length > 0){
        this.setSegment(categories[categories.length-1]);
      } else {
        this.view.flxSegContainer.isVisible = false;
      	this.view.loading.isVisible = true;
        this.view.navbar.flxBackButton.isVisible = false;
        this.view.lblBreadCrumbsText.text = 'Home';
        this.view.navbar.flxSearchButton.onTouchEnd = this.searchButton;
        this.view.flxContainerSearch.search.lblCancel.onTouchEnd = this.cancelSearchButton;
        this.view.flxContainerSearch.search.tbSearch.onDone = this.getSearch;
        this.view.navbar.flxMenuButton.onTouchEnd = this.openAppMenu;
        this.view.flxMenuOverlay.onTouchEnd = this.closeAppMenu;
        this.getCategory('cat00000');
        this.view.flxContainerAppMenu.appMenu.segAppMenu.onRowClick = this.onClickAppMenu;
      }
    },
	getCategory : function(catId){
      var serviceName = "BestBuyADP";
      var integrationObj = KNYMobileFabric.getIntegrationService(serviceName);
      var operationName =  "getCategories";
      var data= {"id": catId,"apikey": apiKey}
      ;
      var headers= {};
      integrationObj.invokeOperation(operationName, headers, data, this.operationSuccess, this.operationFailure);
    },
    operationSuccess : function(res){
      let data = [];
     
      if(res.subCategories){
        if(categories.length > 0) {
          var breadCrumb = this.view.lblBreadCrumbsText.text;
          this.view.lblBreadCrumbsText.text = breadCrumb+' -> '+categoryName;
          this.view.navbar.flxBackButton.isVisible = true;
        }
        
        res.subCategories.map(subCategory => {
         data.push({
           lblCategory: subCategory.category.name,
           categoryId: subCategory.category.id,
           lblIcon: ">"
         });
        });
        
        this.setSegment(data);
        categories.push(data);
      } else {
        alert("This category doesn\'t have products");
      }
      
      this.view.flxSegContainer.isVisible = true;
      this.view.loading.isVisible = false;
    },
    operationFailure : function(res){
      alert(res);
    },
    onRowClickCallBck : function(seguiWidget, sectionNumber, rowNumber, selectedState){
      var data = this.view.segCategories.data[rowNumber];
      category = data.categoryId;
      
      if(categories.length < 3){
        this.view.loading.isVisible = true;
        this.view.navbar.flxBackButton.onClick = this.backButton;
        this.getCategory(category);
        categoryName = data.lblCategory;
      } else {
        var navToProduct = new kony.mvc.Navigation('frmProductList');
        var product = {
          category: category,
          name: data.lblCategory,
          formID: kony.application.getCurrentForm().id
        };
        
        getCategoryBy = 'category';
        navToProduct.navigate(product);
      }
      
    },
    setSegment : function(data){
      this.view.segCategories.setData(data);
      this.view.segCategories.onRowClick = this.onRowClickCallBck;
      this.view.segCategories.setAnimations(segmentAnimation());
    },
    backButton : function(eventobject){
      var arrayBreadCrumb = this.view.lblBreadCrumbsText.text.split(" -> ");
     
      categories.pop();
      
      if(categories.length === 1){
        this.view.navbar.flxBackButton.isVisible = false;
      }
      
      arrayBreadCrumb.pop();
      var breadCrumb = arrayBreadCrumb.join(" -> ");
      this.view.lblBreadCrumbsText.text = breadCrumb;
      
      this.setSegment(categories[categories.length-1]);
    },
    searchButton : function(){
      this.view.flxContainerSearch.isVisible = true;
      var transformObject = kony.ui.makeAffineTransform();

      // Add a translation and a scale.					
      transformObject.translate(10, 0);
      
      //Create the animation configuration.
      var animationConfig = {
        "duration": 1,
        "iterationCount": 1,
        "delay": 0,
        "fillMode": kony.anim.FILL_MODE_FORWARDS
      };
      
      var animDefinition = {
        "0": {
          "bottom": "-100%"
        },
        "100": {
          "bottom": "0%"
        }
      };
      
      var animDef = kony.ui.createAnimation(animDefinition);
      this.view.flxContainerSearch.animate(animDef, animationConfig);
    },
    cancelSearchButton : function(){
      var transformObject = kony.ui.makeAffineTransform();

      // Add a translation and a scale.					
      transformObject.translate(10, 0);
      
      //Create the animation configuration.
      var animationConfig = {
        "duration": 1,
        "iterationCount": 1,
        "delay": 0,
        "fillMode": kony.anim.FILL_MODE_FORWARDS
      };
      
      var animDefinition = {
        "0": {
          "bottom": "0%"
        },
        "100": {
          "bottom": "-100%"
        }
      };
      
      var animDef = kony.ui.createAnimation(animDefinition);
      this.view.flxContainerSearch.animate(animDef, animationConfig, {"animationEnd":() => {
        this.view.flxContainerSearch.isVisible = false;
      }});
      
    },
    getSearch : function(eventObject){
      let searchText = eventObject.text;
      let criteria = '';
      
      switch(Number(this.view.flxContainerSearch.search.lbCreteria.selectedKey)){
        case 1:
          criteria = '';
          break;
        case 2:
          criteria = '&onSale=true';
          break;
        case 3:
          criteria = '&onSale=false';
          break;
        case 4:
          criteria = '&new=true';
          break;
        case 5:
          criteria = '&new=false';
          break;
        case 6:
          criteria = '&freeShipping=true';
          break;
        case 7:
          criteria = '&freeShipping=false';
          break;
        default:
          criteria = '';
          break;
      }
      
      var navToProduct = new kony.mvc.Navigation('frmProductList');
      var product = {
        searchText,
        criteria
      };
      searchCriteria = searchText+criteria;
      getCategoryBy = 'search';
      
      this.view.flxContainerSearch.search.tbSearch.text = '';
      this.view.flxContainerSearch.search.lbCreteria.selectedKey = 1;
      navToProduct.navigate(product);
    },
    openAppMenu : function(){      
      this.view.flxContainerAppMenu.animate(animDefinition("-80%","0%"), animationConfig());
      this.view.flxHomeContainer.animate(animDefinition("0%","80%"), animationConfig());
      this.view.flxMenuOverlay.isVisible = true;
    },
    closeAppMenu : function(){      
      this.view.flxContainerAppMenu.animate(animDefinition("0%","-80%"), animationConfig());
      this.view.flxHomeContainer.animate(animDefinition("80%","0%"), animationConfig());
      this.view.flxMenuOverlay.isVisible = false;
    },
    onClickAppMenu : function(seguiWidget, sectionNumber, rowNumber, selectedState){
      onRowClickMenuApp(rowNumber);
      this.view.flxHomeContainer.left = "0%";
      this.view.flxContainerAppMenu.left = "-80%";
      this.view.flxMenuOverlay.isVisible = false;
      this.view.navbar.flxBackButton.isVisible = false;
      categories = [];
    }
  });

 });
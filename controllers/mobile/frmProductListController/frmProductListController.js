define(function(){ 
	return({
      onNavigate : function(context){
        if(context){
          this.view.flxContainerProductList.isVisible = false;
          this.view.flxNoProducts.isVisible = false;
          this.view.flxPagination.isVisible = false;
          this.view.loading.isVisible = true;
          this.view.navbar.flxBackButton.onTouchEnd = this.navigateToPreviousForm;
          this.view.navbar.flxMenuButton.onTouchEnd = this.openAppMenu;
          this.view.flxMenuOverlay.onTouchEnd = this.closeAppMenu;
          this.view.flxContainerAppMenu.appMenu.segAppMenu.onRowClick = this.onClickAppMenu;
          
          if(getCategoryBy == 'category') {        
            this.view.lblInformation.text = "Category: "+context.name;
            this.getProductsByCategory(category, 1);
          } else {
            this.view.lblInformation.text = "Results for: "+context.searchText;
            this.getProductsBySearch(searchCriteria, 1);
          }
        }
      },
      getProductsByCategory : function(prodID, page){
        var serviceName = "BestBuyADP";
        var integrationObj = KNYMobileFabric.getIntegrationService(serviceName);
        var operationName =  "getProducts";
        var data= {"id": prodID,"apiKey": apiKey,"pageSize": "10","page": page};
        var headers= {};
        integrationObj.invokeOperation(operationName, headers, data, this.operationSuccess, this.operationFailure);
      },
      getProductsBySearch : function(search, page){
        var serviceName = "BestBuyADP";
        var integrationObj = KNYMobileFabric.getIntegrationService(serviceName);
        var operationName =  "getSearchProducts";
        var data= {"apiKey": apiKey,"search": search,"page": page,"pageSize": "10"};
        var headers= {};
        integrationObj.invokeOperation(operationName, headers, data, this.operationSuccess, this.operationFailure);
      },
      operationSuccess : function(res){
        var data = [];
        
        if(res.products.length > 0) {
          // mapear products
          res.products.map(prod => { 
            let productPrice = '';
            let shippingBanner = '';
            let price = '';

            // validate if it's onsale
            if(prod.product.onSale === 'true'){
              price = prod.product.salePrice;
              productPrice = {
                text: "$ "+prod.product.salePrice,
                skin: 'sknProductPriceRed'
              };
            } else {
              price = prod.product.regularPrice;
              productPrice = {
                text: "$ "+prod.product.regularPrice,
                skin: 'sknProductPriceBlack'
              };
            }

            // validate free shipping
            if(prod.product.freeShipping === 'true'){
              shippingBanner = 'sknFreeShpBanner';
            } else {
              shippingBanner = 'sknNoFreeShpBanner';
            }

            data.push({
              productCustomerReviewCount: prod.product.customerReviewCount,
              lblProductName: prod.product.name,
              imgProduct: prod.product.image,
              lblProductRating: prod.product.customerReviewAverage !== '' ? 'Avg User Rating: '+prod.product.customerReviewAverage : '',
              productAvgRating: prod.product.customerReviewAverage,
              lblProductPrice: productPrice,
              lblFreeShipping: prod.product.freeShipping === 'true' ? "!!! Free Shipping !!!" : '',
              flxBanner: {skin: shippingBanner},
              productLongDescription: prod.product.longDescription,
              productOnSale: prod.product.onSale,
              productSKU: prod.product.sku,
              productImages: JSON.stringify(prod.product.images),
              productNew: prod.product.new,
              productPrice: price
            });
          });

          // set pagination section
          if(res.totalPages > 1){
            let listBox = [];

            for(let i = 1; i <= res.totalPages; i++) {
              listBox.push([String(i), String(i)]);
            }

            this.view.lbPagination.masterData = listBox;
            this.view.lbPagination.selectedKey = res.currentPage;
            this.view.lbPagination.onSelection = this.onSelectionCallback;
            this.view.lbPagination.isVisible = true;
          } else {
            this.view.lbPagination.isVisible = false;
          }

          this.view.lblPaginationText.text = `Page ${res.currentPage} of ${res.totalPages}`;

          this.setSegment(data);
          this.view.flxContainerProductList.isVisible = true;
          this.view.flxNoProducts.isVisible = false;
          this.view.flxPagination.isVisible = true;
        } else {
          this.view.flxContainerProductList.isVisible = false;
          this.view.flxNoProducts.isVisible = true;
        }

        this.view.loading.isVisible = false;
      },
      operationFailure : function(res){
        alert(res);
        kony.print(res);
      },
      navigateToPreviousForm: function (eventObject) {
        var navBack = new kony.mvc.Navigation('frmHome');
        navBack.navigate(null);
      },
      setSegment : function(data){
        this.view.segProductList.setData(data);
        this.view.segProductList.onRowClick = this.onRowClickCallback;
        this.view.segProductList.setAnimations(segmentAnimation());
      },
      onSelectionCallback : function(list) {
        this.view.flxContainerProductList.isVisible = false;
        this.view.loading.isVisible = true;
        
        if(getCategoryBy == 'category') {
        	this.getProductsByCategory(category, list.selectedKeyValue[0]);
        } else {
          this.getProductsBySearch(searchCriteria, list.selectedKeyValue[0]);
        }
        
      },
      onRowClickCallback : function(seguiWidget, sectionNumber, rowNumber, selectedState){
      	let data = this.view.segProductList.data[rowNumber];
        let navToProductDetail = new kony.mvc.Navigation('frmProductDetails');
        navToProductDetail.navigate(data);
      },
      openAppMenu : function(){
        this.view.flxContainerAppMenu.animate(animDefinition("-80%","0%"), animationConfig());
        this.view.flxProductListContainer.animate(animDefinition("0%","80%"), animationConfig());
        this.view.flxMenuOverlay.isVisible = true;
      },
      closeAppMenu : function(){
        this.view.flxContainerAppMenu.animate(animDefinition("0%","-80%"), animationConfig());
        this.view.flxProductListContainer.animate(animDefinition("80%","0%"), animationConfig());
        this.view.flxMenuOverlay.isVisible = false;
      },
      onClickAppMenu : function(seguiWidget, sectionNumber, rowNumber, selectedState){
        categories = [];
        onRowClickMenuApp(rowNumber);
        this.view.flxProductListContainer.left = "0%";
        this.view.flxContainerAppMenu.left = "-80%";
        this.view.flxMenuOverlay.isVisible = false;
      }
    });
});
function onRowClickMenuApp(rowNumber) {
  let navToPage = null;
  
  if(rowNumber === 0){
    navToPage = new kony.mvc.Navigation('frmHome');
  } else if(rowNumber === 1){
    navToPage = new kony.mvc.Navigation('frmStores');
  } else if(rowNumber === 2){
    navToPage = new kony.mvc.Navigation('frmCart');
  }
  
  navToPage.navigate(null);
}

function animationConfig() {
  return {
    "duration": 0.4,
    "iterationCount": 1,
    "delay": 0,
    "fillMode": kony.anim.FILL_MODE_FORWARDS
  };
}

function animDefinition(step0, step100) {
  var animationDef = {
    "0": {
      "left": step0
    },
    "100": {
      "left": step100
    }
  };
  
  return kony.ui.createAnimation(animationDef);
}

function segmentAnimation() {
  var transformObject1 = kony.ui.makeAffineTransform();
  transformObject1.translate(200, 0);
  var transformObject2 = kony.ui.makeAffineTransform();
  transformObject2.translate(0, 0);

  var animationDef = {
    "0": {
      "transform": transformObject1
    },
    "100": {
      "transform": transformObject2
    }
  };

  var animDef = kony.ui.createAnimation(animationDef);

  var config = {
    "duration": 0.4,
    "delay": 0,
    "fillMode": kony.anim.FILL_MODE_FORWARDS,
  };
  
  return {
    visible: {
      definition: animDef,
      config: config,
      callbacks: null
    }
  };
}
  
function totalAnimation() {
  var transformProp1 = kony.ui.makeAffineTransform();
  transformProp1.rotate(0);
  var transformProp2 = kony.ui.makeAffineTransform();
  transformProp2.rotate3D(360, 0, 1, 0);
  var transformProp3 = kony.ui.makeAffineTransform();
  transformProp3.rotate(90);
  var animDefinitionOne = {
    /*0: {
      "transform": transformProp1
    },*/
    100: {
      "transform": transformProp2
    }
  };
  animDef = kony.ui.createAnimation(animDefinitionOne);
  return animDef;

}
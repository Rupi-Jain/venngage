var utils = {

  rectPointCollision: function(x, y, rect) {
    rectLeft = rect.x;
    rectRight = rect.x + rect.width;
    rectTop = rect.y;
    rectBottom = rect.y + rect.height;
		return ((x > rectLeft && x < rectRight) && (y > rectTop && y < rectBottom))
	},

	circlePointCollision: function(x, y, circle) {
		return utils.distanceXY(x, y, circle.x, circle.y) < circle.radius;
	},
  
  distanceXY: function(x0, y0, x1, y1) {
		var dx = x1 - x0,
			dy = y1 - y0;
		return Math.sqrt(dx * dx + dy * dy);
	},

  findMinimumDistance: function(origin, target){
    var dx = target.x - origin.x;
    dy = target.y - origin.y;
    return Math.sqrt(dx * dx + dy * dy);
  },

  drawOuterBox: function(handle) {
    let coords = utils.findLeftRightCenterOfNode(handle);
    if (coords.isRadius) 
      utils.drawOuterCircle(coords, context);
    else 
      utils.drawOuterRect(coords, context);
  },

  findLeftRightCenterOfNode: function(handle) {
    let coords;  
    if (handle.hasOwnProperty('radius')) 
      coords = utils.findLeftRightCenterOfCircle(handle); 
    else 
      coords = utils.findLeftRightCenterOfRect(handle);
    return coords;
  },

  findCenterOfNode: function(handle) {
    if (handle.hasOwnProperty('radius'))
      return {x: handle.x, y: handle.y};
    else
      return {x: handle.x + (handle.width / 2), y: handle.y + (handle.height / 2)};
  },

  alignToPage: function(handle,pageCoords, height, width) {
    let coords = utils.findCenterOfNode(handle);

    for (let pageSide in pageCoords) {
      let minDistance;
      if (pageSide === 'left' || pageSide === 'right')
        minDistance = Math.abs(pageCoords[pageSide].x - coords.x);
      else
        minDistance = utils.findMinimumDistance(pageCoords[pageSide], coords);
      if (minDistance < 100)
        return utils.drawAlignmentLinesOnPage(pageSide, pageCoords, height, width)
    }
  },

  drawAlignmentLinesOnPage: function(pageSide, pageCoords, height, width) {
    console.log("pageSide", pageSide);
    context.strokeStyle = 'lightBlue';
    context.setLineDash([5, 5]);
    context.beginPath();
    
    if (pageSide === 'center') {
      context.moveTo(pageCoords[pageSide].x , 0);
      context.lineTo(pageCoords[pageSide].x  , height);
      context.stroke();
      context.beginPath();
      context.moveTo( 0  , pageCoords[pageSide].y );
      context.lineTo(width , height/2);
    }  
    else   {
      context.moveTo(pageCoords[pageSide].x , pageCoords[pageSide].y);
      context.lineTo(pageCoords[pageSide].x  , height);
    }  
    context.stroke();
  },

  findLeftRightCenterOfCircle: function(handle) {
    let left = [(handle.x - handle.radius), handle.y];
    let right = [(handle.x + handle.radius), handle.y];
    let center = [handle.x, handle.y];
    let top = [handle.x, handle.y - handle.radius];
    let bottom = [handle.x, handle.y + handle.radius];
    let isRadius = true; 
    return {left, right, center, top, bottom, isRadius};
  },

  findLeftRightCenterOfRect: function(handle) {
    let leftTop = [handle.x , handle.y];
    let rightTop = [(handle.x + handle.width) , handle.y  ];
    let center = [handle.x + (handle.width / 2), handle.y + (handle.height / 2)];
    let leftBottom = [handle.x, (handle.y + handle.height) ];
    let rightBottom = [rightTop[0] , leftBottom[1]];
    let leftCenter = [leftTop[0] , (leftTop[1] + handle.height / 2)];
    let rightCenter = [rightTop[0] , (rightTop[1] + handle.height / 2)];
    let topCenter = [(leftTop[0] + handle.width / 2), leftTop[1]];
    let  bottomCenter = [(leftBottom[0] + handle.width / 2), leftBottom[1]];    
    let  isRadius = false;
    return {leftTop, rightTop, center, leftBottom, rightBottom, 
            leftCenter, rightCenter, topCenter, bottomCenter, isRadius};
  },

  drawOuterCircle: function(coords,context) {
    context.beginPath();
    context.moveTo(coords.left[0] , coords.top[1]);
    context.lineTo(coords.left[0] , coords.bottom [1]);
    context.stroke();
    context.beginPath();
    context.moveTo(coords.right[0] , coords.top[1]);
    context.lineTo(coords.right[0] , coords.bottom [1]);
    context.stroke();
    context.beginPath();
    context.moveTo(coords.left[0] , coords.top[1]);
    context.lineTo(coords.right[0] , coords.top[1]);
    context.stroke();
    context.beginPath();
    context.moveTo(coords.left[0] , coords.bottom[1]);
    context.lineTo(coords.right[0] , coords.bottom[1]);
    context.stroke();
    context.beginPath();
    context.moveTo(coords.top[0] , coords.top[1]);
    context.lineTo(coords.bottom[0] , coords.bottom[1]);
    context.stroke();
    context.beginPath();
    context.moveTo(coords.left[0] , coords.left[1]);
    context.lineTo(coords.right[0] , coords.right[1]);
    context.stroke();
  },

  drawOuterRect: function(coords, context) {
    context.beginPath();
    context.moveTo(coords.leftTop[0] , coords.leftTop[1]);
    context.lineTo(coords.leftBottom[0] , coords.leftBottom [1]);
    context.stroke();
    context.beginPath();
    context.moveTo(coords.leftTop[0] , coords.leftTop[1]);
    context.lineTo(coords.rightTop[0] , coords.rightTop[1]);
    context.stroke();
    context.beginPath();
    context.moveTo(coords.leftBottom[0] , coords.leftBottom[1]);
    context.lineTo(coords.rightBottom[0] , coords.leftBottom[1]);
    context.stroke();
    context.beginPath();
    context.moveTo(coords.rightTop[0] , coords.rightTop[1]);
    context.lineTo(coords.rightTop[0] , coords.rightBottom[1]);
    context.stroke();
    context.beginPath();
    context.moveTo(coords.topCenter[0] , coords.topCenter[1]);
    context.lineTo(coords.topCenter[0] , coords.bottomCenter[1]);
    context.stroke();
    context.beginPath();
    context.moveTo(coords.leftCenter[0] , coords.leftCenter[1]);
    context.lineTo(coords.rightCenter[0] , coords.rightCenter[1]);
    context.stroke();
  },

  drawOuterRectForSelectedNode: function(coords, context){
    let height = width = 5;
    
    context.beginPath();
    context.rect(coords.leftTop[0],coords.leftTop[1], height, width);
		context.fill();
    context.beginPath();
    context.rect(coords.rightTop[0],coords.rightTop[1], height, width);
		context.fill();
    context.beginPath();
    context.rect(coords.leftBottom[0],coords.leftBottom[1], height, width);
		context.fill();
    context.beginPath();
    context.rect(coords.rightBottom[0],coords.rightBottom[1], height, width);
		context.fill();
    context.beginPath();
    context.rect(coords.leftCenter[0],coords.leftCenter[1], height, width);
		context.fill();
    context.beginPath();
    context.rect(coords.rightCenter[0],coords.rightCenter[1], height, width);
		context.fill();
    context.beginPath();
    context.rect(coords.topCenter[0],coords.topCenter[1], height, width);
		context.fill();
    context.beginPath();
    context.rect(coords.bottomCenter[0],coords.bottomCenter[1], height, width);
		context.fill();

  }

}
window.onload = function() {
	let canvas = document.getElementById("canvas");
  context = canvas.getContext("2d");
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;
  console.log(width, height);

  let handle1 = { x: 200, y: 350, radius: 30 };
  let handle2 = { x: 450, y: 250, radius: 30 };
  let handle3 = { x: 200, y: 200, width: 80, height:60 };
  let handle4 = { x: 500, y: 300, width: 85, height:65 };
  let handles = { handle1,handle2,handle3,handle4 }
  let pageCoords = {left: {x: 30, y: 0}, right: {x: width - 30, y: 0}, center: {x: width/2, y: height/2}};
  let offset = {};
  let handle = {};
  let priorityQueue = [];
  let currentNode;
  let count = 0;

  draw();

  document.body.addEventListener("mousedown", function(event) {
    
		if(utils.circlePointCollision(event.clientX, event.clientY, handle1)) {
			document.body.addEventListener("mousemove", onMouseMove);
			document.body.addEventListener("mouseup", onMouseUp);
			offset.x = event.clientX - handle1.x;
			offset.y = event.clientY - handle1.y;
      handle = handle1;
      currentNode = "handle1";
		}
    if(utils.circlePointCollision(event.clientX, event.clientY, handle2)) {
			document.body.addEventListener("mousemove", onMouseMove);
			document.body.addEventListener("mouseup", onMouseUp);
			offset.x = event.clientX - handle2.x;
			offset.y = event.clientY - handle2.y;
      handle = handle2;
      currentNode = "handle2";
		}
    if(utils.rectPointCollision(event.clientX, event.clientY, handle3)) {
			document.body.addEventListener("mousemove", onMouseMove);
			document.body.addEventListener("mouseup", onMouseUp);
			offset.x = event.clientX - handle3.x 
			offset.y = event.clientY - handle3.y ;
      handle = handle3;
      currentNode = "handle3";
		}
    if(utils.rectPointCollision(event.clientX, event.clientY, handle4)) {
			document.body.addEventListener("mousemove", onMouseMove);
			document.body.addEventListener("mouseup", onMouseUp);
			offset.x = event.clientX - handle4.x ;
			offset.y = event.clientY - handle4.y;
      handle = handle4;
      currentNode = "handle4";
		}
	});

	function onMouseMove(event) {
		handle.x = event.clientX  - offset.x;
		handle.y = event.clientY - offset.y;
		draw();
    
    utils.drawOuterBox(handle);
    utils.alignToPage(handle, pageCoords, height, width);
    let nearestNode = findNearestNeighbour(handle);
    if(nearestNode)
      utils.drawOuterBox(handles[nearestNode.handle]);  //Nearest Node
    updateCurrentNodePoints(handle, currentNode); 
	}

	function onMouseUp(event) {    
		document.body.removeEventListener("mousemove", onMouseMove);
		document.body.removeEventListener("mouseup", onMouseUp);
    context.setLineDash([]);
    draw();
	}

  function findNearestNeighbour(handle){
    let origin = utils.findCenterOfNode(handle);
    let target;
    for (let handle in handles) {    
      if (handle !== currentNode) {
        target = utils.findCenterOfNode(handles[handle]);
        let minDistance = utils.findMinimumDistance(origin, target);
        if (minDistance < 100)
          addNodeToPriorityQueue({minDistance, handle})
      }  
    }
    return removeNodeFromPriorityQueue();
  }

  function addNodeToPriorityQueue(node) {
    let i = shiftItemToInsert(node);
    priorityQueue[i] = node;
    count++;
  }

  function shiftItemToInsert(node) {
    let i = 0;
    for (i = count - 1; i >= 0; i--) {
      if (priorityQueue[i].value < node.value) 
        priorityQueue[ i + 1] = priorityQueue[i];
      else
        break;
    }
    return i + 1;
  }

  function removeNodeFromPriorityQueue() {
    let nearestNode =  priorityQueue[--count];
    priorityQueue = [];
    count = 0;
    return nearestNode;
  }

  function draw() {
		context.clearRect(0, 0, width, height);
		context.fillStyle = "blue";
    context.strokeStyle = 'red';
    context.beginPath();
		context.arc(handle1.x, handle1.y, handle1.radius, 0, Math.PI * 2, false);
    context.fill();
		context.beginPath();
    context.rect(handle3.x,handle3.y, handle3.width, handle3.height);
    context.fill();
    context.beginPath();
    context.arc(handle2.x, handle2.y, handle2.radius, 0, Math.PI * 2, false);
		context.fill();
    context.beginPath();
    context.rect(handle4.x,handle4.y, handle4.width, handle4.height);
		context.fill();
	}

  function updateCurrentNodePoints(handle, currentNode) {
    handles[currentNode].x = handle.x;
    handles[currentNode].y = handle.y;
  }


};
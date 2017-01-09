/**
 * Mouse-Camera-Controller that controls camera position and target with the mouse.
 * Mouse-wheel: change distance between camera and target
 * Mouse with left button pressed: rotate camera (but camera keeps looking at target)
 *
 * @param{THREE.Camera} camera the camera to control.
 * @param{Objekt} canvas the canvas dom elememnt where all this takes place.
 * @param{THREE.Vector3} camTarget the target where the camera looks at (default: (0,0,0))
 */
function MouseCamController(camera, canvas, camTarget) {

   if(camTarget===undefined) camTarget = new THREE.Vector3(0,0,0);

   // --- Private data and methods ---
   // data for zooming
   var targetDist = camera.position.length();  // distance camera-target that we wan't to get.
   var currentDist = targetDist;   // current distance between camera and target.

   // -- Private data for rotation ---
   var rotStart;   // rotation start in world coordinates
   var rotEnd;     // rotation end in world coordinates

   // translates canvas coordinates of mouse pointer to camera near plane coordinates.
   function clientInCamCoords( clientX, clientY ) {

      // mouse pointer in camera coordinates:
      var mcc = new THREE.Vector3( (clientX - 0.5*canvas.width)/(0.5*canvas.width),
                                   (0.5*canvas.height - clientY)/(0.5*canvas.height),
                                   0);
      // clamp values to [-1, 1] if mouse pointer is outside canvas:
      if(mcc.x >1) mcc.x = 1;
      if(mcc.x <-1) mcc.x = -1;
      if(mcc.y >1) mcc.y = 1;
      if(mcc.y <-1) mcc.y = -1;
      return mcc;
   }

   // --- Public Methods ---

   /**
    * sets the target where the camera looks to.
    */
   this.setCamTarget = function(vec) {
      camTarget.copy(vec);
   };

   /**
    * updates distance of camera to target to approach desired distance.
    */
   this.updateDist = function() {

      // currentDist is where we get after this update. It approaches but never exactly
      // reaches the targetDist value in order to get smooth behaviour.
      currentDist += (targetDist - currentDist) / 10;
      var d = camera.position.length();
      if(d>0.00001) {
         camera.position.multiplyScalar(currentDist/d);
      }
   };

   /**
    * rotate camera position according to mouse movement
    */
   this.updateRot = function() {

      if(rotEnd===undefined || rotStart===undefined) return;

      // Speed of rotation,  depends on currentDist to get good
      // rotation speed even if we are far away from target.
      var rotSpeed = 2*currentDist; 
            
      // theta: angle by which to rotate
      var theta = rotSpeed * rotEnd.angleTo(rotStart);  
      if(theta < 0.00001) return;
      // axis: axis around which to rotate
      var axis = new THREE.Vector3();
      axis.crossVectors(rotEnd, rotStart).normalize();

      // define rotation matrix and apply it to camera
      var rotMat4 = new THREE.Matrix4();
      rotMat4.makeRotationAxis(axis, theta);
      camera.position.applyMatrix4(rotMat4);
      camera.up.applyMatrix4(rotMat4);
      // keep looking at target
      camera.lookAt(camTarget);

      // update vectors defining the rotation
      rotEnd.applyMatrix4(rotMat4);
      rotStart.copy(rotEnd);
   };

   // --- Callback functions to register with the document object ---

   // this callback sets the desired distance of the camera to the target
   // ans is registered with the mouse wheel. The magic numbers have been
   // found by trial and error to get smooth behaviour.
   function mousewheelCB (event) {

      event.preventDefault();

      var delta = 0;
      if ( event.wheelDelta ) { // WebKit / Opera / Explorer 9
         delta = event.wheelDelta / 40;
      } else if ( event.detail ) { // Firefox
         delta = - event.detail / 3;
      }
      targetDist = targetDist * (1+delta/20);
   }
   document.addEventListener( 'mousewheel', mousewheelCB, false );
   document.addEventListener( 'DOMMouseScroll', mousewheelCB, false );  // firefox

   // Left mouse button pressed: Start rotation
   // Trick: install / uninstall mouse-move-handler at mouse-down event.
   function mousedown( event ) {

      event.preventDefault();
      // rotation start point in camera coordinates ...
      rotStart = clientInCamCoords(event.clientX, event.clientY);
      // and then in world coordinates:
      rotStart.applyMatrix4(camera.matrixWorld); // alternative: camera.localToWorld(rotStart);
      rotEnd = rotStart.clone();  // no rotation yet

      document.addEventListener( 'mousemove', mousemove, false );
      document.addEventListener( 'mouseup', mouseup, false );
   }
   document.addEventListener( 'mousedown', mousedown, false );

   // trigger rotation by setting rotEnd to a vector different from rotStart.
   function mousemove( event ) {
      event.preventDefault();
      // event.stopPropagation();    // if this is active, other controls can't be used anymore

      // mouse position: first in camera coordinates ...
      rotEnd = clientInCamCoords(event.clientX, event.clientY);
      // ... then in world coordinates
      rotEnd.applyMatrix4(camera.matrixWorld);
   }

   // stop rotation by unregistering the other callbacks
   function mouseup( event ) {

      event.preventDefault();
      rotStart = undefined;
      rotEnd = undefined;

      document.removeEventListener( 'mousemove', mousemove );
      document.removeEventListener( 'mouseup', mouseup );
   }
}

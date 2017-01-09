// Helper functions for THREE lib

// Apparently, THREE matrices are column major (see Vector3.applyMatrix3 in source code).
// The documentation seems to indicate somezthing different ...
function printMat(m, digits) {
   if(digits===undefined) digits = 4;

   var x = Math.pow(10, digits);
   function round(v) {
      return Math.round(x*v)/x;
   }

   var len = Math.sqrt(m.elements.length);
   for(var r=0;r<len; ++r) {
      var str = '';
      for (var c=0; c<len; ++c) {
         str += round(m.elements[c*len+r]) + ' ';
      }
      console.log(str);
   }
}




/**
 * add face normal arrows to some mesh object
 */
function addFaceNormalArrows(obj, len) {
   if (len === undefined) len = 1/4;
   for(var f=0; f<obj.geometry.faces.length; ++f){
      var face = obj.geometry.faces[f];
      var arrow = new THREE.ArrowHelper(face.normal, face.centroid, 1/8, 0x3333FF);
      obj.add(arrow);
   }
}




/**
 * add vertex normal arrows to some mesh object
 */
function addVertexNormalArrows(obj, len) {
   if (len === undefined) len = 1/4;

   for(var f=0; f<obj.geometry.faces.length; ++f){
      var face = obj.geometry.faces[f];
      var arrow1 = new THREE.ArrowHelper(face.vertexNormals[0],
                                         obj.geometry.vertices[face.a],
                                         1/8, 0x3333FF);

      obj.add(arrow1);
      var arrow2 = new THREE.ArrowHelper(face.vertexNormals[1],
                                         obj.geometry.vertices[face.b],
                                         1/8, 0x33FF33);

      obj.add(arrow2);
      var arrow3 = new THREE.ArrowHelper(face.vertexNormals[2],
                                         obj.geometry.vertices[face.c],
                                         1/8, 0xFF3333);

      obj.add(arrow3);
   }
}




function addWorldAxes(scene, len, thick) {

   if(len===undefined) len = 1.5;
   if(thick===undefined) thick = 1/50;
   var greenMat = new THREE.MeshBasicMaterial({color: 'green'});
   var axisGeo = new THREE.CylinderGeometry(thick, thick, len, 48);
   var axis = new THREE.Mesh(axisGeo, greenMat);
   var headGeo = new THREE.CylinderGeometry(0, 2*thick, 2*thick, 48);
   var head = new THREE.Mesh(headGeo, greenMat);
   head.position.y = len/2+thick;
   var yAxis = new THREE.Object3D();
   yAxis.add(axis);
   yAxis.add(head);
   yAxis.position.y=len/6;
   scene.add(yAxis);


   var blueMat = new THREE.MeshBasicMaterial({color: 'blue'});
   axis = new THREE.Mesh(axisGeo, blueMat);
   head = new THREE.Mesh(headGeo, blueMat);
   head.position.y = len/2+thick;
   var zAxis = new THREE.Object3D();
   zAxis.add(axis);
   zAxis.add(head);
   zAxis.rotation.x = Math.PI/2;
   zAxis.position.z = len/6;
   scene.add(zAxis);

   var redMat = new THREE.MeshBasicMaterial({color: 'red'});
   axis = new THREE.Mesh(axisGeo, redMat);
   head = new THREE.Mesh(headGeo, redMat);
   head.position.y = len/2+thick;
   var xAxis = new THREE.Object3D();
   xAxis.add(axis);
   xAxis.add(head);
   xAxis.rotation.z = -Math.PI/2;
   xAxis.position.x = len/6;
   scene.add(xAxis);
}

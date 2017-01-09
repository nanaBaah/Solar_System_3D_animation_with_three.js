// Helper function (Matlab-inspired)
linspace = function(start, end, N) {
   if(N===undefined) {
      N = 100;
   }

   var result = new Array(N);
   result[0] = start;
   var incr = (end-start)/(N-1);
   for(var k = 1; k<N; ++k) {
      result[k] = result[k-1] + incr;
   }
   return result;
};



/**
 * create triangulation of a sphere (zu schwierig)
 * @param{Number} r radius of sphere
 * @param{Number} nPhi number of intervals for phi angle
 * @param{Number} nTheta number of intervals for theta angle
 * @return the created sphere as a geometryObjec
 */
function createSphereGeo(r, nPhi, nTheta) {
   var n,k,lrIdx,llIdx,urIdx,ulIdx;   // local variables
   // argument handling
   if(nPhi === undefined) nPhi = 12;
   if(nTheta === undefined) nTheta = 8;

   // initialization
   var geo = new THREE.Geometry();
   var phiVec = linspace(0, 2*Math.PI, nPhi+1);
   phiVec.pop();
   var thetaVec = linspace(0, Math.PI, nTheta+1);

   // helper function to turn (phi, theta)-coordinates into cartesian coordinates
   function createVertex(phi, theta) {
      return new THREE.Vector3(r * Math.sin(theta) * Math.cos(phi),
                               r * Math.sin(theta) * Math.sin(phi),
                               r * Math.cos(theta));
   }

   // --- Fill in vertices ---
   // top vertex: index 0
   geo.vertices.push(new THREE.Vector3(0,0,r));
   for(n=1; n<nTheta; ++n) {
      for(k=0; k<nPhi; ++k) {
         geo.vertices.push(createVertex(phiVec[k], thetaVec[n]));
      }
   }
   // bottom vertex: last index
   geo.vertices.push(new THREE.Vector3(0,0,-r));


   // --- Fill in faces ---
   // fill in top row
   for(k = 1; k<=nPhi; ++k) {
      geo.faces.push(new THREE.Face3(0, k-1, k));
   }
   geo.faces.push(new THREE.Face3(0, nPhi, 1));
   // fill in next rows
   for(n=2; n<=nTheta-1; ++n) {
      for(k=1; k<nPhi; ++k) {
         lrIdx = (n-1)*nPhi+k+1; // index of lower right corner
         llIdx = lrIdx - 1;   // index of lower left vertex
         urIdx = lrIdx - nPhi;   // index of upper right vertex
         ulIdx = urIdx - 1;   // index of upper left vertex
         geo.faces.push(new THREE.Face3(lrIdx, urIdx, ulIdx));
         geo.faces.push(new THREE.Face3(ulIdx, llIdx, lrIdx));
      }
      // fill in last square
      lrIdx = (n-1)*nPhi+1;   // index of lower right corner
      llIdx = lrIdx + nPhi-1;   // index of lower left vertex
      urIdx = lrIdx - nPhi;   // index of upper right vertex
      ulIdx = urIdx + nPhi -1;   // index of upper left vertex
      geo.faces.push(new THREE.Face3(lrIdx, urIdx, ulIdx));
      geo.faces.push(new THREE.Face3(ulIdx, llIdx, lrIdx));
   }
   // fill in top row
   var lastIdx = geo.vertices.length - 1;
   for(k = 0; k<nPhi-1; ++k) {
      geo.faces.push(new THREE.Face3(lastIdx-nPhi+k, lastIdx, lastIdx-nPhi+k+1));
   }
   geo.faces.push(new THREE.Face3(lastIdx-1, lastIdx, lastIdx-nPhi));
     
   //geo.computeFaceNormals();
   //geo.computeVertexNormals();
   //
   //function randVec(s) {
   //   if(s===undefined) s = 1;
   //   return new THREE.Vector3(s*Math.random(),
   //                         s*Math.random(),
   //                         s*Math.random());
   //}
   //
   //
   //geo.faces.forEach(function(face) {
   //  face.vertexNormals.forEach(function(n) {
   //     if(Math.random() > 0.9) {
   //        n.add(randVec(2));
   //        n.normalize();
   //     }
   //  });
   //});
   return geo;
}

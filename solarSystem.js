/**
*   Nana Baah
*   Hamburg University of Applied Sciences (Information Engineering)
*   Matrikel Nr: 2061594
*   Solar System 3D
*	November 11, 2013	
*/

var canvas = document.getElementById("mycanvas");
var renderer = new THREE.WebGLRenderer({canvas:canvas});
renderer.setSize(canvas.width, canvas.height);

renderer.setClearColor('black');

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(45,
                                         window.innerWidth/ window.innerHeight,
                                         0.1,
                                         4000);
camera.position.set(500, 500, 500);
camera.lookAt(scene.position);

// sun as the light in all directions
var light = new THREE.PointLight(0xffffff, 3);
light.position.set(0, 0, 0);
scene.add(light);

var orbit = [];
var planet = [];
var group = [];

var orbitSpeed = [1, 0.001, 0.0002, 0.0003, 0.0004];
var orbitRing = [1, 160, 220, 290, 360];
var planetRadius = [80, 10, 13, 15, 14];

// Sun, Mercury, Venus, Earth, Mars
 var texture = [ "images/sunTexture.jpg", "images/mercuryTexture.jpg", "images/venusTexture.jpg", "images/earthTexture.jpg",
                "images/marsTexture.jpg" ];

for (var i = 0; i < 5; i++) {
    var geo = new THREE.TorusGeometry(orbitRing[i], 0.1, 50, 100);
    var mat = new THREE.MeshNormalMaterial({wireframe: true});
    orbit[i] = new THREE.Mesh(geo, mat);
    scene.add(orbit[i]);
    
    geo = new THREE.SphereGeometry(planetRadius[i], 200, 200);
    
    if (i === 0) {
		mat = new THREE.MeshPhongMaterial({map: THREE.ImageUtils.loadTexture(texture[i]),
						  ambient: 0x030303,
						  emissive: 0xffa500,
						  shininess: 200,
						  specular: 0x009900});
    } else {
		mat = new THREE.MeshPhongMaterial({map: THREE.ImageUtils.loadTexture(texture[i])});
    }
   
  
    planet[i] = new THREE.Mesh(geo, mat);
    scene.add(planet[i]);
    
    planet[i].position.set(orbitRing[i], 0, 0);
    
    if ( i === 3) {
		// add moon to earth
		var earth = planet[3];
		earth.rotation.z += 0.41;				// tilts the earth
		var moonGeo = new THREE.SphereGeometry(5, 20, 20);
		var moonMat = new THREE.MeshPhongMaterial( {map: THREE.ImageUtils.loadTexture("moonTexture.jpg")});
		var moon = new THREE.Mesh(moonGeo);
		
		var earthMoon = new THREE.Object3D();
		earth.add(earthMoon);
		earthMoon.add(moon);
		earthMoon.position.set(25, 0, 0);
    }
}

// mouse camera control
var CameraController = function() {
    this.fov = 45;
    this.r = 2;
    this.phi = 0;
    this.theta = Math.PI/2;
}

var camCon = new CameraController();

window.onload = function() {
    var gui = new dat.GUI();
    gui.add(camCon, 'fov', 0, 90);
}

var mcc = new MouseCamController(camera, canvas);

draw();

function draw() {
	// sun is stationary therefore array begin from 1
    for (var i = 1; i < 5; i++) {
        planet[i].rotation.y = Date.now() * 0.0010;
        planet[i].position.x = Math.sin(Date.now() * orbitSpeed[i]) * orbitRing[i];
        planet[i].position.y = Math.cos(Date.now() * orbitSpeed[i]) * orbitRing[i];
    }
  
    camera.fov = camCon.fov;
    camera.updateProjectionMatrix();
    
    mcc.updateDist();
    mcc.updateRot();
    
    renderer.render(scene, camera);
    requestAnimationFrame(draw);
}

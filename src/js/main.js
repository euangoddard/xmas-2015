var camera, scene, renderer, controls;
var objects = [];
var sphere = [];

init();
animate();

function init() {

    camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.z = 3000;

    scene = new THREE.Scene();

    for (var i=0; i<150; i++) {
        var element = document.createElement('div');
        element.classList.add('card');
        var pattern = Trianglify({
            width: 200, 
            height: 200
        });
        element.style.backgroundImage = 'url(' + pattern.png() + ')'
        element.textContent = i;
        var object = new THREE.CSS3DObject(element);
        object.position.x = Math.random() * 4000 - 2000;
        object.position.y = Math.random() * 4000 - 2000;
        object.position.z = Math.random() * 4000 - 2000;
        scene.add(object);
        objects.push(object);
    }

    // sphere

    var vector = new THREE.Vector3();

    for (var i=0, l=objects.length; i < l; i++) {

        var phi = Math.acos( -1 + ( 2 * i ) / l );
        var theta = Math.sqrt( l * Math.PI ) * phi;

        var object = new THREE.Object3D();

        object.position.x = 1000 * Math.cos( theta ) * Math.sin( phi );
        object.position.y = 1000 * Math.sin( theta ) * Math.sin( phi );
        object.position.z = 1000 * Math.cos( phi );

        vector.copy(object.position).multiplyScalar(2);
        object.lookAt(vector);
        sphere.push(object);

    }

    // cube
    var cube = [];
    var faces = [
        {fixed: 'z', a: 'x', b: 'y'},
        {fixed: 'x', a: 'y', b: 'z'},
        {fixed: 'y', a: 'x', b: 'z'}
    ];
    for (var i=0; i < faces.length; i++) {
        var face = faces[i];
        for (var j=-2; j < 3; j++) {
            for (var k=-2; k < 3; k++) {
                var object_plus = new THREE.Object3D();
                object_plus.position[face.fixed] = 500;
                object_plus.position[face.a] = 200 * j;
                object_plus.position[face.b] = 200 * k;

                var object_minus = new THREE.Object3D();
                object_minus.position[face.fixed] = -500;
                object_minus.position[face.a] = 200 * j;
                object_minus.position[face.b] = 200 * k;
                
                vector.copy(object_minus.position).multiplyScalar(2);
                object_plus.lookAt(vector);
                cube.push(object_plus);
                vector.copy(object_plus.position).multiplyScalar(2);
                object_minus.lookAt(vector);
                cube.push(object_minus);
            }
        }
    }



    renderer = new THREE.CSS3DRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.style.position = 'absolute';
    document.getElementById('container').appendChild(renderer.domElement);

    //

    controls = new THREE.TrackballControls(camera, renderer.domElement);
    controls.rotateSpeed = 0.5;
    controls.minDistance = 500;
    controls.maxDistance = 6000;
    controls.addEventListener('change', render);

    document.addEventListener('dblclick', function (event) {
        transform(cube, 2000);
    }, false);

    //

    window.addEventListener('resize', onWindowResize, false);

}

function transform( targets, duration ) {

    TWEEN.removeAll();

    for (var i=0; i < objects.length; i ++) {

        var object = objects[ i ];
        var target = targets[ i ];

        new TWEEN.Tween( object.position )
            .to( { x: target.position.x, y: target.position.y, z: target.position.z }, Math.random() * duration + duration )
            .easing( TWEEN.Easing.Exponential.InOut )
            .start();

        new TWEEN.Tween( object.rotation )
            .to( { x: target.rotation.x, y: target.rotation.y, z: target.rotation.z }, Math.random() * duration + duration )
            .easing( TWEEN.Easing.Exponential.InOut )
            .start();

    }

    new TWEEN.Tween( this )
        .to({}, duration * 2)
        .onUpdate(render)
        .start();

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

    render();

}

function animate() {
    requestAnimationFrame( animate );
    TWEEN.update();
    controls.update();

}

function render() {
    renderer.render(scene, camera);
}

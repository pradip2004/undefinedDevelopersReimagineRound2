
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as dat from 'dat.gui';

const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// Add OrbitControls for better camera interaction
const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

camera.position.set(0, 0, 5)

// Add ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 2); // Soft white light
scene.add(ambientLight);
//add directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 10);
directionalLight.position.set(5, 5, 1)
scene.add(directionalLight);
directionalLight.castShadow = true;

const dLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5);
// scene.add(dLightHelper)

// Load the model
const loader = new GLTFLoader();
// const watchURL = new URL('./assets/models/apple_watch_series_7_-_free_watch-face_sdctm.glb', import.meta.url);
const watchURL = new URL('./assets/models/try.glb', import.meta.url);

loader.load(watchURL.href, function (gltf) {
    const model = gltf.scene;
    scene.add(model);

    model.scale.set(4, 4, 4);
    model.position.set(0, -4, 0);
    model.rotation.set(-0.7, 0, 0);

    let t1 = gsap.timeline({
        onComplete: () => {
            // Enable mouse move interaction after animation completes
            document.addEventListener('mousemove', onMouseMove);
        }
    });
    t1.to(model.position, { duration: 2, x: 2.5, y: -0.5, z: 0.8, ease: 'power2.inOut' }, "a");
    t1.to(model.rotation, { duration: 2, x: 0, y: -0.7, z: 0, ease: 'power2.inOut' }, "a");
    t1.to(model.scale, { duration: 2, x: 2.5, y: 2.5, z: 2.5, ease: 'power2.inOut' }, "a");

    t1.to(model.position, { duration: 2, x: 0.5, y: 0, z: 0, ease: 'power2.inOut' }, "b");
    t1.to(model.rotation, { duration: 2, x: 0, y: 0, z: 0, ease: 'power2.inOut' }, "b");
    t1.to(model.scale, { duration: 2, x: 1, y: 1, z: 1, ease: 'power2.inOut' }, "b");

    //title animation
    t1.from(".hero-section > h1 > span", {
        y: 100,
        opacity: 0,
        duration: 2,
        stagger: 0.2
    }, "b")
    gsap.registerPlugin(ScrollTrigger);
    let t2 = gsap.timeline({
        scrollTrigger: {
            trigger: ".hero-section",
            scroller: ".main",
            start: "2% top",
            end: "60% top",
            // markers: true,
            scrub: true
        }
    });
    t2.to(model.rotation, {
        x: 2 * Math.PI,
        y: 2 * Math.PI,
    }, "a");
    t2.to(model.position, {
        x: 15,
        y: -5
    }, "a");
    //hide canvas in product section
    gsap.to(renderer.domElement, {
        opacity: 0,
        duration: 1,
        scrollTrigger: {
            trigger: ".product-section",
            scroller: ".main",
            start: "top center",
            end: "top center",
            scrub: true,
            onEnter: () => {
                renderer.domElement.style.display = "none"; // Hide the canvas
            },
            onLeaveBack: () => {
                renderer.domElement.style.display = "block"; // Show the canvas when scrolling back
                gsap.to(renderer.domElement, { opacity: 1, duration: 1 }); // Animate opacity back to 1
            },
            markers: false
        }
    });

    gsap.to({}, {
        duration: 10,
        repeat: -1,
        onUpdate: function () {
            const time = performance.now() * 0.0005;
            const radius = 10; // Adjust this value for the desired orbit radius
            directionalLight.position.x = model.position.x + Math.sin(time) * 10;
            directionalLight.position.z = model.position.z + Math.cos(time) * 10;
            directionalLight.position.y = model.position.y + 5; // Adjust height as needed
        }
    });

    document.addEventListener('mousemove', onMouseMove);

    function onMouseMove(event) {
        const mouseX = event.clientX / window.innerWidth * 2 - 1;
        const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

        const rotationScale = 0.5; // Adjust the scale of rotation

        // Rotate the model based on mouse movement
        model.rotation.x = mouseY * rotationScale;
        model.rotation.y = mouseX * rotationScale;
    }


}, undefined, (err) => {
    console.error('Error loading model:', err);
});

// Basic render loop
function animate(time) {

    renderer.render(scene, camera);
}


renderer.setAnimationLoop(animate);


window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight);
})


window.addEventListener('beforeunload', () => {
    document.removeEventListener('mousemove', onMouseMove);
});




// add svg to navbar logo
const svgLogoColor = "#FFFFFF"
const svg = ` <svg id="Group_11948" data-name="Group 11948" xmlns="http://www.w3.org/2000/svg" width="124" height="22" viewBox="0 0 124 22">
                                    <g id="Layer_x0020_1" transform="translate(35.939)">
                                      <path id="Path_4372" data-name="Path 4372" d="M192.95-.01h0V1.676h-6.783V20.345h-3.525V1.676h-6.8V-.01H192.95Zm53.948,0h1.928L262.2,14.521V-.01h1.7V20.344h-.794L248.6,4.215v16.2l-1.7.039V-.01ZM228.662,12.467H236.1l-3.6-7.9ZM233.71-.01h0l9.7,20.436h-3.518l-3.148-6.669h-8.685L224.8,20.426h-1.869L232.853-.01h.856Zm-10.425,0H206.178V1.676h6.8V20.345H216.5V1.676h6.783V-.01ZM197.8-.01h3.525V20.345H197.8Z" transform="translate(-175.843 0.01)" fill="${svgLogoColor}" fill-rule="evenodd"/>
                                    </g>
                                    <path id="Path_4372-2" data-name="Path 4372" d="M21.455,7.37c1.9,4.492-.858,11.057-5.3,12.625V2.924h7.05L25.071-.01H13.127l0,20.486V21.99c6.188-.393,11.855-5.327,11.855-11.58a11.938,11.938,0,0,0-.4-3.04H21.455ZM11.928-.01H-.01L1.848,2.924H8.9v17.07C4.5,18.442,1.631,11.771,3.614,7.37H.467a11.946,11.946,0,0,0-.4,3.04c0,6.253,5.667,11.187,11.855,11.58V20.476l0-20.486Z" transform="translate(0.01 0.01)" fill="${svgLogoColor}" fill-rule="evenodd"/>
                                  </svg>`
document.querySelector(".navbar-top-logo").innerHTML = svg;


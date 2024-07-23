
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import VanillaTilt from 'vanilla-tilt';
import * as dat from 'dat.gui';
import { Draggable } from 'gsap/all';
import InertiaPlugin from 'gsap/all';
import watch1 from "./assets/models/try.glb"
import watch2 from "./assets/models/type3.glb"
import watch3 from "./assets/models/type2.glb"



const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);


const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

camera.position.set(0, 0, 5)


const ambientLight = new THREE.AmbientLight(0xffffff, 2);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 10);
directionalLight.position.set(5, 5, 1)
scene.add(directionalLight);
directionalLight.castShadow = true;

const dLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5);
// scene.add(dLightHelper)


const loader = new GLTFLoader();

//!!important change this url
const watchURL = new URL('./assets/models/try.glb', import.meta.url);
let heroTimeline = gsap.timeline({
    paused: true,
    onComplete: () => {
        document.addEventListener('mousemove', onMouseMove);
    }
});
loader.load(watchURL.href, function (gltf) {
    const model = gltf.scene;
    scene.add(model);

    model.scale.set(4, 4, 4);
    model.position.set(0, -4, 0);
    model.rotation.set(-0.7, 0, 0);

    // let heroTimeline = gsap.timeline({
    //     paused: true ,
    //     onComplete: () => {
    //         // Enable mouse move interaction after animation completes
    //         document.addEventListener('mousemove', onMouseMove);
    //     }
    // });
    heroTimeline.to(model.position, { duration: 2, x: 2.5, y: -0.5, z: 0.8, ease: 'power2.inOut' }, "a");
    heroTimeline.to(model.rotation, { duration: 2, x: 0, y: -0.7, z: 0, ease: 'power2.inOut' }, "a");
    heroTimeline.to(model.scale, { duration: 2, x: 2.5, y: 2.5, z: 2.5, ease: 'power2.inOut' }, "a");


    function setModelScaleAnimation(model) {
        const targetScale = window.innerWidth < 764 ? 0.5 : 1;
        heroTimeline.to(model.position, { duration: 2, x: window.innerWidth < 764 ? 0 : 0.5, y: 0, z: 0, ease: 'power2.inOut' }, "b");
        heroTimeline.to(model.rotation, { duration: 2, x: 0, y: 0, z: 0, ease: 'power2.inOut' }, "b");
        heroTimeline.to(model.scale, { duration: 2, x: targetScale, y: targetScale, z: targetScale, ease: 'power2.inOut' }, "b");

    }
    setModelScaleAnimation(model)
    // heroTimeline.to(model.scale, { duration: 2, x: targetScale, y: targetScale, z: targetScale, ease: 'power2.inOut' }, "b");

    //title animation
    heroTimeline.from(".hero-section > h1 > span", {
        y: 100,
        opacity: 0,
        duration: 2,
        stagger: 0.2
    }, "b")
    //overlay animation
    heroTimeline.from(".hero-section-overlay-1", {
        y: 100,
        opacity: 0,
        duration: 1.2,
        ease: "expo.in"
    }, "<0.5")
    heroTimeline.from(".hero-section-overlay-2", {
        y: -100,
        opacity: 0,
        duration: 1.2,
        ease: "expo.in"
    }, "<0.8")
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
    setModelScaleAnimation(model)
    renderer.setSize(window.innerWidth, window.innerHeight);
})


window.addEventListener('beforeunload', () => {
    document.removeEventListener('mousemove', onMouseMove);
});




// add svg to navbar logo
const getSvgLogo = (color) => {
    return ` <svg id="Group_11948" data-name="Group 11948" xmlns="http://www.w3.org/2000/svg" width="124" height="22" viewBox="0 0 124 22">
                                    <g id="Layer_x0020_1" transform="translate(35.939)">
                                      <path id="Path_4372" data-name="Path 4372" d="M192.95-.01h0V1.676h-6.783V20.345h-3.525V1.676h-6.8V-.01H192.95Zm53.948,0h1.928L262.2,14.521V-.01h1.7V20.344h-.794L248.6,4.215v16.2l-1.7.039V-.01ZM228.662,12.467H236.1l-3.6-7.9ZM233.71-.01h0l9.7,20.436h-3.518l-3.148-6.669h-8.685L224.8,20.426h-1.869L232.853-.01h.856Zm-10.425,0H206.178V1.676h6.8V20.345H216.5V1.676h6.783V-.01ZM197.8-.01h3.525V20.345H197.8Z" transform="translate(-175.843 0.01)" fill="${color}" fill-rule="evenodd"/>
                                    </g>
                                    <path id="Path_4372-2" data-name="Path 4372" d="M21.455,7.37c1.9,4.492-.858,11.057-5.3,12.625V2.924h7.05L25.071-.01H13.127l0,20.486V21.99c6.188-.393,11.855-5.327,11.855-11.58a11.938,11.938,0,0,0-.4-3.04H21.455ZM11.928-.01H-.01L1.848,2.924H8.9v17.07C4.5,18.442,1.631,11.771,3.614,7.37H.467a11.946,11.946,0,0,0-.4,3.04c0,6.253,5.667,11.187,11.855,11.58V20.476l0-20.486Z" transform="translate(0.01 0.01)" fill="${color}" fill-rule="evenodd"/>
                                  </svg>`
}

function updateSvgColor(color) {
    document.querySelector('.navbar-top-logo').innerHTML = getSvgLogo(color);
}

// Initial SVG render
updateSvgColor("#FFFFFF");

// Menu animation
function menuOpenBtn() {
    let isOpen = false;

    document.querySelector('.menu-btn').addEventListener('click', function () {
        const clipDiv = document.querySelector('.extented-menu');
        const openClipPath = 'polygon(0 0, 100% 0, 100% 50%, 100% 100%, 0 100%, 0 50%)';
        const closedClipPath = 'polygon(100% 100%, 100% 0, 100% 0, 100% 100%, 0 100%, 0 100%)';

        if (isOpen) {
            gsap.to(".toggle-menu-name", {
                duration: 0.1,
                ease: "power2.out",
                onStart: () => {
                    document.querySelector(".toggle-menu-name").classList.remove("-translate-y-6")
                },
                delay: 1
            })
            let t1 = gsap.timeline();
            t1.to(clipDiv, {
                ease: "expo.inOut",
                clipPath: closedClipPath,
                duration: 1
            });
            t1.to(".navbar-upper-section", {
                onStart: () => {
                    document.querySelector('.navbar-upper-section').classList.remove('bg-[#f8eddb]');
                    document.querySelectorAll('.icon').forEach(icon => {
                        icon.classList.remove('text-black');
                    });
                    updateSvgColor("#FFFFFF");
                    document.querySelector(".menu-btn").classList.add("text-black");
                    document.querySelector(".menu-btn").classList.remove("bg-black");
                    // document.querySelector(".menu-btn > div > div").classList.add("-translate-y-6")
                },
                duration: 1,
                ease: "power2.out"
            }, ">-0.1")

        } else {
            gsap.to(".toggle-menu-name", {
                duration: 0.1,
                ease: "power2.out",
                onStart: () => {
                    document.querySelector(".menu-btn > div > div").classList.add("-translate-y-6")
                },
                delay: 1
            })
            let t1 = gsap.timeline();
            t1.to(clipDiv, {
                ease: "expo.inOut",
                clipPath: openClipPath,
                duration: 1
            });

            t1.to(".navbar-upper-section", {
                onStart: () => {
                    document.querySelector('.navbar-upper-section').classList.add('bg-[#f8eddb]');
                    document.querySelectorAll('.icon').forEach(icon => {
                        icon.classList.add('text-black');
                    });
                    updateSvgColor("#000000");
                    document.querySelector(".menu-btn").classList.add("bg-black", "text-white");
                    document.querySelector(".menu-btn").classList.remove("text-black");
                },
                duration: 1,
                ease: "power2.out"
            }, ">-0.1")
        }

        isOpen = !isOpen;
    });
}

menuOpenBtn()

// product tilt effect 
function productSection() {
    VanillaTilt.init(document.querySelectorAll(".product-card"), {
        max: 25,
        speed: 400
    });
    gsap.registerPlugin(ScrollTrigger)
    // product title animation 
    let productTimeline = gsap.timeline({
        scrollTrigger: {
            trigger: ".product-section",
            scroller: ".main",
            start: "top 70%",
            end: "top 30%",
            scrub: true,
            markers: false,

        }
    })
    productTimeline.from(".product-heading > span", {
        y: 100,
        opacity: 0,
        duration: 1,
        ease: "ease.in",
        stagger: 0.2,

    })
}

productSection();

//new arrival section background change
function newArrivalSection() {
    const bgColors = [
        "#faba4a",
        "#0D1317",
        "#E7B592",
        "#754488"
    ]

    const bgColorElement = document.querySelector(".new-arrival-background");
    gsap.registerPlugin(ScrollTrigger);
    gsap.utils.toArray(".item").forEach((item, index) => {
        let img = item.querySelector(".item-img img");

        gsap.fromTo(img, {
            scale: 1.25
        }, {
            scale: 1,
            duration: 0.5,
            ease: "power1.out",
            scrollTrigger: {
                trigger: item,
                scroller: ".main",
                markers: false,
                start: "center bottom",
                end: "bottom top",
                scrub: true,
                onEnter: () => updateArrivalBg(bgColors[index]),
                onEnterBack: () => updateArrivalBg(bgColors[index]),
            }
        })
    })

    function updateArrivalBg(color) {
        gsap.to(bgColorElement, {
            background: `linear-gradient(0deg, ${color} 0%, rgba(252, 176, 69, 0) 100%)`,
            duration: 1,
            ease: "power1.out"
        })
    }



    //marquee for new arrival section


    let tween = gsap.to(".marquee-part", {
        xPercent: -100,
        repeat: -1,
        duration: 5,
        ease: "linear",
    }).totalProgress(0.5);

    gsap.set(".marquee-inner", { xPercent: -50 })
}

newArrivalSection();


//brand animation
function brandSection() {
    gsap.registerPlugin(Draggable, InertiaPlugin);
    function animateElement(el) {
        gsap.to(el, {
            y: "+=20",  // move up 20px
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
    }
    let randomColors = [
        "#dbfe87",
        "#ffe381",
        "#ed254e",
        "#d4f5f5",
        "#aafcb8",
        "#e16f7c",
        "#ddf8e8",
        "#fff07c",
        "#fe938c",
        "#f4442e",
        "#04e762",
        "#f5b700",
        "#004346",
        "#75dddd",
        "#f5b0cb",
        "#d05353",
        "#b10f2e",
        "#73fbd3",
    ]

    gsap.utils.toArray(".brand").forEach((el) => {
        animateElement(el);
        el.addEventListener("mouseover", () => {
            const randomIndex = Math.floor(Math.random() * randomColors.length);
            const randomColor = randomColors[randomIndex];
            el.style.borderColor = randomColor;
            el.setAttribute("data-currentColor", randomColor);
        });
        el.addEventListener("click", () => {

        })
        el.addEventListener("mouseout", () => {
            el.style.borderColor = "white";
        });

        el.addEventListener("click", () => {
            const currentColor = el.getAttribute("data-currentColor");
            if (currentColor) {
                el.style.backgroundColor = currentColor;
                setTimeout(() => {
                    // el.style.backgroundColor = "transparent";
                    gsap.to(el, {
                        backgroundColor: "transparent",
                        duration: 1,
                        ease: "power1.out",
                        onComplete: () => animateElement(el)
                    })
                }, 2000);
            }
        });
        Draggable.create(el, {
            bounds: ".brands",
            inertia: true,
            onDragEnd: () => animateElement(el)
        });
    });

    // brand section background change 

    gsap.to(".new-arrival-background", {
        background: '#3b3b3b',
        duration: 1.5,
        ease: "ease.in",
        scrollTrigger: {
            trigger: ".brands-section",
            scroller: ".main",
            markers: false,
            start: "top 50%",
            end: "bottom 50%",
            scrub: true,
        }
    })

}

brandSection();



//2d canvas animation

function canvas2() {
    const canvas = document.querySelector("#movement-section-canvas>canvas");
    const context = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;


    window.addEventListener("resize", function () {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        render();
    });

    function files(index) {
        var data = `
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_000.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_001.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_002.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_003.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_004.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_005.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_006.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_007.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_008.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_009.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_010.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_011.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_012.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_013.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_014.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_015.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_016.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_017.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_018.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_019.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_020.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_021.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_022.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_023.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_024.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_025.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_026.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_027.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_028.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_029.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_030.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_031.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_032.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_033.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_034.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_035.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_036.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_037.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_038.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_039.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_040.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_041.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_042.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_043.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_044.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_045.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_046.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_047.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_048.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_049.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_050.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_051.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_052.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_053.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_054.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_055.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_056.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_057.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_058.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_059.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_060.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_061.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_062.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_063.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_064.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_065.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_066.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_067.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_068.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_069.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_070.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_071.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_072.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_073.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_074.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_075.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_076.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_077.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_078.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_079.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_080.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_081.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_082.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_083.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_084.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_085.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_086.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_087.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_088.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_089.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_090.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_091.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_092.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_093.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_094.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_095.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_096.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_097.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_098.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_099.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_100.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_101.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_102.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_103.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_104.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_105.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_106.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_107.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_108.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_109.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_110.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_111.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_112.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_113.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_114.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_115.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_116.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_117.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_118.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_119.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_120.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_121.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_122.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_123.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_124.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_125.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_126.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_127.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_128.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_129.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_130.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_131.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_132.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_133.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_134.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_135.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_136.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_137.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_138.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_139.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_140.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_141.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_142.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_143.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_144.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_145.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_146.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_147.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_148.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_149.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_150.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_151.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_152.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_153.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_154.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_155.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_156.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_157.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_158.jpg
https://pradip2004.github.io/magmaClone/assets/img/frames/titan-watch_159.jpg
  `;
        return data.split("\n")[index];
    }

    const frameCount = 160;

    const images = [];
    const imageSeq = {
        frame: 1,
    };

    for (let i = 0; i < frameCount; i++) {
        const img = new Image();
        img.src = files(i);
        images.push(img);
    }

    gsap.to(imageSeq, {
        frame: frameCount - 1,
        snap: "frame",
        ease: `ease.in`,
        // ease: `none`,
        scrollTrigger: {
            scrub: .5,
            trigger: `.movement-section`,
            start: `top top`,
            end: `250% top`,
            scroller: ".main",
        },
        onUpdate: render,
    });

    images[1].onload = render;

    function render() {
        scaleImage(images[imageSeq.frame], context);
    }

    function scaleImage(img, ctx) {
        var canvas = ctx.canvas;
        var hRatio = canvas.width / img.width;
        var vRatio = canvas.height / img.height;
        var ratio = Math.max(hRatio, vRatio);
        var centerShift_x = (canvas.width - img.width * ratio) / 2;
        var centerShift_y = (canvas.height - img.height * ratio) / 2;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(
            img,
            0,
            0,
            img.width,
            img.height,
            centerShift_x,
            centerShift_y,
            img.width * ratio,
            img.height * ratio
        );
    }
    ScrollTrigger.create({

        trigger: ".movement-section",
        pin: true,
        scroller: ".main",
        start: `top top`,
        end: `250% top`,

    });
}
canvas2()


//movement setion text and background change

gsap.fromTo(".movement-text-title", {
    scale: 0
}, {
    scale: 1,
    ease: "power3.inOut",
    scrollTrigger: {
        trigger: ".movement-section",
        markers: false,
        start: "top top",
        end: "bottom top",
        scroller: ".main",
        scrub: true
    }
})


//movement section canvas change

function modelCanvas() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById('canvas2'),
        alpha: true
    });

    // renderer.setSize(window.innerWidth / 2, window.innerHeight);
    // document.body.appendChild(renderer.domElement);
    setRendererSize();

    const loader = new GLTFLoader();
    let models = [];
    let centralPoint = new THREE.Object3D();
    scene.add(centralPoint);
    // centralPoint.position.set(2, -10, 0);
    setCentralPointPosition();
    centralPoint.rotateZ(Math.PI / 2)

    const modelData = [
        { url: watch1, scale: 1.3, rotateZ: (Math.PI / 2) },
        { url: watch2, scale: 45, rotateZ: (Math.PI / 4) },
        { url: watch3, scale: 5, rotateZ: (Math.PI / 2) }
    ];

    function loadModels() {
        const radius = 10;
        const angleIncrement = 120 * (Math.PI / 180);

        modelData.forEach((data, index) => {
            loader.load(data.url, (gltf) => {
                let model = gltf.scene;
                model.scale.set(data.scale, data.scale, data.scale);
                const angle = index * angleIncrement;
                const x = radius * Math.cos(angle);
                const y = radius * Math.sin(angle);
                model.position.set(x, y, 0);
                model.rotation.z = data.rotateZ;
                centralPoint.add(model);
                animateModel(model);
                models.push({ model, index });
            }, undefined, (err) => {
                console.error('Error loading model:', err);
            });
        });
    }

    function animateModel(model) {
        gsap.timeline({ repeat: -1, yoyo: true })
            .to(model.rotation, { x: -Math.PI / 8, duration: 3, ease: "power1.inOut" })
            // .to(model.rotation, { y: 0, duration: 2, ease: "power1.inOut" })
            .to(model.rotation, { x: Math.PI / 8, duration: 3, ease: "power1.inOut" })
            .to(model.rotation, { x: -Math.PI / 8, duration: 3, ease: "power1.inOut" })
    }
    loadModels();

    const ambientLight = new THREE.AmbientLight(0xffffff, 7);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
    directionalLight.position.set(5, 5, -3)
    scene.add(directionalLight);

    camera.position.z = 5;

    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }

    animate();

    gsap.to("#canvas2", {
        scrollTrigger: {
            trigger: ".movement-type-section",
            start: "top 35%",
            end: "bottom 65%",
            markers: false,
            scroller: ".main",
            toggleActions: "play none none reverse",
            onEnter: () => gsap.to("#canvas2", { opacity: 1 }),
            onLeave: () => gsap.to("#canvas2", { opacity: 0 }),
            onEnterBack: () => gsap.to("#canvas2", { opacity: 1 }),
            onLeaveBack: () => gsap.to("#canvas2", { opacity: 0 }),
        }
    });

    let activeIndex = 0;

    function rotateCentralPoint(newIndex) {
        const angle = (newIndex - activeIndex) * 120;
        gsap.to(centralPoint.rotation, {
            z: centralPoint.rotation.z + THREE.MathUtils.degToRad(angle),
            duration: 1,
            ease: "power2.inOut"
        });
        activeIndex = newIndex;
    }

    document.querySelectorAll('.product-circle').forEach((circle) => {
        circle.addEventListener('click', (event) => {
            const newIndex = parseInt(event.target.getAttribute('data-index'));
            if (newIndex !== activeIndex) {
                document.querySelector('.active-circle').classList.remove('active-circle');
                event.target.classList.add('active-circle');
                rotateCentralPoint(newIndex);
            }
        });
    });

    function setCentralPointPosition() {
        const width = window.innerWidth;
        if (width > 1280) {
            centralPoint.position.set(2, -10, 0);
        } else if (width > 1024) {
            centralPoint.position.set(1, -10, 0);
        } else if (width > 768) {
            centralPoint.position.set(0, -11, 0);
        }
        else {
            centralPoint.position.set(0, -10, 0);
        }
    }

    function setRendererSize() {
        const width = window.innerWidth < 768 ? window.innerWidth : window.innerWidth / 2;
        const height = window.innerHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    }

    // window.addEventListener('resize', () => {
    //     const width = window.innerWidth / 2;
    //     const height = window.innerHeight;
    //     renderer.setSize(width, height);
    //     camera.aspect = width / height;
    //     setCentralPointPosition();
    //     camera.updateProjectionMatrix();
    // });
    window.addEventListener('resize', () => {
        setRendererSize();
        setCentralPointPosition();
    });

    setRendererSize();
    setCentralPointPosition();
}

function onClickMovementSetionBgChange() {
    let movementData = [
        {
            title: "mechanical",
            desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellat, hic?"
        }, {
            title: "chornograph",
            desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellat, hic?"
        },
        {
            title: "smart",
            desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellat, hic?"
        }
    ]
    document.querySelectorAll('.product-circle').forEach((circle, index) => {
        circle.addEventListener('click', function () {
            const newColor = this.getAttribute('data-color');
            const dataIndex = index;
            const { title, desc } = movementData[dataIndex];

            gsap.to('.innerCircle', {
                duration: 2,
                rotation: '+=360',
                backgroundColor: newColor
            });

            const descriptionDiv = document.querySelector('.movement-type-description');
            gsap.to(descriptionDiv, {
                duration: 0.5,
                width: 0,
                onComplete: function () {
                    descriptionDiv.querySelector('.movement-type-title').textContent = title;
                    descriptionDiv.querySelector('.movement-type-desc').textContent = desc;
                    gsap.to(descriptionDiv, { duration: 0.5, width: window.innerWidth > 768 ? '40%' : "100%" });
                }
            });

            // const bgDiv = document.querySelector('.movement-type-section');
            // const before = bgDiv.querySelector('::before');

            // bgDiv.style.setProperty('--before-bg-color', newColor);
            // bgDiv.style.setProperty('--before-right', '0'); // Move to the left

            // setTimeout(() => {
            //     bgDiv.style.backgroundColor = newColor; // Update the final background color
            //     bgDiv.style.setProperty('--before-right', '100%'); // Reset for next transition
            // }, 1000);

        });
    });
}


onClickMovementSetionBgChange();
modelCanvas();





//automatic run
/*
const circles = document.querySelectorAll('.product-circle');
        let currentIndex = 0;
        let autoClickInterval;
        function handleClick(index) {
            automaticRunMovementSection();
            currentIndex = index;
            clearTimeout(autoClickInterval);
            startAutoClick();
        }
        function startAutoClick() {
            autoClickInterval = setInterval(() => {
                currentIndex++;
                if (currentIndex >= circles.length) {
                    currentIndex = 0;
                }
                circles[currentIndex].click();
            }, 10000); // Adjust the interval time as needed
        }

        circles.forEach((circle, index) => {
            circle.addEventListener('click', () => handleClick(index));
        });

        // Start automatic cycling when the page loads
        startAutoClick();
*/


// type of products
function typeOfProductsSection() {
    let typeProductData = [{
        name: "men",
        imgUrl: "https://www.titan.co.in/on/demandware.static/-/Library-Sites-TitanSharedLibrary/default/dw3b1db283/images/Category%20Images/Men.jpg"
    }, {
        name: "women",
        imgUrl: "https://www.titan.co.in/on/demandware.static/-/Library-Sites-TitanSharedLibrary/default/dw4a2a191a/images/header/titan_raga_h.jpg"
    }, {
        name: "smart watch",
        imgUrl: "https://www.titan.co.in/on/demandware.static/-/Library-Sites-TitanSharedLibrary/default/dw869c9036/images/titantraveller_thumbnail.jpg"
    }, {
        name: "premium",
        imgUrl: "https://www.titan.co.in/on/demandware.static/-/Library-Sites-TitanSharedLibrary/default/dw23da7056/images/Category%20Images/TItan-Edge.jpg"
    }, {
        name: "watches",
        imgUrl: "https://www.titan.co.in/on/demandware.static/-/Library-Sites-TitanSharedLibrary/default/dwcb076392/images/Category%20Images/Watches_mega.jpg"
    }]

    typeProductData.forEach((type) => {
        document.querySelector(".product-type-right").innerHTML += `<div class="product-type-title w-full flex justify-center relative">
                                  <h1 class="text-5xl sm:text-7xl lg:text-8xl text-black uppercase opacity-50 w-full text-center border-t-2 border-black">${type.name}</h1>
                                  <div class="product-type-img opacity-0 w-36 h-44 bg-rose-400 absolute left-[0%] lg:-left-[25%] xl:-left-[30%]">
                                    <img class="w-full h-full object-cover" src="${type.imgUrl}" alt="${type.name}">
                                  </div>
                            </div>`
    })

    //product type section background change

    gsap.to(".new-arrival-background", {
        scrollTrigger: {
            trigger: ".product-type-section",
            start: "top 35%",
            end: "top 0%",
            markers: false,
            scroller: ".main",
            // onEnter: () => document.querySelector('.main').setAttribute('theme', 'white'),
            // onLeave: () => {
            //     document.querySelector('.main').removeAttribute('theme')
            // },
            // onEnterBack: () => document.querySelector('.main').setAttribute('theme', 'white'),
            // onLeaveBack: () => {
            //     document.querySelector('.main').removeAttribute('theme')
            // },
            scrub: true
        },
        background: "#ffffff",
        duration: 1,
        ease: "ease.in"
    });

    //product type section hover animation

    document.querySelectorAll(".product-type-title")
        .forEach(function (member) {

            member.addEventListener('mousemove', function (e) {
                const img = this.querySelector(".product-type-img");
                const windowWidth = window.innerWidth;
                const centerX = windowWidth / 2;
                const offsetX = e.clientX - centerX;
                const rotationDegree = gsap.utils.mapRange(-centerX, centerX, -15, 15, offsetX); // Adjust rotation range as needed

                gsap.to(img, {
                    opacity: 1,
                    x: gsap.utils.mapRange(0, windowWidth, -200, 200, e.clientX),
                    rotation: rotationDegree,
                    ease: "power4.out",
                    duration: 0.5
                });
            });

            member.addEventListener('mouseleave', function () {
                const img = this.querySelector(".product-type-img");
                gsap.to(img, {
                    opacity: 0,
                    ease: "power4.out",
                    duration: 0.5
                });
            });
        });

}

typeOfProductsSection();

//collection section
function collectionSection() {
    const collectionSectionAnimation = () => {
        gsap.to(".slide", {
            scrollTrigger: {
                trigger: ".partner-section-container",
                start: "top top",
                end: "bottom bottom",
                scroller: ".main",
                markers: false,
                scrub: 2
            },
            xPercent: -300,
            ease: "power3.inOut"
        })
    }

    collectionSectionAnimation()

    document.querySelector('.login-details-btn').addEventListener('mouseover', () => {
        gsap.to(".login-overlay", {
            background: "transparent",
            duration: 1,
            ease: "expo.easeInOut"
        })
    })

    document.querySelector('.login-details-btn').addEventListener('mouseleave', () => {
        gsap.to(".login-overlay", {
            background: "#ffffff",
            duration: 1,
            ease: "expo.easeInOut"
        })
    })

}

collectionSection();


//footer section
function footerSection() {
    let footerTimeline = gsap.timeline({
        scrollTrigger: {
            trigger: ".footer-section",
            scroller: ".main",
            start: "top 80%",
            end: "top 30%",
            scrub: true,
            markers: false,

        }
    })
    footerTimeline.from(".footer-heading > span", {
        y: 100,
        opacity: 0,
        duration: 1,
        ease: "power3.inOut",
        stagger: 0.2,

    })

    footerTimeline.from(".footer-section > img", {
        y: 500,
        opacity: 0,
        duration: 1.5,
        ease: "ease.in",
        stagger: 0.2,
    })

}

footerSection();


//real time shown in hero section
function updateTime() {
    const overlayDetails = document.getElementById('showTime');
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    overlayDetails.textContent = `${hours}:${minutes}:${seconds}`;
}

setInterval(updateTime, 1000);

updateTime();

// small interaction 
function applyMagneticEffect(element, power) {
    element.addEventListener("mousemove", (event) => {
        let x = event.offsetX;
        let y = event.offsetY;
        let itemWidth = element.clientWidth;
        let itemHeight = element.clientHeight;
        let moveX = (x - itemWidth / 2) * power;
        let moveY = (y - itemHeight / 2) * power;
        gsap.to(element, { x: moveX, y: moveY, duration: 0.3 });
    });
    element.addEventListener("mouseleave", () => {
        gsap.to(element, { x: 0, y: 0, duration: 0.3 });
    });
}

document.querySelectorAll('.menu-item h1').forEach((el) => applyMagneticEffect(el, 0.1));
document.querySelectorAll('.icon').forEach((el) => applyMagneticEffect(el, 0.5));

// navbar hover animation 
document.querySelectorAll('.menu-wrapper').forEach(wrapper => {
    let height = wrapper.offsetHeight;
    wrapper.addEventListener('mouseenter', () => {
        gsap.to(wrapper.querySelector('.menu-item'), { y: -height, duration: 0.5 });
    });

    wrapper.addEventListener('mouseleave', () => {
        gsap.to(wrapper.querySelector('.menu-item'), { y: 0, duration: 0.5 });
    });
});


//try loading page
function animateClock() {
    const duration = 5;
    let loadingTimeline =
        gsap.to("#percentage", {
            duration: duration,
            innerText: 100,
            ease: "power1.out",
            snap: { innerText: 1 },
            onUpdate: function () {
                const element = document.getElementById("percentage");
                element.innerText = Math.round(element.innerText) + '%';
            },
            onComplete: function () {

                gsap.to(".loading-screen", {
                    duration: 0.5,
                    clipPath: "circle(0% at 50% 50%)",
                    ease: "power4.in",
                    onComplete: function () {

                        heroTimeline.play();
                        // document.querySelector(".loading-screen").style.display = "none";
                    }
                });
            }
        });

    gsap.to(".minute-hand", {
        rotation: 360,
        duration: duration,
        ease: "power1.out",
        onComplete: function () {
            gsap.killTweensOf(".hour-hand");
        }
    });

    const textElement = document.querySelector("#shuffling-text");
    const originalText = textElement.innerText;
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    gsap.fromTo(textElement,
        { innerText: originalText },
        {
            duration: duration / 2,
            ease: "none",
            onUpdate: function () {
                let randomText = '';
                for (let i = 0; i < originalText.length; i++) {
                    randomText += characters[Math.floor(Math.random() * characters.length)];
                }
                textElement.innerText = randomText;
            },
            onComplete: function () {
                textElement.innerText = originalText;
            }
        }
    );

    /*
    const textElement = document.querySelector("#shuffling-text");
const originalText = textElement.innerText;
const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
// const duration = 5;
const timeline = gsap.timeline();

function shuffleCharacter(index) {
    const char = originalText[index];
    const randomText = characters[Math.floor(Math.random() * characters.length)];

    // Create a temporary span element to hold the random character
    const tempSpan = document.createElement("span");
    tempSpan.innerText = randomText;
    tempSpan.style.opacity = "1";

    // Replace the original character with the span element
    const currentText = textElement.innerText;
    const newText = currentText.slice(0, index) + randomText + currentText.slice(index + 1);
    textElement.innerHTML = newText;

    gsap.fromTo(tempSpan, 
        { innerText: randomText }, 
        {
            duration: (duration / originalText.length) / 2,
            ease: "none",
            onUpdate: function () {
                tempSpan.innerText = characters[Math.floor(Math.random() * characters.length)];
            },
            onComplete: function () {
                tempSpan.innerText = char;
                textElement.innerHTML = currentText.slice(0, index) + char + currentText.slice(index + 1);
            }
        }
    );
}

// Create a timeline to sequence the animations
originalText.split('').forEach((char, index) => {
    timeline.add(() => shuffleCharacter(index), index * (duration / originalText.length));
});

// Play the timeline
timeline.play();
*/
}
window.onload = function () {
    animateClock();
}


//modify navbar and nav icon accronding to background
gsap.to(".navbar-upper-section", {
    scrollTrigger: {
        trigger: ".movement-type-section",
        scroller: ".main",
        start: "top 90%",
        end: "bottom 90%",
        scrub: true,
        markers: false,
    },
    yPercent: -100,
    ease: "power3.inOut",
    onComplete: () => {
        gsap.to(".navbar-upper-section", {
            yPercent: 0,
            duration: 0.5,
            ease: "power3.inOut",
        })
    }
})
//todo:- change color of icon in all section and change menu button color 
gsap.registerPlugin(ScrollTrigger);

function changeColors() {
    gsap.to('.icon', {
        color: 'black', duration: 0.5, scrollTrigger: {
            trigger: '.product-type-section',
            scroller: ".main",
            start: 'top center',
            markers: false,
            scrub: true,
            onEnter: () => updateSvgColor("#000000"),
            onEnterBack: () => updateSvgColor("#000000"),
            onLeaveBack: () => updateSvgColor("#ffffff")
        },

    });
    gsap.to('.icon', {
        color: 'white', duration: 0.5, scrollTrigger: {
            trigger: '.footer-section',
            scroller: ".main",
            start: 'top center',
            end: '5% center',
            markers: false,
            scrub: true,
            onEnter: () => updateSvgColor("#ffffff"),
            onLeaveBack: () => {
                updateSvgColor("#000000")
            }

            // onLeave: ()=>updateSvgColor("#000000")
        },

    });

}

changeColors()


//todo:- cursor making 
function cursorAnimationPage1() {
    let cursorflow = document.querySelector(".cursor-flow");
    let cursorText = document.querySelector(".cursor-flow span")
    let page = document.querySelector(".main");
    let productSection = document.querySelector(".product-section")
    page.addEventListener("mousemove", (e) => {
        // page1_cursor.style.left = e.pageX + "px";
        // page1_cursor.style.top = e.pageY + "px";
        gsap.to(cursorflow, {
            top: (e.y + 10),
            left: (e.x + 10),
            duration: 0.5,
            opacity: 1,
        })
    })
    productSection.addEventListener("mouseenter", () => {
        gsap.to(cursorflow, {
            background: "transparent",
            duration: 0.1,
            width: "64px",
            height: "64px",
            ease: "power4.in"
        })
        cursorText.textContent = "hover";

    })
    productSection.addEventListener("mouseleave", () => {
        gsap.to(cursorflow, {
            background: "#f8eddb",
            duration: 0.1,
            width: "0",
            height: "0",
            ease: "power4.in"
        })
        cursorText.textContent = "";
    })

    document.querySelector(".menu-btn").addEventListener("mouseenter", () => {
        gsap.to(cursorflow, {
            background: "transparent",
            duration: 0.1,
            width: "64px",
            height: "64px",
            ease: "power4.in"
        })
        cursorText.textContent = "click";

    })

    document.querySelector(".menu-btn").addEventListener("mouseleave", () => {
        gsap.to(cursorflow, {
            background: "#f8eddb",
            duration: 0.1,
            width: "0",
            height: "0",
            ease: "power4.in"
        })
        cursorText.textContent = "";
    })

    
    document.querySelectorAll(".brand").forEach((el) => {
        el.addEventListener("mouseenter", () => {
            gsap.to(cursorflow, {
                background: "transparent",
                duration: 0.1,
                width: "64px",
                height: "64px",
                ease: "power4.in"
            })
            cursorText.textContent = "drag";

        })
    })

    document.querySelectorAll(".brand").forEach((el) => {
        el.addEventListener("mouseleave", () => {
            gsap.to(cursorflow, {
                background: "#f8eddb",
                duration: 0.1,
                width: "0",
                height: "0",
                ease: "power4.in"
            })
            cursorText.textContent = "";
        })
    })

    document.querySelectorAll(".inner-btn").forEach((el) => {
        el.addEventListener("mouseenter", () => {
            gsap.to(cursorflow, {
                background: "transparent",
                duration: 0.1,
                width: "64px",
                height: "64px",
                ease: "power4.in"
            })
            cursorText.textContent = "click";

        })
    })

    document.querySelectorAll(".inner-btn").forEach((el) => {
        el.addEventListener("mouseleave", () => {
            gsap.to(cursorflow, {
                background: "#f8eddb",
                duration: 0.1,
                width: "0",
                height: "0",
                ease: "power4.in"
            })
            cursorText.textContent = "";
        })
    })
}

cursorAnimationPage1()


// document.querySelector(".go-to-btn").addEventListener("click", function() {
//     window.scrollTo({
//         top: 0,
//         behavior: "smooth" 
//     });
// });
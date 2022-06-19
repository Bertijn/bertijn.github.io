import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import * as dat from "lil-gui";

// Cursor
const cursor = {
    x: 0,
    y: 0,
};

window.addEventListener("mousemove", (event) => {
    cursor.x = event.clientX / sizes.width - 0.5;
    cursor.y = -(event.clientY / sizes.height - 0.5);
});

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color("#18082b");

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const matcapTexture = textureLoader.load("textures/matcaps/5.png");

/**
 * Fonts
 */
const fontLoader = new FontLoader();
const fontGroup = new THREE.Group();
scene.add(fontGroup);

fontLoader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
    // Material
    const material = new THREE.MeshMatcapMaterial({ matcap: matcapTexture });

    // Text
    const textGeometry = new TextGeometry("Bertijn Pauwels", {
        font: font,
        size: 0.5,
        height: 0.2,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 5,
    });
    textGeometry.center();

    const workInProgressGeometry = new TextGeometry("WORK IN PROGRESS", {
        font: font,
        size: 0.6,
        height: 0.3,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 5,
    });
    workInProgressGeometry.center();

    const text = new THREE.Mesh(textGeometry, material);
    text.position.y = 0.5;
    const workInProgressText = new THREE.Mesh(workInProgressGeometry, material);
    workInProgressText.position.y = -1;

    fontGroup.add(text, workInProgressText);

    // Spheres
    const sphereGeometry = new THREE.SphereGeometry(0.1, 5, 5);

    for (let i = 0; i < 250; i++) {
        const sphere = new THREE.Mesh(sphereGeometry, material);
        sphere.position.x = (Math.random() - 0.5) * 20;
        sphere.position.y = (Math.random() - 0.5) * 20;
        sphere.position.z = (Math.random() - 0.5) * 20;
        const scale = Math.random() * 0.5;
        sphere.scale.set(scale, scale, scale);

        scene.add(sphere);
    }
});

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
};

window.addEventListener("resize", () => {
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    0.1,
    100
);
camera.position.x = 0;
camera.position.y = -1;
camera.position.z = 5;
scene.add(camera);

// // Controls
// const controls = new OrbitControls(camera, canvas);
// controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    // // Update controls
    // controls.update();

    // Update camera
    camera.position.x = cursor.x * 3;
    camera.position.y = cursor.y * 3;
    // camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 2;
    camera.lookAt(fontGroup.position);

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();

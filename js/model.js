import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

// Resto do seu código JS...
const container = document.getElementById("viewer");

// Cena
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000);

// Camera (Ajustado para pegar as dimensões reais do container)
const camera = new THREE.PerspectiveCamera(
    50,
    container.clientWidth / container.clientHeight,
    0.1,
    100
);
camera.position.set(0, 1.5, 4);

// Renderer
const renderer = new THREE.WebGLRenderer({
    antialias: true
});
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

container.appendChild(renderer.domElement);

// Luzes
scene.add(new THREE.AmbientLight(0xffffff, 2));

const dirLight = new THREE.DirectionalLight(0xffffff, 3);
dirLight.position.set(5, 8, 5);
scene.add(dirLight);

// Controles
const controls = new OrbitControls(camera, renderer.domElement);
controls.enablePan = false;
controls.enableZoom = true;
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.target.set(0, 0, 0);

// Loader
const loader = new GLTFLoader();
loader.load(
    "../assets/models/carro.glb",
    (gltf) => {
        const model = gltf.scene;
        scene.add(model);

        // Centralização automática
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center);

        controls.target.set(0, 0, 0);
    },
    undefined,
    (erro) => {
        console.error("Erro ao carregar o modelo GLTF:", erro);
    }
);

// Trata o redimensionamento sem distorcer o 3D
window.addEventListener("resize", () => {
    const width = container.clientWidth;
    const height = container.clientHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
});

// Loop de animação
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

animate();
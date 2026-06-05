import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Sélectionner toutes les zones de cartes 3D
const cardElements = document.querySelectorAll('.card-canvas');

cardElements.forEach((container) => {
    const modelPath = container.getAttribute('data-model');
    initCard3D(container, modelPath);
});

function initCard3D(container, modelPath) {
    // 1. Scène locale à la carte
    const scene = new THREE.Scene();

    // 2. Caméra adaptée à la taille de la carte
    const width = container.clientWidth;
    const height = container.clientHeight;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.5, 4.5);

    // 3. Rendu (alpha: true permet de voir l'effet de verre transparent derrière le canvas)
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 4. Lumières
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 2);
    dirLight1.position.set(5, 5, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xffffff, 1);
    dirLight2.position.set(-5, 5, -5);
    scene.add(dirLight2);

    // 5. Contraintes OrbitControls (Pas de zoom, pas de pan, rotation horizontale pure)
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    
    controls.enableZoom = false; // Désactive le zoom (molette / pincement)
    controls.enablePan = false;  // Désactive le déplacement avec le clic droit
    
    // Bloquer la rotation verticale (axe Y uniquement)
    // En fixant l'angle polaire min et max à Pi/2 (90 degrés), la caméra reste bloquée à hauteur des yeux
    controls.minPolarAngle = Math.PI / 2;
    controls.maxPolarAngle = Math.PI / 2;

    // 6. Chargement du modèle GLB unique
    const loader = new GLTFLoader();
    loader.load(modelPath, (gltf) => {
        const model = gltf.scene;
        // ---- AJOUTE CETTE LIGNE POUR GROSSIR L'OBJET ----
        model.scale.set(1.5, 1.5, 1.5); // 1.5 multiplie la taille par 1.5 (Ajuste la valeur si besoin)
        // -------------------------------------------------
        // Centrer automatiquement le modèle dans la carte
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.x += (model.position.x - center.x);
        model.position.y += (model.position.y - center.y) - 0.2; // Légèrement abaissé
        model.position.z += (model.position.z - center.z);
        
        scene.add(model);
    }, undefined, (error) => {
        console.error("Erreur chargement carte :", error);
    });

    // 7. Animation propre à cette carte
    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }
    animate();

    // Ajustement en cas de redimensionnement de la fenêtre
    window.addEventListener('resize', () => {
        const w = container.clientWidth;
        const h = container.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
    });
}
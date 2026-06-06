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
        
        // On clone proprement pour éviter les conflits
        const model = gltf.scene.clone();
        
        // --- NOUVEAU : CALCUL DE L'ÉCHELLE AUTOMATIQUE ---
        // 1. On mesure la taille actuelle du modèle aux extrêmes (X, Y, Z)
        const box = new THREE.Box3().setFromObject(model);
        const size = new THREE.Vector3();
        box.getSize(size); // Récupère la largeur, hauteur, profondeur de la voiture

        // 2. On choisit la taille maximale souhaitée dans la carte (ex: 2.5 unités)
        const targetSize = 2.5; 
        
        // 3. On trouve la dimension la plus grande du modèle (souvent la longueur de la voiture)
        const maxDim = Math.max(size.x, size.y, size.z);
        
        // 4. On calcule le ratio et on applique une échelle uniforme et parfaite
        const scaleFactor = targetSize / maxDim;
        model.scale.set(scaleFactor, scaleFactor, scaleFactor);
        
        // -------------------------------------------------
        // --- NOUVEAU : REDRESSER LA VOITURE SELON SON FICHIER ---
        // ---------------------------------------------------------
        if (modelPath.includes('599obj.glb')) {
            // Si la voiture est debout sur le nez ou l'arrière, on la bascule de 90 degrés
            // Math.PI / 2 correspond à un angle de 90° en radians
            model.rotation.x = -Math.PI / 2; 
            
            // Si jamais elle est aussi de biais, tu pourras ajuster l'axe Y ou Z en décochant ici :
            // model.rotation.y = Math.PI / 2;
        }
        // Recalculer la boîte englobante après la mise à l'échelle pour recentrer parfaitement
        const newBox = new THREE.Box3().setFromObject(model);
        const center = newBox.getCenter(new THREE.Vector3());
        
        model.position.x += (model.position.x - center.x);
        model.position.y += (model.position.y - center.y) - 0.2; // Légèrement abaissé au centre de la carte
        model.position.z += (model.position.z - center.z);
        
        scene.add(model);
    }, undefined, (error) => {
        console.error("Erreur chargement carte :", error);
    });

    // 7. Animation optimisée (S'arrête si la carte n'est pas visible)
    let isVisible = true;

    // On observe si la carte est visible à l'écran
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            isVisible = entry.isIntersecting; // Vrai si la carte est visible, Faux sinon
        });
    }, { threshold: 0.1 }); // Se déclenche dès que 10% de la carte est visible

    observer.observe(container);

    function animate() {
        requestAnimationFrame(animate);
        
        // On n'exécute les calculs 3D QUE si la carte est visible
        if (isVisible) {
            controls.update();
            renderer.render(scene, camera);
        }
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
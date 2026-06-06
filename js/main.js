import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// =========================================================================
// 1. DONNÉES DES VÉHICULES
// =========================================================================
const carData = [
    {
        model: "assets/models/2022_ferrari_296_gtb.glb",
        title: "Ferrari Monza SP3 Evo",
        desc: "Moteur V12 Hybride | 950 ch | 0-100 km/h : 2.8s"
    },
    {
        model: "assets/models/599obj.glb",
        title: "Ferrari SF100 Vision",
        desc: "Full Électrique | 1200 ch | Vitesse max : 350 km/h"
    },
    {
        model: "assets/models/ferrari.glb",
        title: "Ferrari F42 Aperta",
        desc: "V8 Bi-turbo | 830 ch | Châssis Carbone Monocoque"
    }
];

let currentIndex = 0;
const carDistance = 10; // Espace entre chaque voiture dans la scène 3D (en mètres)

// =========================================================================
// 2. CONFIGURATION DE LA SCÈNE UNIQUE GÉANTE
// =========================================================================
const container = document.getElementById('showroom-canvas-container');
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(40, container.clientWidth / container.clientHeight, 0.1, 100);
// Position de profil stricte par défaut face à la première voiture
camera.position.set(0, 0.8, 5.0); 

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
container.appendChild(renderer.domElement);

// Lumières globales d'exposition
scene.add(new THREE.AmbientLight(0xffffff, 1.2));
const spotLight1 = new THREE.DirectionalLight(0xffffff, 2);
spotLight1.position.set(5, 10, 5);
scene.add(spotLight1);
const spotLight2 = new THREE.DirectionalLight(0xffffff, 1);
spotLight2.position.set(-5, 5, -5);
scene.add(spotLight2);

// Contrôles de caméra (restreints pour garder une vue de profil globale propre)
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;
controls.minDistance = 3;
controls.maxDistance = 7;
controls.maxPolarAngle = Math.PI / 2; // Empêche de passer sous le sol

// Cibles d'animation pour les flèches
let targetCameraX = 0;
let targetControlsX = 0;

// =========================================================================
// 3. CHARGEMENT DES VOITURES ALIGNÉES
// =========================================================================
const loader = new GLTFLoader();

carData.forEach((car, index) => {
    loader.load(car.model, (gltf) => {
        const model = gltf.scene;

        // Échelle automatique
        const box = new THREE.Box3().setFromObject(model);
        const size = new THREE.Vector3();
        box.getSize(size);
        const maxDim = Math.max(size.x, size.y, size.z);
        const scaleFactor = 3.5 / maxDim; // Voiture très grande
        model.scale.set(scaleFactor, scaleFactor, scaleFactor);

        // Correction d'axe pour la deuxième voiture
        if (car.model.includes('599obj.glb')) {
            model.rotation.x = -Math.PI / 2;
        }

        // Centrage du modèle sur lui-même
        const newBox = new THREE.Box3().setFromObject(model);
        const center = newBox.getCenter(new THREE.Vector3());
        model.position.x = -center.x;
        model.position.y = -center.y;
        model.position.z = -center.z;

        // Création d'un groupe pour positionner la voiture le long de l'axe X
        const carGroup = new THREE.Group();
        carGroup.add(model);
        
        // Aligner les voitures les unes à côté des autres (0m, 10m, 20m...)
        carGroup.position.x = index * carDistance;
        
        scene.add(carGroup);
    });
});

// =========================================================================
// 4. NAVIGATION PAR FLÈCHES (SYSTÈME DE SLIDER SLIDE)
// =========================================================================
const btnPrev = document.getElementById('arrow-prev');
const btnNext = document.getElementById('arrow-next');

btnNext.addEventListener('click', () => {
    if (currentIndex < carData.length - 1) {
        currentIndex++;
        updateShowroom();
    }
});

btnPrev.addEventListener('click', () => {
    if (currentIndex > 0) {
        currentIndex--;
        updateShowroom();
    }
});

function updateShowroom() {
    const data = carData[currentIndex];
    
    // Mettre à jour l'interface HTML
    document.getElementById('car-title').innerText = data.title;
    document.getElementById('car-desc').innerText = data.desc;

    // Calculer la nouvelle position X vers laquelle la caméra doit se déplacer
    targetCameraX = currentIndex * carDistance;
    targetControlsX = currentIndex * carDistance;
}

// =========================================================================
// 5. BOUCLE D'ANIMATION (MOUVEMENT FLUIDE DE LA CAMÉRA)
// =========================================================================
function animate() {
    requestAnimationFrame(animate);

    // Interpolation linéaire (Lerp) pour faire glisser la caméra en douceur
    camera.position.x += (targetCameraX - controls.target.x) * 0.08;
    controls.target.x += (targetControlsX - controls.target.x) * 0.08;

    controls.update();
    renderer.render(scene, camera);
}
animate();

// Gérer le redimensionnement de la fenêtre de manière réactive
window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
});

// =========================================================================
// 6. GESTION DE LA FENÊTRE MODALE DÉTAILS
// =========================================================================
const modal = document.getElementById('tech-modal');
const btnOpenDetails = document.getElementById('open-details-btn');
const btnCloseModal = document.querySelector('.close-modal');

btnOpenDetails.addEventListener('click', () => {
    const data = carData[currentIndex];
    document.getElementById('modal-title').innerText = data.title;
    document.getElementById('modal-description').innerText = "Fiche technique détaillée de la " + data.title + ". Idéale pour afficher les performances avancées, le couple aérodynamique et les rapports de vitesse.";
    modal.style.display = 'flex';
});

btnCloseModal.addEventListener('click', () => modal.style.display = 'none');
window.addEventListener('click', (e) => { if (e.target === modal) modal.style.display = 'none'; });
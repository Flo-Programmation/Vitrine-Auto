<?php include 'includes/db.php'; ?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ferrari Vitrine Exposition</title>
    <link rel="stylesheet" href="assets/css/style.css">
    
    <script type="importmap">
    {
        "imports": {
            "three": "https://unpkg.com/three@0.160.0/build/three.module.js",
            "three/addons/": "https://unpkg.com/three@0.160.0/examples/jsm/"
        }
    }
    </script>
</head>
<body>
    <video src="assets/src/videos/bg-header.mp4" autoplay loop muted playsinline id="bg-video"></video>

    <main class="showroom-wrapper">
        <header class="header-content">
            <h1 id="car-title">Ferrari Monza SP3 Evo</h1>
            <p id="car-desc">Moteur V12 Hybride | 950 ch | 0-100 km/h : 2.8s</p>
        </header>

        <div id="showroom-canvas-container"></div>

        <button id="arrow-prev" class="nav-arrow">◀</button>
        <button id="arrow-next" class="nav-arrow">▶</button>
    </main>

    <div id="tech-modal" class="modal">
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <div class="modal-body">
                <div class="modal-info">
                    <h2 id="modal-title">Modèle</h2>
                    <hr>
                    <p id="modal-description">Spécifications techniques avancées...</p>
                </div>
            </div>
        </div>
    </div>

    <button id="open-details-btn">Voir la fiche technique</button>

    <script type="module" src="js/main.js"></script>
</body>
</html>
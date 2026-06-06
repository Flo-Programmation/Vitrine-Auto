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
    <header>
        <video src="assets/src/videos/bg-header.mp4" autoplay loop muted playsinline id="bg-video"></video>
        
        <div class="header-content">
            <h1>Scuderia Ferrari Concept Exhibition</h1>
        </div>
    </header>

    <section class="showroom-section">
        <div class="cards-container">
            
            <div class="card">
                <div class="card-canvas" data-model="assets/models/2022_ferrari_296_gtb.glb"></div>
                <div class="card-info">
                    <h3>Ferrari Monza SP3 Evo</h3>
                    <p>Moteur V12 Hybride | 950 ch</p>
                </div>
            </div>

            <div class="card">
                <div class="card-canvas" data-model="assets/models/599obj.glb"></div>
                <div class="card-info">
                    <h3>Ferrari SF100 Vision</h3>
                    <p>Full Électrique | 1200 ch</p>
                </div>
            </div>

            <div class="card">
                <div class="card-canvas" data-model="assets/models/ferrari.glb"></div>
                <div class="card-info">
                    <h3>Ferrari F42 Aperta</h3>
                    <p>V8 Bi-turbo | 830 ch</p>
                </div>
            </div>

        </div>
    </section>
    <script type="module" src="js/main.js"></script>
</body>
</html>
/* service-worker.js
   Nuqthah Learning Center
   Cache sederhana untuk SPA
*/

const CACHE_NAME = "nuqthah-cache-v26";




/* ⚠️ Hal penting (supaya tidak bingung nanti)
Kalau kamu ubah JS / CSS tapi tidak berubah di browser:
Itu normal, karena cache.
Solusi:

Ubah versi cache di service-worker.js:
const CACHE_NAME = "nuqthah-cache-v16";
Save
Refresh halaman
*/

const ASSETS_TO_CACHE = [
    "./",
    "./index.html",

    // ===== CSS =====
    "./assets/style/style.css",
    "./assets/style/jago-warna.css",
    "./assets/style/bimbel-midnav-image.css",
    "./assets/style/home-top-gap.css",
    "./assets/style/teach.css",
    "./assets/style/materials.css",
    "./assets/style/desktop-only.css",

    // ===== paket images=====
    "./assets/images/nu.png",
    "./assets/images/nu.png",
    "./assets/images/nu.png",
    "./assets/images/nu.png",


    // ===== JS DATA =====
    "./assets/js/lessons-data.js",
    "./assets/js/lessons-offline-data.js",
    "./assets/js/lessons-intensif-data.js",
    "./assets/js/news-data.js",
    "./assets/js/products-data.js",

    // ===== JS LOGIC =====
    "./assets/js/desktop-only.js",
    "./assets/js/home-top-fix.js",
    "./assets/js/mobile-title-pack.js",
    "./assets/js/teacher-fix.js",
    "./assets/js/teach.js",
    "./assets/js/packages_patched.js",
    "./assets/js/app.js",

    // ===== IMAGES (opsional tapi disarankan) =====
    "./assets/images/nu.png",
    "./assets/images/bimbel2.png",
    "./assets/images/teacher.jpg"
];

// INSTALL: simpan file ke cache
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
        }).then(() => self.skipWaiting())
    );
});

// ACTIVATE: hapus cache lama
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// FETCH: ambil dari cache dulu, kalau tidak ada ambil dari network
self.addEventListener("fetch", (event) => {
    if (event.request.method !== "GET") return;

    event.respondWith(
        caches.match(event.request).then((cached) => {
            if (cached) return cached;

            return fetch(event.request).then((response) => {
                const copy = response.clone();
                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, copy);
                });
                return response;
            });
        })
    );
});

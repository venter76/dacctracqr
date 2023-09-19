const CACHE_NAME = 'static-cache-v4';
const STATIC_ASSETS = [
    'placeholder.html',
    '/iconLarge_1.png',
    '/iconLarge_2.png',
    '/iconLarge_3.png',
    '/iconLarge.png',
    '/MrF.gif',
    '/NXRX.gif',
    '/penguin.gif',
    '/cat.gif',
   
    // ... other static assets
];


self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(STATIC_ASSETS);
        })
    );
});



self.addEventListener('activate', (event) => {
    console.log('Service Worker activated!');
});

self.addEventListener('fetch', (event) => {
    const dynamicPaths = ['/', '/detail', '/rosterset', '/rosterchange'];

    if (dynamicPaths.some(path => event.request.url.includes(path))) {
        // Use Network Only strategy for dynamic content
    //     event.respondWith(fetch(event.request));
    // } else {
        // Use Cache First strategy for static assets
        event.respondWith(

            fetch(event.request).catch(() => {
                // Return placeholder.html if the app is offline and the request is for the homepage
                if (event.request.url.includes('/')) {
                    return caches.match('/placeholder.html');
                }

            // caches.match(event.request).then((response) => {
            //     return response || fetch(event.request).then((fetchResponse) => {
            //         return caches.open(CACHE_NAME).then((cache) => {
            //             cache.put(event.request, fetchResponse.clone());
            //             return fetchResponse;
                    })
                );
            } else {
                // Use Cache First strategy for static assets
                event.respondWith(
                    caches.match(event.request).then((response) => {
                        return response || fetch(event.request).then((fetchResponse) => {
                            return caches.open(CACHE_NAME).then((cache) => {
                                cache.put(event.request, fetchResponse.clone());
                                return fetchResponse;
                            });
                        });
                    })
                );
            }
        });
    
    
    
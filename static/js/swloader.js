document.addEventListener('DOMContentLoaded', () => {
    if(!navigator.serviceWorker) return;

    navigator.serviceWorker.register('/sw.js', {scope: '/'}).then(function(registration) {
        console.log('Service worker registration succeeded:', registration);
    }).catch(function(error) {
        console.log('Service worker registration failed:', error);
    });
});
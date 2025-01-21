// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA6lcNZLhGQX8x9IYdSZMFGDFgykO-DJxU",
    authDomain: "raam-237c8.firebaseapp.com",
    databaseURL: "https://raam-237c8-default-rtdb.firebaseio.com",
    projectId: "raam-237c8",
    storageBucket: "raam-237c8.firebasestorage.app",
    messagingSenderId: "897215539131",
    appId: "1:897215539131:web:d6d44486600b529906069e"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Export auth as a global variable
window.auth = firebase.auth();

// Add authentication state observer
auth.onAuthStateChanged(user => {
    if (user) {
        console.log('User is signed in:', user);
    } else {
        console.log('User is signed out');
    }
});










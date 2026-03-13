// Firebase Configuration
// NOTE: These are placeholders. You should replace them with your own Firebase project credentials.
const firebaseConfig = {
    apiKey: "AIzaSyCdcnXDghpsf0lqxMZxNharUiUr-n0k8E",
    authDomain: "project-name-9123e.firebaseapp.com",
    projectId: "project-name-9123e",
    storageBucket: "project-name-9123e.firebasestorage.app",
    messagingSenderId: "697052698723",
    appId: "1:697052698723:web:dbe4c09af065cb1e3e8056",
    measurementId: "G-EMJ2R2YS33"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Optional: Enable offline persistence
db.enablePersistence().catch((err) => {
    if (err.code == 'failed-precondition') {
        console.log('Persistence failed: multiple tabs open');
    } else if (err.code == 'unimplemented') {
        console.log('Persistence is not available in this browser');
    }
});

const { initializeApp } = require("firebase/app");
const { getFirestore } = require("firebase/firestore");

const { getAuth } = require("firebase/auth");




const firebaseConfig = {
    apiKey: "AIzaSyD0-w9gc6EcOUQKHLXFeJWyzqpKgoBAuY4",
    authDomain: "backend-resturant-app.firebaseapp.com",
    projectId: "backend-resturant-app",
    storageBucket: "backend-resturant-app.firebasestorage.app",
    messagingSenderId: "282220410723",
    appId: "1:282220410723:web:982c6a0202ea4e71d34556",
    measurementId: "G-P96WQML885"
};


const app = initializeApp(firebaseConfig);


const db = getFirestore(app);
const auth = getAuth(app);

module.exports = { db,auth };
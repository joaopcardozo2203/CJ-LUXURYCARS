const firebaseConfig = {

    apiKey: "AIzaSyBC1FPPBaZZZf12QJON7b5yQX7RCNZ24dc",

    authDomain:
        "cj-luxury-cars.firebaseapp.com",

    databaseURL:
        "https://cj-luxury-cars-default-rtdb.firebaseio.com",

    projectId:
        "cj-luxury-cars",

    storageBucket:
        "cj-luxury-cars.firebasestorage.app",

    messagingSenderId:
        "89062166539",

    appId:
        "1:89062166539:web:c037568c97ab41c5d0770e"
};


if (!firebase.apps.length) {

    firebase.initializeApp(firebaseConfig);

}


const auth = firebase.auth();

const db = firebase.database();
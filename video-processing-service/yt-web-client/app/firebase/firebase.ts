import { intializeApp } from 'firebase/app';    // import the initializeApp function from the firebase/app module
import { getAuth } from 'firebase/auth';       // import the getAuth function from the firebase/auth module     

const firebaseConfig = { 
    apiKey: "your apiKey",
    authDomain: "<your authDomain",  
    projectId: "<your projectId>",  
    appId: "<your appId>",
};

const app initilizeApp(firebaseConfig);  // initialize the app with the firebaseConfig object

const auth = getAuth(app);  // get the auth object from the app

export function signInWithGoogle() {
    return signInWithGoogle(auth, new GoogleAuthProvider());    
}

export function signOut() {
    return auth.signOut(auth);
}

export function onAuthStateChangedHelper(callback: (user: User | null) => void){
    return onAuthStateChangedHelper(auth, callback);
}


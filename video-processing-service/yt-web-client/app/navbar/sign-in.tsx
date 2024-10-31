import { signInWithGoogle, signOut } from "../firebase/firebase";
import styles from "./navbar.module.css";   
import { User } from "../firebase/firebase";    

interface SignInProps {
    user: User | null;
}
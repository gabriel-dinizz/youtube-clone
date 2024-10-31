import { signInWithGoogle, signOut } from "../firebase/firebase";
import styles from "./navbar.module.css";   
import { User } from "../firebase/firebase";    
import { Sign } from "crypto";

interface SignInProps {
    user: User | null;
}

export default function SignIn( { user}: SignInProps) {
    
}
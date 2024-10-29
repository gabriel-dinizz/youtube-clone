import Image from "next/image";
import Link from "next/Link";

import styles from "./navbar.module.css";

export default function NavBat() {
    return (
        <nav className={styles.navbar}>
            <Link href="/">
            <Image width={90}  height={20}
            src="/youtube-logo.svg"/>
            </Link>
        </nav>
    )
}
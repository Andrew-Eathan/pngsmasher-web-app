import styles from "@/components/Header.module.css";
import HeaderLink from "@/components/HeaderLink";
import { FXController } from "@/effects";
import { useEffect } from "react";

let navlist = [
    ["App", "/"],
    ["Examples", "/examples"],
    ["About", "/about"]
]

function Header() {
    let controller = FXController();
    useEffect(controller.func, [])

    let headertext = <h1 style={controller.styles} ref={controller.ref}>
        pngsmasher
    </h1>;

    return (
        <div className={styles.header}>
            <div className={styles.headertextcontainer}>
                {headertext}
                <a className={`${styles.dimtext} ${styles.headertext}`} href="https://mariluu.hehe.moe">by andreweathan/mariluu</a>
            </div>
            <br></br>
            <div>
                {
                    navlist.map(obj => {
                        return <HeaderLink href={obj[1]} label={obj[0]} key={obj[0]}/>
                    })
                }
            </div>
        </div>
    )
}

export default Header;
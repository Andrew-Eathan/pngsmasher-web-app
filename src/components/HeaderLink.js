import styles from "@/components/HeaderLink.module.css";
import fxstyles from "@/components/fx.module.css";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { FXController } from "@/effects";

function HeaderLink({label, href}) {
    const router = useRouter();
    const thisPage = router.pathname == href;
    let controller;

    if (thisPage) {
        controller = FXController();
    }

    useEffect(_ => {
        if (thisPage) controller.func()
    }, [])

    let element = <Link 
        className={styles.shadowtext + (thisPage ? (" " + fxstyles.chromaAbberationText) : "")} 
        href={href} 
        key={label}
        style={controller ? controller.styles : null}
        ref={controller ? controller.ref : null}
    >
        {label}
    </Link>

    return element;
}

export default HeaderLink;
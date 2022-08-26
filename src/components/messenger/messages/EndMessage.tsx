import React from "react";
import styles from "./EndMessage.module.css"

export function EndMessage() {
    return <div className={styles.container}>
        <h2 className={styles.text}>
            There is no more messages
        </h2>
    </div>
}
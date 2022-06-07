import React from "react";
import style from "./IconedButton.module.css";
import {Button} from "@mui/material";

interface IconedButtonProps {
    onClick: () => void,
    icon: any,
    text: string,
}

const IconedButton: React.FC<IconedButtonProps> = (props) => {

    return (
        <div className={style.controls_button_container}>
            <Button className={style.controls_button}
                    onClick={() => props.onClick()}
            >

                <div className={style.button_content}>
                    {props.icon}
                    <div className={style.button_content_spacer}/>
                    <span>{props.text}</span>
                </div>
            </Button>
        </div>
    )
}

export default IconedButton;
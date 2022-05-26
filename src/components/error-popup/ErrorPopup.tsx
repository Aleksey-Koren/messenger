import {Alert, Snackbar} from "@mui/material";
import React from "react";
import style from './ErrorPopup.module.css'

interface ErrorPopupProps {
    isError: boolean;
    errorMessage: string;
    handlePopupClose?: () => void;
    autoHideDuration?: number;
    isShowReloadButton?: boolean;
}

function ErrorPopup(props: ErrorPopupProps) {

    return (
        <Snackbar open={props.isError} anchorOrigin={{vertical: 'bottom', horizontal: "right"}}
                  autoHideDuration={props.autoHideDuration} onClose={() => props.handlePopupClose ? props.handlePopupClose() : ''}
        >
            <Alert severity="error" sx={{width: '100%'}}>
                <strong>{props.errorMessage}</strong>
                {props.isShowReloadButton &&
                    <div className={style.popup_footer}>
                        <button type={"button"} className={style.refresh_button}
                                onClick={() => window.location.reload()}>Refresh
                        </button>
                    </div>
                }
            </Alert>
        </Snackbar>
    );
}

export default ErrorPopup;
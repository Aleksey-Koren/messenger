import {Alert, Snackbar} from "@mui/material";
import React from "react";
import style from './ErrorPopup.module.css'
import {useAppSelector} from "../../index";

interface ErrorPopupProps {
    handlePopupClose?: () => void;
    autoHideDuration?: number;
    isShowReloadButton?: boolean;
}

function ErrorPopup(props: ErrorPopupProps) {
    const isOpen = useAppSelector(state => state.errorPopup.isErrorPopupOpen);
    const errorMessage = useAppSelector(state => state.errorPopup.errorMessage);

    return (
        <Snackbar open={isOpen} anchorOrigin={{vertical: 'bottom', horizontal: "right"}}
                  autoHideDuration={props.autoHideDuration}
                  onClose={() => props.handlePopupClose ? props.handlePopupClose() : ''}
        >
            <Alert severity="error" sx={{width: '100%'}}>
                <strong>{errorMessage}</strong>
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
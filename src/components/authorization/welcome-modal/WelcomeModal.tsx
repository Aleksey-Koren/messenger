import {Button, Dialog, DialogActions, DialogTitle} from "@mui/material";
import style from "./WelcomeModal.module.css";
import React from "react";
import {useAppDispatch, useAppSelector} from "../../../index";
import {setIsLoginModalOpen, setIsRegistrationModalOpen} from "../../../redux/authorization/authorizationActions";

function WelcomeModal() {
    const dispatch = useAppDispatch();
    const isOpen = useAppSelector(state => state.authorization.isWelcomeModalOpen);

    return (
        <Dialog open={isOpen}>
            <DialogTitle className={style.dialog__title}>
                Hello! Who are you?
            </DialogTitle>

            <DialogActions className={style.dialog__actions}>
                <Button onClick={() => dispatch(setIsRegistrationModalOpen(true))}
                        className={style.dialog__disagree_button}>
                    I'm new user
                </Button>
                <Button onClick={() => dispatch(setIsLoginModalOpen(true))}>
                    I'm already registered
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default WelcomeModal;
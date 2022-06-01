import {Button, Dialog, DialogActions, DialogTitle} from "@mui/material";
import style from "./WelcomeModal.module.css";
import React from "react";
import {useAppSelector} from "../../../index";
import {registerTF, setIsLoginModalOpen} from "../../../redux/authorization/authorizationActions";
import {useDispatch} from "react-redux";

function WelcomeModal() {
    const dispatch = useDispatch();
    const isOpen = useAppSelector(state => state.authorization.isWelcomeModalOpen);

    return (
        <Dialog open={isOpen}>
            <DialogTitle className={style.dialog__title}>
                Hello! Who are you?
            </DialogTitle>

            <DialogActions className={style.dialog__actions}>
                <Button onClick={() => dispatch(registerTF())}
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
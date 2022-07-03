import {Button, Dialog, DialogActions, DialogTitle} from "@mui/material";
import style from "./WelcomeModal.module.css";
import React from "react";
import {AppState} from "../../../index";
import {
    registerTF,
    setIsLoginModalOpen,
    setIsWelcomeModalOpen
} from "../../../redux/authorization/authorizationActions";
import {connect, useDispatch} from "react-redux";

interface WelcomeModalProps {
    isOpen?: boolean,
    setIsWelcomeModalOpen?: (b:boolean) => void,
    registerTF?: () => void,
    setIsLoginModalOpen?: (b:boolean) => void,
}

function WelcomeModal(props:WelcomeModalProps) {
    const dispatch = useDispatch();

    return (
        <Dialog open={!!props.isOpen}>
            <DialogTitle className={style.dialog__title}>
                Hello! Who are you?
            </DialogTitle>

            <DialogActions className={style.dialog__actions}>
                <Button onClick={() => {
                    dispatch(registerTF());
                }}
                        className={style.dialog__disagree_button}>
                    I'm new user
                </Button>
                <Button onClick={() => {
                    dispatch(setIsWelcomeModalOpen(false))
                    dispatch(setIsLoginModalOpen(true))
                }}>
                    I'm already registered
                </Button>
            </DialogActions>
        </Dialog>
    );
}

const mapStateToProps = (state: AppState) => {
    return {
        isOpen: state.authorizationReducer.isWelcomeModalOpen,
    }
}


const connector = connect(mapStateToProps);


export default connector(WelcomeModal);
import {Button, Dialog, DialogActions, DialogTitle} from "@mui/material";
import style from "./WelcomeModal.module.css";
import React from "react";
import {AppState} from "../../../index";
import {
    registerRSA,
    setIsLoginModalOpen,
    setIsWelcomeModalOpen
} from "../../../redux/authorization/authorizationActions";
import {connect, ConnectedProps} from "react-redux";

function WelcomeModal(props: Props) {

    return (
        <Dialog open={true}>
            <DialogTitle className={style.dialog__title}>
                Hello! Who are you?
            </DialogTitle>

            <DialogActions className={style.dialog__actions}>
                <Button onClick={() => {
                    //@TODO ERROR block all buttons while action is not done
                    props.registerRSA();
                }}
                >
                    I'm new user
                </Button>
                <Button onClick={() => {
                    props.setIsWelcomeModalOpen(false)
                    props.setIsLoginModalOpen(true)
                }}>
                    I'm already registered
                </Button>
                <Button onClick={() => {
                    //@TODO ERROR block all buttons while action is not done
                    props.registerRSA(true);
                }}
                >
                    Ghost registration
                </Button>
            </DialogActions>
        </Dialog>
    );
}

const mapStateToProps = (state: AppState) => ({
    isOpen: state.authorizationReducer.isWelcomeModalOpen,
})

const mapDispatchToProps = {
    setIsWelcomeModalOpen,
    setIsLoginModalOpen,
    registerRSA,
}


const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector>;

export default connector(WelcomeModal);
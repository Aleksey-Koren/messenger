import {Button, Dialog, DialogActions, DialogTitle} from "@mui/material";
import style from "./WelcomeModal.module.css";
import React from "react";
import {AppState} from "../../../index";
import {
    registerRSA,
    setIsFetching,
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
                <Button disabled={props.isFetching}
                        onClick={() => {
                            props.registerRSA();
                        }}
                >
                    I'm new user
                </Button>
                <Button disabled={props.isFetching}
                        onClick={() => {
                            props.setIsWelcomeModalOpen(false)
                            props.setIsLoginModalOpen(true)
                        }}>
                    I'm already registered
                </Button>
                <Button disabled={props.isFetching}
                        onClick={() => {
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
    isFetching: state.authorizationReducer.isFetching,
})

const mapDispatchToProps = {
    setIsWelcomeModalOpen,
    setIsLoginModalOpen,
    registerRSA,
    setIsFetching,
}


const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector>;

export default connector(WelcomeModal);
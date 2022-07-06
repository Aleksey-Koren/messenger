import {Button, Dialog, DialogActions, DialogTitle} from "@mui/material";
import style from "./WelcomeModal.module.css";
import React from "react";
import {AppState} from "../../../index";
import {
    registerTF,
    setIsLoginModalOpen,
    setIsWelcomeModalOpen
} from "../../../redux/authorization/authorizationActions";
import {connect, ConnectedProps, useDispatch} from "react-redux";

// interface WelcomeModalProps {
//     isOpen?: boolean,
//     setIsWelcomeModalOpen?: (b:boolean) => void,
//     registerTF?: () => void,
//     setIsLoginModalOpen?: (b:boolean) => void,
// }

function WelcomeModal(props: Props) {
    // const dispatch = useDispatch();

    return (
        <Dialog open={true}>
            <DialogTitle className={style.dialog__title}>
                Hello! Who are you?
            </DialogTitle>

            <DialogActions className={style.dialog__actions}>
                <Button onClick={() => {
                    props.registerTF(false);
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
                    props.registerTF(true);
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
    registerTF
}


const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector>;

export default connector(WelcomeModal);
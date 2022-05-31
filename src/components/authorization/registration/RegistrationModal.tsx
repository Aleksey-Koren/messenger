import React from "react";
import {connect, ConnectedProps} from "react-redux";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import style from "./RegistrationModal.module.css";
import globalStyles from '../../../global-styles/ModalWindow.module.css'
import {AppState} from "../../../index";
import {setIsRegistrationModalOpen} from "../../../redux/authorization/authorizationActions";


const RegistrationModal: React.FC<Props> = (props) => {

    return (
        <Dialog open={props.isOpen}>
            <DialogTitle className={globalStyles.dialog__title}>
                Please save your id and private key.<br/>
                They are used as login credentials
            </DialogTitle>

            <DialogContent className={globalStyles.dialog__content}>
                <div className={style.dialog__info_container}>
                    <div className={style.dialog__content_row}>
                        <strong className={style.dialog__content_row_label}>ID: </strong>
                        <textarea rows={1} className={style.dialog__content_row_input}/>
                    </div>

                    <div className={style.dialog__content_row}>
                        <strong className={style.dialog__content_row_label}>Private Key:</strong>
                        <textarea rows={3} className={style.dialog__content_row_input}/>
                    </div>

                    <div className={style.dialog__content_row}>
                        <strong className={style.dialog__content_row_label}>Public Key:</strong>
                        <textarea rows={3} className={style.dialog__content_row_input}/>
                    </div>
                </div>
            </DialogContent>

            <DialogActions className={style.dialog__actions}>
                <Button onClick={() => props.setIsRegistrationModalOpen(false)}>Close window, i saved it.</Button>
            </DialogActions>
        </Dialog>
    );
}

const mapStateToProps = (state: AppState) => ({
    isOpen: state.authorization.isRegistrationModalOpen
})

const mapDispatchToProps = {
    setIsRegistrationModalOpen
}

const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector>;

export default connector(RegistrationModal);
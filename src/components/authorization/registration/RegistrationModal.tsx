import React from "react";
import {connect, ConnectedProps} from "react-redux";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography} from "@mui/material";
import style from "./RegistrationModal.module.css";
import globalStyles from '../../../global-styles/ModalWindow.module.css'
import {AppState} from "../../../index";
import {setIsRegistrationModalOpen} from "../../../redux/authorization/authorizationActions";


const RegistrationModal: React.FC<Props> = (props) => {

    return (
        <Dialog open={props.isOpen}>
            <DialogTitle className={globalStyles.dialog__title}>
                Done!
            </DialogTitle>

            <DialogContent className={globalStyles.dialog__content}>
                <Typography>
                    Please save your id and private key, it is your credentials. Public key is associated with your ID and saved in our database.
                </Typography>
                <div className={style.dialog__info_container}>
                    <div className={style.dialog__content_row}>
                        <span className={style.dialog__content_row_label}>ID: </span>
                        <textarea rows={1} readOnly className={style.dialog__content_row_input}
                                  defaultValue={props.userId!}/>
                    </div>

                    <div className={style.dialog__content_row}>
                        <span className={style.dialog__content_row_label}>Private Key:</span>
                        <textarea rows={3} readOnly className={style.dialog__content_row_input}
                                  defaultValue={props.privateKey?.join(',')}/>
                    </div>

                    <div className={style.dialog__content_row}>
                        <span className={style.dialog__content_row_label}>Public Key:</span>
                        <textarea rows={3} readOnly className={style.dialog__content_row_input}
                                  defaultValue={props.publicKey?.join(',')}/>
                    </div>
                </div>
            </DialogContent>

            <DialogActions className={style.dialog__actions}>
                <Button  onClick={() => props.setIsRegistrationModalOpen(false)}>I save it, go to the chats</Button>
            </DialogActions>
        </Dialog>
    );
}

const mapStateToProps = (state: AppState) => ({
    isOpen: state.authorization.isRegistrationModalOpen,
    userId: state.messenger.user?.id,
    publicKey: state.messenger.user?.publicKey,
    privateKey: state.messenger.user?.privateKey
})

const mapDispatchToProps = {
    setIsRegistrationModalOpen
}

const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector>;

export default connector(RegistrationModal);
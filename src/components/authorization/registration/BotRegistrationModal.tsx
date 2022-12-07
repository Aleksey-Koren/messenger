import React from "react";
import {connect, ConnectedProps} from "react-redux";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography} from "@mui/material";
import style from "./RegistrationModal.module.css";
import globalStyles from '../../../global-styles/ModalWindow.module.css'
import {AppState} from "../../../index";
import {setIsBotRegistrationModalOpen} from "../../../redux/authorization/authorizationActions";

const BotRegistrationModal: React.FC<Props> = (props) => {
    return (
        <Dialog open={true} maxWidth={'md'}>
            <DialogTitle className={globalStyles.dialog__title}>
                Done!
            </DialogTitle>
            <DialogContent className={globalStyles.dialog__content}>
                <Typography style={{paddingTop: "5px"}}>
                    Please save bot id and private key.
                </Typography>
                <div className={style.dialog__info_container}>
                    <div className={style.dialog__content_row}>
                        <strong className={style.dialog__content_row_label}>ID: </strong>
                        <textarea rows={1} readOnly className={style.dialog__content_row_input}
                                defaultValue={props.botId!}/>
                    </div>
                    <div className={style.dialog__content_row}>
                        <strong className={style.dialog__content_row_label}>Private Key:</strong>
                        <textarea rows={8} readOnly className={style.dialog__content_row_input}
                                defaultValue={props.botPrivateKey!}/>
                    </div>
                    <div className={style.dialog__content_row}>
                        <strong className={style.dialog__content_row_label}>Public Key:</strong>
                        <textarea rows={10} readOnly className={style.dialog__content_row_input}
                                defaultValue={props.botPublicKey!}/>
                    </div>
                </div>
            </DialogContent>
            <DialogActions className={style.dialog__actions}>
                <Button onClick={() => {
                    props.setIsBotRegistrationModalOpen(false)
                }}>I save it, go to the chats</Button>
            </DialogActions>
        </Dialog>
    );
}

const mapStateToProps = (state: AppState) => {
    const bot = state.messenger.bot;
    
    return {
        botId: bot?.id,
        botPublicKey: bot?.publicKeyPem,
        botPrivateKey: bot?.privateKeyPem,
    }
}

const mapDispatchToProps = {
    setIsBotRegistrationModalOpen
}

const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector>;

export default connector(BotRegistrationModal);
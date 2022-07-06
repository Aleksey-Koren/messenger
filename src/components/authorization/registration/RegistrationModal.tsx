import React from "react";
import {connect, ConnectedProps} from "react-redux";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography} from "@mui/material";
import style from "./RegistrationModal.module.css";
import globalStyles from '../../../global-styles/ModalWindow.module.css'
import {AppState} from "../../../index";
import {setIsRegistrationModalOpen} from "../../../redux/authorization/authorizationActions";


const RegistrationModal: React.FC<Props> = (props) => {

    return (
        <Dialog open={true}>
            <DialogTitle className={globalStyles.dialog__title}>
                Done!
            </DialogTitle>

            <DialogContent className={globalStyles.dialog__content}>
                <Typography>
                    {props.isGhost
                        ?
                        <p>
                            You have registered as ghost user.
                            <br/>
                            To make other users be able to chat with you, let them know not only ID but and Public Key
                            too.
                            <br/>
                            You are not saved in database. If you log out, your ghost account will be lost.
                        </p>
                        :
                        <p>
                            Please save your id and private key, it is your credentials. Public key is associated with
                            your ID and saved in our database.
                        </p>
                    }
                </Typography>
                <div className={style.dialog__info_container}>
                    <div className={style.dialog__content_row}>
                        <strong className={style.dialog__content_row_label}>ID: </strong>
                        <textarea rows={1} readOnly className={style.dialog__content_row_input}
                                  defaultValue={props.userId!}/>
                    </div>

                    {!props.isGhost &&
                        <div className={style.dialog__content_row}>
                            <strong className={style.dialog__content_row_label}>Private Key:</strong>
                            <textarea rows={3} readOnly className={style.dialog__content_row_input}
                                     defaultValue={props.privateKey?.join(',')}/>
                        </div>
                    }
                    
                    <div className={style.dialog__content_row}>
                        <strong className={style.dialog__content_row_label}>Public Key:</strong>
                        <textarea rows={3} readOnly className={style.dialog__content_row_input}
                                  defaultValue={props.publicKey?.join(',')}/>
                    </div>
                </div>
            </DialogContent>

            <DialogActions className={style.dialog__actions}>
                <Button  onClick={() => {
                    props.setIsRegistrationModalOpen(false, false)
                }}>I save it, go to the chats</Button>
            </DialogActions>
        </Dialog>
    );
}

const mapStateToProps = (state: AppState) => {
    const user = state.messenger.user;
    return {
        userId: user?.id,
        publicKey: user?.publicKey,
        privateKey: user?.privateKey,
        isGhost: state.authorizationReducer.isRegistrationGhost
    }
}

const mapDispatchToProps = {
    setIsRegistrationModalOpen
}

const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector>;

export default connector(RegistrationModal);
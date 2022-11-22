import React from "react";
import {connect, ConnectedProps} from "react-redux";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Typography
} from "@mui/material";
import style from "./RegistrationModal.module.css";
import globalStyles from '../../../global-styles/ModalWindow.module.css'
import {AppState} from "../../../index";
import {saveCredentials, setIsRegistrationModalOpen} from "../../../redux/authorization/authorizationActions";

const RegistrationModal: React.FC<Props> = (props) => {
    return (
        <Dialog open={true} maxWidth={'md'}>
            <DialogTitle className={globalStyles.dialog__title}>
                Done!
            </DialogTitle>
            <DialogContent className={globalStyles.dialog__content}>
                <Typography style={{paddingTop: "5px"}}>
                    {props.isGhost &&
                        <>
                            You have been registered as a ghost user.
                            <br/>
                            To make other users be able to chat with you, let them know your ID and Public Key.
                            <br/>
                            Everybody may kick you from the chat, and everybody may see list of your chats
                            <br/>
                            You can't be admin or moderator
                            <br/>
                        </>}
                    Please save your id and private key, it's your credentials.
                </Typography>
                {/*@TODO WARN create component for same for LoginModal.
                 Replace <div> with <table><tbody><tr><td>, on small screen it is shown not as expected
                */}
                <TableContainer>
                    <Table sx={{maxWidth: 250}} aria-label="simple table">
                        <TableBody>
                            <TableRow sx={{'&:last-child td, &:last-child th': {border: 0}}}>
                                <TableCell component="th" scope="row">
                                    <strong className={style.dialog__content_row_label}>ID: </strong>
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    <textarea rows={1} readOnly className={style.dialog__content_row_input}
                                              defaultValue={props.userId!}/>
                                </TableCell>
                            </TableRow>
                            <TableRow sx={{'&:last-child td, &:last-child th': {border: 0}}}>
                                <TableCell>
                                    <strong className={style.dialog__content_row_label}>Private Key:</strong>
                                </TableCell>
                                <TableCell>
                                    <textarea rows={8} readOnly className={style.dialog__content_row_input}
                                              defaultValue={props.privateKey!}/>
                                </TableCell>
                            </TableRow>
                            <TableRow sx={{'&:last-child td, &:last-child th': {border: 0}}}>
                                <TableCell>
                                    <strong className={style.dialog__content_row_label}>Public Key:</strong>
                                </TableCell>
                                <TableCell>
                                <textarea rows={10} readOnly className={style.dialog__content_row_input}
                                          defaultValue={props.publicKey!}/>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
                {/*<div className={style.dialog__info_container}>*/}
                {/*    <div className={style.dialog__content_row}>*/}
                {/*        <strong className={style.dialog__content_row_label}>ID: </strong>*/}
                {/*        <br/>*/}
                {/*        <textarea rows={1} readOnly className={style.dialog__content_row_input}*/}
                {/*                  defaultValue={props.userId!}/>*/}
                {/*    </div>*/}
                {/*    <div className={style.dialog__content_row}>*/}
                {/*        <strong className={style.dialog__content_row_label}>Private Key:</strong>*/}
                {/*        <textarea rows={8} readOnly className={style.dialog__content_row_input}*/}
                {/*                  defaultValue={props.privateKey!}/>*/}
                {/*    </div>*/}
                {/*    <div className={style.dialog__content_row}>*/}
                {/*        <strong className={style.dialog__content_row_label}>Public Key:</strong>*/}
                {/*        <textarea rows={10} readOnly className={style.dialog__content_row_input}*/}
                {/*                  defaultValue={props.publicKey!}/>*/}
                {/*    </div>*/}
                {/*</div>*/}
            </DialogContent>
            <DialogActions className={style.dialog__actions}>
                <Button onClick={() => {
                    props.setIsRegistrationModalOpen(false, false)
                }}>I save it, go to the chats</Button>
                <Button onClick={props.saveCredentials}>
                    Download credentials file</Button>
            </DialogActions>
        </Dialog>
    )
        ;
}

const mapStateToProps = (state: AppState) => {
    const user = state.messenger.user;
    return {
        userId: user?.id,
        publicKey: user?.publicKeyPem,
        privateKey: user?.privateKeyPem,
        isGhost: state.authorizationReducer.isRegistrationGhost
    }
}

const mapDispatchToProps = {
    setIsRegistrationModalOpen,
    saveCredentials
}

const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector>;

export default connector(RegistrationModal);
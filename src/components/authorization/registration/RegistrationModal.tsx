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
        <Dialog open={true} maxWidth={"sm"} fullWidth={true}>
            <DialogTitle className={globalStyles.dialog__title}>
                Done!
            </DialogTitle>
            <DialogContent className={globalStyles.dialog__content} style={{paddingTop: "0px"}}>
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
                <TableContainer>
                    <Table aria-label="simple table">
                        <TableBody>
                            <TableRow>
                                <TableCell className={style.dialog__no_margin}>
                                    <strong>ID: </strong>
                                </TableCell>
                                <TableCell>
                                    <textarea rows={1} readOnly className={style.dialog__content_row_input}
                                              defaultValue={props.userId!}/>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className={style.dialog__no_margin}>
                                    <strong>Private Key:</strong>
                                </TableCell>
                                <TableCell>
                                    <textarea rows={8} readOnly className={style.dialog__content_row_input}
                                              defaultValue={props.privateKey!}/>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className={style.dialog__no_margin}>
                                    <strong>Public Key:</strong>
                                </TableCell>
                                <TableCell>
                                <textarea rows={10} readOnly className={style.dialog__content_row_input}
                                          defaultValue={props.publicKey!}/>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </DialogContent>
            <DialogActions className={globalStyles.dialog__actions}>
                <Button onClick={() => {
                    props.setIsRegistrationModalOpen(false, false)
                }}>I save it, go next</Button>
                <Button onClick={props.saveCredentials}>
                    Download file</Button>
            </DialogActions>
        </Dialog>
    );
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
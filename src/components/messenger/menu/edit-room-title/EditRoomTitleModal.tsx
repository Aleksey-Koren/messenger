import {Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@mui/material";
import style from "../../../../global-styles/ModalWindow.module.css";
import {Form, Formik} from "formik";
import * as yup from "yup";
import {connect, ConnectedProps} from "react-redux";
import React from "react";
import {AppState} from "../../../../index";
import {setIsEditRoomTitleModalOpen} from "../../../../redux/messenger-menu/messengerMenuActions";
import {sendMessage} from "../../../../redux/messenger/messengerActions";
import {MessageType} from "../../../../model/messenger/messageType";

const validationSchema = yup.object().shape({
    title: yup.string().required('Title cannot be empty').min(3,)
})

const EditRoomTitleModal: React.FC<Props> = (props) => {

    const chat = props.chats[props.currentChat!] || {};

    return (
        <Dialog open={true} onClose={() => {
        }} maxWidth={"sm"} fullWidth>
            <DialogTitle className={style.dialog__title}>Enter room title</DialogTitle>
            <Formik
                initialValues={{title: chat?.title}}
                onSubmit={(values) => {
                    props.sendMessage(values.title!, MessageType.HELLO, () => {
                        props.setIsEditRoomTitleModalOpen(false);
                    })
                }}
                validationSchema={validationSchema}
            >
                {formik => (
                    <div>
                        <Form>
                            <DialogContent className={style.dialog__content}>
                                <TextField
                                    autoFocus margin="none" type="text"
                                    defaultValue={formik.values.title}
                                    onChange={(event) => formik.setFieldValue('title', event.target.value)}
                                    error={!!formik.errors.title}
                                    helperText={formik.errors.title}
                                    fullWidth variant="standard"
                                />
                            </DialogContent>
                            <DialogActions className={style.dialog__actions}>
                                <Button onClick={() => props.setIsEditRoomTitleModalOpen(false)}>Cancel</Button>
                                <Button type={"submit"} disabled={!formik.isValid}>Save</Button>
                            </DialogActions>
                        </Form>
                    </div>
                )}
            </Formik>
        </Dialog>
    );
}

const mapStateToProps = (state: AppState) => ({
    currentChat: state.messenger.currentChat,
    chats: state.messenger.chats
})

const mapDispatchToProps = {
    setIsEditRoomTitleModalOpen,
    sendMessage
}

const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector>;

export default connector(EditRoomTitleModal);
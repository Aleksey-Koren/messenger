import {connect, ConnectedProps} from "react-redux";
import React, {useState} from "react";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@mui/material";
import style from "../../../../global-styles/ModalWindow.module.css";
import {Form, Formik} from "formik";
import {AppState} from "../../../../index";
import {addUserToRoomTF, setIsAddUserModalOpened} from "../../../../redux/messenger-menu/messengerMenuActions";
import * as yup from "yup";

const validationSchema = yup.object().shape({
    id: yup.string().required('User ID cannot be empty').min(3)
})

const AddUserModal: React.FC<TProps> = (props) => {

    const onClose = () => setIsAddUserModalOpened(false);

    return (
        <Dialog open={props.isOpened} onClose={onClose} maxWidth={"sm"} fullWidth>
            <DialogTitle className={style.dialog__title}>Enter user ID</DialogTitle>
            <Formik
                initialValues={{id: ''}}
                onSubmit={(values) => {
                    props.addUserToRoomTF(props.user!, props.currentChat!, values.id);
                }}
                validationSchema={validationSchema}
            >
                {formik => (
                    <div>
                        <Form >
                            <DialogContent className={style.dialog__content}>
                                <TextField
                                    className={style.dialog__text_field}
                                    autoFocus margin="dense" type="text"
                                    defaultValue={formik.values.id}
                                    onChange={(event) => formik.setFieldValue('id', event.target.value)}
                                    error={!!formik.errors.id} helperText={formik.errors.id}
                                    fullWidth variant="standard" placeholder={"User ID"}
                                />
                            </DialogContent>
                            <DialogActions className={style.dialog__actions}>
                                <Button onClick={onClose}>Cancel</Button>
                                <Button type={"submit"} disabled={!formik.isValid}>Create</Button>
                            </DialogActions>
                        </Form>
                    </div>
                )}
            </Formik>
        </Dialog>
    );
}

const mapStateToProps = (state: AppState) => ({
    isOpened: state.messengerMenu.isAddUserModalOpened,
    user: state.messenger.user,
    currentChat: state.messenger.currentChat
})

const mapDispatchToProps = {
    addUserToRoomTF
}

const connector = connect(mapStateToProps, mapDispatchToProps);

type TProps = ConnectedProps<typeof connector>;

export default connector(AddUserModal);
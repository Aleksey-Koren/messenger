import {Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@mui/material";
import style from "../../../../global-styles/ModalWindow.module.css";
import {Form, Formik} from "formik";
import * as yup from "yup";
import TitleAlreadyExistsModal from "../../new-room-modal/TitleAlreadyExistsModal";
import {connect, ConnectedProps} from "react-redux";
import React from "react";
import {AppState} from "../../../../index";
import {setIsEditTitleModalOpen} from "../../../../redux/messenger-menu/messengerMenuActions";
import {updateRoomTitle} from "../../../../redux/messenger/messengerActions";

const validationSchema = yup.object().shape({
    title: yup.string().required('Title cannot be empty').min(3,)
})

const EditTitleModal: React.FC<Props> = (props) => {

    return (
        <Dialog open={props.isOpen} onClose={() => {
        }} maxWidth={"sm"} fullWidth>
            <DialogTitle className={style.dialog__title}>Enter room title</DialogTitle>
            <Formik
                initialValues={{title: props.currentChat?.title}}
                onSubmit={(values) => props.updateRoomTitle(values.title!)}
                validationSchema={validationSchema}
            >
                {formik => (
                    <div>
                        <Form>
                            <DialogContent className={style.dialog__content}>
                                <TextField
                                    className={style.dialog__text_field}
                                    autoFocus margin="dense" type="text"
                                    defaultValue={formik.values.title}
                                    onChange={(event) => formik.setFieldValue('title', event.target.value)}
                                    error={!!formik.errors.title} helperText={formik.errors.title}
                                    fullWidth variant="standard" placeholder={"Room title"}
                                />
                            </DialogContent>
                            <DialogActions className={style.dialog__actions}>
                                <Button onClick={() => props.setIsEditTitleModalOpen(false)}>Cancel</Button>
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
    isOpen: state.messengerMenu.isEditTitleModalOpen,
    currentChat: state.messenger.currentChat,
})

const mapDispatchToProps = {
    setIsEditTitleModalOpen,
    updateRoomTitle
}

const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector>;

export default connector(EditTitleModal);
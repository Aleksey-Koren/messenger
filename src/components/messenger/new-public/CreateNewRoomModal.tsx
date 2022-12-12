import * as yup from "yup";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography} from "@mui/material";
import style from "../../../global-styles/ModalWindow.module.css";
import {Form, Formik} from "formik";
import {AppState, useAppDispatch} from "../../../index";
import {createNewRoomTF, setIsNewRoomModalOpened} from "../../../redux/messenger-controls/messengerControlsActions";
import {connect, ConnectedProps} from "react-redux";
import React from "react";
import {setUserTitle} from "../../../redux/messenger/messengerActions";


const validationSchema = yup.object().shape({
    title: yup.string().required('Room name cannot be empty').min(1)
})

const CreateNewRoomModal: React.FC<TProps> = (props) => {
    const dispatch = useAppDispatch();

    const onClose = () => dispatch(setIsNewRoomModalOpened(false));

    return (
        <Dialog open={true} onClose={onClose} maxWidth={"sm"} fullWidth>
            <DialogTitle>Create new room</DialogTitle>
            <Formik
                initialValues={{title: '', userTitle: props.userTitle}}
                onSubmit={(values) => {
                    props.createNewRoomTF(values.title, values.userTitle || props.user!.id);
                    props.setUserTitle(values.userTitle)
                }}
                validationSchema={validationSchema}
            >
                {formik => (
                    <div>
                        <Form>
                            <DialogContent className={style.dialog__content}>
                                <Typography>Room name:</Typography>
                                <TextField
                                    autoFocus margin="dense" type="text"
                                    defaultValue={formik.values.title}
                                    onChange={(event) => formik.setFieldValue('title', event.target.value)}
                                    error={!!formik.errors.title} helperText={formik.errors.title}
                                    fullWidth variant="standard"
                                />
                                <Typography>You will be known as:</Typography>
                                <TextField
                                    margin="dense" type="text"
                                    placeholder={formik.values.userTitle}
                                    onChange={(event) => formik.setFieldValue('userTitle', event.target.value)}
                                    error={!!formik.errors.userTitle} helperText={formik.errors.userTitle}
                                    fullWidth variant="standard"
                                />
                            </DialogContent>
                            <DialogActions className={style.dialog__actions}>
                                <Button onClick={onClose}>Cancel</Button>
                                <Button type={"submit"} disabled={!formik.isValid || props.isFetching}>Create</Button>
                            </DialogActions>
                        </Form>
                    </div>
                )}
            </Formik>
        </Dialog>
    );
}

const mapStateToProps = (state: AppState) => ({
    user: state.messenger.user,
    userTitle: state.messenger.user!.title || state.messenger.user!.id,
    isFetching: state.messengerControls.isFetching,
})

const mapDispatchToProps = {
    createNewRoomTF, setUserTitle
}

const connector = connect(mapStateToProps, mapDispatchToProps);

type TProps = ConnectedProps<typeof connector>;

export default connector(CreateNewRoomModal);
import React from "react";
import {connect, ConnectedProps} from "react-redux";
import {AppState} from "../../../index";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@mui/material";
import style from "../../../global-styles/ModalWindow.module.css";
import {Form, Formik} from "formik";
import * as yup from "yup";
import {setIsEditUserTitleModalOpen} from "../../../redux/messenger-controls/messengerControlsActions";
import {updateUserTitle} from "../../../redux/messenger/messengerActions";

const validationSchema = yup.object().shape({
    title: yup.string().required('Title cannot be empty').min(3)
})

const EditUserTitleModal: React.FC<Props> = (props) => {
    console.log(props);
    return (
        <Dialog open={true} maxWidth={"sm"} fullWidth>
            <DialogTitle className={style.dialog__title}>Update your name</DialogTitle>
            <Formik
                initialValues={{title: props.user?.title}}
                onSubmit={(values) => props.updateUserTitle(values.title!)}
                validationSchema={validationSchema}
            >
                {formik => (
                    <div>
                        <Form>

                            <DialogContent className={style.dialog__content}>
                                <TextField
                                    autoFocus margin="dense" type="text"
                                    defaultValue={formik.values.title}
                                    onChange={(event) => formik.setFieldValue('title', event.target.value)}
                                    error={!!formik.errors.title}
                                    fullWidth variant="standard" placeholder={"User title"}
                                />
                            </DialogContent>

                            <DialogActions className={style.dialog__actions}>
                                <Button onClick={() => props.setIsEditUserTitleModalOpen(false)}>Cancel</Button>
                                <Button type={"submit"} disabled={!formik.isValid}>Save</Button>
                            </DialogActions>

                        </Form>
                    </div>
                )}
            </Formik>
        </Dialog>
    )
}

const mapStateToProps = (state: AppState) => {
    const user = state.messenger.user;
    return {
        user: user,
    }
}

const mapDispatchToProps = {
    setIsEditUserTitleModalOpen,
    updateUserTitle
}

const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector>;

export default connector(EditUserTitleModal)
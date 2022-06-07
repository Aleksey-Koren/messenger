import * as yup from "yup";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@mui/material";
import style from "../../../global-styles/ModalWindow.module.css";
import {Form, Formik} from "formik";
import {useAppDispatch, useAppSelector} from "../../../index";
import {setIsNewPrivateModalOpened} from "../../../redux/messenger-controls/messengerControlsActions";


const validationSchema = yup.object().shape({
    userId: yup.string().required("User id can't be empty").min(3)
})

function CreateNewPrivateModal() {
    const isOpened = useAppSelector(state => state.messengerControls.isCreateNewPrivateModalOpened);
    const dispatch = useAppDispatch();

    const onClose = () => dispatch(setIsNewPrivateModalOpened(false));

    return (
        <Dialog open={isOpened} onClose={onClose} maxWidth={"sm"} fullWidth>
            <DialogTitle className={style.dialog__title}>Enter user ID</DialogTitle>
            <Formik
                initialValues={{userId: ''}}
                onSubmit={(values) => {
                    // dispatch(createNewPublicRoomTF(values.title))
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
                                    defaultValue={formik.values.userId}
                                    onChange={(event) => formik.setFieldValue('title', event.target.value)}
                                    error={!!formik.errors.userId} helperText={formik.errors.userId}
                                    fullWidth variant="standard" placeholder={"user ID"}
                                />
                            </DialogContent>
                            <DialogActions className={style.dialog__actions}>
                                <Button onClick={onClose}>Cancel</Button>
                                <Button type={"submit"} disabled={!formik.isValid}>Create</Button>
                            </DialogActions>
                        </Form>
                        {/*<TitleAlreadyExistsModal title={formik.values.title}/>*/}
                    </div>
                )}
            </Formik>
        </Dialog>
    );
}

export default CreateNewPrivateModal;
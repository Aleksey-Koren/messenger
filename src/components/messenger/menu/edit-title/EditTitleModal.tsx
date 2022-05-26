import {Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@mui/material";
import {useAppDispatch, useAppSelector} from "../../../../index";
import {setEditTitleOpen, updateRoomTitle} from "../../../../redux/messenger/messengerActions";
import style from "../../../../global-styles/ModalWindow.module.css";
import {Form, Formik} from "formik";
import * as yup from "yup";
import TitleAlreadyExistsModal from "../../new-room-modal/TitleAlreadyExistsModal";

const validationSchema = yup.object().shape({
    title: yup.string().required('Room title cannot be empty').min(3,)
})

function EditTitleModal() {
    const isOpen = useAppSelector(state => state.messenger.isEditTitleModalOpen);
    const selectedRoom = useAppSelector(state => state.messenger.selectedRoom);
    const dispatch = useAppDispatch();

    const onCloseModal = () => dispatch(setEditTitleOpen(false));

    return (
        <Dialog open={isOpen} onClose={onCloseModal} maxWidth={"sm"} fullWidth>
            <DialogTitle className={style.dialog__title}>Enter room title</DialogTitle>
            <Formik
                initialValues={{title: selectedRoom?.title}}
                onSubmit={(values) => {
                    dispatch(updateRoomTitle(selectedRoom?.id, values.title))
                }}
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
                                <Button onClick={onCloseModal}>Cancel</Button>
                                <Button type={"submit"} disabled={!formik.isValid}>Save</Button>
                            </DialogActions>
                        </Form>
                        <TitleAlreadyExistsModal title={formik.values.title}/>
                    </div>
                )}
            </Formik>
        </Dialog>
    );
}

export default EditTitleModal;
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@mui/material";
import style from "../../../../global-styles/ModalWindow.module.css";
import {Form, Formik} from "formik";
import * as yup from "yup";
import TitleAlreadyExistsModal from "../../new-room-modal/TitleAlreadyExistsModal";

const validationSchema = yup.object().shape({
    title: yup.string().required('Title cannot be empty').min(3,)
})

function EditTitleModal() {

    return (
        <Dialog open={false} onClose={() => {
        }} maxWidth={"sm"} fullWidth>
            <DialogTitle className={style.dialog__title}>Enter room title</DialogTitle>
            <Formik
                initialValues={{title: 'changed room title'}}
                onSubmit={(values) => {
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
                                <Button onClick={() => {
                                }}>Cancel</Button>
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
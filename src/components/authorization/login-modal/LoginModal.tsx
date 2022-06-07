import React from "react";
import {connect, ConnectedProps} from "react-redux";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Tooltip} from "@mui/material";
import style from "./LoginModal.module.css";
import globalStyles from '../../../global-styles/ModalWindow.module.css'
import {AppState} from "../../../index";
import {authenticateTF, setIsWelcomeModalOpen} from "../../../redux/authorization/authorizationActions";
import {Field, Form, Formik} from "formik";
import * as Yup from 'yup';

const LoginModal: React.FC<Props> = (props) => {

    const loginSchema = Yup.object().shape({
        id: Yup.string().required("Can't be empty"),
        pKey: Yup.string().required("Can't be empty")
    });

    return (
        <Dialog open={props.isOpen}>
            <DialogTitle className={globalStyles.dialog__title}>
                Paste your id and private key
            </DialogTitle>

            <Formik
                initialValues={{id: '', pKey: ''}}
                validationSchema={loginSchema}
                onSubmit={() => {}}
                validateOnChange
            >
                {formik => (
                    <Form>
                        <DialogContent className={globalStyles.dialog__content}>
                            <div className={style.dialog__content_container}>
                                <h2>d2577569-b349-40ef-a860-533d377551ea</h2>
                                <Tooltip
                                    title={formik.errors.id ? `${formik.errors.id}` : ''}
                                    open={!!formik.errors.id && !!formik.touched.id}
                                    placement={"right-start"}
                                    arrow
                                >
                                    <div className={style.dialog__content_row}>
                                        <strong className={style.dialog__content_row_label}>ID</strong>
                                        <Field as={"textarea"} name={"id"} rows={1}
                                               className={style.dialog__input_field} placeholder={"Your id"}/>
                                    </div>
                                </Tooltip>
                                <h2>120,84,12,124,175,130,237,207,107,9,186,44,132,37,154,250,61,240,84,18,171,97,251,4,176,244,140,176,182,204,255,58</h2>
                                <Tooltip
                                    title={formik.errors.pKey ? `${formik.errors.pKey}` : ''}
                                    open={!!formik.errors.pKey && !!formik.touched.pKey}
                                    placement={"right-start"}
                                    arrow
                                >
                                    <div className={style.dialog__content_row}>
                                        <strong className={style.dialog__content_row_label}>Private Key</strong>
                                        <Field as={"textarea"} name={"pKey"} rows={3} className={style.dialog__input_field} placeholder={"Your private key"}/>
                                    </div>

                                </Tooltip>
                            </div>
                        </DialogContent>

                        <DialogActions className={globalStyles.dialog__actions}>
                            <Button onClick={() => props.setIsWelcomeModalOpen(true)}>Back</Button>
                            <Button type={"submit"}
                                    disabled={!formik.isValid}
                                    onClick={() => props.authenticateTF(formik.values.id, formik.values.pKey)}
                            >
                                Login
                            </Button>
                        </DialogActions>
                    </Form>
                )}
            </Formik>

        </Dialog>
    );
}

const mapStateToProps = (state: AppState) => ({
    isOpen: state.authorization.isLoginModalOpen
})

const mapDispatchToProps = {
    authenticateTF,
    setIsWelcomeModalOpen
}

const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector>;

export default connector(LoginModal);
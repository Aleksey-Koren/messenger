import React from "react";
import {connect, ConnectedProps} from "react-redux";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Tooltip} from "@mui/material";
import style from "./LoginModal.module.css";
import globalStyles from '../../../global-styles/ModalWindow.module.css'
import {AppState} from "../../../index";
import {
    authenticateTF,
    setIsLoginModalOpen,
    setIsWelcomeModalOpen
} from "../../../redux/authorization/authorizationActions";
import {Field, Form, Formik} from "formik";
import * as Yup from 'yup';

const LoginModal: React.FC<Props> = (props) => {

    const loginSchema = Yup.object().shape({
        id: Yup.string().required("Can't be empty"),
        pKey: Yup.string().required("Can't be empty")
    });

    return (
        <Dialog open={true}>
            <DialogTitle className={globalStyles.dialog__title}>
                Paste your id and private key
            </DialogTitle>

            <Formik
                initialValues={{id: '', pKey: ''}}
                validationSchema={loginSchema}
                onSubmit={(values) => props.authenticateTF(values.id, values.pKey)}
                validateOnChange
            >
                {formik => (
                    <Form>
                        <DialogContent className={globalStyles.dialog__content}>
                            <div className={style.dialog__content_container}>
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
                                <Tooltip
                                    title={formik.errors.pKey ? `${formik.errors.pKey}` : ''}
                                    open={!!formik.errors.pKey && !!formik.touched.pKey}
                                    placement={"right-start"}
                                    arrow
                                >
                                    <div className={style.dialog__content_row}>
                                        <strong className={style.dialog__content_row_label}>Private Key</strong>
                                        <Field as={"textarea"} name={"pKey"} rows={3}
                                               className={style.dialog__input_field} placeholder={"Your private key"}/>
                                    </div>

                                </Tooltip>
                            </div>
                        </DialogContent>

                        <DialogActions className={globalStyles.dialog__actions}>
                            <Button onClick={() => {
                                props.setIsWelcomeModalOpen(true);
                                props.setIsLoginModalOpen(false);
                            }}>
                                Back</Button>
                            <Button type={"submit"}
                                    disabled={!formik.isValid}
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

const mapStateToProps = (state: AppState) => ({})

const mapDispatchToProps = {
    authenticateTF,
    setIsWelcomeModalOpen,
    setIsLoginModalOpen
}

const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector>;

export default connector(LoginModal);
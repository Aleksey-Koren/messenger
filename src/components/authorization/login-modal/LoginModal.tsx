import React, {useState} from "react";
import {connect, ConnectedProps} from "react-redux";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Tooltip} from "@mui/material";
import style from "./LoginModal.module.css";
import globalStyles from '../../../global-styles/ModalWindow.module.css'
import {AppState} from "../../../index";
import {
    authenticateRSA,
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

    const [id, setId] = useState('')
    const [privateKey, setPrivateKey] = useState('')

    const credentialsFromFile = (input: any) => {
        const file = input.target.files[0];

        let fr = new FileReader();
        fr.readAsText(file);
        fr.onload = function () {
            if (fr.result !== null && typeof fr.result == "string") {
                const values = fr.result.split('\n\n')
                setId(values[0])
                setPrivateKey(values[1])
            }
        };
    }

    return (
        <Dialog open={true}>
            <DialogTitle className={globalStyles.dialog__title}>
                Paste your id and private key
            </DialogTitle>

            <Formik
                enableReinitialize={true}
                initialValues={{id: id, pKey: privateKey}}
                validationSchema={loginSchema}
                onSubmit={(values) => props.authenticateRSA(values.id, values.pKey)}
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
                                        <Field as={"textarea"} name={"pKey"} rows={10}
                                               className={style.dialog__input_field}
                                               placeholder={"Your private key"}/>
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


                            <Button component="label">
                                Credentials from file
                                <input
                                    accept={".txt"}
                                    hidden
                                    type="file"
                                    onChange={credentialsFromFile}
                                />
                            </Button>
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
    authenticateRSA,
    setIsWelcomeModalOpen,
    setIsLoginModalOpen
}

const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector>;

export default connector(LoginModal);
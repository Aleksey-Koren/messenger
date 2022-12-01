import React, {useState} from "react";
import {connect, ConnectedProps} from "react-redux";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Tooltip
} from "@mui/material";
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
        privateKey: Yup.string().required("Can't be empty"),
        publicKey: Yup.string().required("Can't be empty"),
    });

    const [id, setId] = useState('')
    const [privateKey, setPrivateKey] = useState('')
    const [publicKey, setPublicKey] = useState('')

    const credentialsFromFile = (input: any) => {
        const file = input.target.files[0];

        let fr = new FileReader();
        fr.readAsText(file);
        fr.onload = function () {
            if (fr.result !== null && typeof fr.result == "string") {
                const values = fr.result.split('\n\n')
                setId(values[0])
                setPrivateKey(values[1])
                setPublicKey(values[2])
            }
        };
    }

    return (
        <Dialog open={true} maxWidth={"sm"} fullWidth={true}>
            <DialogTitle className={globalStyles.dialog__title}>
                Authorization
            </DialogTitle>
            <Formik
                enableReinitialize={true}
                initialValues={{id: id, privateKey: privateKey, publicKey: publicKey}}
                validationSchema={loginSchema}
                onSubmit={(values) => props.authenticateRSA(values.id, values.privateKey)}
                validateOnChange
            >
                {formik => (
                    <Form>
                        <DialogContent className={globalStyles.dialog__content} style={{paddingTop: "0px"}}>
                            <TableContainer>
                                <Table aria-label="simple table">
                                    <TableBody>
                                        <Tooltip
                                            title={formik.errors.id ? `${formik.errors.id}` : ''}
                                            open={!!formik.errors.id && !!formik.touched.id}
                                            placement={"right-start"}
                                            arrow
                                        >
                                            <TableRow>
                                                <TableCell className={style.dialog__no_margin}>
                                                    <strong>ID</strong>
                                                </TableCell>
                                                <TableCell>
                                                    <Field as={"textarea"} name={"id"} rows={1}
                                                           className={style.dialog__input_field}
                                                           placeholder={"Your id"}/>
                                                </TableCell>
                                            </TableRow>
                                        </Tooltip>
                                        <Tooltip
                                            title={formik.errors.privateKey ? `${formik.errors.privateKey}` : ''}
                                            open={!!formik.errors.privateKey && !!formik.touched.privateKey}
                                            placement={"right-start"}
                                            arrow
                                        >
                                            <TableRow>
                                                <TableCell className={style.dialog__no_margin}>
                                                    <strong>Private Key</strong>
                                                </TableCell>
                                                <TableCell>
                                                    <Field as={"textarea"} name={"privateKey"} rows={10}
                                                           className={style.dialog__input_field}
                                                           placeholder={"Your private key"}/>
                                                </TableCell>
                                            </TableRow>
                                        </Tooltip>
                                        <Tooltip
                                            title={formik.errors.publicKey ? `${formik.errors.publicKey}` : ''}
                                            open={!!formik.errors.publicKey && !!formik.touched.publicKey}
                                            placement={"right-start"}
                                            arrow
                                        >
                                            <TableRow>
                                                <TableCell className={style.dialog__no_margin}>
                                                    <strong className={style.dialog__content_row_label}>Public
                                                        Key</strong>
                                                </TableCell>
                                                <TableCell>
                                                    <Field as={"textarea"} name={"publicKey"} rows={10}
                                                           className={style.dialog__input_field}
                                                           placeholder={"Your private key"}/>
                                                </TableCell>
                                            </TableRow>
                                        </Tooltip>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </DialogContent>
                        <DialogActions className={globalStyles.dialog__actions} style={{paddingTop: "0px"}}>
                            <Button onClick={() => {
                                props.setIsWelcomeModalOpen(true);
                                props.setIsLoginModalOpen(false);
                            }}>
                                Back</Button>
                            <Button component="label" variant={"outlined"} style={{
                                borderRadius: "2px",
                                width: "90%",
                                border: "1px solid #90caf9"
                            }}>
                                Upload file
                                <input
                                    accept={".txt"}
                                    hidden
                                    type="file"
                                    onChange={credentialsFromFile}
                                />
                            </Button>
                            <Button type={"submit"}
                                    disabled={!formik.isValid || props.isFetching}
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
    isFetching: state.authorizationReducer.isFetching,
})

const mapDispatchToProps = {
    authenticateRSA,
    setIsWelcomeModalOpen,
    setIsLoginModalOpen
}

const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector>;

export default connector(LoginModal);
import React, {useState} from "react";
import {connect, ConnectedProps} from "react-redux";
import {AppState, store} from "../../../../index";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Tooltip
} from "@mui/material";
import style from "./GlobalUserConfigurationModal.module.css"
import globalModalStyles from '../../../../global-styles/ModalWindow.module.css'
import {
    removeGlobalUserPublicKeyTF,
    setIsConfirmModalOpen,
    setIsGlobalUserConfigurationModalOpen
} from "../../../../redux/messenger-controls/messengerControlsActions";
import DeleteIcon from '@mui/icons-material/Delete';
import PerfectScrollbar from "react-perfect-scrollbar";
import {addGhostUserTF, addPkToGlobalUserTF} from "../../../../redux/messenger/messengerActions";
import ConfirmModal from "../../../confirm-modal/ConfirmModal";
import {Field, Form, Formik} from "formik";
import * as yup from "yup";

const validationSchema = yup.object().shape({
    userId: yup.string()
        .required('User ID cannot be empty')
        .uuid("Not a valid UUID")
        .test('test.ts-global-user-existing', 'User already exists', function (value) {
            return !store.getState().messenger.globalUsers[value!];
        })
});

const GlobalUserConfigurationModal: React.FC<TProps> = (props) => {

    const isGlobalUserToEditExist = !!props.globalUserToEdit;
    const [pkInputValue, setPkInputValue] = useState<string>('');
    const [publicKeyToDelete, setPublicKeyToDelete] = useState<string>();

    return (
        <Dialog open={true} maxWidth="md" fullWidth>
            <DialogTitle
                className={style.dialog__title}>{isGlobalUserToEditExist ? props.globalUserToEdit?.userId : 'Add Ghost User'}
            </DialogTitle>

            <DialogContent className={globalModalStyles.dialog__content}>
                {!isGlobalUserToEditExist &&
                    <Formik
                        initialValues={{userId: ''}}
                        validationSchema={validationSchema}
                        //@TODO WARN check if submit button is blocked untill current request is done
                        onSubmit={(values) => props.addGhostUserTF(values.userId)}
                        validateOnChange
                    >
                        {formik => (
                            <Form>
                                <div className={style.id_input_container}>
                                    <Tooltip
                                        title={formik.errors.userId ? `${formik.errors.userId}` : ''}
                                        open={!!formik.errors.userId && !!formik.touched.userId}
                                        placement={'top-end'}
                                        arrow
                                    >
                                        <label className={style.id_input_label}> User ID:&nbsp;&nbsp;&nbsp;
                                            <Field className={style.id_input} name={'userId'}/>
                                        </label>
                                    </Tooltip>
                                    <button type={'submit'} className={style.add_key_button}
                                            disabled={!formik.isValid}>ADD
                                    </button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                }

                <h3 style={{textAlign: 'center'}}>User Public Keys: </h3>

                <div className={style.keys_list_container}>
                    <PerfectScrollbar>
                        <List>
                            {isGlobalUserToEditExist && props.globalUserToEdit?.certificates.map(cert =>
                                <ListItem key={cert}
                                          secondaryAction={
                                              <IconButton edge="end" aria-label="delete" onClick={() => {
                                                  setPublicKeyToDelete(cert);
                                                  props.setIsConfirmModalOpen(true);
                                              }}>
                                                  <DeleteIcon/>
                                              </IconButton>
                                          }
                                >
                                    <ListItemText
                                        primary={cert}
                                    />
                                </ListItem>
                            )}
                        </List>
                    </PerfectScrollbar>
                </div>

                <div className={style.add_key_container}>
                    <label className={style.id_input_label}>Public Key:&nbsp;&nbsp;&nbsp;
                        <input className={style.id_input}
                               value={pkInputValue}
                               onChange={e => setPkInputValue(e.target.value)}
                        />
                    </label>

                    <button className={style.add_key_button}
                            onClick={() => {
                                //@TODO make button disabled until request is done
                                props.addPkToGlobalUserTF(props.globalUserToEdit!, pkInputValue);
                                setPkInputValue('');
                            }}
                            disabled={!props.globalUserToEdit || pkInputValue.length === 0}
                    >ADD
                    </button>
                </div>

            </DialogContent>

            <DialogActions className={globalModalStyles.dialog__actions}>

                <Button type={"submit"}
                        onClick={() => props.setIsGlobalUserConfigurationModalOpen(false)}>
                    Close</Button>
            </DialogActions>

            {props.isConfirmModalOpen
                && <ConfirmModal
                    confirmFunction={() => props.removeGlobalUserPublicKeyTF(publicKeyToDelete!, props.globalUserToEdit!)}
                    text={"Are you sure that you want to delete public key?"}
                    closeFunction={() => props.setIsConfirmModalOpen(false)}/>
            }
        </Dialog>
    );
}

const mapStateToProps = (state: AppState) => ({
    globalUserToEdit: state.messengerControls.globalUserConfigurationState.globalUserToEdit,
    globalUsers: state.messenger.globalUsers,
    isConfirmModalOpen: state.messengerControls.isConfirmModalOpen
})

const mapDispatchToProps = {
    setIsGlobalUserConfigurationModalOpen,
    addPkToGlobalUserTF,
    addGhostUserTF,
    setIsConfirmModalOpen,
    removeGlobalUserPublicKeyTF,
}

const connector = connect(mapStateToProps, mapDispatchToProps);

type TProps = ConnectedProps<typeof connector>;

export default connector(GlobalUserConfigurationModal);
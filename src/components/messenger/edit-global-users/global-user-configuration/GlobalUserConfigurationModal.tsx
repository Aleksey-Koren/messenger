import React, {useState} from "react";
import {connect, ConnectedProps} from "react-redux";
import {AppState} from "../../../../index";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    List,
    ListItem,
    ListItemText
} from "@mui/material";
import style from "./GlobalUserConfigurationModal.module.css"
import globalModalStyles from '../../../../global-styles/ModalWindow.module.css'
import {setIsGlobalUserConfigurationModalOpen} from "../../../../redux/messenger-controls/messengerControlsActions";
import DeleteIcon from '@mui/icons-material/Delete';
import PerfectScrollbar from "react-perfect-scrollbar";
import {addGhostUserTF, addPkToGlobalUserTF} from "../../../../redux/messenger/messengerActions";

const GlobalUserConfigurationModal: React.FC<TProps> = (props) => {

    const isGlobalUserToEditExist = !!props.globalUserToEdit;
    const [pkInputValue, setPkInputValue] = useState<string>('');
    const [idInputValue, setIdInputValue] = useState<string>('');

    return (
        <Dialog open={true} maxWidth="md" fullWidth>
            <DialogTitle
                className={style.dialog__title}>{isGlobalUserToEditExist ? props.globalUserToEdit?.userId : 'Add Ghost User'}</DialogTitle>
            <div>

                <DialogContent className={globalModalStyles.dialog__content}>

                    {!isGlobalUserToEditExist &&
                    <div className={style.id_input_container}>
                        <label className={style.id_input_label}> User ID:&nbsp;&nbsp;&nbsp;
                            <input className={style.id_input}
                                   value={idInputValue}
                                   onChange={e => setIdInputValue(e.target.value)}/>
                        </label>
                        <button className={style.add_key_button}
                                onClick={() => props.addGhostUserTF(idInputValue)}
                        >ADD
                        </button>
                    </div>
                    }

                    <h3 style={{textAlign: 'center'}}>User Public Keys: </h3>

                    <div className={style.keys_list_container}>
                        <PerfectScrollbar>
                            <List>
                                {isGlobalUserToEditExist && props.globalUserToEdit?.certificates.map(cert =>
                                    <ListItem key={cert}
                                        secondaryAction={
                                            <IconButton edge="end" aria-label="delete">
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
                                    props.addPkToGlobalUserTF(props.globalUserToEdit!, pkInputValue);
                                    setPkInputValue('');
                                }}
                                disabled={!props.globalUserToEdit}
                        >ADD
                        </button>
                    </div>

                </DialogContent>

                <DialogActions className={globalModalStyles.dialog__actions}>

                    <Button type={"submit"}
                            onClick={() => props.setIsGlobalUserConfigurationModalOpen(false)}>
                        Close</Button>
                </DialogActions>
            </div>
        </Dialog>
    );
}

const mapStateToProps = (state: AppState) => ({
    globalUserToEdit: state.messengerControls.globalUserConfigurationState.globalUserToEdit,
    globalUsers: state.messenger.globalUsers
})

const mapDispatchToProps = {
    setIsGlobalUserConfigurationModalOpen,
    addPkToGlobalUserTF,
    addGhostUserTF
}

const connector = connect(mapStateToProps, mapDispatchToProps);

type TProps = ConnectedProps<typeof connector>;

export default connector(GlobalUserConfigurationModal);
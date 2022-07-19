import React from "react";
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
import style from "./GlobalUserConfigurationModal.module.css";
import globalModalStyles from '../../../../global-styles/ModalWindow.module.css'
import {setIsGlobalUserConfigurationModalOpen} from "../../../../redux/messenger-controls/messengerControlsActions";
import DeleteIcon from '@mui/icons-material/Delete';
import PerfectScrollbar from "react-perfect-scrollbar";

const GlobalUserConfigurationModal: React.FC<TProps> = (props) => {

    const isGlobalUserToEditExist = !!props.globalUserToEdit;

    return (
        <Dialog open={true} maxWidth="md" fullWidth>
            <DialogTitle
                className={style.dialog__title}>{isGlobalUserToEditExist ? props.globalUserToEdit?.userId : 'Add Ghost User'}</DialogTitle>
            <div>

                <DialogContent className={globalModalStyles.dialog__content}>

                    {!isGlobalUserToEditExist &&
                        <div className={style.id_input_container}>
                            <label className={style.id_input_label}> User ID:&nbsp;&nbsp;&nbsp;
                                <input className={style.id_input}/>
                            </label>
                        </div>
                    }

                    <h3 style={{textAlign: 'center'}}>User Public Keys: </h3>

                    <div className={style.keys_list_container}>
                        <PerfectScrollbar>
                            <List>
                                <ListItem
                                    secondaryAction={
                                        <IconButton edge="end" aria-label="delete">
                                            <DeleteIcon/>
                                        </IconButton>
                                    }
                                >
                                    <ListItemText
                                        primary="XB1Hyb6+3W9Cy8RWj6vQTo2Mv2ulnyK7FNnDVvdAvCE="
                                    />
                                </ListItem>
                                <ListItem
                                    secondaryAction={
                                        <IconButton edge="end" aria-label="delete">
                                            <DeleteIcon/>
                                        </IconButton>
                                    }
                                >
                                    <ListItemText
                                        primary="XB1Hyb6+3W9Cy8RWj6vQTo2Mv2ulnyK7FNnDVvdAvCE="
                                    />
                                </ListItem>
                                <ListItem
                                    secondaryAction={
                                        <IconButton edge="end" aria-label="delete">
                                            <DeleteIcon/>
                                        </IconButton>
                                    }
                                >
                                    <ListItemText
                                        primary="XB1Hyb6+3W9Cy8RWj6vQTo2Mv2ulnyK7FNnDVvdAvCE="
                                    />
                                </ListItem>
                                <ListItem
                                    secondaryAction={
                                        <IconButton edge="end" aria-label="delete">
                                            <DeleteIcon/>
                                        </IconButton>
                                    }
                                >
                                    <ListItemText
                                        primary="XB1Hyb6+3W9Cy8RWj6vQTo2Mv2ulnyK7FNnDVvdAvCE="
                                    />
                                </ListItem>
                                <ListItem
                                    secondaryAction={
                                        <IconButton edge="end" aria-label="delete">
                                            <DeleteIcon/>
                                        </IconButton>
                                    }
                                >
                                    <ListItemText
                                        primary="XB1Hyb6+3W9Cy8RWj6vQTo2Mv2ulnyK7FNnDVvdAvCE="
                                    />
                                </ListItem>
                                <ListItem
                                    secondaryAction={
                                        <IconButton edge="end" aria-label="delete">
                                            <DeleteIcon/>
                                        </IconButton>
                                    }
                                >
                                    <ListItemText
                                        primary="XB1Hyb6+3W9Cy8RWj6vQTo2Mv2ulnyK7FNnDVvdAvCE="
                                    />
                                </ListItem>
                            </List>
                        </PerfectScrollbar>
                    </div>

                    <div className={style.add_key_container}>
                        <label className={style.id_input_label}>Public Key:&nbsp;&nbsp;&nbsp;
                            <input className={style.id_input}/>
                        </label>

                        <button className={style.add_key_button}>ADD</button>
                    </div>

                </DialogContent>

                <DialogActions className={globalModalStyles.dialog__actions}>
                    <Button onClick={() => {
                        props.setIsGlobalUserConfigurationModalOpen(false)
                    }}>Cancel</Button>

                    <Button type={"submit"}>Save</Button>
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
    setIsGlobalUserConfigurationModalOpen
}

const connector = connect(mapStateToProps, mapDispatchToProps);

type TProps = ConnectedProps<typeof connector>;

export default connector(GlobalUserConfigurationModal);
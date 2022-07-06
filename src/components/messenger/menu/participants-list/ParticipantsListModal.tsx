import React, {useMemo, useState} from "react";
import {connect, ConnectedProps, useDispatch} from "react-redux";
import {
    Button,
    Dialog, DialogActions,
    DialogContent, DialogContentText, DialogTitle,
    IconButton,
    ListItem,
    ListItemIcon, TextField,
    Toolbar,
    Typography
} from "@mui/material";
import AppBar from "@mui/material/AppBar/AppBar";
import CloseIcon from "@mui/icons-material/Close";
import style from './ParticipantsListModal.module.css'
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText/ListItemText";
import StarIcon from '@mui/icons-material/Star';
import PersonIcon from '@mui/icons-material/Person';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import {AppState, useAppDispatch} from "../../../../index";
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import {
    addUserToRoomTF, leaveChatTF,
    setIsMembersModalOpened
} from "../../../../redux/messenger-menu/messengerMenuActions";
import {Form, Formik} from "formik";
import * as yup from "yup";
import {User} from "../../../../model/messenger/user";
import {CustomerApi} from "../../../../api/customerApi";
import Notification from '../../../../Notification'

const validationSchema = yup.object().shape({
    id: yup.string().required('User ID cannot be empty').uuid("Not a valid UUID")
});
const ParticipantsListModal: React.FC<Props> = (props) => {
    //const dispatch = useAppDispatch();
    const dispatch = useDispatch();
    const [deleteConfirm, setDeleteConfirm] = useState<boolean>(false);
    const chatParticipants = useMemo(() => {
        const out:User[] = [];
        for(let key in props.chatParticipants) {
            out.push(props.chatParticipants[key]);
        }
        return out;
    }, [props.chatParticipants])

    return (<>
        <Dialog open={true} maxWidth="sm" fullWidth>
            <AppBar classes={{root: style.dialog__app_bar}}>
                <Toolbar>
                    <Typography variant="h4" component="div" flex={1} mx={3} align={"center"}>
                        Add people to the chat
                    </Typography>
                    <IconButton onClick={() => dispatch(setIsMembersModalOpened(false))}>
                    <CloseIcon fontSize={'large'} classes={{root: style.dialog__close_icon}}/>
                </IconButton>
                </Toolbar>
            </AppBar>

            <Formik
                initialValues={{id: ''}}
                onSubmit={(values, formik) => {
                    return CustomerApi.getCustomer(values.id).then(customer => {
                        props.addUserToRoomTF(props.user!, customer, values.id);
                        formik.setFieldValue('id', '', false);
                    }).catch((e) => {
                        Notification.add({message: "User not found", severity: 'warning', error: e});
                        formik.setFieldValue('id', '', false);
                    });
                }}
                validationSchema={validationSchema}
            >
                {formik => (
                    <div>
                        <Form style={{display: 'flex'}} >
                            <DialogContent className={style.dialog__content}>
                                <TextField
                                    autoComplete={"off"}
                                    autoFocus margin="dense" type="text"
                                    value={formik.values.id}
                                    onChange={(event) => formik.setFieldValue('id', event.target.value)}
                                    error={!!formik.errors.id} helperText={formik.errors.id}
                                    fullWidth variant="standard" placeholder={"User ID"}
                                />
                            </DialogContent>
                            <DialogActions className={style.dialog__actions} style={{marginLeft: 'auto'}}>
                                <Button type={"submit"} disabled={!formik.isValid}>Add</Button>
                            </DialogActions>
                        </Form>
                    </div>
                )}
            </Formik>

            <List dense sx={{width: '100%'}} className={style.dialog__participants_list}>
                {chatParticipants?.map(member => (
                    <ListItem
                        key={member.id}
                        secondaryAction={
                            member.id === props.user?.id && <IconButton
                                onClick={() => {
                                    setDeleteConfirm(true);
                                }}>
                                <RemoveCircleIcon color={"error"} />
                            </IconButton>
                        }
                    >
                        <ListItemIcon>

                            {member.id === props.user?.id
                                ? <StarIcon fontSize={"medium"} color={"warning"}/>
                                : (!member.title
                                    ? <QuestionMarkIcon fontSize={"medium"} color={"warning"}/>
                                    : <PersonIcon fontSize={"medium"} color={"warning"}/>)
                            }
                        </ListItemIcon>
                        <ListItemText>
                            <p className={style.dialog__person_title}>{member.title || member.id}</p>
                        </ListItemText>
                    </ListItem>
                ))}
            </List>
        </Dialog>
        <Dialog open={deleteConfirm}>
            <DialogTitle>Confirm your action</DialogTitle>
            <DialogContent>
            <DialogContentText>
                You are about to leave current chat.
                All your messages will be deleted, and there is no way how to restore them.
                Are you sure to proceed?
            </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setDeleteConfirm(false)}>
                    No
                </Button>
                <Button onClick={() => props.leaveChatTF(props.user!, props.currentChat!)}>
                    Yes
                </Button>
            </DialogActions>
        </Dialog>
    </>
    );
}

const mapStateToProps = (state: AppState) => ({
    chatParticipants: state.messenger.users,
    user: state.messenger.user,
    currentChat: state.messenger.currentChat
})

const mapDispatchToProps = {
    addUserToRoomTF, leaveChatTF
}

const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector>

export default connector(ParticipantsListModal);
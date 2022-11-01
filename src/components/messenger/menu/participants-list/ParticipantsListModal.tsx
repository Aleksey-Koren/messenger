import React, {useMemo, useState} from "react";
import {connect, ConnectedProps, useDispatch} from "react-redux";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle, FormControl,
    IconButton, InputLabel,
    ListItem,
    ListItemIcon, MenuItem, Select,
    TextField,
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
import DeleteIcon from "@mui/icons-material/Delete";
import {AppState} from "../../../../index";
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import {
    addUserToRoomTF, removeCustomerFromChat,
    setIsMembersModalOpened
} from "../../../../redux/messenger-menu/messengerMenuActions";
import {Form, Formik} from "formik";
import * as yup from "yup";
import {User} from "../../../../model/messenger/user";
import {CustomerApi} from "../../../../api/customerApi";
import Notification from '../../../../Notification'
import {leaveChatTF} from "../../../../redux/messenger-controls/messengerControlsActions";
import {Administrator} from "../../../../model/messenger/administrator";
import {assignRoleToCustomer, denyRoleFromCustomer} from "../../../../redux/messenger/messengerActions";
import {UserType} from "../../../../model/messenger/userType";

const validationSchema = yup.object().shape({
    id: yup.string().required('User ID cannot be empty').uuid("Not a valid UUID")
});
const ParticipantsListModal: React.FC<Props> = (props) => {
    const dispatch = useDispatch();
    const [deleteConfirm, setDeleteConfirm] = useState<boolean>(false);
    const [removeMemberConfirm, setRemoveMemberConfirm] = useState<boolean>(false);
    const [currentMember, setCurrentMember] = useState<User | null>(null);

    const chatParticipants = useMemo(() => {
        const out: User[] = [];
        for (let key in props.chatParticipants) {
            out.push(props.chatParticipants[key]);
        }
        return out;
    }, [props.chatParticipants])

    const chatAdministrators = useMemo(() => {
        const out: Administrator[] = [];
        for (let key in props.administrators) {
            out.push(props.administrators[key]);
        }
        return out;
    }, [props.administrators])

    const changeRole = (customerId: string, role: string) => {
        if (role !== UserType.NO_ROLE) {
            props.assignRoleToCustomer(customerId, props.currentChat!, role)
        } else {
            props.denyRoleFromCustomer(customerId, props.currentChat!)
        }
    }

    return (<>
            <Dialog open={true} maxWidth="sm" fullWidth>
                {removeDialog()}
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
                            <Form style={{display: 'flex'}}>
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
                    {chatParticipants?.map((member, index) => (
                        // <Item key={index} member={member} user={props.user}/>
                        <>
                    {Item(member)}
                        </>
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
                    <Button onClick={() => {
                        props.leaveChatTF();
                        setDeleteConfirm(false);
                        props.setIsMembersModalOpened(false);
                    }}>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );

    function removeDialog() {
        return (
            <Dialog open={removeMemberConfirm}>
                <DialogTitle>Remove member</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        You are really want to remove member from chat?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setRemoveMemberConfirm(false)}>
                        No
                    </Button>
                    <Button onClick={() => {
                        props.removeCustomerFromChat(currentMember!.id, props.currentChat!);
                        setRemoveMemberConfirm(false);
                    }}>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }

    function Item(member: User) {
        const roleItem = chatAdministrators?.find(admin => admin.userId === member.id)?.userType || UserType.NO_ROLE
        const userRole = chatAdministrators?.find(admin => admin.userId === props.user?.id)?.userType || UserType.NO_ROLE

        return (
            <ListItem
                key={member.id}
                secondaryAction={
                    member.id === props.user?.id ?
                        <IconButton
                            onClick={() => {
                                setDeleteConfirm(true);
                            }}>
                            <RemoveCircleIcon color={"error"}/>
                        </IconButton>
                        :
                        <>
                            {
                                userRole !== UserType.NO_ROLE &&
                                <IconButton
                                    onClick={() => {
                                        setCurrentMember(member)
                                        setRemoveMemberConfirm(true);
                                    }}
                                >
                                    <DeleteIcon color={"error"}/>
                                </IconButton>
                            }

                        </>

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
                    <div
                        style={{
                            display: "flex", flexDirection: "row",
                            justifyContent: "left", alignItems: "center"
                        }}>
                        <p className={style.dialog__person_title}>{member.title || member.id}</p>
                        <FormControl style={{width: "150px", marginLeft: "10px"}}
                                     size={"small"}
                                     disabled={userRole === UserType.NO_ROLE}
                        >
                            <InputLabel>Role</InputLabel>
                            <Select
                                defaultValue={roleItem}
                                label="Role"
                                onChange={event => changeRole(member.id, event.target.value)}
                            >
                                <MenuItem value={UserType.NO_ROLE}>No role</MenuItem>
                                <MenuItem value={UserType.ADMINISTRATOR}>Administrator</MenuItem>
                                <MenuItem value={UserType.MODERATOR}>Moderator</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                </ListItemText>
            </ListItem>
        )
    }
}

const mapStateToProps = (state: AppState) => ({
    chatParticipants: state.messenger.users,
    administrators: state.messenger.administrators,
    user: state.messenger.user,
    currentChat: state.messenger.currentChat
})

const mapDispatchToProps = {
    addUserToRoomTF,
    removeCustomerFromChat,
    leaveChatTF,
    setIsMembersModalOpened,
    assignRoleToCustomer,
    denyRoleFromCustomer,
}

const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector>

export default connector(ParticipantsListModal);
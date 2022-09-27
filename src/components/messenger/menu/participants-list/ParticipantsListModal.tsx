import React, {useState} from "react";
import {connect, ConnectedProps, useDispatch} from "react-redux";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    ListItem,
    ListItemIcon, Menu, MenuItem,
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
import {AppState} from "../../../../index";
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import {setIsMembersModalOpened} from "../../../../redux/messenger-menu/messengerMenuActions";
import {Form, Formik} from "formik";
import * as yup from "yup";
import {leaveChatTF} from "../../../../redux/messenger-controls/messengerControlsActions";
import {addCustomerToChat} from "../../../../redux/chats/chatsActions";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const validationSchema = yup.object().shape({
    id: yup.string().required('User ID cannot be empty').uuid("Not a valid UUID")
});
const ParticipantsListModal: React.FC<Props> = (props) => {
    const dispatch = useDispatch();
    const [deleteConfirm, setDeleteConfirm] = useState<boolean>(false);

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: any) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (<>
            <Dialog open={true} maxWidth="sm" fullWidth>
                <AppBar classes={{root: style.dialog__app_bar}}>
                    <Toolbar>
                        <Typography variant="h4" component="div" flex={1} mx={3} align={"center"}>
                            Members of chat
                        </Typography>
                        <IconButton onClick={() => dispatch(setIsMembersModalOpened(false))}>
                            <CloseIcon fontSize={'large'} classes={{root: style.dialog__close_icon}}/>
                        </IconButton>
                    </Toolbar>
                </AppBar>

                {
                    props.currentMember!.role !== "NONE" ?
                        <Formik
                            initialValues={{id: ''}}
                            onSubmit={(values) => {
                                props.addCustomerToChat(props.currentChat!.id, values.id)
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
                        : null
                }
                <List dense sx={{width: '100%'}} className={style.dialog__participants_list}>
                    {props.currentChatMembers?.map(member => (
                        <ListItem
                            key={member.id}
                            secondaryAction={
                                member.id === props.user?.id && <IconButton
                                    onClick={handleClick}
                                    // onClick={() => {

                                        // setDeleteConfirm(true);
                                    // }}>
                                >
                                    <MoreVertIcon/>
                                    {/*<RemoveCircleIcon color={"error"}/>*/}
                                </IconButton>
                            }
                        >
                            <ListItemIcon>
                                {member.id === props.user?.id
                                    ? <StarIcon fontSize={"medium"} color={"warning"}/>
                                    : (!member.id
                                        ? <QuestionMarkIcon fontSize={"medium"} color={"warning"}/>
                                        : <PersonIcon fontSize={"medium"} color={"warning"}/>)
                                }
                            </ListItemIcon>
                            <ListItemText>
                                <p className={style.dialog__person_title}>{member.id} ({member.role})</p>
                            </ListItemText>
                        </ListItem>
                    ))}
                </List>
                <div>
                    <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        MenuListProps={{
                            'aria-labelledby': 'basic-button',
                        }}
                    >
                        <MenuItem>
                            <ListItemIcon><EditIcon fontSize="medium"/></ListItemIcon>
                            <ListItemText>Edit</ListItemText>
                        </MenuItem>
                        <MenuItem>
                            <ListItemIcon><DeleteIcon fontSize="medium"/></ListItemIcon>
                            <ListItemText>Delete</ListItemText>
                        </MenuItem>
                    </Menu>
                </div>
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
                        // props.leaveChatTF();
                        setDeleteConfirm(false);
                        props.setIsMembersModalOpened(false);
                    }}>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

const mapStateToProps = (state: AppState) => ({
    user: state.messenger.user,
    currentChat: state.chats.chat,
    currentChatMembers: state.chats.members,
    currentMember: state.chats.member,
})

const mapDispatchToProps = {
    leaveChatTF,
    setIsMembersModalOpened,
    addCustomerToChat,

}

const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector>

export default connector(ParticipantsListModal);
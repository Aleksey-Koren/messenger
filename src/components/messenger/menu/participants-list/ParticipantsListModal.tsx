import React from "react";
import {connect, ConnectedProps} from "react-redux";
import {Dialog, IconButton, ListItem, ListItemIcon, Toolbar, Typography} from "@mui/material";
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
import {setIsMembersModalOpened} from "../../../../redux/messenger-menu/messengerMenuActions";

const ParticipantsListModal: React.FC<Props> = (props) => {
    const dispatch = useAppDispatch();
    const chatParticipants = props.chatParticipants && Array.from(props.chatParticipants?.values());

    return (
        <Dialog open={props.isOpen} maxWidth="sm" fullWidth>
            <AppBar classes={{root: style.dialog__app_bar}}>
                <Toolbar>
                    <IconButton onClick={() => dispatch(setIsMembersModalOpened(false))}>
                        <CloseIcon fontSize={'large'} classes={{root: style.dialog__close_icon}}/>
                    </IconButton>
                    <Typography variant="h4" component="div" flex={1} mx={3} align={"center"}>
                        {props.chatParticipants?.size} members
                    </Typography>
                </Toolbar>
            </AppBar>
            <List dense sx={{width: '100%'}} className={style.dialog__participants_list}>
                {chatParticipants?.map(member => (
                    <ListItem
                        key={member.id}
                        secondaryAction={
                            <IconButton
                                onClick={() => {
                                }}>
                                <RemoveCircleIcon className={style.dialog__remove_icon}/>
                            </IconButton>
                        }
                    >
                        <ListItemIcon>

                            {member.id === props.user?.id
                                ? <StarIcon fontSize={"medium"} className={style.dialog__star_icon}/>
                                : (!member.title
                                    ? <QuestionMarkIcon fontSize={"medium"} className={style.dialog__person_icon}/>
                                    : <PersonIcon fontSize={"medium"} className={style.dialog__person_icon}/>)
                            }
                        </ListItemIcon>
                        <ListItemText>
                            <p className={style.dialog__person_title}>{member.title || member.id}</p>
                        </ListItemText>
                    </ListItem>
                ))}
            </List>
        </Dialog>
    );
}

const mapStateToProps = (state: AppState) => ({
    isOpen: state.messengerMenu.isMembersModalOpen,
    chatParticipants: state.messenger.users,
    user: state.messenger.user
})

const mapDispatchToProps = {}

const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector>

export default connector(ParticipantsListModal);
import Grid from "@mui/material/Grid/Grid";
import List from "@mui/material/List";
import style from "../Messenger.module.css";
import ListItem from "@mui/material/ListItem/ListItem";
import ListItemText from "@mui/material/ListItemText/ListItemText";
import {IconButton} from "@mui/material";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import Divider from "@mui/material/Divider";
import {AppState} from "../../../index";
import {Message} from "../../../model/message";
import React from "react";
import {connect, ConnectedProps} from "react-redux";


const MessagesList: React.FC<Props> = (props) => {

    const userId = props.user?.id;

    const createEditIcon = (message: Message) => (

        userId === message.sender &&
        <IconButton className={style.message_edit_button} onClick={() => {
        }}>
            <BorderColorIcon fontSize={"small"}/>
        </IconButton>
    );

    return (
        <Grid item>
            <List className={style.message_list} id={'list'}>
                {/* This place should start a loop for room messages and create ListItem for each message */}
                {props.messages?.map(message => (
                    <ListItem key={message.id}>
                        <Grid container>
                            <Grid item xs={12}>
                                <div className={style.message_container} style={{
                                    float: (message.sender === userId ? 'right' : 'left'), // my messages - right, others - left
                                    background: (message.sender === userId ? '#60ad60' : 'grey') // my messages #60ad60, others - grey
                                }}>
                                    <ListItemText>
                                    <span className={style.message_info}>
                                        {createEditIcon(message)}
                                        {`${message.created} | ${props.chatParticipants?.get(message.sender!)?.title || message.sender}`}
                                    </span>
                                    </ListItemText>

                                    <ListItemText>
                                        <span className={style.message}>{message.data}</span>
                                    </ListItemText>
                                </div>
                            </Grid>
                        </Grid>
                    </ListItem>
                ))}
            </List>
            <Divider style={{background: '#ecca19'}}/>
        </Grid>
    );
}

const mapStateToProps = (state: AppState) => ({
    messages: state.messenger.messages,
    chatParticipants: state.messenger.users,
    user: state.messenger.user
})

const mapDispatchToProps = {}

const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector>;

export default connector(MessagesList);
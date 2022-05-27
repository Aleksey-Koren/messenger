import Grid from "@mui/material/Grid/Grid";
import List from "@mui/material/List";
import style from "../Messenger.module.css";
import ListItem from "@mui/material/ListItem/ListItem";
import ListItemText from "@mui/material/ListItemText/ListItemText";
import {IconButton} from "@mui/material";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import Divider from "@mui/material/Divider";
import React, {Dispatch, SetStateAction} from "react";

interface MessagesListProps {
    currentUserId: number;
    setMessageText: Dispatch<SetStateAction<string>>;
}

function MessagesList(props: MessagesListProps) {

    const createEditIcon = (message: any) => (
        props.currentUserId === 2 &&           //if current user is message sender => create Edit Icon
        <IconButton className={style.message_edit_button} onClick={() => {
        }}>
            <BorderColorIcon fontSize={"small"}/>
        </IconButton>
    );

    return (
        <Grid item>
            <List className={style.message_list} id={'list'}>
                {/* This place should start a loop for room messages and create ListItem for each message */}
                <ListItem key={2}>
                    <Grid container>
                        <Grid item xs={12}>
                            {3 + 2 === 5 &&     // if message is not a system
                                <div className={style.message_container} style={{
                                    float: (2 === 2 ? 'right' : 'left'), // my messages - right, others - left
                                    background: (2 === 2 ? '#60ad60' : 'grey') // my messages #60ad60, others - grey
                                }}>
                                    <ListItemText>
                                    <span className={style.message_info}>
                                        {createEditIcon({})}
                                        Message create time and owner title
                                    </span>
                                    </ListItemText>

                                    <ListItemText>
                                        <span className={style.message}>Message text</span>
                                    </ListItemText>
                                </div>
                            }
                        </Grid>
                    </Grid>
                </ListItem>

                <ListItem key={3}>
                    <Grid container>
                        <Grid item xs={12}>
                            <div className={style.system_message}>
                                <span>This is system message</span>
                            </div>
                        </Grid>
                    </Grid>
                </ListItem>

            </List>
            <Divider style={{background: '#ecca19'}}/>
        </Grid>
    );
}


export default MessagesList;
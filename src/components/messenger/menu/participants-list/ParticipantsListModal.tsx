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

const ParticipantsListModal: React.FC<Props> = (props) => {

    return (
        <Dialog open={false} maxWidth="sm" fullWidth>
            <AppBar classes={{root: style.dialog__app_bar}}>
                <Toolbar>
                    <IconButton onClick={() => {
                    }}>
                        <CloseIcon fontSize={'large'} classes={{root: style.dialog__close_icon}}/>
                    </IconButton>
                    <Typography variant="h4" component="div" flex={1} mx={3} align={"center"}>
                        Number of participants
                    </Typography>
                </Toolbar>
            </AppBar>
            <List dense sx={{width: '100%'}} className={style.dialog__participants_list}>

                {/* This place should start a loop for room members and create ListItem for each member */}
                <ListItem
                    key={1}
                    secondaryAction={ // add icon for delete member
                        <IconButton
                            onClick={() => {
                            }}>
                            <RemoveCircleIcon className={style.dialog__remove_icon}/>
                        </IconButton>
                    }
                >
                    <ListItemIcon>
                        {2 * 2 === 4
                            ? <StarIcon fontSize={"medium"} className={style.dialog__star_icon}/> //This icon for room admin
                            : <PersonIcon fontSize={"medium"} className={style.dialog__person_icon}/> //This icon for common members
                        }
                    </ListItemIcon>
                    <ListItemText>
                        <p className={style.dialog__person_title}>Member title</p>
                    </ListItemText>
                </ListItem>

            </List>
        </Dialog>
    );
}

const mapStateToProps = (state: any) => ({})

const mapDispatchToProps = {}

const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector>

export default connector(ParticipantsListModal);
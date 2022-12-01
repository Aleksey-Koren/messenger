
import CloseIcon from '@mui/icons-material/Close';
import { AppBar, Dialog, IconButton, Toolbar, Typography } from '@mui/material';
import React from 'react';
import { connect, ConnectedProps, useDispatch } from 'react-redux';
import { AppState } from '../../../..';
import { setIsBotsModalOpened } from '../../../../redux/messenger-menu/messengerMenuActions';
import style from './BotsModal.module.css';

const BotsModal: React.FC<Props> = (props) => {
  const dispatch = useDispatch();

  return (
    <Dialog open={true} maxWidth="sm" fullWidth>
        <AppBar classes={{root: style.dialog__app_bar}}>
            <Toolbar>
                <Typography variant="h4" component="div" flex={1} mx={3} align={"center"}>
                    Add bots to the chat
                </Typography>
                <IconButton onClick={() => dispatch(setIsBotsModalOpened(false))}>
                    <CloseIcon fontSize={'large'} classes={{root: style.dialog__close_icon}}/>
                </IconButton>
            </Toolbar>
        </AppBar>
    </Dialog>
  )
}


const mapStateToProps = (state: AppState) => ({
    chatParticipants: state.messenger.users,
    // chatBots: state.messenger.bots,
    user: state.messenger.user,
    currentChat: state.messenger.currentChat
})

const mapDispatchToProps = {
    setIsBotsModalOpened,
}

const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector>

export default connector(BotsModal);
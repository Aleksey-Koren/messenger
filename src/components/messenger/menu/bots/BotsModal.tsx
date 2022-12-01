
import CloseIcon from '@mui/icons-material/Close';
import { AppBar, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, List, TextField, Toolbar, Typography } from '@mui/material';
import { Form, Formik } from 'formik';
import React from 'react';
import { connect, ConnectedProps, useDispatch } from 'react-redux';
import { AppState } from '../../../..';
import { setIsBotsModalOpened } from '../../../../redux/messenger-menu/messengerMenuActions';
import style from './BotsModal.module.css';

const BotsModal: React.FC<Props> = (props) => {
  const dispatch = useDispatch();

  return (<>
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


                <Formik
                    initialValues={{id: ''}}
                    onSubmit={(values, formik) => {
                        // return CustomerApi.getCustomer(values.id).then(customer => {
                        //     props.addUserToRoomTF(props.user!, customer, values.id);
                        //     formik.setFieldValue('id', '', false);
                        // }).catch((e) => {
                        //     Notification.add({message: "User not found", severity: 'warning', error: e});
                        //     formik.setFieldValue('id', '', false);
                        // });
                        return;
                    }}
                    // validationSchema={validationSchema}
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
                    {/* {chatBots?.map((bot, index) => (
                        <Item key={index} member={bot} user={props.user}/>
                    ))} */}
                </List>
            </Dialog>
            <Dialog open={false}>
            {/* <Dialog open={deleteConfirm}> */}
                <DialogTitle>Confirm your action</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        You are about to leave current chat.
                        All your messages will be deleted, and there is no way how to restore them.
                        Are you sure to proceed?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button>
                    {/* <Button onClick={() => setDeleteConfirm(false)}> */}
                        No
                    </Button>
                    <Button onClick={() => {
                        // props.leaveChatTF();
                        // setDeleteConfirm(false);
                        props.setIsBotsModalOpened(false);
                    }}>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
    </>

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
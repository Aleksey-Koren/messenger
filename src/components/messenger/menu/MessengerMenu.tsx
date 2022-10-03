import {Divider, IconButton, Menu, MenuItem} from "@mui/material";
import React, {useState} from "react";
import EditIcon from '@mui/icons-material/Edit';
import Groups from '@mui/icons-material/Groups';
import MenuIcon from '@mui/icons-material/Menu';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import {IPlainDataAction} from "../../../redux/redux-types";
import {AppState, useAppDispatch} from "../../../index";
import {
    setIsEditGlobalUsersModalOpened,
    setIsEditRoomTitleModalOpen
} from "../../../redux/messenger-menu/messengerMenuActions";
import {setIsMembersModalOpened} from "../../../redux/messenger-menu/messengerMenuActions";
import CreateNewPublicButton from "../new-public/CreateNewPublicButton";
import EditUserTitleButton from "../edit-user-title/EditUserTitleButton";
import IconedButton from "../../button/IconedButton";
import {connect, ConnectedProps} from "react-redux";
import {logout} from "../../../redux/authorization/authorizationActions";
import {
    setIsLeaveChatConfirmModalOpened,
    setIsNewRoomModalOpened
} from "../../../redux/messenger-controls/messengerControlsActions";
import Chat from "@mui/icons-material/Chat";


function MessengerMenu(props: TProps) {
    const [anchorEl, setAnchorEl] = useState(null);
    const dispatch = useAppDispatch();

    const onMenuItemClick = (dispatchAction: (isOpen: boolean) => IPlainDataAction<boolean>) => {
        setAnchorEl(null);
        dispatch(dispatchAction(true))
    }

    return (
        <div style={{marginLeft: "auto"}}>
            <IconButton color={"secondary"} onClick={(event: any) => setAnchorEl(event.currentTarget)}>
                <MenuIcon color="primary"/>
            </IconButton>
            <Menu
                anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
                transformOrigin={{vertical: 'top', horizontal: 'right'}}
                anchorEl={anchorEl}
                open={!!anchorEl}
                onClose={() => setAnchorEl(null)}
            >

                <div>
                    {props.chatSelected &&
                    <>
                        <MenuItem>
                            <EditUserTitleButton/>
                        </MenuItem>
                        <MenuItem>
                            <IconedButton onClick={() => onMenuItemClick(props.setIsEditRoomTitleModalOpen)}
                                          icon={<EditIcon style={{marginRight: '10px'}} fontSize={"medium"}/>}
                                          text={"Rename chat"}/>
                        </MenuItem>
                        <MenuItem>
                            <IconedButton onClick={() => onMenuItemClick(props.setIsMembersModalOpened)}
                                          icon={<Groups style={{marginRight: '10px'}} fontSize={"medium"}/>}
                                          text={"Members"}/>
                        </MenuItem>
                        <MenuItem>
                            <IconedButton onClick={() => onMenuItemClick(props.setIsLeaveChatConfirmModalOpened)}
                                          icon={<ExitToAppIcon style={{marginRight: '10px'}} fontSize={'medium'}/>}
                                          text={"Leave chat"}/>
                        </MenuItem>
                        <Divider/>
                    </>
                    }
                    <MenuItem>
                        <IconedButton onClick={() => onMenuItemClick(props.setIsEditGlobalUsersModalOpened)}
                                      icon={<Groups style={{marginRight: '10px'}} fontSize={"medium"}/>}
                                      text={"Edit Global Users"}/>
                    </MenuItem>
                    <MenuItem>
                        {/*<CreateNewPublicButton/>*/}
                        <IconedButton icon={<Chat style={{marginRight: '10px'}} />}
                                      text={"New chat"}
                                      onClick={() => onMenuItemClick(props.setIsNewRoomModalOpened)} />
                    </MenuItem>
                    <MenuItem>
                        <IconedButton onClick={() => onMenuItemClick(props.logout)}
                                      icon={<ExitToAppIcon style={{marginRight: '10px'}} fontSize={"medium"}/>}
                                      text={"Logout"}/>
                    </MenuItem>
                </div>
            </Menu>

        </div>
    );
}


const mapStateToProps = (state: AppState) => ({
    chatSelected: !!state.messenger.currentChat,
})

const mapDispatchToProps = {
    setIsEditGlobalUsersModalOpened,
    setIsEditRoomTitleModalOpen,
    setIsMembersModalOpened,
    setIsNewRoomModalOpened,
    setIsLeaveChatConfirmModalOpened,
    logout
}

const connector = connect(mapStateToProps, mapDispatchToProps);

type TProps = ConnectedProps<typeof connector>;

export default connector(MessengerMenu);

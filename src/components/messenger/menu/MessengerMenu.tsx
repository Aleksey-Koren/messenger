import {IconButton, Menu, MenuItem} from "@mui/material";
import React, {useState} from "react";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import Groups from '@mui/icons-material/Groups';
import PersonAdd from '@mui/icons-material/PersonAdd';
import ListIcon from '@mui/icons-material/List';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import Divider from "@mui/material/Divider";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import {IPlainDataAction} from "../../../redux/redux-types";
import {useAppDispatch, useAppSelector} from "../../../index";
import {setIsEditRoomTitleModalOpen} from "../../../redux/messenger-menu/messengerMenuActions";
import {setIsAddUserModalOpened, setIsMembersModalOpened} from "../../../redux/messenger-menu/messengerMenuActions";
import CreateNewPublicButton from "../new-public/CreateNewPublicButton";
import EditUserTitleButton from "../edit-user-title/EditUserTitleButton";
import IconedButton from "../../button/IconedButton";


function MessengerMenu() {
    const [anchorEl, setAnchorEl] = useState(null);
    const dispatch = useAppDispatch();

    const onMenuItemClick = (dispatchAction: (isOpen: boolean) => IPlainDataAction<boolean>) => {
        setAnchorEl(null);
        dispatch(dispatchAction(true))
    }

    return (
        <div style={{marginLeft: "auto"}}>
            <IconButton color={"secondary"} onClick={(event: any) => setAnchorEl(event.currentTarget)}>
                <MoreVertIcon/>
            </IconButton>
            <Menu
                anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
                transformOrigin={{vertical: 'top', horizontal: 'right'}}
                anchorEl={anchorEl}
                open={!!anchorEl}
                onClose={() => setAnchorEl(null)}
            >

                    <div>
                        <MenuItem>
                            <EditUserTitleButton/>
                        </MenuItem>
                        <MenuItem>
                            <IconedButton onClick={() => onMenuItemClick(setIsEditRoomTitleModalOpen)}
                                          icon={<EditIcon style={{marginRight: '10px'}} fontSize={"medium"}/>}
                                          text={"Rename Room"}/>
                        </MenuItem>
                        <MenuItem>
                            <IconedButton onClick={() => onMenuItemClick(setIsAddUserModalOpened)}
                                          icon={<PersonAdd fontSize={'medium'} style={{marginRight: '10px'}}/>}
                                          text={"Add members"}/>
                        </MenuItem>
                        <MenuItem>
                            <IconedButton onClick={() => onMenuItemClick(setIsMembersModalOpened)}
                                          icon={<Groups style={{marginRight: '10px'}} fontSize={"medium"}/>}
                                          text={"Members"}/>
                        </MenuItem>
                        <MenuItem>
                            <CreateNewPublicButton/>
                        </MenuItem>
                        <MenuItem>
                            <IconedButton onClick={() => onMenuItemClick(setIsMembersModalOpened)}
                                          icon={<ExitToAppIcon style={{marginRight: '10px'}} fontSize={"medium"}/>}
                                          text={"Logout"}/>
                        </MenuItem>
                        {/*<Divider/>*/}
                        {/*<MenuItem onClick={() => {*/}
                        {/*}}>*/}
                        {/*    <ExitToAppIcon style={{marginRight: '10px'}} fontSize={'medium'}/>*/}
                        {/*    Leave room*/}
                        {/*</MenuItem>*/}
                    </div>

                {/*{3 === 3 &&     // if room type is private or current user is room admin*/}
                {/*    <MenuItem onClick={() => {*/}
                {/*    }}>*/}
                {/*        <DeleteOutlineOutlinedIcon style={{marginRight: '10px', color: 'red'}} fontSize={'medium'}/>*/}
                {/*        <span style={{color: 'red'}}>Delete room</span>*/}
                {/*    </MenuItem>*/}
                {/*}*/}
            </Menu>

        </div>
    );
}

export default MessengerMenu;
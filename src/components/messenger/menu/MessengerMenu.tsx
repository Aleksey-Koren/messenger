import {IconButton, Menu, MenuItem} from "@mui/material";
import {useState} from "react";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import ListIcon from '@mui/icons-material/List';
import {RoomType} from "../../../model/messenger/room/RoomType";
import {useAppDispatch, useAppSelector} from "../../../index";
import {
    setEditTitleOpen,
    setIsAddUsersModalOpened,
    setParticipantsListModalOpen
} from "../../../redux/messenger/messengerActions";
import {IPlainDataAction} from "../../../redux/redux-types";
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import Divider from "@mui/material/Divider";
import {RoomService} from "../../../service/messenger/room/RoomService";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import {retrieveUserId} from "../../../service/authService";
import {openConfirmModal} from "../../../redux/app/appActions";

function MessengerMenu() {
    const [anchorEl, setAnchorEl] = useState(null);
    const selectedRoom = useAppSelector(state => state.messenger.selectedRoom);
    const dispatch = useAppDispatch();

    const onMenuItemClick = (dispatchAction: (isOpen: boolean) => IPlainDataAction<boolean>) => {
        setAnchorEl(null);
        dispatch(dispatchAction(true))
    }

    const onLeaveRoomClick = () => {
        setAnchorEl(null);
        dispatch(openConfirmModal(() => RoomService.leaveFromRoom(selectedRoom?.id), 'Do you want leave from room?'));
    }

    const onDeleteRoomClick = () => {
        setAnchorEl(null);
        dispatch(openConfirmModal(() => RoomService.deleteRoom(selectedRoom?.id), 'Do you want delete room?'))
    }

    return (
        <div>
            <IconButton onClick={(event: any) => setAnchorEl(event.currentTarget)}>
                <MoreVertIcon/>
            </IconButton>
            <Menu
                anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
                transformOrigin={{vertical: 'top', horizontal: 'right'}}
                anchorEl={anchorEl}
                open={!!anchorEl}
                onClose={() => setAnchorEl(null)}
            >
                {selectedRoom?.roomType === RoomType.PUBLIC &&
                    <div>
                        <MenuItem onClick={() => onMenuItemClick(setEditTitleOpen)}>
                            <EditIcon style={{marginRight: '10px'}} fontSize={"medium"}/>
                            Edit Title
                        </MenuItem>
                        <MenuItem onClick={() => onMenuItemClick(setIsAddUsersModalOpened)}>
                            <AddIcon fontSize={'medium'} style={{marginRight: '10px'}}/>
                            Add members
                        </MenuItem>
                        <MenuItem onClick={() => onMenuItemClick(setParticipantsListModalOpen)}>
                            <ListIcon style={{marginRight: '10px'}} fontSize={"medium"}/>
                            Members
                        </MenuItem>
                        <Divider/>
                        <MenuItem onClick={onLeaveRoomClick}>
                            <ExitToAppIcon style={{marginRight: '10px'}} fontSize={'medium'}/>
                            Leave room
                        </MenuItem>
                    </div>
                }

                {(selectedRoom?.roomType === RoomType.PRIVATE || selectedRoom?.ownerId === retrieveUserId()) &&
                    <MenuItem onClick={onDeleteRoomClick}>
                        <DeleteOutlineOutlinedIcon style={{marginRight: '10px', color: 'red'}} fontSize={'medium'}/>
                        <span style={{color: 'red'}}>Delete room</span>
                    </MenuItem>
                }
            </Menu>
        </div>
    );
}

export default MessengerMenu;
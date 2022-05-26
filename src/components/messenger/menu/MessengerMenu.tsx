import {IconButton, Menu, MenuItem} from "@mui/material";
import {useState} from "react";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import ListIcon from '@mui/icons-material/List';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import Divider from "@mui/material/Divider";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';


function MessengerMenu() {
    const [anchorEl, setAnchorEl] = useState(null);

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
                {2 === 2 &&      //if room is public
                    <div>
                        <MenuItem onClick={() => {
                        }}>
                            <EditIcon style={{marginRight: '10px'}} fontSize={"medium"}/>
                            Edit Title
                        </MenuItem>
                        <MenuItem onClick={() => {
                        }}>
                            <AddIcon fontSize={'medium'} style={{marginRight: '10px'}}/>
                            Add members
                        </MenuItem>
                        <MenuItem onClick={() => {
                        }}>
                            <ListIcon style={{marginRight: '10px'}} fontSize={"medium"}/>
                            Members
                        </MenuItem>
                        <Divider/>
                        <MenuItem onClick={() => {
                        }}>
                            <ExitToAppIcon style={{marginRight: '10px'}} fontSize={'medium'}/>
                            Leave room
                        </MenuItem>
                    </div>
                }

            </Menu>
            {3 === 3 &&     // if room type is private or current user is room admin
                <MenuItem onClick={() => {}}>
                    <DeleteOutlineOutlinedIcon style={{marginRight: '10px', color: 'red'}} fontSize={'medium'}/>
                    <span style={{color: 'red'}}>Delete room</span>
                </MenuItem>
            }
        </div>
    );
}

export default MessengerMenu;
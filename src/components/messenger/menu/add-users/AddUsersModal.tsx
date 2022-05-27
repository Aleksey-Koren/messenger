// import {setIsAddUsersModalOpened} from "../../../../redux/messenger/messengerActions";
import {connect, ConnectedProps} from "react-redux";
// import {AppState} from "../../../../index";
import React, {useState} from "react";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import AddUserSelect from "../../select/AddUserSelect";
import style from "./Add-users.module.css"
// import {User} from "../../../../model/User";
// import {RoomService} from "../../../../service/messenger/room/RoomService";

const AddUsersModal: React.FC<TProps> = (props) => {

    // const handleClose = () => {
    //     props.setIsAddUsersModalOpened(false);
    //     setSelectedUsers(new Array<User>())
    // };

    // const handleSubmit = () => {
    //     const userIds = selectedUsers.map(s => s.id);
    //     RoomService.inviteToRoom(userIds, props.room.id);
    //     handleClose();
    // }

    // const [selectedUsers, setSelectedUsers] = useState<User[]>(new Array<User>());

    return (
            <Dialog open={false} onClose={() => {}} className={style.add_users_dialog}>
                <div className={style.dialog_container}>
                    <DialogTitle className={style.dialog_title}>Add members to room</DialogTitle>
                    <DialogContent className={style.dialog_content}>
                        <div className={style.select}>
                            <AddUserSelect /*selectedUsers={selectedUsers}
                                           setSelectedUsers={setSelectedUsers}
                                           isDisabled={selectedUsers.length >= 10}*/
                            />
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => {}} style={{color: "#ecca19"}}>Cancel</Button>
                        <Button onClick={() => {}} style={{color: "#ecca19"}}>Add</Button>
                    </DialogActions>
                </div>
            </Dialog>
    );
}

const mapStateToProps = () => ({

})

const mapDispatchToProps = {

}

const connector = connect(mapStateToProps, mapDispatchToProps);

type TProps = ConnectedProps<typeof connector>;

export default connector(AddUsersModal);
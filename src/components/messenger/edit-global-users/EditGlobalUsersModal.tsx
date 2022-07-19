import {AppState} from "../../../index";
import {
    setIsEditGlobalUsersModalOpened,
    setIsEditRoomTitleModalOpen, setIsMembersModalOpened
} from "../../../redux/messenger-menu/messengerMenuActions";
import {connect, ConnectedProps} from "react-redux";
import React from "react";
import {Button, Dialog, DialogContent, DialogTitle, IconButton, Toolbar, Typography} from "@mui/material";
import AppBar from "@mui/material/AppBar/AppBar";
import style from "./EditGlobalUsers.module.css";
import CloseIcon from "@mui/icons-material/Close";
import PerfectScrollbar from "react-perfect-scrollbar";
import {StringIndexArray, stringIndexArrayToArray} from "../../../model/stringIndexArray";
import {GlobalUser} from "../../../model/local-storage/localStorageTypes";


const EditGlobalUsersModal: React.FC<TProps> = (props) => {
    return (
        <Dialog open={true} maxWidth="md" fullWidth>
            <AppBar classes={{root: style.dialog__app_bar}}>
                <Toolbar>
                    <Button variant="contained">
                        Add Ghost user
                    </Button>
                    <Typography variant="h4" component="div" flex={1} mx={3} align={"center"}>
                        Edit Global Users
                    </Typography>
                    <IconButton
                        onClick={() => props.setIsEditGlobalUsersModalOpened(false)}>
                        <CloseIcon fontSize={'large'} classes={{root: style.dialog__close_icon}}/>
                    </IconButton>
                </Toolbar>
            </AppBar>
            <div className={style.search_container}>
                <div className={style.search_element_container}>
                    <label>
                        ID:&nbsp;&nbsp;
                        <input className={style.search_element_input}/>
                    </label>
                </div>
                <div className={style.search_element_container}>
                    <label>
                        Title:&nbsp;&nbsp;
                        <input className={style.search_element_input}/>
                    </label>
                </div>
                <div className={style.search_element_container}>
                    <button className={style.search_element_button}>
                        Search
                    </button>
                </div>
            </div>
            <PerfectScrollbar>
                <div className={style.list_container}>
                    {props.globalUsers.map(globalUser =>
                        <div key={globalUser.userId} className={style.list_element_container}>
                            <div className={style.list_element_column}>
                                <h2 className={style.list_id}>{globalUser.userId}</h2>
                            </div>
                            <div className={style.list_element_column}>
                                {
                                    stringIndexArrayToArray(globalUser.titles).map(title =>
                                    <h2>{title}</h2>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </PerfectScrollbar>
        </Dialog>
    )
}

function mapTitlesToJSX(titles: StringIndexArray<string>) {
    const elements = [];
    for (let i in titles) {

    }
    return (
        <div>

        </div>
    )
}


const mapStateToProps = (state: AppState) => ({
    globalUsers: stringIndexArrayToArray(state.messenger.globalUsers)
})

const mapDispatchToProps = {
    setIsEditGlobalUsersModalOpened,
}

const connector = connect(mapStateToProps, mapDispatchToProps);

type TProps = ConnectedProps<typeof connector>;

export default connector(EditGlobalUsersModal);
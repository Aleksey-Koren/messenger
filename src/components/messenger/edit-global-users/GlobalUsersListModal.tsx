import {AppState} from "../../../index";
import {setIsEditGlobalUsersModalOpened} from "../../../redux/messenger-menu/messengerMenuActions";
import {connect, ConnectedProps} from "react-redux";
import React, {useEffect, useState} from "react";
import {Button, Dialog, IconButton, Toolbar, Typography} from "@mui/material";
import AppBar from "@mui/material/AppBar/AppBar";
import style from "./GlobalUsersList.module.css";
import CloseIcon from "@mui/icons-material/Close";
import PerfectScrollbar from "react-perfect-scrollbar";
import {
    StringIndexArray,
    StringIndexArrayEntry,
    stringIndexArrayToArray,
    stringIndexArrayToEntryArray
} from "../../../model/stringIndexArray";
import {Chat} from "../../../model/messenger/chat";
import {setIsGlobalUserConfigurationModalOpen} from "../../../redux/messenger-controls/messengerControlsActions";
import {GlobalUser} from "../../../model/local-storage/localStorageTypes";
import {GlobalUsersSearchService} from "../../../service/local-data/globalUsersSearchService";

export interface ISearchParams {
    id?: string
    title?: string
}

const GlobalUsersListModal: React.FC<TProps> = (props) => {

    const globalUsersArray = stringIndexArrayToArray(props.globalUsers);

    const [usersToRender, setUsersToRender] = useState<GlobalUser[]>(globalUsersArray);
    const [searchParams, setSearchParams] = useState<ISearchParams>({id: '', title: ''});

    useEffect(() => {
        setUsersToRender(GlobalUsersSearchService.filterGlobalUsers(searchParams, globalUsersArray));
    }, [props.globalUsers])

    return (
        <Dialog open={true} maxWidth="md" fullWidth>
            <AppBar classes={{root: style.dialog__app_bar}}>
                <Toolbar>
                    <Button variant="contained" onClick={() => props.setIsGlobalUserConfigurationModalOpen(true)}>
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
                        <input className={style.search_element_input}
                               value={searchParams?.id}
                               onChange={e => setSearchParams({...searchParams, id: e.target.value})}
                        />
                    </label>
                </div>
                <div className={style.search_element_container}>
                    <label>
                        Title:&nbsp;&nbsp;
                        <input className={style.search_element_input}
                               value={searchParams?.title}
                               onChange={e => setSearchParams({...searchParams, title: e.target.value})}
                        />
                    </label>
                </div>
                <div className={style.search_element_container}>
                    <button className={style.search_element_button}
                            onClick={() => setUsersToRender(GlobalUsersSearchService.filterGlobalUsers(searchParams, globalUsersArray))}
                    >
                        Search
                    </button>
                </div>
            </div>
            <PerfectScrollbar>
                <div className={style.list_container}>
                    {usersToRender.length === 0 && <h4 style={{textAlign: 'center'}}>No users found</h4>}
                    {usersToRender.map(globalUser =>
                        <div key={globalUser.userId} className={style.list_element_container}>

                            <div className={style.list_element_column}>
                                <h2 className={style.list_id}
                                    key={globalUser.userId}
                                    onClick={() => props.setIsGlobalUserConfigurationModalOpen(true, globalUser)}>{globalUser.userId}</h2>
                            </div>

                            <div className={style.list_element_column}>
                                <ul>
                                    {stringIndexArrayToEntryArray<string>(globalUser.titles).map(entry =>
                                        <li key={entry.key}>
                                            <h2>{generateUsernameToChatTitleRatio(entry, props.chats)}</h2>
                                        </li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
            </PerfectScrollbar>
        </Dialog>
    )
}

function generateUsernameToChatTitleRatio(entry: StringIndexArrayEntry<string>, chats: StringIndexArray<Chat>) {
    const chat = chats[entry.key];

    if (chat) {
        return `${chat.title} / ${entry.value}`
    }

    return `${entry.key} / ${entry.value}`
}

const mapStateToProps = (state: AppState) => ({
    globalUsers: state.messenger.globalUsers,
    chats: state.messenger.chats
})

const mapDispatchToProps = {
    setIsEditGlobalUsersModalOpened,
    setIsGlobalUserConfigurationModalOpen
}

const connector = connect(mapStateToProps, mapDispatchToProps);

type TProps = ConnectedProps<typeof connector>;

export default connector(GlobalUsersListModal);
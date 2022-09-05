import React from "react";
import {AppState} from "../../../index";
import {connect, ConnectedProps} from "react-redux";
import {MessagesListService} from "../../../service/messenger/messagesListService";
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import style from "./ScrollToUnreadButton.module.css"
import {scrollToUnreadTF} from "../../../redux/messages-list/messagesListActions";

interface IOwnProps {
    scrollRef: HTMLUListElement | null,
    unreadQuantity: number
}

const ScrollToUnreadButton: React.FC<TProps> = (props) => {
    const coordinates = MessagesListService.calculateScrollButtonCoordinates(props.scrollRef);

    return <div className={style.container} style={{left: `${coordinates.x}px`, top: `${coordinates.y}px`}}>
        <span className={style.quantity}>{props.unreadQuantity}</span>
        <ArrowCircleDownIcon fontSize={'large'}
                             className={style.icon}
                             onClick={() => props.scrollToUnreadTF(props.lastRead, props.scrollRef)}
        />
    </div>
}

function mapStateToProps(state: AppState, ownProps: IOwnProps) {
    return {
        lastRead: state.messagesList.lastRead!,
        scrollRef: ownProps.scrollRef!,
        unreadQuantity: ownProps.unreadQuantity
    }
}

const mapDispatchToProps = {
    scrollToUnreadTF
}

const connector = connect(mapStateToProps, mapDispatchToProps);

type TProps = ConnectedProps<typeof connector>

export default connector(ScrollToUnreadButton);
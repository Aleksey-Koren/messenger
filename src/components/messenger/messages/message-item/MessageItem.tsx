import React from "react";
import {AppState} from "../../../../index";
import {connect, ConnectedProps} from "react-redux";

const MessageItem: React.FC<TProps> = (props) => {
    return <></>
}

function mapStateTpProps(state: AppState) {
    return {}
}

const connector = connect(mapStateTpProps);
type TProps = ConnectedProps<typeof connector>;
export default connector(MessageItem);
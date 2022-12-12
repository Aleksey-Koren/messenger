import {AppState} from "../../../index";
import {connect, ConnectedProps} from "react-redux";
import React from "react";

interface IOwnProps {
    duration: number
}

const TimerString: React.FC<TProps> = (props) => {
    const minutes = Math.floor(props.duration / 60);
    const seconds = props.duration % 60;
    return <>
        <span style={{color: "#ffffff"}}>
            {`${minutes < 10 ? "0" + minutes : minutes} : ${seconds < 10 ? "0" + seconds : seconds}`}
        </span>
    </>
}

const mapStateToProps = (state: AppState, ownProps: IOwnProps) => ({
    duration: ownProps.duration
})

const connector = connect(mapStateToProps);

type TProps = ConnectedProps<typeof connector>;

export default connector(TimerString);


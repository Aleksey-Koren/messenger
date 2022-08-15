import {AppState} from "../../../index";
import {connect, ConnectedProps} from "react-redux";
import React from "react";

interface IOwnProps {
    delta: number
}

const TimerString: React.FC<TProps> = (props) => {
    const minutes = Math.floor(props.delta / 60);
    const seconds = props.delta % 60;
    return <>
        <span style={{color: "white"}}>
            {`${minutes < 10 ? "0" + minutes : minutes} : ${seconds < 10 ? "0" + seconds : seconds}`}
        </span>
    </>
}

const mapStateToProps = (state: AppState, ownProps: IOwnProps) => ({
    delta: ownProps.delta
})

const connector = connect(mapStateToProps);

type TProps = ConnectedProps<typeof connector>;

export default connector(TimerString);


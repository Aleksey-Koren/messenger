import {Timer} from "@mui/icons-material";
import React, {useEffect, useState} from "react";
import TimerString from "./TimerString";
import {connect, ConnectedProps} from "react-redux";
import {AppState} from "../../../index";
import {VoiceMessagesService} from "../../../service/messenger/voiceMessagesService";
import Notification from "../../../Notification";

interface IState {
    start: number;
    duration: number;
    interval: NodeJS.Timer | null;
}

const VoiceMessageTimer: React.FC<TProps> = (props) => {

    const [state, setState] = useState<IState>({start: Date.now(), duration: 15, interval: null});
    const [delta, setDelta] = useState<number>(0);


    useEffect(() => {
        const interval = setInterval(function() {
            const currentDelta = Math.floor((Date.now() - state.start) / 1000);
            setDelta(currentDelta);
            console.log("INTERVAL!!!!!!!!!!!!!!!!")
        }, 1000);
        setState({...state, interval: interval});
    }, [])


    if(delta > state.duration && props.isRecording) {
        VoiceMessagesService.stopRecording(props.recorder);
        clearInterval(state.interval!);
        Notification.add({
            message: `Max voice message duration is ${state.duration} seconds :-(   But you can send several one by one :-)`,
            severity: "info"
        });
    }

    return <>
        <Timer style={{color: "white"}}/>
        <TimerString delta={delta}/>
    </>
}

const mapStateToProps = (state: AppState) => ({
    recorder: state.voiceMessages.audioRecorder!,
    isRecording: state.voiceMessages.isRecording
})

const connector = connect(mapStateToProps);

type TProps = ConnectedProps<typeof connector>;

export default connector(VoiceMessageTimer);
import {
    IVoiceMessagesState,
    SET_AUDIO_RECORDER,
    SET_AUDIO_STREAM, SET_CHUNKS,
    SET_IS_RECORDING,
    TVoiceMessengerAction
} from "./voiceMessagesTypes";

const initialState: IVoiceMessagesState = {
    isRecording: false,
    audioStream: null,
    audioRecorder: null,
    chunks: [],
}

export function voiceMessagesReducer(state: IVoiceMessagesState = initialState, action: TVoiceMessengerAction): IVoiceMessagesState {

    switch (action.type) {

        case SET_IS_RECORDING:
            return {...state, isRecording: action.payload.isRecording};

        case SET_AUDIO_STREAM:
            return {...state, audioStream: action.payload.audioStream};

        case SET_AUDIO_RECORDER:
            return {...state, audioRecorder: action.payload.audioRecorder}

        case SET_CHUNKS:
            return {...state, chunks: action.payload.chunks}


        default: return state;
    }
}
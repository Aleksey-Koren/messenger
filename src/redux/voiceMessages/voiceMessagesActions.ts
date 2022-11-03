import {IVoiceMessagesStateOpt, SET_AUDIO_RECORDER, SET_DURATION, SET_IS_RECORDING} from "./voiceMessagesTypes";
import {IPlainDataAction} from "../redux-types";
import {AppDispatch, AppState, store} from "../../index";
import {Message} from "../../model/messenger/message";
import {MessageType} from "../../model/messenger/messageType";
import {MessageApi} from "../../api/messageApi";
import {FileService} from "../../service/fileService";
import {MessageMapper} from "../../mapper/messageMapper";


export function setIsRecording(isRecording: boolean): IPlainDataAction<IVoiceMessagesStateOpt> {
    return {
        type: SET_IS_RECORDING,
        payload: {
            isRecording
        }
    }
}

export function setAudioRecorder(audioRecorder: MediaRecorder): IPlainDataAction<IVoiceMessagesStateOpt> {
    return {
        type: SET_AUDIO_RECORDER,
        payload: {
            audioRecorder
        }
    }
}

export function setDuration(duration: number): IPlainDataAction<IVoiceMessagesStateOpt> {
    return {
        type: SET_DURATION,
        payload: {
            duration
        }
    }
}

export function prepareAudioRecorderTF() {
    return (dispatch: AppDispatch, getState: () => AppState) => {
        const state = getState();
        if(!state.voiceMessages.audioRecorder) {
            navigator.mediaDevices.getUserMedia({audio: true, video: false})
                .then(mediaStream => {
                    const recorder = new MediaRecorder(mediaStream);
                    let intervalId: NodeJS.Timer;
                    recorder.onstart = () => {
                        document.getElementById("mic")!.style.color = "red";
                        const start = Date.now();
                        intervalId = setInterval(function() {
                            const currentDelta = Math.floor((Date.now() - start) / 1000);
                            dispatch(setDuration(currentDelta));
                        }, 1000);
                        dispatch(setIsRecording(true));
                    }

                    recorder.onstop = () => {
                        document.getElementById("mic")!.style.color = "white";
                        clearInterval(intervalId);
                        dispatch(setDuration(0));
                        dispatch(setIsRecording(false));
                    }

                    recorder.ondataavailable = event => {
                        event.data.arrayBuffer()
                            .then(arrayBuffer => sendVoiceMessage(new Uint8Array(arrayBuffer)));
                    }

                    dispatch(setAudioRecorder(recorder));
                });
        }
    }
}

export function sendVoiceMessage(attachment: Uint8Array) {
    console.log("sendVoiceMessage")
    const state = store.getState();
    const currentChatId = state.messenger.currentChat;
    const currentChat = state.messenger.chats[state.messenger.currentChat!];
    const user = state.messenger.user;
    const globalUsers = state.messenger.globalUsers;
    const users = state.messenger.users;
    const messagesToSend: Message[] = []
    const attachArrays = [FileService.addByteMarker(attachment, 3)]

    for (let id in users) {
        const member = users[id];
        const message = {
            chat: currentChatId!,
            data: '',
            attachments: attachArrays,
            type: MessageType.whisper,
            sender: user?.id!,
            receiver: member.id!
        } as Message;
        console.log(message.attachments)
        messagesToSend.push(message);
    }
    // MessageApi.sendMessages(messagesToSend, globalUsers).then();

    Promise.all(messagesToSend.map(message => MessageMapper.toDto(message, globalUsers[message.receiver], currentChat)))
        .then(dto => {
            state.messenger.stompClient
                .send(`/app/chat/send-message/${user?.id}`, {}, JSON.stringify(dto))
        })
}
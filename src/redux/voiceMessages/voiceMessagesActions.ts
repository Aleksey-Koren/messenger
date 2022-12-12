import {IVoiceMessagesStateOpt, SET_AUDIO_RECORDER, SET_DURATION, SET_IS_RECORDING} from "./voiceMessagesTypes";
import {IPlainDataAction} from "../redux-types";
import {AppDispatch, AppState, store} from "../../index";
import {Message} from "../../model/messenger/message";
import {MessageType} from "../../model/messenger/messageType";
import {MessageMapper} from "../../mapper/messageMapper";
import {MyFile} from "../../model/messenger/MyFile";


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
        if (!state.voiceMessages.audioRecorder) {
            try {
                navigator.mediaDevices.getUserMedia({audio: true, video: false})
                    .then(mediaStream => {
                        const recorder = new MediaRecorder(mediaStream);
                        let intervalId: NodeJS.Timer;
                        recorder.onstart = () => {
                            document.getElementById("mic")!.style.color = "red";
                            const start = Date.now();
                            intervalId = setInterval(function () {
                                const currentDelta = Math.floor((Date.now() - start) / 1000);
                                dispatch(setDuration(currentDelta));
                            }, 1000);
                            dispatch(setIsRecording(true));
                        }

                        recorder.onstop = () => {
                            document.getElementById("mic")!.style.color = "#ffffff";
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
            } catch (e) {
                console.log("AUDIO NOT SUPPORTED")
            }
        }
    }
}

export function sendVoiceMessage(attachment: Uint8Array) {
    const state = store.getState();
    const currentChatId = state.messenger.currentChat;
    const user = state.messenger.user;
    const globalUsers = state.messenger.globalUsers;
    const users = state.messenger.users;
    const messagesToSend: Message[] = []

    const file = {
        name: "audio_" + (Math.random() + 1).toString(36).substring(2),
        type: "audio/mp3",
        data: attachment,
    } as MyFile

    console.log("NAME: " + file.name)

    for (let id in users) {
        const member = users[id];
        const message = {
            chat: currentChatId!,
            data: '',
            // attachments: attachArrays,
            files: [file],
            type: MessageType.WHISPER,
            sender: user?.id!,
            receiver: member.id!
        } as Message;
        messagesToSend.push(message);
    }

    Promise.all(messagesToSend.map(message => MessageMapper.toDto(message, globalUsers[message.receiver])))
        .then(dto => {
            state.messenger.stompClient
                .send(`/app/chat/send-message/${user?.id}`, {}, JSON.stringify(dto))
        })
}
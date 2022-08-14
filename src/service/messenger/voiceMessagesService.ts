
export class VoiceMessagesService {

    static startRecording(recorder: MediaRecorder) {
        if (recorder.state !== 'recording') {
            recorder.start();
        }
    }

    static stopRecording(recorder: MediaRecorder) {
        if(recorder.state === 'recording') {
            recorder.stop()
        }
    }
}
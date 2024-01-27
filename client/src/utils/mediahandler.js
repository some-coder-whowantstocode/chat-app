import { Actions } from "./Actions";



const ClearTracks = (tracks) => {
    try {
        tracks.forEach((track) => {
            track.stop();
        })

    } catch (err) {
        console.log(err);
    }

}

export const Mediacontroller = async(use, pc, socket, media, givenstream) => {

    if (socket) {

        return new Promise((resolve, reject) => {
            let peers = [...pc];
            switch (use) {
                case "add_video":

                    navigator.mediaDevices.getUserMedia({ video: true })
                        .then(async(stream) => {

                            peers = peers.map(async(peer) => {
                                await peer.addTracks(stream);

                            })

                            socket.send({
                                type: 'videocall',
                                roomid: sessionStorage.getItem('room'),
                                from: sessionStorage.getItem('name'),
                                command: Actions.CALL_ACTIONS.MEDIA,
                                video: true,
                                audio: media.current.mic
                            })

                            media.current.cam = true;
                            resolve(stream)

                        })
                        .catch((err) => {
                            if (err.name === 'NotFoundError') {
                                console.log(err)
                            } else {
                                reject("Error while getting media in Getmedia : " + err);
                            }
                        })

                    break;

                case "add_audio":

                    navigator.mediaDevices.getUserMedia({ audio: true })
                        .then(async(stream) => {

                            peers = peers.map(async(peer) => {
                                await peer.addTracks(stream);
                            })

                            socket.send({
                                type: 'videocall',
                                roomid: sessionStorage.getItem('room'),
                                from: sessionStorage.getItem('name'),
                                command: Actions.CALL_ACTIONS.MEDIA,
                                audio: true,
                                video: media.current.cam
                            })
                            resolve(stream)

                        })
                        .catch((err) => {
                            if (err.name === 'TypeError') {
                                reject(err);
                            } else {
                                reject("Error while getting media in Getmedia : " + err);
                            }
                        })
                        .finally(async() => {
                            media.current.mic = true;
                        })

                    break;

                case "remove_video":
                    {
                        media.current.cam = false;
                        console.log(givenstream)
                        let tracks = givenstream.getTracks();
                        ClearTracks(tracks);
                        let newstream = new MediaStream([])


                        socket.send({
                            type: 'videocall',
                            roomid: sessionStorage.getItem('room'),
                            from: sessionStorage.getItem('name'),
                            command: Actions.CALL_ACTIONS.MEDIA,
                            video: false,
                            audio: media.current.mic
                        })
                        resolve(newstream);
                    }
                    break;

                case "remove_audio":
                    {
                        media.current.mic = false;
                        let tracks = givenstream.getTracks();
                        ClearTracks(tracks);
                        let newstream = new MediaStream([])


                        socket.send({
                            type: 'videocall',
                            roomid: sessionStorage.getItem('room'),
                            from: sessionStorage.getItem('name'),
                            command: Actions.CALL_ACTIONS.MEDIA,
                            audio: false,
                            video: media.current.cam
                        })
                        resolve(newstream);

                    }
                    break;

                default:
                    console.log('invalid use requested')
            }
        })


    }
}


export const Mediapackup = async(command, data) => {
    try {
        if (command === Actions.PACKUP_ACTIONS.CAM || command === Actions.PACKUP_ACTIONS.ALL) {
            const { video } = data;
            const videoTracks = video.getTracks();
            ClearTracks(videoTracks);
        }

        if (command === Actions.PACKUP_ACTIONS.MIC || command === Actions.PACKUP_ACTIONS.ALL) {
            const { audio } = data;
            const audioTracks = audio.getTracks();
            ClearTracks(audioTracks);
        }
    } catch (err) {
        console.log(err);
    }

}
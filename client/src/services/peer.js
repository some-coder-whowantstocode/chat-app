import { Actions } from "../utils/Actions";

export default class Peer {
    constructor(socket, name, Id) {
        this.config = {
            iceServers: [{
                urls: [
                    "stun:stun.l.google.com:19302",
                    "stun:global.stun.twilio.com:3478",
                ],
            }, ],
        };
        this.myname = sessionStorage.getItem('name');
        this.roomid = sessionStorage.getItem('room');
        this.name = name;
        this.Id = Id;
        this.socket = socket;
        this.peer = new RTCPeerConnection(this.config);
        this.incall = true;
        this.stream = null;
        this.media_availability = { cam: true, mic: true };


        this.socket.on("message", async({ command, des, to, Id }) => {
            try {
                if (to === this.myname && Id === this.Id) {
                    if (command === Actions.CALL_ACTIONS.ICE) {
                        this.peer.addIceCandidate(des);
                    } else if (command === Actions.CALL_ACTIONS.R_OFFER) {
                        const ans = await this.handleOffer(des);
                        socket.send({
                            roomid: sessionStorage.getItem('room'),
                            from: sessionStorage.getItem('name'),
                            command: Actions.CALL_ACTIONS.R_OFFER,
                            type: 'videocall',
                            des: ans,
                            to: this.name,
                            Id: this.Id
                        })
                    } else if (command === Actions.CALL_ACTIONS.R_ANSWER) {
                        await this.handleAnswer(des);
                    }
                }

            } catch (err) {
                console.log(err);
            }
        })

        this.peer.onicecandidate = (event) => {
            this.socket.send({
                roomid: this.roomid,
                from: this.myname,
                command: Actions.CALL_ACTIONS.ICE,
                type: "videocall",
                des: event.candidate,
                to: this.name,
                Id: this.Id,
            });
        };


        this.peer.onicecandidateerror = (e) => {
            console.log("ice error", e)
        }

        this.peer.onnegotiationneeded = async() => {
            try {
                await this.peer.setLocalDescription();
                this.socket.send({
                    roomid: this.roomid,
                    from: this.myname,
                    command: Actions.CALL_ACTIONS.NEGO_INIT,
                    type: "videocall",
                    des: this.peer.localDescription,
                    to: this.name,
                    Id: this.Id,
                });
            } catch (err) {
                console.error(err);
            }
        };



    }
    async addTracks(stream) {

        return new Promise((resolve, reject) => {

            let tracks = stream.getTracks();
            for (let track of tracks) {
                const senders = this.peer.getSenders();

                const senderexists = senders.find((sender) => { return sender.track && sender.track.id === track.id });
                if (!senderexists) {
                    this.peer.addTrack(track, stream);

                } else {
                    this.peer.removeTrack(senderexists);
                    this.peer.addTrack(track, stream);
                }

            }

            try {
                resolve();
            } catch (err) {
                reject(err);
            }
        }).catch((err) => {
            console.log(err);
        });
    }

    async getOffer() {
        try {
            await this.peer.setLocalDescription();

            return this.peer.localDescription;
        } catch (err) {
            console.error('Error in getOffer:', err);
        }
    }


    async handleOffer(offer) {

        await this.peer.setRemoteDescription(new RTCSessionDescription(offer));
        let answer = await this.peer.createAnswer();
        await this.peer.setLocalDescription(answer);
        return answer;
    }

    async handleAnswer(answer) {
        await this.peer.setRemoteDescription(new RTCSessionDescription(answer));
        return;
    }

    Close() {

        this.peer.close();
    }
}
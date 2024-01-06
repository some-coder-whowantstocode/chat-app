const config = {
    iceServers: [{
            urls: [
                "stun:stun.l.google.com:19302",
                "stun:global.stun.twilio.com:3478"
            ]
        }

    ],
};

export const getPeer = () => {
    try {
        return new RTCPeerConnection(config)
    } catch (err) {
        console.log(err);
    }
}

export const getOffer = async(peer) => {
    try {
        let offer = await peer.createOffer();
        await peer.setLocalDescription(offer);
        return offer;
    } catch (err) {
        throw new Error(err)
    }
}

export const getAnswer = async(peer, offer) => {
    try {
        await peer.setRemoteDescription(new RTCSessionDescription(offer));
        let answer = await peer.createAnswer();
        await peer.setLocalDescription(answer);
        return answer;
    } catch (err) {
        console.log(err);
    }
}

export const closePeer = async(peer) => {
    if (peer) {
        try {
            // const senders = peer.getSenders();
            // senders.forEach((s) => {
            //     peer.removeTrack(s);
            // })
            await peer.close();
        } catch (err) {
            console.log(err);
        }
    }
};
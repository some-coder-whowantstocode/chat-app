export const Mediacleanup = (stream) => {
    return new Promise((resolve, reject) => {
        let prevstreams = stream;
        if (prevstreams) {
            try {
                prevstreams.getTracks()
                    .forEach((track) => {
                        if (track.kind === 'audio' || track.kind === 'video') {
                            track.stop();
                        }
                    })
                resolve();
            } catch (err) {
                reject("Error occured in Mediacleanup :" + err.name);
            }
        } else {
            resolve();
        }
    })

};
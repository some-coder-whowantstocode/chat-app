export  const reopenconnection = () => {
    return new Promise((resolve, reject) => {
        let websoc = new WebSocket('ws://localhost:9827');
        websoc.onopen = () => resolve(websoc);
        websoc.onerror = (error) => reject(error);
    });
}
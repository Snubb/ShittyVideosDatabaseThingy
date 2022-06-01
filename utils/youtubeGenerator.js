function getID(url) {
    let id = "";
    if (url.includes('v=')) {
        id = url.split('v=')[1];
    } else if (url.split('/').length = 4) {
        id = url.split('/')[3];
    } else {
        id = url.split('/')[1];
    }
    console.log("URL: " + url)
    console.log("Generated ID: " + id);
    return id;
}
module.exports = getID;
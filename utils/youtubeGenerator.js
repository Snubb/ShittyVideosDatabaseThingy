function getID(url) {
    let id = "";
    if (url.includes('v=')) {
        id = url.split('v=')[1];
    } else {
        id = url.split('/')[3];
    }
    console.log("URL: " + url)
    console.log("Generated ID: " + id);
    return id;
}
module.exports = getID;
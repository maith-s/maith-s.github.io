let handlefail = function(err){
    console.log(err)
}

let i = 0;

// gets a streamId and creates a new div with the id, and appends it to the remote stream
// container so that other users can join 
function addVideoStream(streamId){
    let remoteContainer = document.getElementsByClassName("remoteStream")[i++];
    let streamDiv = document.createElement("div");
    streamDiv.id  = streamId;
    streamDiv.style.transform = "rotateY(180deg)"; // mirrors the image
    streamDiv.style.height = "200px"
    remoteContainer.appendChild(streamDiv)
    let a = document.getElementsByClassName("participants")[i];
    let n = document.createTextNode(streamId);
    a.appendChild(n);
}

document.getElementById("join").onclick = function () {
    let channelName = document.getElementById("channelName").value;
    let username = document.getElementById("userName").value;
    let appId = "385bd7c6e36942dab93094f6653e3299";

    let r = document.getElementsByClassName("participants")[i];
    let o = document.createTextNode(username);
    r.appendChild(o);
    
    let client = AgoraRTC.createClient({
        mode: "live", 
        codec: "h264"
    })

    // init takes an appID and function and returns one of two things depending on if the inti succeeds or fails 
    client.init(appId,() => console.log("AgoraRTC Client Connected"), handlefail
    )

    client.join(
        null,
        channelName,
        username,
        () =>{
            var localStream = AgoraRTC.createStream({
                video: true,
                audio: true,
            })
            localStream.init(function(){
                localStream.play("SelfStream")
                console.log(`App id: ${appId}\nChannel id: ${channelName}`)
                client.publish(localStream)
            })

        }
    )
    client.on("stream-added", function (evt){
        console.log("Added Stream");
        client.subscribe(evt.stream,handlefail)
    })

    client.on("stream-subscribed", function(evt){
        console.log("Subscribed Stream");
        let stream = evt.stream;
        addVideoStream(stream.getId());
        stream.play(stream.getId()); 
    })
} 
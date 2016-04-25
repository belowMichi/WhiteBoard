var recordBtn =function(btnPlace) {

    var constraints = { video: false, audio: true },
        recorder = new RecordRTC({
            enable: constraints
        });

    // get user media
    recorder.getMedia(recorder.setMedia, function() {
        console.log("get user media failed!");
    });

    recorder.onVideoReady(function(blob) {
        attachLink(blob, "video");
    });

    recorder.onAudioReady(function(blob) {
        attachLink(blob, "audio");
    });

    var startBtn = document.getElementById("start-record"),
        stopBtn = document.getElementById("stop-record"),
        result = document.getElementById('container'),
        download = document.getElementById('download');

    startBtn.addEventListener("click", function() {
        startBtn.disabled = true;
        stopBtn.disabled = false;

        recorder.start();
    });

    stopBtn.addEventListener("click", function() {
        startBtn.disabled = false;
        stopBtn.disabled = true;

        recorder.stop();
    });

    function attachLink(blob, str, dl) {
        var a = document.createElement('a');
        a.target = '_blank';
        //a.innerHTML = (dl ? 'Download ' : 'Open ') + str;

        var audio = document.createElement('audio');
        var btn = document.createElement('button');
        btn.innerHTML="播放"
        btn.style.position="absolute";
        console.log(btn.style.left)
        btn.style.left=btnPlace.x+"px";
        btn.style.top=btnPlace.y+"px";
        btn.className="btn";
        var reader = new FileReader();
        reader.onload = function(e) {
            a.href = e.target.result;

            audio.src = e.target.result;
        };
        reader.readAsDataURL(blob);

        btn.addEventListener("click",function(){audio.play()});
            result.appendChild(a);
            result.appendChild(audio);
            result.appendChild(btn);

    }

}

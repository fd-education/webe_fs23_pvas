let ctx;
let bufferLoader;
let bufferList;
function BufferLoader(context, urlList, callback) {
    this.context = context;
    this.urlList = urlList;
    this.onload = callback;
    this.bufferList = new Array();
    this.loadCount = 0;
}

BufferLoader.prototype.loadBuffer = function(url, index) {
    // Load buffer asynchronously
    var request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.responseType = "arraybuffer";

    var loader = this;

    request.onload = function() {
        // Asynchronously decode the audio file data in request.response
        loader.context.decodeAudioData(
            request.response,
            function(buffer) {
                if (!buffer) {
                    alert('error decoding file data: ' + url);
                    return;
                }
                loader.bufferList[index] = buffer;
                if (++loader.loadCount == loader.urlList.length)
                    loader.onload(loader.bufferList);
            }
        );
    }

    request.onerror = function() {
        alert('BufferLoader: XHR error');
    }

    request.send();
}

BufferLoader.prototype.load = function() {
    for (var i = 0; i < this.urlList.length; ++i)
        this.loadBuffer(this.urlList[i], i);
}

function init(){
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        ctx = new AudioContext();
    } catch (e) {
        alert('Web Audio API is not supported in this browser');
    }

    bufferLoader = new BufferLoader(
        ctx,
        [
            "kick.mp3",
            "snare.mp3",
            "hihat.mp3",
        ],
        bufferLoadCompleted
        );

    bufferLoader.load();
}

function startPlayingRhythm1(bufferList) {
    const kick = bufferList[0];
    const snare = bufferList[1];
    const hihat = bufferList[2];

    // We'll start playing the rhythm 100 milliseconds from "now"
    const startTime = ctx.currentTime + 0.100;

    const tempo = 120; // BPM (beats per minute)
    const quarterNoteTime = 60 / tempo;

    // Play the kick drum on beats 1, 2, 3, 4
    play(kick, startTime);
    play(kick, startTime + quarterNoteTime);
    play(kick, startTime + 2*quarterNoteTime);
    play(kick, startTime + 3*quarterNoteTime);

    // Play the snare drum on beats 2, 4
    play(snare, startTime + 0.75 * quarterNoteTime);
    play(snare, startTime + 1.5 * quarterNoteTime);
    play(snare, startTime + 2.75 * quarterNoteTime);
    play(snare, startTime + 3.5 * quarterNoteTime);

    // Play the hi-hat every 16th note.
    for (var i = 0; i < 16; ++i) {
        play(hihat, startTime + i*0.25*quarterNoteTime);
    }
}

function play(buffer, time){
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    src.connect(ctx.destination);
    src.start(time);
}

function bufferLoadCompleted(){}

/**
 * Reality record helper ver.0.0.1
 */

const API_URL = "https://media-prod-dot-vlive-prod.appspot.com/api/v1/media/get";
const VIEWER_URL = "https://reality.wrightflyer.net/viewer/";
const ID_REGEX = /\d+$/;
const CMD_PREFIX = "streamlink ";
const CMD_POSTFIX = " --default-stream best -o - | ffmpeg -i - -movflags faststart -c copy ";
const EXT = ".ts";

var app = new Vue({
    el:"#app", 
    data:{
        param: "",
        success: false,
        error: false,
        result: "",
        stream_url: "",
        name: "",
        title: "",
        thumb_src: "",
        viewer_url: "",
        supportsCB: true,
    },
    created: function() {
        if(document.execCommand) {
            supportsCB = true;
        }
    },
    methods:{
        get_strem_url: async function(){
            var id = ID_REGEX.exec(this.param);
            var res = await fetch(API_URL, {
                "credentials": "omit",
                "headers": {
                },
                "body": "{\"media_id\":\"" + id + "\"}",
                "method": "POST",
                "mode": "cors"
            });
            var json = await res.json();
            if (json['ok']) {
                var endpoint_url = json['payload']['StreamingServer']['view_endpoint'];
                var name = json['payload']['OwnerStreamer']['nickname'];
                var title = json['payload']['title'];
                var filename = (name + "_" + title + EXT).replace('"', "");
                var command = CMD_PREFIX + endpoint_url + CMD_POSTFIX + '"' + filename + '"';
                this.name = name;
                this.title = title;
                this.thumb_src = json['payload']['thumbnail'];
                console.log(endpoint_url);
                this.result = command;
                this.stream_url = endpoint_url;
                this.viewer_url = VIEWER_URL + id;
                this.success = true;
                this.error = false;
            } else {
                this.result = "Error! 配信が終了している可能性があります。";
                console.log("error!");
                this.success = false;
                this.error = true;
            }
        },
        copy_to_cb: function(){
            this.$refs.command.select();
            document.execCommand('copy');
        }
    }
    })
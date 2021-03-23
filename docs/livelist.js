/**
 * Reality lives ver.0.0.1
 */

const API_URL = "https://media.reality.app/api/v1/media/lives_user";

var app = new Vue({
    el:"#app", 
    data:{
        param: "",
        success: false,
        error: false,
        lives: [],
        filtered_lives: [],
    },
    created: async function() {
        var res = await fetch(API_URL, {
            "credentials": "omit",
            "headers": {
            },
            "method": "POST",
            "mode": "cors"
        });
        var json = await res.json();
        if (json['ok']) {
            this.lives = json['payload'];
            this.filtered_lives = json['payload'];
        }
        console.log("Load");
    },
    methods:{
        search: function(){
            var term = this.param;
            if (this.lives) {
                if(term) {
                    this.filtered_lives = this.lives.filter(
                            function(i){
                                return i.OwnerStreamer.nickname.toLowerCase().includes(term.toLowerCase())
                                    || i.title.toLowerCase().includes(term.toLowerCase());
                            }
                        );
                } else {
                    this.filtered_lives = this.lives;
                }
                this.success = true;
                this.error = false;
            } else {
                this.result = "Error!";
                console.log("error!");
                this.success = false;
                this.error = true;
            }
        },
        clear: function() {
            this.param = "";
            this.search();
        }
    }
    })

/**
 * Reality lives ver.0.0.1
 */

 const API_URL = "https://appgateway.reality.app/api/v1/event/broadcaster/result/list"

 var app = new Vue({
     el:"#app", 
     data:{
         event_id: "",
         profile_url_base: "https://reality.app/profile/",
         title: "",
         header_img: "",
         event_page: "",
         success: false,
         error: false,
         entrants: [],
     },
     created: function() {
        console.log("created");
     },
     methods:{
         getEntrants: async function() {
            if (!this.event_id) {
                return;
            }

            page = 1;
            do {
                let res = await fetch(API_URL, {
                    "headers": {
                    },
                    "body": `{"eventId": ${this.event_id}, "ignorePeriod": false, "page": ${page}}`,
                    "method": "POST",
                    "mode": "cors"
                });
                let json = await res.json();
                if (json['ok']) {
                    payload = json['payload'];
                    this.entrants = this.entrants.concat(payload['broadcasterEventResults']);
                    pagenation = payload['pagination'];
                    page = pagenation['Next'];
                    event_info = payload['broadcasterEvent'];
                    this.title = event_info['title'];
                    this.header_img = event_info['headerImageUrl'];
                    this.event_page = event_info['pageUrl'];
                } else {
                    break;
                }
            } while (page > 0)

            console.log("Load");
         },
         resetData: function() {
            this.title = "";
            this.header_img = "";
            this.entrants = [];
         },
         clear: function() {
            this.event_id = "";
            this.resetData();
         },
         toggleAdditionalInfo: function(ev) {
            this.success = !this.success;
            console.log("click")
         }
     }
     })
 
var AppRouter = Backbone.Router.extend({
    routes : {
        "" : "list",
        "board/:id" : "board"
    },
    list : function () {
        if(typeof app.user == 'undefined') {
            console.log("user is not logged in")
            return;
        }
        
        this.boards = new BoardSet();
        this.boards_view = new BoardSetView({model:this.boards})
        this.boards.fetch({data: { username: app.user }}); // retrieve from server
    },
    board : function (id) {
        var self = this;
        var _select_board = function () {
            $("#boarditem-" + id).addClass("active").siblings().removeClass("active")
        };
        if (!this.boards_view) {
            console.log("no boards_view, calling list")
            this.list();
        }
        this.boards.on("reset", _select_board);
        _select_board();
        
        console.log("constructing segments for board "+id);
        
        var segments = new TripSegmentSet();
        board = this.boards.get("/api/board/"+id+"/")

        this.tripsegmentset_view = new TripSegmentSetView({model:segments},{board: board})
        segments.fetch({data:{board:id}})
        
        //hide the trip notes section 
        console.log("empty notes section")
        $("#tripsegmentnotes").empty();
    }
})
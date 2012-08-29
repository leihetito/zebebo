var TripSegmentItemView = Backbone.View.extend({
    tagName : "div",
    template : _.template( $("#TripSegmentTemplate").html()),
    initialize : function () {
        this.model.bind('change', this.render, this)                                         
    },
    render : function () {
        $(this.el).append(this.template({"item" : this.model.toJSON()}))
        return this;
    }
})

var TripSegmentSetView = Backbone.View.extend({
    el : $("#stages"),
    initialize : function () {
        this.model.bind('reset', this.render, this)
    },
    render : function () {
        $(this.el).empty()
        $(this.el).html("<table border=\"1\">")
        _.each(this.model.models, function (segment) {
            $(this.el).append(new TripSegmentItemView({model:segment}).render().el)
        }, this)
        $(this.el).append("</table>")
        return this;
    }
})

var BoardItemView = Backbone.View.extend({
    tagName : "li" ,
    template : _.template($("#BoardItemTemplate").html()),
    events : {
        "click a"       : "make_active",
        "click .edit"   : "edit",
        "click .delete" : "del",
        "click .add"    : "add_leg"
    },
    initialize : function () {
        $(this.el).attr("id", "boarditem-" + this.model.get("id"))
    },
    make_active : function () {
        $(this.el).siblings().removeClass("active")
        $(this.el).addClass("active");
    },
    edit: function(e) {
        e.preventDefault();
        new EditView({ model: this.model }).render();
    },
    del: function(e) {
        e.preventDefault();
        var del = confirm('Are you sure you want to delete this bookmark?');
        if (del) {
            //app.boards.remove(this.model);
            this.model.destroy();
            $(this.el).remove();
            $(app.board_view.el).masonry('reload');
        }
    },
    add_leg: function(e) {
        e.preventDefault();
        
    },
    render : function () {
        $(this.el).html(this.template({"item" : this.model.toJSON()}))
        return this;
    }
})

var BoardSetView = Backbone.View.extend({
    el : $("#select-board"),
    events : {
        "click .new" : "new_board"
    },
    new_board: function(e) {
        e.preventDefault();
        new EditView({ model: new Board() }).render();        
    },
    initialize : function () {
        this.boarditem_views = []
        this.model.bind("reset", this.render, this);
        this.model.bind("add", this.render, this);
    },
    render : function () {
        $(this.el).find("ul").empty();
        _.forEach(this.model.models, function (item) {
            $(this.el).find("ul").append((new BoardItemView({model:item})).render().el)
        }, this)
        return this;
    }
})

var EditView = Backbone.View.extend({
    
    //template : _.template($("#EditTripTemplate").html()),
    el: $("#dialog-add-booking"),
    
    events: {
      "click .save":            "save",
      "click .cancel":          "cancel",
      "submit form":            "save"
    },
    
    initialize: function() {
        _.bindAll(this, 'render', 'unrender', 'save', 'cancel');
    },

    render: function() {
        //$(this.el).html(this.template({"item" : this.model.toJSON()}))
                     
        $(this.el).modal({
            backdrop: true,
            keyboard: false,
            show: true
        });
    },
    
    unrender: function() {
        $(this.el).modal('hide');
        $(this.el).remove();
    },
    
    save: function(e) {
        e.preventDefault();
  
        var title = this.$('input[name=title]').val();
        var origin = this.$('input[name=origin]').val();
        var destination = this.$('input[name=destination]').val();
       
        this.model.set({ title: title, origin: origin, destination: destination });
        this.model.save();

        app.boards.fetch();
        app.boards_view.render();
                   
        this.unrender();
    },
    
    cancel: function(e) {
        e.preventDefault();
        this.unrender();
    }
})

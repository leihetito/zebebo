var TripSegmentItemView = Backbone.View.extend({
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
    initialize : function (model, options) {
        this.board = options["board"];
        this.model.bind('reset', this.render, this)
    },
    events : {
        "click .add" : "add_segment"
    },
    add_segment : function() {
        $("#add_seg_form").html(_.template($("#TripSegmentAddRowTemplate").html()));
        $("#add_seg_form").modal("show");

        // save action
        $("#add_seg_form")
            .find(".save")
            .click(_.bind(function () {
               var data = {}
               var form_data = $("#add_seg_form form").serializeArray();
               for (var i in form_data) {
                   data[form_data[i].name]=form_data[i].value;
               }
               var tripSegment = new TripSegment()
               tripSegment.set(data)
               tripSegment.set({
                                   board: this.board.toJSON(),
                                   order: this.model.length+1
                          });
               
               console.log(tripSegment.toJSON())
               tripSegment.save()
               this.model.add(tripSegment);
               $("#add_seg_form").modal("hide");
               
               this.render()
           }, this))
    },
    render : function () {
        console.log("here")
        $(this.el).find("table").empty()
        _.each(this.model.models, function (segment) {
            $(this.el).find("table").append(new TripSegmentItemView({model:segment}).render().el)
        }, this)
        
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
    
    template : _.template($("#ModalTemplate").html()),
    el: $("#modal"),
    
    events: {
      "click .save":            "save",
      "click .cancel":          "cancel",
      "submit form":            "save"
    },
    
    initialize: function() {
        _.bindAll(this, 'render', 'unrender', 'save', 'cancel');
    },

    render: function() {
        //$(this.el).html(this.model.toJSON());
        $(this.el).empty();
        $(this.el).append(this.template({"item" : this.model.toJSON()}))
        $(this.el).modal({
            backdrop: true,
            keyboard: false,
            show: true
        });
        
        return this;
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
        var fromDate = this.$('input[name=from_date]').val();
        var toDate = this.$('input[name=to_date]').val();
       
        this.model.set({ title: title, origin: origin, destination: destination, 
                         fromDate: fromDate, toDate: toDate });
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

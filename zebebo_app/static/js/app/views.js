var SegmentNotesView = Backbone.View.extend({
    el : $("#tripsegmentnotes"),
    template : _.template($("#SegmentNotesTemplate").html()),
   
    initialize : function () {
        this.model.bind('change', this.render, this)     
    },
    events : {
        "click .save" : "save_segment_notes"      
    },
    save_segment_notes : function() {
        var notes = this.$('textarea[name=segment_notes]').val();
       
        console.log(this.model.get("order") + " saving notes: " + notes)
        this.model.set({ notes: notes });
        this.model.save();
    },
    render : function () {
        console.log("in trip segment render")
        $(this.el).html(this.template({"item" : this.model.toJSON()}))
        return this;
    }
})

var TripSegmentItemView = Backbone.View.extend({
    tagName : "tr",
    className: "row",
    
    template : _.template( $("#TripSegmentTemplate").html()),
    initialize : function () {
        this.model.bind('change', this.render, this)                                         
    },
    events : {
        "click .delete" : "delete_segment"      
    },
    delete_segment : function(e) {
        console.log("in delete")
        e.preventDefault();
        var del = confirm('Are you sure you want to delete this segment?');
        if (del) {
            //app.boards.remove(this.model);
            this.model.destroy();
            $(this.el).remove();
        }
    },
    render : function () {
        this.el.id = this.model.get('order');

        //render trip segment table
        $(this.el).html(this.template({"item" : this.model.toJSON()})).addClass("segment")
        return this;
    }
})

var TripSegmentSetView = Backbone.View.extend({
    el : $("#stages"),
    rowid_clicked: null,
    notesView: null,
    
    initialize : function (model, options) {
        this.board = options["board"];
        this.model.bind('reset', this.render, this);
        this.model.bind("add", this.reorder, this);
        this.model.bind("remove", this.reorder, this);
    },
    events : {
        "click .add"            : "add_segment",
        "click .table tbody tr" : "row_clicked",
        "click .moveup"         : "row_up",
        "click .movedown"       : "row_down",
    },
    add_segment : function() {
        $("#add_seg_form").html(_.template($("#TripSegmentEditTemplate").html()));
        $("#add_seg_form").modal("show");

        // save action
        $("#add_seg_form")
            .find(".save")
            .click(_.bind(function () {
               var data = {}
               var form_data = $("#add_seg_form form").serializeArray();
               for (var i in form_data) {
                   if(form_data[i].name == "add_to_date")
                       data["toDate"]=form_data[i].value;
                   else if(form_data[i].name == "add_from_date")
                       data["fromDate"]=form_data[i].value;
                   else
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
               $("#add_seg_form").modal("hide");
               
               this.model.fetch()
           }, this))    
    },
    row_clicked : function(ev) {
      if(!$(ev.target).is("TD"))
          return;
      
      this.rowid_clicked = $(ev.target).parent().attr("id");
      row = $(ev.target).parent();
      row.addClass("rowselected").siblings().removeClass("rowselected");
      row.siblings().find(".editsection").hide()
      row.find(".editsection").show();
      
      segment = this.model.models[this.rowid_clicked-1]
      
      //unbind events of existing notes view so they dont fire on save
      if(this.notesView != null)
          this.notesView.undelegateEvents();
        
      this.notesView = new SegmentNotesView({model: segment})
      //render trip segmenet notes in a separate widget
      this.$("#tripsegmentnotes").append(this.notesView.render().el)
    },
    row_up: function() {
      console.log( "on row up " + this.rowid_clicked)  
      row_id = this.rowid_clicked;

      //row_id start from 1, arr index start from 0
      if(row_id > 1) {
          prev = this.model.models[row_id-2];
          prev_order = prev.get("order");
          curr = this.model.models[row_id-1];
          curr_order = curr.get("order");
          
          curr.set({
              order: prev_order 
          })
          prev.set({
              order: curr_order 
          })
          curr.save()
          prev.save()
          
          this.model.fetch({data:{board:this.board.get('id')}})
      }
    },
    row_down: function() {
      console.log( "on row down " + this.rowid_clicked)  
      row_id = this.rowid_clicked;
      
      //row_id start from 1, arr index start from 0
      if(row_id < this.model.length ) {
          next = this.model.models[row_id];
          next_order = next.get("order");
          curr = this.model.models[row_id-1];
          curr_order = curr.get("order");

          curr.set({
              order: next_order 
          })
          next.set({
              order: curr_order 
          })
          curr.save()
          next.save()
          
          this.model.fetch({data:{board:this.board.get('id')}})
      }
    },
    reorder: function() {
        console.log("in reorder") 
        
        var i = 1;
        _.each(this.model.models, function (segment) {
            segment.set({"order" : i++});
            segment.save()
        }) 
    },
    render : function () {
        console.log("in render, size of model "+this.model.length)

        if(this.model.length == 0) {
            this.$("#tripsegmentnotes").hide();
        }
        
        this.$(".segmentTable").empty()
        
        // sort the collection by model.order
        _.sortBy(this.model.models, function(segment) {
            return segment.get("order")
        })
        _.each(this.model.models, function (segment) {
            this.$(".segmentTable").append(new TripSegmentItemView({model:segment}).render().el)
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
        new EditTripView({ model: this.model }).render();
    },
    del: function(e) {
        e.preventDefault();
        var del = confirm('Are you sure you want to delete this trip?');
        if (del) {
            this.model.destroy();
            $(this.el).remove();
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
        new EditTripView({ model: new Board() }).render();        
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

var EditTripView = Backbone.View.extend({
    
    template : _.template($("#TripEditTemplate").html()),
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
        var notes = this.$('textarea[name=notes]').val();
       
        this.model.set({ title: title, origin: origin, destination: destination, 
                         fromDate: fromDate, toDate: toDate, notes: notes });
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

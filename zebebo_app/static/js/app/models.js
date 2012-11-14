var Board = Backbone.Model.extend({
    urlRoot : "/api/board/"
})
var BoardSet = Backbone.Collection.extend({
    url : "/api/board/",
    model : Board
})

var TripSegment = Backbone.Model.extend( {
    urlRoot: "/api/tripsegment/"
})
var TripSegmentSet = Backbone.Collection.extend({
    url : "/api/tripsegment/"
})
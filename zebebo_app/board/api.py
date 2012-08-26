from django.http import HttpResponse
from tastypie.authorization import Authorization
from tastypie.resources import ModelResource
from tastypie import fields
from tastypie.constants import ALL_WITH_RELATIONS
from zebebo_app.board.models import Board, TripSegment

class BoardResource(ModelResource):
    def obj_create(self, bundle, request=None, **kwargs):
        kwargs["user_id"] = 1 # TODO: Authentication
        return super(BoardResource, self).obj_create(bundle, request, **kwargs)

    class Meta:
        queryset = Board.objects.all()
        #include_resource_uri = False
        authorization = Authorization()

class TripSegmentResource(ModelResource):
    board = fields.ForeignKey(BoardResource, 'board',full=True)
    class Meta:
        queryset = TripSegment.objects.all()
        #include_resource_uri = False
        authorization = Authorization()
        filtering = {
            "board" : ('exact', )
        }

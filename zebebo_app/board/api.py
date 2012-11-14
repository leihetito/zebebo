from django.http import HttpResponse
from django.contrib.auth.models import User
from tastypie.authorization import Authorization
from tastypie.resources import ModelResource
from tastypie import fields
from tastypie.constants import ALL_WITH_RELATIONS
from zebebo_app.board.models import Board, TripSegment

class UserResource(ModelResource):
   
    class Meta:
        queryset = User.objects.all()
        resource_name = 'user'
        fields = ['username']
        #allowed_methods = ['get']
        authorization= Authorization()
        #authentication = BasicAuthentication()
        
class BoardResource(ModelResource):
    
    user = fields.ForeignKey(UserResource, 'user', full=True)
    
    def obj_create(self, bundle, request=None, **kwargs):
        kwargs["user_id"] = 1 # TODO: Authentication
        return super(BoardResource, self).obj_create(bundle, request, user=request.user)
    
    def apply_authorization_limits(self, request, object_list):
        if request and hasattr(request, 'user'):
            return object_list.filter(user__username=request.user.username)
        else: 
            return object_list
   
    class Meta:
        queryset = Board.objects.all()
        #include_resource_uri = False
        #list_allowed_methods = ['get', 'post', ]
        #detail_allowed_methods = ['get', 'post', 'put', 'delete']
        authorization= Authorization()
       #authentication = BasicAuthentication()

class TripSegmentResource(ModelResource):
    board = fields.ForeignKey(BoardResource, 'board',full=True)
    class Meta:
        queryset = TripSegment.objects.all()
        #include_resource_uri = False
        authorization= Authorization()
        #authentication = BasicAuthentication()
        filtering = {
            "board" : ('exact', )
        }

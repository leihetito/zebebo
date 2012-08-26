from django.conf.urls.defaults import patterns, url, include
from tastypie.api import Api
from zebebo_app.board.api import TripSegmentResource, BoardResource

api = Api(api_name='api')
api.register(TripSegmentResource())
api.register(BoardResource())

urlpatterns = patterns('',
    url(r'^$', 'zebebo_app.board.views.app', name='dashboard'),
    (r'^', include(api.urls)),
)

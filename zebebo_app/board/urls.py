from django.conf.urls.defaults import patterns, url, include
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from tastypie.api import Api
from zebebo_app.board.api import TripSegmentResource, BoardResource, UserResource

api = Api(api_name='api')
api.register(UserResource())
api.register(TripSegmentResource())
api.register(BoardResource())

urlpatterns = patterns('',
    url(r'^$', 'zebebo_app.board.views.app', name='dashboard'),
    (r'^', include(api.urls)),
)

urlpatterns += staticfiles_urlpatterns()

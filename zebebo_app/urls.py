from django.conf.urls.defaults import patterns, include, url
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    # zebebo_app urls
    url(r'^', include('board.urls')),

    # auth
    # url(r'^auth/', include('auth.urls')),

    # admin
    url(r'^admin/', include(admin.site.urls)),
)

from django.conf.urls.defaults import patterns, include, url
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    # zebebo_app urls
    url(r'^', include('board.urls')),

    url(r'^social/', include('socialregistration.urls', namespace = 'socialregistration')),

    # admin
    url(r'^admin/', include(admin.site.urls)),
)

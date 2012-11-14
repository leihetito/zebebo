import allauth
from django.conf.urls.defaults import patterns, include, url
from django.contrib import admin
from django.views.generic.simple import direct_to_template

admin.autodiscover()

urlpatterns = patterns('',
    # zebebo_app urls
    #url(r'^$', 'zebebo_app.board.views.home', name='dashboard'),
    
    url(r'^', include('board.urls')),
    
    #url(r'^social/', include('socialregistration.urls', namespace = 'socialregistration')),
    url(r'^accounts/', include('allauth.urls')),
    url(r'^accounts/profile/', direct_to_template, { 'template' : 'board/profile.html' }),
    
    # admin
    url(r'^admin/', include(admin.site.urls)),
)

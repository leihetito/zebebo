import logging
from django.http import HttpResponseRedirect
from django.shortcuts import render_to_response
from django.template.context import RequestContext
from core.decorators import render_template
from django.dispatch import receiver
from django.contrib.auth.decorators import login_required
from allauth.account.signals import user_logged_in
from socialregistration.contrib.facebook.models import FacebookProfile
from socialregistration.contrib.twitter.models import TwitterProfile

@login_required
def app(request):
    print("user is %s" %request.user)
    return render_to_response(
        'board/app.html', dict(
            facebook=FacebookProfile.objects.all(),
            twitter=TwitterProfile.objects.all(), 
            username=request.user,           
    ), context_instance=RequestContext(request))

@render_template
def home(request):
    return "board/home.html"

@receiver(user_logged_in)
def get_more_information(sender, **kwargs):
    print( "getting more information in callback")


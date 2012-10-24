from django.http import HttpResponseRedirect
from django.shortcuts import render_to_response
from django.template.context import RequestContext
from core.decorators import render_template
from socialregistration.contrib.facebook.models import FacebookProfile
from socialregistration.contrib.twitter.models import TwitterProfile

def app(request):
    return render_to_response(
        'board/app.html', dict(
            facebook=FacebookProfile.objects.all(),
            twitter=TwitterProfile.objects.all(),            
    ), context_instance=RequestContext(request))

@render_template
def home(request):
    return "index.html"
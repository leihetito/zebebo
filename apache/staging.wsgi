import os
import sys
import site

# www/staging
TOP_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
site_packages = os.path.join(TOP_ROOT, 'zebeboenv/lib/python2.7/site-packages/')
site.addsitedir(os.path.abspath(site_packages))
# www/staging/zebebo_site
PROJECT_ROOT = os.path.dirname(os.path.dirname(__file__))
# zebebo_app
APP_ROOT = os.path.join(PROJECT_ROOT, 'zebebo_app')

extra_paths = []
extra_paths.append(PROJECT_ROOT)
extra_paths.append(APP_ROOT)
sys.path[0:0] = extra_paths

os.environ['DJANGO_SETTINGS_MODULE'] = 'zebebo_app.settings'

import django.core.handlers.wsgi
application = django.core.handlers.wsgi.WSGIHandler()
    
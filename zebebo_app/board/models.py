from django.contrib.auth.models import User
from django.db import models
from django.db.models.aggregates import Max, Count
from django.db.models.signals import post_save
from django.utils.encoding import smart_unicode

class Board(models.Model):
    user = models.ForeignKey(User)
    title = models.CharField(max_length=255)
    origin = models.CharField(max_length=50)
    destination = models.CharField(max_length=50)
    fromDate = models.DateField()
    toDate = models.DateField()

    def __unicode__(self):
        return smart_unicode(self.title)

TRANSPORT_CHOICES = (
    ('flight', 'Flight'),
    ('taxi', 'Taxi'),
    ('car', 'Car'),
    ('train', 'Train'),
    ('bus', 'Bus'),
    ('foot', 'Foot')
)

class TripSegment(models.Model):
    board = models.ForeignKey(Board)
    order = models.IntegerField()
    origin = models.CharField(max_length=50)
    destination = models.CharField(max_length=50)
    transport = models.CharField(max_length=30, choices=TRANSPORT_CHOICES)
    
    class Meta:
        ordering = ["order", ]

    def save(self, **kwargs):
        if self.pk and not self.order:
            # self.order = (self.stage.story_set.aggregate(Max("order")).get("order__max") or 0)  + 1
            # TODO: use aggregate for performance !
            from operator import attrgetter
            try:
                total = max(self.board.tripsegment_set.all(), key=attrgetter("order")) + 1
            except ValueError:
                total = 1
            self.order = total
            self.save()
        super(TripSegment, self).save(**kwargs)

    def __unicode__(self):
        return smart_unicode('%s - %s' % (self.origin, self.destination))
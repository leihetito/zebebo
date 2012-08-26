from django.contrib import admin
from board.models import Board, TripSegment


class TripSegmentInline(admin.TabularInline):
    model = TripSegment


class BoardAdmin(admin.ModelAdmin):
    inlines = [TripSegmentInline, ]

admin.site.register(Board, BoardAdmin)

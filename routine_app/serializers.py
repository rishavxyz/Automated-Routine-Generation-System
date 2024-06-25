# backend_app/serializers.py
from rest_framework import serializers

class FileSerializer(serializers.Serializer):
    facultyFile = serializers.FileField()
    courseFile = serializers.FileField()
    roomFile = serializers.FileField()
    sectionFile = serializers.FileField()
    # no_of_days = serializers.IntegerField()
    # no_of_slots = serializers.IntegerField()
    # break_slot = serializers.IntegerField()
    # weekly_holiday = serializers.CharField()


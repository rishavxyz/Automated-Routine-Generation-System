# backend_app/urls.py
from django.urls import path
from .views import RoutineGenerationAPIView, ScheduleView ,CsrfView, SlotAPIView

urlpatterns = [
    path('generate_routine/', RoutineGenerationAPIView.as_view(), name='generate_routine'),
    path('generate_resource/',ScheduleView.as_view(), name='generate_resource'),
    path('csrf/', CsrfView.as_view(), name='csrf'),
    path('slots/', SlotAPIView.as_view(), name = 'slots')
]

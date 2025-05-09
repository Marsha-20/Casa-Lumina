from django.urls import path
from . import views
from .views import submit_property


urlpatterns = [
    path('', views.home, name='Home'),
    path('contact/', views.contact, name='Contact'),
    path('services/', views.services, name='Services'),
    path('properties/', views.properties, name='Properties'),
    path('submit_property/', submit_property, name='submit_property'),
]

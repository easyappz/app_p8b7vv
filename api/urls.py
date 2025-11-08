from django.urls import path
from .views import MessageListCreateView, OnlineCountView

urlpatterns = [
    path("messages/", MessageListCreateView.as_view(), name="messages"),
    path("online-count/", OnlineCountView.as_view(), name="online-count"),
]

from django.contrib import admin
from .models import Message, UserSession


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    """
    Admin interface for Message model.
    """
    list_display = ['id', 'username', 'text_preview', 'timestamp', 'session_id']
    list_filter = ['timestamp', 'username']
    search_fields = ['username', 'text', 'session_id']
    readonly_fields = ['timestamp']
    ordering = ['-timestamp']
    date_hierarchy = 'timestamp'

    def text_preview(self, obj):
        """
        Show text preview in admin list.
        """
        return obj.text[:50] + '...' if len(obj.text) > 50 else obj.text
    text_preview.short_description = 'Текст сообщения'


@admin.register(UserSession)
class UserSessionAdmin(admin.ModelAdmin):
    """
    Admin interface for UserSession model.
    """
    list_display = ['id', 'username', 'session_id', 'last_activity', 'last_message_time', 'is_online']
    list_filter = ['last_activity', 'last_message_time']
    search_fields = ['username', 'session_id']
    readonly_fields = ['last_activity', 'last_message_time']
    ordering = ['-last_activity']
    date_hierarchy = 'last_activity'

    def is_online(self, obj):
        """
        Check if user is online (active in last 5 minutes).
        """
        from django.utils import timezone
        from datetime import timedelta
        five_minutes_ago = timezone.now() - timedelta(minutes=5)
        return obj.last_activity >= five_minutes_ago
    is_online.boolean = True
    is_online.short_description = 'Онлайн'

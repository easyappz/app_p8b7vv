from django.db import models
from django.utils import timezone


class Message(models.Model):
    """
    Model for storing chat messages.
    """
    username = models.CharField(max_length=100, verbose_name="Имя пользователя")
    text = models.CharField(max_length=500, verbose_name="Текст сообщения")
    timestamp = models.DateTimeField(default=timezone.now, db_index=True, verbose_name="Время отправки")
    session_id = models.CharField(max_length=255, db_index=True, verbose_name="ID сессии")

    class Meta:
        ordering = ['-timestamp']
        verbose_name = "Сообщение"
        verbose_name_plural = "Сообщения"
        indexes = [
            models.Index(fields=['-timestamp']),
            models.Index(fields=['session_id']),
        ]

    def __str__(self):
        return f"{self.username}: {self.text[:50]}"


class UserSession(models.Model):
    """
    Model for tracking user sessions and activity.
    """
    session_id = models.CharField(max_length=255, unique=True, db_index=True, verbose_name="ID сессии")
    username = models.CharField(max_length=100, verbose_name="Имя пользователя")
    last_activity = models.DateTimeField(default=timezone.now, db_index=True, verbose_name="Последняя активность")
    last_message_time = models.DateTimeField(null=True, blank=True, verbose_name="Время последнего сообщения")

    class Meta:
        verbose_name = "Сессия пользователя"
        verbose_name_plural = "Сессии пользователей"
        indexes = [
            models.Index(fields=['session_id']),
            models.Index(fields=['last_activity']),
        ]

    def __str__(self):
        return f"{self.username} ({self.session_id})"

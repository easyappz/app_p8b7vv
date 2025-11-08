from rest_framework import serializers
from .models import Message
import random


RUSSIAN_NAMES = [
    "Александр", "Дмитрий", "Максим", "Сергей", "Андрей",
    "Алексей", "Артём", "Илья", "Кирилл", "Михаил",
    "Никита", "Матвей", "Роман", "Егор", "Арсений",
    "Иван", "Денис", "Евгений", "Даниил", "Тимофей",
    "Владимир", "Павел", "Руслан", "Марк", "Глеб",
    "Анна", "Мария", "Елена", "Ольга", "Наталья",
    "Татьяна", "Екатерина", "Ирина", "Юлия", "Светлана",
    "Анастасия", "Виктория", "Дарья", "Полина", "София",
]


class MessageSerializer(serializers.ModelSerializer):
    """
    Serializer for Message model.
    """
    class Meta:
        model = Message
        fields = ['id', 'username', 'text', 'timestamp', 'session_id']
        read_only_fields = ['id', 'username', 'timestamp', 'session_id']

    def validate_text(self, value):
        """
        Validate message text length.
        """
        if not value or len(value.strip()) == 0:
            raise serializers.ValidationError("Сообщение не может быть пустым")
        if len(value) > 500:
            raise serializers.ValidationError("Сообщение не может быть длиннее 500 символов")
        return value.strip()


class MessageCreateSerializer(serializers.Serializer):
    """
    Serializer for creating messages.
    """
    text = serializers.CharField(max_length=500, min_length=1)

    def validate_text(self, value):
        """
        Validate message text.
        """
        if not value or len(value.strip()) == 0:
            raise serializers.ValidationError("Сообщение не может быть пустым")
        if len(value) > 500:
            raise serializers.ValidationError("Сообщение не может быть длиннее 500 символов")
        return value.strip()


class OnlineCountSerializer(serializers.Serializer):
    """
    Serializer for online users count.
    """
    count = serializers.IntegerField()


def generate_random_username():
    """
    Generate random Russian username.
    """
    return random.choice(RUSSIAN_NAMES)

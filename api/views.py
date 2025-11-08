from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from datetime import timedelta
from drf_spectacular.utils import extend_schema, OpenApiParameter
from .models import Message, UserSession
from .serializers import (
    MessageSerializer,
    MessageCreateSerializer,
    OnlineCountSerializer,
    generate_random_username
)


class MessageListCreateView(APIView):
    """
    API endpoint for listing and creating chat messages.
    """

    @extend_schema(
        responses={200: MessageSerializer(many=True)},
        description="Get all chat messages ordered by timestamp",
        parameters=[
            OpenApiParameter(name='page', type=int, description='Page number'),
            OpenApiParameter(name='page_size', type=int, description='Messages per page'),
        ]
    )
    def get(self, request):
        """
        Get all messages with pagination.
        """
        # Update user activity
        session_id = request.session.session_key
        if not session_id:
            request.session.create()
            session_id = request.session.session_key

        # Update or create user session
        if session_id:
            UserSession.objects.update_or_create(
                session_id=session_id,
                defaults={'last_activity': timezone.now()}
            )

        # Get pagination parameters
        try:
            page = int(request.GET.get('page', 1))
            page_size = int(request.GET.get('page_size', 50))
        except ValueError:
            page = 1
            page_size = 50

        # Limit page_size
        page_size = min(page_size, 100)
        page = max(page, 1)

        # Get messages
        messages = Message.objects.all().order_by('-timestamp')
        total_count = messages.count()

        # Pagination
        start = (page - 1) * page_size
        end = start + page_size
        messages_page = messages[start:end]

        serializer = MessageSerializer(messages_page, many=True)

        return Response({
            'results': serializer.data,
            'count': total_count,
            'page': page,
            'page_size': page_size,
            'total_pages': (total_count + page_size - 1) // page_size
        })

    @extend_schema(
        request=MessageCreateSerializer,
        responses={201: MessageSerializer},
        description="Create a new chat message"
    )
    def post(self, request):
        """
        Create a new message with rate limiting.
        """
        # Ensure session exists
        if not request.session.session_key:
            request.session.create()

        session_id = request.session.session_key

        # Get or create user session
        user_session, created = UserSession.objects.get_or_create(
            session_id=session_id,
            defaults={'username': generate_random_username()}
        )

        # Check rate limiting (1 message per 2 seconds)
        if user_session.last_message_time:
            time_since_last_message = timezone.now() - user_session.last_message_time
            if time_since_last_message < timedelta(seconds=2):
                remaining_time = 2 - time_since_last_message.total_seconds()
                return Response(
                    {
                        'error': f'Пожалуйста, подождите {remaining_time:.1f} секунд перед отправкой следующего сообщения'
                    },
                    status=status.HTTP_429_TOO_MANY_REQUESTS
                )

        # Validate message data
        serializer = MessageCreateSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # Create message
        message = Message.objects.create(
            username=user_session.username,
            text=serializer.validated_data['text'],
            session_id=session_id
        )

        # Update user session
        user_session.last_message_time = timezone.now()
        user_session.last_activity = timezone.now()
        user_session.save()

        # Store username in session
        request.session['username'] = user_session.username

        return Response(
            MessageSerializer(message).data,
            status=status.HTTP_201_CREATED
        )


class OnlineCountView(APIView):
    """
    API endpoint for getting online users count.
    """

    @extend_schema(
        responses={200: OnlineCountSerializer},
        description="Get count of online users (active in last 5 minutes)"
    )
    def get(self, request):
        """
        Get count of users active in last 5 minutes.
        """
        # Update current user activity
        session_id = request.session.session_key
        if not session_id:
            request.session.create()
            session_id = request.session.session_key

        if session_id:
            UserSession.objects.update_or_create(
                session_id=session_id,
                defaults={'last_activity': timezone.now()}
            )

        # Count users active in last 5 minutes
        five_minutes_ago = timezone.now() - timedelta(minutes=5)
        online_count = UserSession.objects.filter(
            last_activity__gte=five_minutes_ago
        ).count()

        serializer = OnlineCountSerializer({'count': online_count})
        return Response(serializer.data)

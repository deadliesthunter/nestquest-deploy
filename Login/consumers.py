from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from datetime import datetime
from rest_framework.authtoken.models import Token
from urllib.parse import parse_qs
import json

from .models import PrivateMessage, User


class BaseChatConsumer(AsyncWebsocketConsumer):
    @database_sync_to_async
    def get_user_from_token(self, token_key):
        try:
            token = Token.objects.get(key=token_key)
            return token.user
        except Token.DoesNotExist:
            return None

    @database_sync_to_async
    def save_message(self, sender, receiver_id, message):
        receiver = User.objects.get(id=receiver_id)
        return PrivateMessage.objects.create(
            sender=sender, receiver=receiver, message=message
        )


class PrivateChatConsumer(BaseChatConsumer):
    async def connect(self):
        query_string = parse_qs(self.scope["query_string"].decode())
        token_key = query_string.get("token", [None])[0]
        user = await self.get_user_from_token(token_key)
        if user:
            self.scope["user"] = user
            # Use a personal group name based on user id
            self.room_group_name = f"user_{user.id}"
            await self.channel_layer.group_add(self.room_group_name, self.channel_name)
            await self.accept()
            print(f"Private chat connected: {user.firstname}")
        else:
            await self.close()

    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data.get("message")
        receiver_id = data.get("receiver_id")
        user = self.scope.get("user")
        if message and receiver_id and user and user.is_authenticated:
            # Persist the message in the DB
            await self.save_message(user, receiver_id, message)
            payload = {
                "type": "chat_message",
                "message": message,
                "sender_id": str(user.id),
                "sender_name": user.firstname,
                "timestamp": datetime.now().isoformat(),
            }
            # Broadcast the message to both sender's and receiver's groups
            await self.channel_layer.group_send(f"user_{user.id}", payload)
            await self.channel_layer.group_send(f"user_{receiver_id}", payload)

    async def chat_message(self, event):
        await self.send(
            text_data=json.dumps(
                {
                    "type": "chat_message",  # Include the type
                    "message": event["message"],
                    "sender_id": event["sender_id"],  # Include sender_id
                    "sender_name": event["sender_name"],
                    "timestamp": event["timestamp"],
                }
            )
        )

    async def disconnect(self, code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)


# notification .......
from channels.generic.websocket import AsyncWebsocketConsumer
import json

class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope["user"]
        if self.user.is_authenticated:
            self.group_name = f"notifications_{self.user.id}"
            await self.channel_layer.group_add(self.group_name, self.channel_name)
            await self.accept()
        else:
            await self.close()

    async def disconnect(self, close_code):
        if self.user.is_authenticated:
            await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def send_notification(self, event):
        await self.send(text_data=json.dumps(event["message"]))


from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

def send_real_time_notification(user, message):
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        f"notifications_{user.id}",
        {
            "type": "send_notification",
            "message": {"message": message},
        },
    )

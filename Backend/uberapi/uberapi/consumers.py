from channels.generic.websocket import AsyncWebsocketConsumer
import json
from asgiref.sync import async_to_sync
import math

class KafkaConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = 'available-drivers'
        self.room_group_name = f'group_{self.room_name}'
        print("Connection made to self.room_group_name: ", self.room_group_name)
        
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()
        print("Connection accepted")
        await self.send(text_data=json.dumps({
            'type': 'connection_accepted',
            'message': 'Connection accepted'
        }))
        print("self.channel_layer: ", self.channel_layer)

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def send_message(self, event):
        # Handle the incoming message
        print("Message received:", event["message"])
        await self.send(text_data=json.dumps({
            'type': 'driver_update',
            'message': event["message"]
        }))
        
        # Send acknowledgment back
        await self.channel_layer.send(
            "sender_channel",  # Replace with the actual channel name
            {
                "type": "acknowledge_message",
                "status": "success"
            }
        )

    async def acknowledge_message(self, event):
        # Handle acknowledgment
        print("Acknowledgment received:", event["status"])
    # async def receive(self, text_data):
    #     """Handle incoming messages from WebSocket clients"""
    #     print("receive: ")
    #     data = json.loads(text_data)
    #     print("data: ", data)
    #     await self.channel_layer.group_send(
    #         self.room_group_name,
    #         {
    #             'type': 'broadcast_driver_location',
    #             'message': data
    #         }
    #     )

    # async def broadcast_driver_location(self, event):
    #     """Send driver location updates to all connected clients"""
    #     print("broadcast_driver_location: ")
    #     print(event['message'])
    #     await self.send(text_data=json.dumps({
    #         'type': 'driver_location',
    #         'data': event['message']
    #     }))




    # def calculate_distance(self, lat1, lon1, lat2, lon2):
    #     """Calculate distance between two points using Haversine formula"""
    #     R = 6371  # Earth's radius in kilometers

    #     dlat = math.radians(lat2 - lat1)
    #     dlon = math.radians(lon2 - lon1)
    #     a = math.sin(dlat/2) * math.sin(dlat/2) + \
    #         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * \
    #         math.sin(dlon/2) * math.sin(dlon/2)
    #     c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
    #     distance = R * c

    #     return distance
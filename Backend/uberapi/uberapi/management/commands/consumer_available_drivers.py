from django.core.management.base import BaseCommand
from kafka import KafkaConsumer
import json
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

class Command(BaseCommand):
    help = 'Starts the Kafka consumer'

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.channel_layer = get_channel_layer()
        print("self.channel_layer: ", self.channel_layer)

    def handle(self, *args, **options):
        consumer = KafkaConsumer('available-drivers',
                                 bootstrap_servers=['localhost:9092'],
                                 value_deserializer=lambda m: json.loads(m.decode('utf-8')))
        
        for message in consumer:
            print(f"Received: {message.value}")
            try:
                async_to_sync(self.channel_layer.group_send)("group_available-drivers", {
                    "type": "send_message",
                    "message": message.value
                })
                print("Message sent to WebSocket")
            except Exception as e:
                print(f"Failed to send message: {e}")

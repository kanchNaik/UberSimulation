class WebSocketService {
    constructor() {
        this.callbacks = {};
        this.websocket = null;
    }

    connect() {
        if (this.websocket) {
            this.websocket.close();
        }

        this.websocket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL || 'ws://localhost:8000/ws/drivers/');
        
        this.websocket.onopen = () => {
            console.log('Connected to WebSocket');
        };

        this.websocket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            Object.keys(this.callbacks).forEach(key => {
                this.callbacks[key](data);
            });
        };

        this.websocket.onclose = () => {
            console.log('Disconnected from WebSocket');
            // Attempt to reconnect after 3 seconds
            setTimeout(() => {
                this.connect();
            }, 3000);
        };

        this.websocket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
    }

    addCallback(key, callback) {
        this.callbacks[key] = callback;
    }

    removeCallback(key) {
        delete this.callbacks[key];
    }

    disconnect() {
        if (this.websocket) {
            this.websocket.close();
            this.websocket = null;
        }
        this.callbacks = {};
    }
}

export default WebSocketService; 
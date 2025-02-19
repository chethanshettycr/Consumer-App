class WebSocketService {
  private socket: WebSocket | null = null
  private listeners: { [key: string]: ((data: any) => void)[] } = {}

  connect(userId: string) {
    this.socket = new WebSocket(`wss://your-websocket-server.com?userId=${userId}`)

    this.socket.onmessage = (event) => {
      const { type, data } = JSON.parse(event.data)
      if (this.listeners[type]) {
        this.listeners[type].forEach((listener) => listener(data))
      }
    }

    this.socket.onclose = () => {
      // Attempt to reconnect after 5 seconds
      setTimeout(() => this.connect(userId), 5000)
    }
  }

  on(type: string, callback: (data: any) => void) {
    if (!this.listeners[type]) {
      this.listeners[type] = []
    }
    this.listeners[type].push(callback)
  }

  off(type: string, callback: (data: any) => void) {
    if (this.listeners[type]) {
      this.listeners[type] = this.listeners[type].filter((listener) => listener !== callback)
    }
  }

  send(type: string, data: any) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ type, data }))
    }
  }
}

export const webSocketService = new WebSocketService()


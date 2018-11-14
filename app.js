const app = require('express')()
const http = require('http').Server(app)
const io = require('socket.io')(http)

io.on('connection', socket => {
	console.log('user connected : ', socket.id)
	socket.on('loaded', (data) => {
		console.log('data from client : ', data)
	})

	socket.username = socket.id

	socket.on('usernameSet', (data) => {
		socket.emit('usernameChanged', {
	      username : data
	  	});
	})

	socket.on('messageSent' , (data) => {
		if (data.user !== '') {
			socket.username = data.user
		}
		socket.broadcast.emit('messageReceived', {
	      username: socket.username,
	      message: data.message
	  	});
	})

	socket.on('disconnect', () => {
    	console.log('user disconnected');
  });

})

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/views/index.html')
})

http.listen(3000, () => {
	console.log('Server is up and running on http://localhost:3000')
})
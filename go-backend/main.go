package main

import (
	"errors"
	"log"
	"net/http"
	"time"

	"github.com/gorilla/websocket"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	//Allow any origin to send msg
	CheckOrigin: func(r *http.Request) bool { return true },
	//block some  clients from connecting
}

type Vote struct {
	Count uint `json:"count"`
}
type Comment struct {
	ID        uint   `json:"id"`
	Message   string `json:"message"`
	Timestamp string `json:"timestamp"` //set on server
}

type Message struct {
	RowId   uint     `json:"rowId"`
	Comment *Comment `json:"Comment"`
	Vote    *Vote    `json:"vote"`
}

//NOTE: Above structs are just for testing (only structs i will need are Message{id,text} and Vote{count,rowId})

func main() {
	e := echo.New()

	e.Use(middleware.Logger())
	e.Use(middleware.Recover())
	//Echo docs: https://echo.labstack.com/guide/
	e.GET("/", func(c echo.Context) error {
		return c.String(http.StatusOK, "Hello, World!")
	})
	e.GET("/poll/:id", func(c echo.Context) error {

		id := c.Param("id")
		//FETCH poll data by {id} from Azure
		log.Printf("Fetched data for poll Id: %v", id)

		return c.JSON(http.StatusOK, "Hello, World!")
	})
	e.GET("/chat/:pollId/:rowId", func(c echo.Context) error {

		id := c.Param("pollId")
		rowId := c.Param("rowId")
		//FETCH CosmosDB chat data by {id}/{rowId} from Azure
		log.Printf("Fetched data for poll Id: %v, rowId %v", id, rowId)

		return c.String(http.StatusOK, "Hello, World!")
	})

	e.POST("/createPoll", func(c echo.Context) error {

		data := c.FormValue("data")
		//create poll data in Azure
		//https://echo.labstack.com/guide/#form-multipartform-data
		log.Printf("Creating new poll : %v", data)

		return c.String(http.StatusOK, "Hello, World!")
	})
	/*todo
	/UpdateChat/{PollId}/{RowId} (https://echo.labstack.com/guide/binding/#example)
	/Vote/{PollId}/{RowId} (https://echo.labstack.com/guide/ip-address/ (for ip address detection/ spam prevention)

	Ws Events:
	Vote casted (increment votecounts)
	User Joined (display -> "Currently {num} useres voting")
	Comment Added
	*/

	hub := NewHub()
	go hub.run()
	e.GET("/ws", func(c echo.Context) error {

		ws, err := upgrader.Upgrade(c.Response().Writer, c.Request(), nil)
		if !errors.Is(err, nil) {
			log.Println(err)
		}
		defer func() {
			delete(hub.clients, ws)
			ws.Close()
			log.Printf("Closed!")
		}()

		hub.clients[ws] = true
		log.Println("Connected!")
		read(hub, ws)
		return nil
	})
	//Start server
	e.Logger.Fatal(e.Start(":8080"))
}

func read(hub *Hub, client *websocket.Conn) {
	for {
		var message Message
		err := client.ReadJSON(&message) //this might double encode json ,so test (var message ) above to see value before this

		if !errors.Is(err, nil) {
			log.Printf("error occurred: %v", err)
			delete(hub.clients, client)
			break
		}
		//Handle what i send to fron based on received data over WS
		if message.Comment != nil {
			//date formating :https://stackoverflow.com/questions/20234104/how-to-format-current-time-using-a-yyyymmddhhmmss-format
			utc := time.Now().UTC()
			message.Comment.Timestamp = utc.Format("01-02 15:04")

		} else if message.Vote != nil {
			//todo (this will be tricky to update because i have App state / WS state/ DB state  [coordinate between all 3])
		}

		log.Println(message)

		hub.broadcast <- message
	}
}

//go conditional if assignments:https://stackoverflow.com/questions/25282572/multiple-assignment-by-if-statement

//https://github.com/gorilla/websocket/blob/master/examples/echo/server.go
//ican have multiple ws/endpoints to listen for /votes /messages

// (Go controllers) https://github.com/gorilla/mux#examples
/*
	Chat ws example:
	[medium blog post -]
	https://betterprogramming.pub/implementing-websocket-with-go-and-react-b3ee976770ab
	[Code]
	https://github.com/manakuro/golang-websockets-example

	[Build docker image]
	https://tutorialedge.net/projects/chat-system-in-go-and-react/part-6-dockerizing-your-backend/

	[other ws samples]
	https://github.com/gorilla/websocket/tree/master/examples/chat
	https://tutorialedge.net/projects/chat-system-in-go-and-react/part-2-simple-communication/


	Fetching data from the database
	https://docs.microsoft.com/en-us/azure/cosmos-db/mongodb/create-mongodb-go
	https://medium.com/@The_Regan/how-to-use-azure-cosmos-db-with-golang-using-mongodbs-official-go-driver-ccbb5db54c46

	Ip detection/ request spam prevention:
	https://golangbyexample.com/golang-ip-address-http-request/
*/

//other option taken from : (didnt work for this impl)
//https://docs.temporal.io/blog/build-an-ecommerce-app-with-temporal-part-4-rest-api
// var body Message
// err2 := json.NewDecoder(message).Decode(&body)

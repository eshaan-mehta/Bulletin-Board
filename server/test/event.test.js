const { mongoose, MongoClient, app, chai, expect, uuidv4, Event, Board, event_data, board_data } = require("./testUtils");

describe("Event Controller API", () => {
  let db;
  let event_collection;
  let board_collection;

  before(async function () {
    this.timeout(30000);
    const client = await MongoClient.connect(process.env.MONGO_URI);
    db = client.db();
    event_collection = db.collection("events");
    board_collection = db.collection("boards")
  });

  beforeEach(async function () {
    this.timeout(30000);
    await Event.deleteMany({});
    await Board.deleteMany({});
  });

  after(async function () {
    this.timeout(30000);
    await mongoose.disconnect();
  });

  // Test GET route
  describe("GET /api/events", () => {
    it("It should GET 0 events when none exist", async () => {
      const response = await chai.request(app).get("/api/events");
      expect(response).to.have.status(200);
      expect(response.body).to.be.a("array");
      expect(response.body.length).to.eq(0);
    });

    it("It should GET all events when some exist", async () => {
      for (let i = 0; i < 3; i++) {
        const event_data_with_unique_id = await {
          ...event_data,
          _id: uuidv4(),
        };

        await event_collection.insertOne(event_data_with_unique_id);
      }

      const response = await chai.request(app).get("/api/events");
      expect(response).to.have.status(200);
      expect(response.body).to.be.a("array");
      expect(response.body.length).to.eq(3);
    });
  });

  // Test GET (by ID) route
  describe("GET /api/events/:id", () => {
    it("It should GET an event by ID", async () => {
      const event = await event_collection.insertOne(event_data);
      const response = await chai
        .request(app)
        .get(`/api/events/${event.insertedId}`);
      expect(response).to.have.status(200);
      expect(response.body._id).to.eq(event.insertedId.toString());
    });

    it("It should not GET an event with an invalid ID Type", async () => {
      const response = await chai
        .request(app)
        .get(`/api/events/invalid_id_type`);
      expect(response).to.have.status(404);
      expect(response.body).to.have.property("error").equal("Event not found.");
    });

    it("It should not GET an event that does not exist anymore", async () => {
      const event = await event_collection.insertOne(event_data);
      await event_collection.deleteOne({ _id: event.insertedId });
      const response = await chai
        .request(app)
        .get(`/api/events/${event.insertedId}`);
      expect(response).to.have.status(404);
      expect(response.body).to.have.property("error").equal("Event not found.");
    });
  });

  // Test POST route
  describe("POST /api/events", () => {
    it("It should POST an event", async () => {
      const board = await board_collection.insertOne(board_data);
      const new_event_data = {...event_data, belongsToBoard: board.insertedId,};
      const event = await event_collection.insertOne(new_event_data);
      const event_number = await Event.collection.countDocuments({}, { hint: "_id_" });

      const response = await chai
        .request(app)
        .post("/api/events")
        .set("Content-Type", "application/json")
        .send(new_event_data);

      const final_event_number = await Event.collection.countDocuments({}, { hint: "_id_" });
      expect(response).to.have.status(201);
      expect(final_event_number).equal(event_number + 1);
      expect(response.body).to.have.property("title").equal(new_event_data.title);
      expect(response.body).to.have.property("description").equal(new_event_data.description);
      expect(response.body).to.have.property("contact").equal(new_event_data.contact);
      expect(response.body).to.have.property("tags").deep.equal(new_event_data.tags);
      expect(response.body).to.have.property("date").equal(new Date(new_event_data.date).toISOString());
      expect(response.body).to.have.property("time").equal(new_event_data.time);
      expect(response.body).to.have.property("location").equal(new_event_data.location);
      expect(response.body).to.have.property("belongsToBoard").equal(board.insertedId.toString());
    });

    it("It should not POST an event with a validation error", async () => {
      const board = await board_collection.insertOne(board_data);
      const new_event_data = {...event_data, title: "This title is above 30 characters long which is invalid, and should trigger a validation error.", belongsToBoard: board.insertedId,};
      const event = await event_collection.insertOne(new_event_data);
      const event_number = await Event.collection.countDocuments({}, { hint: "_id_" });

      const response = await chai
        .request(app)
        .post("/api/events")
        .set("Content-Type", "application/json")
        .send(new_event_data);

      const final_event_number = await Event.collection.countDocuments({}, { hint: "_id_" });
      expect(response).to.have.status(400);
      expect(response.body)
        .to.have.property("error")
        .equal(
          "Event validation failed: title: Event title can not be longer than 30 characters."
        );
      expect(final_event_number).equal(event_number);
    });

    it("It should not POST an event with an invalid Board ID Type", async () => {
      const new_event_data = {...event_data, belongsToBoard: "invalid_board_id"};
      const event = await event_collection.insertOne(new_event_data);
      const event_number = await Event.collection.countDocuments({}, { hint: "_id_" });

      const response = await chai
        .request(app)
        .post("/api/events")
        .set("Content-Type", "application/json")
        .send(new_event_data);

      const final_event_number = await Event.collection.countDocuments({}, { hint: "_id_" });
      expect(response).to.have.status(404);
      expect(response.body).to.have.property("error").equal("Board not found.");
      expect(final_event_number).equal(event_number);
    });

    it("It should not POST an event with a Board ID that does not exist", async () => {
      const board = await board_collection.insertOne(board_data);
      await board_collection.deleteOne({ _id: board.insertedId });
      const new_event_data = {...event_data, belongsToBoard: board.insertedId};
      const event = await event_collection.insertOne(new_event_data);
      const event_number = await Event.collection.countDocuments({}, { hint: "_id_" });

      const response = await chai
        .request(app)
        .post("/api/events")
        .set("Content-Type", "application/json")
        .send(new_event_data);

      const final_event_number = await Event.collection.countDocuments({}, { hint: "_id_" });
      expect(response).to.have.status(404);
      expect(response.body).to.have.property("error").equal("Board not found.");
      expect(final_event_number).equal(event_number);
    });
  });

  // Test PATCH route
  describe("PATCH /api/events/:id", () => {
    it("It should PATCH an event by ID", async () => {
      const event = await event_collection.insertOne(event_data);

      const response = await chai
        .request(app)
        .patch(`/api/events/${event.insertedId}`)
        .set("Content-Type", "application/json")
        .send({
          title: "Updated Title.",
        });

      expect(response).to.have.status(200);
      expect(response.body._id).to.eq(event.insertedId.toString());
      expect(response.body.title).to.eq("Updated Title.");
    });

    it("It should not PATCH an event by ID with a validation error", async () => {
      const event = await event_collection.insertOne(event_data);

      const response = await chai
        .request(app)
        .patch(`/api/events/${event.insertedId}`)
        .set("Content-Type", "application/json")
        .send({
          title:
            "This title is above 30 characters long which is invalid, and should trigger a validation error.",
        });
        
      expect(response).to.have.status(400);
      expect(response.body)
        .to.have.property("error")
        .equal(
          "Validation failed: title: Event title can not be longer than 30 characters."
        );
    });

    it("It should not PATCH an event with an invalid ID Type", async () => {
      const response = await chai
        .request(app)
        .patch(`/api/events/invalid_id_type`);
      expect(response).to.have.status(404);
      expect(response.body).to.have.property("error").equal("Event not found.");
    });

    it("It should not PATCH an event that does not exist anymore", async () => {
      const event = await event_collection.insertOne(event_data);
      event_collection.deleteOne({ _id: event.insertedId });
      const response = await chai
        .request(app)
        .patch(`/api/events/${event.insertedId}`);
      expect(response).to.have.status(404);
      expect(response.body).to.have.property("error").equal("Event not found.");
    });
  });

  // Test DELETE route
  describe("DELETE /api/events/:id", () => {
    it("It should DELETE an event by ID", async () => {
      const event = await event_collection.insertOne(event_data);
      const event_number = await Event.collection.countDocuments(
        {},
        { hint: "_id_" }
      );
      const response = await chai
        .request(app)
        .delete(`/api/events/${event.insertedId}`);

      const final_event_number = await Event.collection.countDocuments(
        {},
        { hint: "_id_" }
      );
      expect(response).to.have.status(200);
      expect(response.body._id).to.eq(event.insertedId.toString());
      expect(final_event_number).to.eq(event_number - 1);
    });

    it("It should not DELETE an event with an invalid ID Type", async () => {
      const response = await chai
        .request(app)
        .delete(`/api/events/invalid_id_type`);
      expect(response).to.have.status(404);
      expect(response.body).to.have.property("error").equal("Event not found.");
    });

    it("It should not DELETE an event that does not exist anymore", async () => {
      const event = await event_collection.insertOne(event_data);
      await event_collection.deleteOne({ _id: event.insertedId });
      const response = await chai
        .request(app)
        .delete(`/api/events/${event.insertedId}`);
      expect(response).to.have.status(404);
      expect(response.body).to.have.property("error").equal("Event not found.");
    });
  });
});

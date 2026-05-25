import dotenv from "dotenv";
dotenv.config({
  path: ".env.local",
});
import mongoose from "mongoose";
import APIModel from "../models/APIModel";

async function testModel() {
  try {
    /* ===============================
       CONNECT DATABASE
    =============================== */
    
    await mongoose.connect(
      process.env.MONGODB_URI!
    );

    console.log("✅ MongoDB Connected");

    /* ===============================
       CREATE TEST DATA
    =============================== */

    const api = new APIModel({
      name: "Create User API",

      description:
        "API for creating users",

      route: "/api/users/create",

      method: "POST",

      apiType: "REST",

      authType: "JWT",

      parameters: [
        {
          name: "email",

          type: "string",

          required: true,

          validation: {
            minLength: 5,
          },
        },
      ],

      responseFields: [
        {
          name: "success",
          type: "boolean",
        },
      ],
    });

    /* ===============================
       VALIDATE ONLY
    =============================== */

    await api.validate();

    console.log(
      "✅ Validation Passed"
    );

    /* ===============================
       SAVE TO DATABASE
    =============================== */

    const savedAPI = await api.save();

    console.log(
      "✅ Saved Successfully"
    );

    console.log(savedAPI);

    /* ===============================
       FETCH FROM DATABASE
    =============================== */

    const fetched =
      await APIModel.findById(
        savedAPI._id
      );

    console.log(
      "✅ Data Retrieved"
    );

    console.log(fetched);

    /* ===============================
       CLEANUP
    =============================== */

    await APIModel.findByIdAndDelete(
      savedAPI._id
    );

    console.log(
      "✅ Test Data Deleted"
    );

    /* ===============================
       DISCONNECT
    =============================== */

    await mongoose.disconnect();

    console.log(
      "✅ MongoDB Disconnected"
    );
  } catch (error) {
    console.error(
      "❌ Test Failed"
    );
    console.log("Connecting to MongoDB...", process.env.MONGODB_URI);

    console.error(error);
  }
}

testModel();
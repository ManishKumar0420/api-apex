import mongoose, {
  Schema,
  Document,
  Model,
  Types,
} from "mongoose";

/* =========================================================
   PARAMETER INTERFACE
========================================================= */

export interface IAPIParameter {
  name: string;
  type:
    | "string"
    | "number"
    | "boolean"
    | "array"
    | "object";

  required: boolean;

  defaultValue?: any;

  validation?: {
    minLength?: number;
    maxLength?: number;

    min?: number;
    max?: number;

    regex?: string;
  };
}

/* =========================================================
   RESPONSE FIELD INTERFACE
========================================================= */

export interface IAPIResponseField {
  name: string;

  type:
    | "string"
    | "number"
    | "boolean"
    | "array"
    | "object";
}

/* =========================================================
   MAIN API INTERFACE
========================================================= */

export interface IAPI extends Document {
  name: string;

  description?: string;

  route: string;

  method:
    | "GET"
    | "POST"
    | "PUT"
    | "PATCH"
    | "DELETE";

  apiType: "REST" | "GraphQL";

  graphqlOperation?: "query" | "mutation";

  authType:
    | "None"
    | "JWT"
    | "OAuth"
    | "API_KEY";

  parameters: IAPIParameter[];

  responseFields: IAPIResponseField[];

  createdBy?: Types.ObjectId;

  isActive: boolean;

  version: string;

  createdAt: Date;

  updatedAt: Date;
}

/* =========================================================
   PARAMETER SCHEMA
========================================================= */

const APIParameterSchema =
  new Schema<IAPIParameter>(
    {
      name: {
        type: String,
        required: true,
        trim: true,

        minlength: 2,
        maxlength: 50,
      },

      type: {
        type: String,

        required: true,

        enum: [
          "string",
          "number",
          "boolean",
          "array",
          "object",
        ],
      },

      required: {
        type: Boolean,
        default: false,
      },

      defaultValue: {
        type: Schema.Types.Mixed,
      },

      validation: {
        minLength: {
          type: Number,
        },

        maxLength: {
          type: Number,
        },

        min: {
          type: Number,
        },

        max: {
          type: Number,
        },

        regex: {
          type: String,
        },
      },
    },
    {
      _id: false,
    }
  );

/* =========================================================
   RESPONSE FIELD SCHEMA
========================================================= */

const APIResponseFieldSchema =
  new Schema<IAPIResponseField>(
    {
      name: {
        type: String,
        required: true,
        trim: true,
      },

      type: {
        type: String,

        required: true,

        enum: [
          "string",
          "number",
          "boolean",
          "array",
          "object",
        ],
      },
    },
    {
      _id: false,
    }
  );

/* =========================================================
   MAIN API SCHEMA
========================================================= */

const APISchema = new Schema<IAPI>(
  {
    /* ======================================
       BASIC INFO
    ====================================== */

    name: {
      type: String,

      required: true,

      trim: true,

      minlength: 3,

      maxlength: 100,
    },

    description: {
      type: String,

      trim: true,

      maxlength: 500,
    },

    /* ======================================
       ROUTING
    ====================================== */

    route: {
      type: String,

      required: true,

      trim: true,

      unique: true,

      match: /^\/[a-zA-Z0-9/_-]*$/,
    },

    method: {
      type: String,

      required: true,

      enum: [
        "GET",
        "POST",
        "PUT",
        "PATCH",
        "DELETE",
      ],

      default: "GET",
    },

    /* ======================================
       API TYPE
    ====================================== */

    apiType: {
      type: String,

      required: true,

      enum: ["REST", "GraphQL"],

      default: "REST",
    },

    graphqlOperation: {
      type: String,

      enum: ["query", "mutation"],

      required: function () {
        return this.apiType === "GraphQL";
      },
    },

    /* ======================================
       AUTH
    ====================================== */

    authType: {
      type: String,

      required: true,

      enum: [
        "None",
        "JWT",
        "OAuth",
        "API_KEY",
      ],

      default: "None",
    },

    /* ======================================
       PARAMETERS
    ====================================== */

    parameters: {
      type: [APIParameterSchema],

      default: [],

      validate: {
        validator: function (
          value: IAPIParameter[]
        ) {
          return value.length > 0;
        },

        message:
          "At least one parameter is required",
      },
    },

    /* ======================================
       RESPONSE SCHEMA
    ====================================== */

    responseFields: {
      type: [APIResponseFieldSchema],

      default: [],
    },

    /* ======================================
       USER OWNERSHIP
    ====================================== */

    createdBy: {
      type: Schema.Types.ObjectId,

      ref: "User",
    },

    /* ======================================
       FLAGS
    ====================================== */

    isActive: {
      type: Boolean,

      default: true,
    },

    version: {
      type: String,

      default: "v1",
    },
  },
  {
    timestamps: true,
  }
);

/* =========================================================
   INDEXES
========================================================= */

APISchema.index({
  route: 1,
  method: 1,
});

APISchema.index({
  createdBy: 1,
});

APISchema.index({
  apiType: 1,
});

/* =========================================================
   MODEL
========================================================= */

const APIModel: Model<IAPI> =
  mongoose.models.API ||
  mongoose.model<IAPI>(
    "API",
    APISchema
  );

export default APIModel;
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const expenseRoute_1 = __importDefault(require("./routes/expenseRoute"));
const authRoute_1 = __importDefault(require("./routes/authRoute"));
const errorHandler_1 = __importDefault(require("./middleware/errorHandler"));
const supabase_js_1 = require("@supabase/supabase-js");
const app = (0, express_1.default)();
dotenv_1.default.config();
const supabase = (0, supabase_js_1.createClient)(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
    throw new Error("Supabase environment variables are missing.");
}
app.use(express_1.default.json());
const cors = require("cors");
app.use(cors());
app.get('/', (req, res) => {
    res.send("Welcome To my expenses tracker");
});
app.use(cors({
    origin: ["http://localhost:3001", "https://expenses-tracker-g3ku12y2i-ziads-projects-5e62ff58.vercel.app"],
    credentials: true,
}));
app.use('/', expenseRoute_1.default);
app.use('/', authRoute_1.default);
app.use(errorHandler_1.default);
app.listen(process.env.PORT, () => {
    console.log("running on port " + process.env.PORT);
});

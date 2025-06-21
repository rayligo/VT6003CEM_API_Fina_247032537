"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const koa_router_1 = __importDefault(require("koa-router"));
const config_1 = require("../config");
const axios_1 = __importDefault(require("axios"));
const auth_1 = require("../controllers/auth");
const router = new koa_router_1.default({ prefix: "/api/v1/hotel" });
exports.router = router;
const getAll = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const body = ctx.request.body;
        console.log("Body", body === null || body === void 0 ? void 0 : body.hotelName);
        const token = config_1.config.rapidapi;
        const query = (body === null || body === void 0 ? void 0 : body.hotelName) == undefined || (body === null || body === void 0 ? void 0 : body.hotelName) == ""
            ? "HK"
            : body === null || body === void 0 ? void 0 : body.hotelName;
        const lookFor = "both"; // Hotels and flights
        const limit = 100;
        const convertCase = 0;
        // Construct the API URL
        const url = `http://engine.hotellook.com/api/v2/lookup.json?query=${query}&lookFor=${lookFor}&limit=${limit}&convertCase=${convertCase}&token=${token}`;
        console.log("getAll url", url);
        // Make the API call using axios
        const response = yield axios_1.default.get(url);
        // Check if the response is successful
        if (response.status === 200) {
            ctx.body = {
                status: "success",
                data: response.data,
            };
            ctx.status = 200;
        }
        else {
            ctx.body = {
                status: "error",
                message: "Failed to fetch data from Hotellook API",
            };
            ctx.status = response.status;
        }
    }
    catch (error) {
        console.error("Error fetching Hotellook API:", error === null || error === void 0 ? void 0 : error.status, (_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.statusText, (_b = error === null || error === void 0 ? void 0 : error.response) === null || _b === void 0 ? void 0 : _b.data);
        ctx.body = {
            status: "error",
            message: "Internal server error: " + ((_c = error === null || error === void 0 ? void 0 : error.response) === null || _c === void 0 ? void 0 : _c.data),
        };
        ctx.status = 500;
    }
    yield next();
});
router.post("/", auth_1.basicAuth, getAll);

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
const router = new koa_router_1.default({ prefix: "/api/v1/flights" });
exports.router = router;
const getAll = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f;
    try {
        const body = ctx.request.body;
        const token = config_1.config.rapidapi;
        console.log("Body", body);
        const rapidApiKey = config_1.config.rapidapi;
        if (!rapidApiKey) {
            ctx.body = {
                status: "error",
                message: "RapidAPI key is not configured",
            };
            ctx.status = 500;
            return yield next();
        }
        const departure_id = (body === null || body === void 0 ? void 0 : body.departure_id) || "HKG";
        const arrival_id = (body === null || body === void 0 ? void 0 : body.arrival_id) || "HND";
        const outbound_date = (body === null || body === void 0 ? void 0 : body.outbound_date) || "2025-07-22";
        const return_date = (body === null || body === void 0 ? void 0 : body.return_date) || "2025-07-29";
        const travel_class = (body === null || body === void 0 ? void 0 : body.travel_class) || "ECONOMY";
        const adults = (body === null || body === void 0 ? void 0 : body.adults) || 1;
        const show_hidden = (body === null || body === void 0 ? void 0 : body.show_hidden) || 1;
        const currency = (body === null || body === void 0 ? void 0 : body.currency) || "HKD";
        const language_code = (body === null || body === void 0 ? void 0 : body.language_code) || "en-US";
        const country_code = (body === null || body === void 0 ? void 0 : body.country_code) || "HK";
        const url = `https://google-flights2.p.rapidapi.com/api/v1/searchFlights?departure_id=${encodeURIComponent(departure_id)}&arrival_id=${encodeURIComponent(arrival_id)}&outbound_date=${encodeURIComponent(outbound_date)}&return_date=${encodeURIComponent(return_date)}&travel_class=${encodeURIComponent(travel_class)}&adults=${adults}&show_hidden=${show_hidden}&currency=${encodeURIComponent(currency)}&language_code=${encodeURIComponent(language_code)}&country_code=${encodeURIComponent(country_code)}`;
        console.log("getAll url", url);
        const response = yield axios_1.default.get(url, {
            headers: {
                "X-RapidAPI-Key": config_1.config.rapidapi,
                "X-RapidAPI-Host": config_1.config.rapidapiHost,
            },
        });
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
                message: "Failed to fetch data from Google Flights API",
            };
            ctx.status = response.status;
        }
    }
    catch (error) {
        console.error("Error fetching Google Flights API:", (_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.status, (_b = error === null || error === void 0 ? void 0 : error.response) === null || _b === void 0 ? void 0 : _b.statusText, (_c = error === null || error === void 0 ? void 0 : error.response) === null || _c === void 0 ? void 0 : _c.data);
        ctx.body = {
            status: "error",
            message: "Internal server error: " +
                (((_e = (_d = error === null || error === void 0 ? void 0 : error.response) === null || _d === void 0 ? void 0 : _d.data) === null || _e === void 0 ? void 0 : _e.message) || error.message),
        };
        ctx.status = ((_f = error === null || error === void 0 ? void 0 : error.response) === null || _f === void 0 ? void 0 : _f.status) || 500;
    }
    yield next();
});
router.post("/", auth_1.basicAuth, getAll);

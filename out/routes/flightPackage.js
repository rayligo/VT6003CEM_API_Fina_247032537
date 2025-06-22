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
const router = new koa_router_1.default({ prefix: "/api/v1/flightPackage" });
exports.router = router;
const getAllFlights = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    try {
        const body = ctx.request.body;
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
        console.log("getAllHotels url", url);
        const response = yield axios_1.default.get(url, {
            headers: {
                "X-RapidAPI-Key": config_1.config.rapidapi,
                "X-RapidAPI-Host": config_1.config.rapidapiHost,
            },
        });
        if (response.status === 200) {
            // Attach hotel data to ctx.state for downstream middleware
            (ctx.state.flights = (_c = (_b = (_a = response === null || response === void 0 ? void 0 : response.data) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.itineraries) === null || _c === void 0 ? void 0 : _c.topFlights),
                (ctx.status = 200);
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
        console.error("Error fetching Google Flights API:", (_d = error === null || error === void 0 ? void 0 : error.response) === null || _d === void 0 ? void 0 : _d.status, (_e = error === null || error === void 0 ? void 0 : error.response) === null || _e === void 0 ? void 0 : _e.statusText, (_f = error === null || error === void 0 ? void 0 : error.response) === null || _f === void 0 ? void 0 : _f.data);
        ctx.body = {
            status: "error",
            message: "Internal server error: " +
                (((_h = (_g = error === null || error === void 0 ? void 0 : error.response) === null || _g === void 0 ? void 0 : _g.data) === null || _h === void 0 ? void 0 : _h.message) || error.message),
        };
        ctx.status = ((_j = error === null || error === void 0 ? void 0 : error.response) === null || _j === void 0 ? void 0 : _j.status) || 500;
    }
    yield next();
});
const getAllHotels = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g;
    try {
        const body = ctx.request.body;
        const token = config_1.config.rapidapi;
        const query = (body === null || body === void 0 ? void 0 : body.hotelName) == undefined || (body === null || body === void 0 ? void 0 : body.hotelName) == ""
            ? "Japan"
            : body === null || body === void 0 ? void 0 : body.hotelName;
        const lookFor = "both"; // Hotels and flights
        const limit = 100;
        const convertCase = 0;
        const url = `http://engine.hotellook.com/api/v2/lookup.json?query=${encodeURIComponent(query)}&lookFor=${lookFor}&limit=${limit}&convertCase=${convertCase}&token=${token}`;
        console.log("getAllFlights url", url);
        const response = yield axios_1.default.get(url);
        if (response.status === 200) {
            // Attach flight data to ctx.state for downstream middleware
            (ctx.state.hotels = (_b = (_a = response.data) === null || _a === void 0 ? void 0 : _a.results) === null || _b === void 0 ? void 0 : _b.hotels), (ctx.status = 200);
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
        console.error("Error fetching Hotellook API:", (_c = error === null || error === void 0 ? void 0 : error.response) === null || _c === void 0 ? void 0 : _c.status, (_d = error === null || error === void 0 ? void 0 : error.response) === null || _d === void 0 ? void 0 : _d.statusText, (_e = error === null || error === void 0 ? void 0 : error.response) === null || _e === void 0 ? void 0 : _e.data);
        ctx.body = {
            status: "error",
            message: "Internal server error: " + (((_f = error === null || error === void 0 ? void 0 : error.response) === null || _f === void 0 ? void 0 : _f.data) || error.message),
        };
        ctx.status = ((_g = error === null || error === void 0 ? void 0 : error.response) === null || _g === void 0 ? void 0 : _g.status) || 500;
    }
    yield next();
});
const genPackage = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Access data from previous middleware via ctx.state
        const hotels = ctx.state.hotels;
        const flights = ctx.state.flights;
        if (!hotels || !flights) {
            ctx.body = {
                status: "error",
                message: "Missing hotels or flights data",
            };
            ctx.status = 400;
            return yield next();
        }
        const packageCount = Math.min(hotels === null || hotels === void 0 ? void 0 : hotels.length, flights === null || flights === void 0 ? void 0 : flights.length);
        const travelPackages = [];
        // Loop through hotels and flights to create packages
        for (let i = 0; i < packageCount; i++) {
            const flight = flights === null || flights === void 0 ? void 0 : flights[i];
            let hotel = hotels === null || hotels === void 0 ? void 0 : hotels[i];
            const min = 15;
            const max = 20;
            const coefficient = Math.floor(Math.random() * (max - min + 1)) + min;
            const randomPrice = coefficient * 100;
            hotel.price = randomPrice;
            const travelPackage = {
                flight: flight,
                hotel: hotel,
            };
            travelPackages.push(travelPackage);
        }
        ctx.body = {
            status: "success",
            data: travelPackages,
        };
        ctx.status = 200;
    }
    catch (error) {
        console.error("Error generating package:", error);
        ctx.body = {
            status: "error",
            message: "Internal server error: " + error.message,
        };
        ctx.status = 500;
    }
    yield next();
});
router.post("/", auth_1.basicAuth, getAllHotels, getAllFlights, genPackage);

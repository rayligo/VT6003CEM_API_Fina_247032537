import Router, { RouterContext } from "koa-router";
import { config } from "../config";
import axios from "axios";
import { basicAuth } from "../controllers/auth";

const router: Router = new Router({ prefix: "/api/v1/flights" });

const getAll = async (ctx: RouterContext, next: any) => {
  try {
    const body = ctx.request.body;
    const token = config.rapidapi;
    console.log("Body", body);

    const rapidApiKey = config.rapidapi;
    if (!rapidApiKey) {
      ctx.body = {
        status: "error",
        message: "RapidAPI key is not configured",
      };
      ctx.status = 500;
      return await next();
    }

    const departure_id = body?.departure_id || "HKG";
    const arrival_id = body?.arrival_id || "HND";
    const outbound_date = body?.outbound_date || "2025-07-22";
    const return_date = body?.return_date || "2025-07-29";
    const travel_class = body?.travel_class || "ECONOMY";
    const adults = body?.adults || 1;
    const show_hidden = body?.show_hidden || 1;
    const currency = body?.currency || "HKD";
    const language_code = body?.language_code || "en-US";
    const country_code = body?.country_code || "HK";

    const url = `https://google-flights2.p.rapidapi.com/api/v1/searchFlights?departure_id=${encodeURIComponent(
      departure_id
    )}&arrival_id=${encodeURIComponent(
      arrival_id
    )}&outbound_date=${encodeURIComponent(
      outbound_date
    )}&return_date=${encodeURIComponent(
      return_date
    )}&travel_class=${encodeURIComponent(
      travel_class
    )}&adults=${adults}&show_hidden=${show_hidden}&currency=${encodeURIComponent(
      currency
    )}&language_code=${encodeURIComponent(
      language_code
    )}&country_code=${encodeURIComponent(country_code)}`;
    console.log("getAll url", url);

    const response = await axios.get(url, {
      headers: {
        "X-RapidAPI-Key": config.rapidapi,
        "X-RapidAPI-Host": config.rapidapiHost,
      },
    });

    if (response.status === 200) {
      ctx.body = {
        status: "success",
        data: response.data,
      };
      ctx.status = 200;
    } else {
      ctx.body = {
        status: "error",
        message: "Failed to fetch data from Google Flights API",
      };
      ctx.status = response.status;
    }
  } catch (error: any) {
    console.error(
      "Error fetching Google Flights API:",
      error?.response?.status,
      error?.response?.statusText,
      error?.response?.data
    );
    ctx.body = {
      status: "error",
      message:
        "Internal server error: " +
        (error?.response?.data?.message || error.message),
    };
    ctx.status = error?.response?.status || 500;
  }
  await next();
};

router.post("/", basicAuth, getAll);
export { router };

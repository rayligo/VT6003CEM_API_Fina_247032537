import Router, { RouterContext } from "koa-router";
import { config } from "../config";
import axios from "axios";

const router: Router = new Router({ prefix: "/api/v1/hotel" });

const getAll = async (ctx: RouterContext, next: any) => {
  try {
    const body = ctx.request.body;
    console.log("Body", body?.hotelName);
    const token = config.rapidapi;

    const query =
      body?.hotelName == undefined || body?.hotelName == ""
        ? "HK"
        : body?.hotelName;

    const lookFor = "both"; // Hotels and flights
    const limit = 100;
    const convertCase = 0;

    // Construct the API URL
    const url = `http://engine.hotellook.com/api/v2/lookup.json?query=${query}&lookFor=${lookFor}&limit=${limit}&convertCase=${convertCase}&token=${token}`;
    console.log("getAll url", url);
    // Make the API call using axios
    const response = await axios.get(url);

    // Check if the response is successful
    if (response.status === 200) {
      ctx.body = {
        status: "success",
        data: response.data,
      };
      ctx.status = 200;
    } else {
      ctx.body = {
        status: "error",
        message: "Failed to fetch data from Hotellook API",
      };
      ctx.status = response.status;
    }
  } catch (error: any) {
    console.error(
      "Error fetching Hotellook API:",
      error?.status,
      error?.response?.statusText,
      error?.response?.data
    );
    ctx.body = {
      status: "error",
      message: "Internal server error: " + error?.response?.data,
    };
    ctx.status = 500;
  }
  await next();
};

router.post("/", getAll);
export { router };

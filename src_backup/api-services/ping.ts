import axios from "axios";
import { baseUrl } from "./baseUrl";

const ping = async () => {
  let config = {
    method: "get",
    url: `${baseUrl}`,
  };
  return await axios(config);
};

export { ping };

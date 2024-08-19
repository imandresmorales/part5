import axios from "axios";

const baseUrl = "api/users";

const getAll = () => {
  const response = axios.get(baseUrl);
  return response.then((res) => res.data);
};

export default { getAll };

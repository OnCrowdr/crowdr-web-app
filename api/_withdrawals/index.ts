import api from ".."
import {
  IPostRequestWithdrawalBody,
  IPostRequestWithdrawalResponse,
} from "./models/PostRequestWithdrawal"

const requestWithdrawal = async (body: IPostRequestWithdrawalBody) => {
  const url = `/withdrawals/request`

  try {
    const { data } = await api.post<IPostRequestWithdrawalResponse>(url, body)
    return data
  } catch (error) {
    throw error
  }
}

export default { requestWithdrawal }

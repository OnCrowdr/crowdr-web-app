import api from ".."
import { IDeleteMediaPath } from "./models/DeleteMedia"
import { IGetProfilePath, IGetProfileResponse } from "./models/GetProfile"
import {
  IPatchUpdateProfileBody,
  IPatchUpdateProfileResponse,
} from "./models/PatchUpdateProfile"

const getProfile = async ({ userId }: IGetProfilePath) => {
  const url = `/profile/${userId}`

  try {
    const { data } = await api.get<IGetProfileResponse>(url)
    return data.data
  } catch (error) {
    throw error
  }
}

const updateProfile = async (body: IPatchUpdateProfileBody) => {
  const url = `/profile`

  const formData = new FormData()
  formData.append("location", body.location)
  formData.append("bio", body.bio)
  formData.append("twitter", body.twitter)
  formData.append("instagram", body.instagram)
  for (let image of body.engagements ?? []) {
    formData.append("engagements", image)
  }
  for (let image of body.membersImages ?? []) {
    formData.append("membersImages", image)
  }
  if (body.members && body.members.length) {
    formData.append("members", JSON.stringify(body.members))
  }

  try {
    const { data } = await api.patchForm<IPatchUpdateProfileResponse>(
      url,
      formData
    )
    return data
  } catch (error) {
    throw error
  }
}

const deleteMedia = async ({ mediaId, column }: IDeleteMediaPath) => {
  const url = `/profile/media/${mediaId}/${column}`

  try {
    const { data } = await api.delete(url)
    return data
  } catch (error) {
    throw error
  }
}

export default { getProfile, updateProfile, deleteMedia }

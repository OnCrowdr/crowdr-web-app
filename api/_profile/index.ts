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
  body.location && formData.append("location", body.location)
  body.bio && formData.append("bio", body.bio)
  body.twitter && formData.append("twitter", body.twitter)
  body.instagram && formData.append("instagram", body.instagram)
  if (body.image) {
    formData.append("image", body.image)
  }
  if (body.backgroundImage) {
    formData.append("backgroundImage", body.backgroundImage)
  }
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

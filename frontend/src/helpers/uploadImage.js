const uploadImage = async (image) => {
  const formData = new FormData()
  formData.append("image", image)

  const backendUrl = process.env.REACT_APP_URL_BACKEND || "http://localhost:8080"
  const dataResponse = await fetch(`${backendUrl}/api/upload-image`, {
    method: "POST",
    credentials: "include",
    body: formData,
  })

  return dataResponse.json()
}

export default uploadImage

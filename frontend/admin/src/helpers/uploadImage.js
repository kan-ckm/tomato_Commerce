const uploadImage = async (image) => {
  const formData = new FormData()
  formData.append("image", image)

  const dataResponse = await fetch("http://localhost:8080/api/upload-image", {
    method: "POST",
    credentials: "include",
    body: formData,
  })

  return dataResponse.json()
}

export default uploadImage

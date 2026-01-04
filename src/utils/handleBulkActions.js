export const handleBulk = async ({
  serviceObject,
  serviceMethod,
  params = [],
  actionType = "",
  onSuccess,
  onError,
}) => {
  try {
    const { data } = await serviceObject[serviceMethod](...params);
    if (actionType == "export") {
      const fileUrl = data.data;
      const link = document.createElement("a");
      link.href = fileUrl;
      link.setAttribute("download", "");
      document.body.appendChild(link);
      link.click();
      link.remove();
    }

    onSuccess(data);
  } catch (error) {
    onError(error);
  }
};

const productsMapper = product => {
  const {
    description,
    alt_description,
    urls: {
      thumb: imgThumb,
      regular: img,
    } = {},
    links: {
      download: link
    } = {},
    user: {
      id: userId,
      name: userName,
      links: {
        html: userLink,
      } = {}
    } = {},
    tags
  } = product;

  return {
    description: description || alt_description,
    imgThumb: imgThumb || product.imgThumb,
    img: img || product.img,
    link,
    userId: userId || product.userId,
    userName: userName || product.userName,
    userLink,
    tags
  };
}

module.exports = {
  productsMapper
};

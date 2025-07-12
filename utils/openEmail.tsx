export const email = " info@oncrowdr.com";

export const openEmail = () => {
  const mailtoUrl = `mailto:${email}`;

  window.open(mailtoUrl, "_blank");
};

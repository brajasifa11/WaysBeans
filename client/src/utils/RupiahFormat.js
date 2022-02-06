export const convertRupiah = (price) => {
  let rupiah = '';
  let rupiahrev = !isNaN(price)
    ? price.toString().split('').reverse().join('')
    : '0';

  for (let i = 0; i < rupiahrev.length; i++) {
    if (i % 3 == 0) rupiah += rupiahrev.substr(i, 3) + '.';
  }
  return 'Rp. ' + rupiah.split('', rupiah.length - 1).reverse().join('')
};

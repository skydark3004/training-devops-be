interface IGenerateQrCode {
  bankId: string;
  accountNumber: string;
  ammountMoney: number;
  description: string;
  accountName: string;
}

export function generateQrCode({ bankId, accountNumber, ammountMoney, description, accountName }: IGenerateQrCode) {
  const url = `https://img.vietqr.io/image/${bankId}-${accountNumber}-print.png?amount=${ammountMoney}&addInfo=${description}`;
  return url;
}

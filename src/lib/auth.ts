import jwt from 'jsonwebtoken';

export const verifyToken = (token: string) => {
  return new Promise<any>((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET!, (err, decoded) => {
      if (err) {
        reject('Invalid token');
      } else {
        resolve(decoded);
      }
    });
  });
};

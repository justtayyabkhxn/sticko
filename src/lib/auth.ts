import jwt from 'jsonwebtoken';

// Define the shape of the decoded token
interface DecodedToken {
  id: string;
  name: string;
  exp: number;
}

export const verifyToken = (token: string): Promise<DecodedToken> => {
  return new Promise<DecodedToken>((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET!, (err, decoded) => {
      if (err) {
        reject('Invalid token');
      } else {
        // Ensure the decoded token matches the expected structure
        resolve(decoded as DecodedToken); // Type assertion
      }
    });
  });
};
